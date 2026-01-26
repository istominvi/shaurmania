
import fs from 'fs';
import path from 'path';
import https from 'https';
import Papa from 'papaparse';

// Define types locally to avoid import issues with ts-node
type ProductCategory = string;

interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  image: string;
  basePrice: number;
  available: boolean;
}

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSF-SrUyWUFNrlauDFOomL9FIO9xYN2NhYcdkBTcmz1GP3P-FYgCreNtqgox_v2yG4ku8Uu7dmDaCNI/pub?gid=0&single=true&output=csv';
const DATA_FILE = path.join(process.cwd(), 'lib/data.json');
const PUBLIC_PRODUCTS_DIR = path.join(process.cwd(), 'public/products');

async function fetchCSV(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const get = (currentUrl: string) => {
      https.get(currentUrl, (res) => {
        // Handle redirects
        if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 303 || res.statusCode === 307) {
          if (res.headers.location) {
            console.log(`Redirecting to: ${res.headers.location}`);
            get(res.headers.location);
            return;
          }
        }

        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data);
          } else {
            reject(new Error(`Failed to fetch CSV: Status ${res.statusCode}`));
          }
        });
        res.on('error', (err) => reject(err));
      }).on('error', (err) => reject(err));
    };
    get(url);
  });
}

function getGoogleDriveDirectLink(url: string): string | null {
  if (!url) return null;

  // Handle standard share links: https://drive.google.com/file/d/VIEW_ID/view...
  const matchShare = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchShare && matchShare[1]) {
    return `https://drive.google.com/uc?export=download&id=${matchShare[1]}`;
  }

  // Handle drive-viewer links (Warning: likely to fail without auth, but we can't do much)
  // These links usually expire or require cookies. We'll return null to treat them as generic URLs
  // or log a warning.
  if (url.includes('drive-viewer')) {
      console.warn(`[WARN] Found 'drive-viewer' link. This usually requires authentication and cannot be downloaded by script: ${url}`);
      return null;
  }

  return url; // Return original if not a Drive Share link
}

async function downloadImage(url: string, filepath: string): Promise<boolean> {
  const directUrl = getGoogleDriveDirectLink(url);
  if (!directUrl) {
      console.warn(`[SKIP] Could not determine direct URL for: ${url}`);
      return false;
  }

  return new Promise((resolve) => {
    const file = fs.createWriteStream(filepath);
    https.get(directUrl, (response) => {
      if (response.statusCode !== 200) {
        console.error(`[ERROR] Failed to download image ${directUrl}: Status ${response.statusCode}`);
        // Consume response data to free up memory
        response.resume();
        fs.unlink(filepath, () => {}); // Delete partial file
        resolve(false);
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close(() => resolve(true));
      });

      file.on('error', (err) => {
        console.error(`[ERROR] Error writing file ${filepath}:`, err);
        fs.unlink(filepath, () => {});
        resolve(false);
      });
    }).on('error', (err) => {
       console.error(`[ERROR] Request failed for ${directUrl}:`, err.message);
       fs.unlink(filepath, () => {});
       resolve(false);
    });
  });
}

async function main() {
  console.log('Starting data sync...');

  // Create output directory
  if (!fs.existsSync(PUBLIC_PRODUCTS_DIR)) {
    fs.mkdirSync(PUBLIC_PRODUCTS_DIR, { recursive: true });
  }

  try {
    const csvData = await fetchCSV(CSV_URL);
    const parsed = Papa.parse(csvData, { header: true, skipEmptyLines: true });
    console.log('CSV Fields:', parsed.meta.fields);
    console.log('First Row:', parsed.data[0]);

    const products: Product[] = [];
    const rows = parsed.data as any[];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row['Название']) {
          console.warn('Skipping row without Name:', row);
          continue;
      }

      const category = row['Категория']?.trim() || 'Другое';

      const id = (i + 1).toString();
      const originalImage = row['Изображение'];
      let imagePath = originalImage; // Default to remote URL if download fails

      if (originalImage && originalImage.startsWith('http')) {
         // Determine extension (default to jpg if unknown or drive link)
         let ext = '.jpg';
         if (originalImage.match(/\.(png|jpeg|webp)$/i)) {
             // Basic extension extraction logic could be better but sufficient for now
             // If url ends with .png, use .png
         }

         const filename = `${id}${ext}`;
         const localFilePath = path.join(PUBLIC_PRODUCTS_DIR, filename);
         const publicPath = `/products/${filename}`;

         console.log(`Downloading image for product ${id}...`);
         const success = await downloadImage(originalImage, localFilePath);

         if (success) {
             imagePath = publicPath;
         } else {
             console.warn(`[WARN] Using original URL for product ${id} due to download failure.`);
         }
      }

      const product: Product = {
        id,
        name: row['Название'],
        description: row['Описание'],
        category: category,
        basePrice: parseInt(row['Цена'], 10) || 0,
        image: imagePath,
        available: true // Default
      };

      products.push(product);
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
    console.log(`Successfully synced ${products.length} products to ${DATA_FILE}`);

  } catch (error) {
    console.error('Sync failed:', error);
    process.exit(1);
  }
}

main();
