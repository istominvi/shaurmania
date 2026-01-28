from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:3000")

            # Dismiss the mandatory location modal
            try:
                # Wait for modal to appear
                page.wait_for_selector("text=Способ получения", timeout=5000)

                # Click the text "Заберите заказ сами" which is unique to the pickup option description
                page.get_by_text("Заберите заказ сами").click()

                # Click "Сохранить"
                page.get_by_role("button", name="Сохранить").click()

                # Wait for modal to disappear
                page.wait_for_selector("text=Способ получения", state="hidden")

            except Exception as e:
                print(f"Modal handling failed: {e}")

            # Scroll to the bottom to see the footer
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")

            # Wait for the branches section to be visible
            branches_header = page.get_by_role("heading", name="Наши филиалы")
            branches_header.wait_for()

            # Take a screenshot of the footer area
            footer = page.locator("footer")
            footer.scroll_into_view_if_needed()

            footer.screenshot(path="verification_branches_clean.png")
            print("Screenshot taken: verification_branches_clean.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
