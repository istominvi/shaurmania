import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAssetPath(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${basePath}${normalizedPath}`
}
