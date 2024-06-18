import test from "@playwright/test"
import { argosScreenshot } from "@argos-ci/playwright";
/*import { NavigationPage } from "./page-object/navigationPage"

test.beforeEach(async({page}) => {
    test.setTimeout(10000);
    await page.goto('/')
})

test('testing with argos ci', async({page})=>{
    const navigateTo = new NavigationPage(page)
    await navigateTo.moveToFormLayoutsPage()
    await navigateTo.moveToDatepickerPage()
})*/

test('drag and drop with ifame argo ci', async({page})=>{
    await page.goto(process.env.URL)

    await argosScreenshot(page, "homepage");

    const frame = page.frameLocator('[rel-title="Photo Manager"] iframe')
    await frame.locator('li', {hasText: "High Tatras 2"}).dragTo(frame.locator('#trash'))

    await argosScreenshot(page, "1stDrag");

    // more precise control
    await frame.locator('li', {hasText: "High Tatras 4"}).hover()
    await page.mouse.down()
    await frame.locator('#trash').hover()
    await page.mouse.up()
    await argosScreenshot(page, "2ndDrag");
})
