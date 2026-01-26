from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 1280, "height": 720})
    page = context.new_page()
    page.goto("http://localhost:3000")
    page.wait_for_timeout(2000)
    page.screenshot(path="verification/debug_intercept.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
