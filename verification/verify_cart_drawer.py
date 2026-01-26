from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 1280, "height": 720})
    page = context.new_page()

    page.goto("http://localhost:3000")

    # Handle Location Dialog
    try:
        page.wait_for_selector("[role=dialog]", timeout=5000)
        dialog = page.get_by_role("dialog")

        try:
            dialog.get_by_role("button", name="Close").click(timeout=2000)
        except:
            dialog.locator("text=Самовывоз").click()
            page.wait_for_timeout(500)
            dialog.get_by_role("button", name="Сохранить").click()

        page.wait_for_selector("[role=dialog]", state="hidden")

    except Exception:
        pass

    # Add item
    page.wait_for_selector("button:has-text('Выбрать')")
    page.locator("button:has-text('Выбрать')").first.click()
    page.wait_for_timeout(1000)

    # Open Cart
    # Use explicit selector for the header button to be safe
    # It is inside <header>
    page.locator("header button:has-text('Корзина')").click()

    # Wait for Drawer content
    page.wait_for_selector("text=Сумма заказа", state="visible")

    # Wait for animation
    page.wait_for_timeout(2000)

    # Screenshot
    page.screenshot(path="verification/cart_drawer.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
