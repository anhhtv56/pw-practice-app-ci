import test from "@playwright/test"
import { NavigationPage } from "./page-object/navigationPage"

test.beforeEach(async({page}) => {
    test.setTimeout(10000);
    await page.goto('/')
})

test('testing with argos ci', async({page})=>{
    const navigateTo = new NavigationPage(page)
    await navigateTo.moveToFormLayoutsPage()
    await navigateTo.moveToDatepickerPage()
})