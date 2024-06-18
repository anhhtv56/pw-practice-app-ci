import test from "@playwright/test"
import { NavigationPage } from "./page-object/navigationPage"
import { DatePickerPage } from "./page-object/datepickerPage"

test.beforeEach(async({page}) => {
    await page.goto('/')
})

test('navigate to form page', async({page})=>{
    const navigateTo = new NavigationPage(page)
    await navigateTo.moveToFormLayoutsPage()
    await navigateTo.moveToDatepickerPage()
    await navigateTo.moveToSmartTablePage()
    await navigateTo.moveToToastrPage()
    await navigateTo.moveToTooltipPage()
})

test('parametried form page', async({page})=>{
    const navigateTo = new NavigationPage(page)
    const formLayoutPage = await navigateTo.moveToFormLayoutsPage()
    await formLayoutPage.submitUsingInlineFormWithNameEmailAndCheckbox('anh', 'anhhtv.93@gmail.com', true)
    page.screenshot({path: "screenshot/FormLayoutsPage.png"})
    await formLayoutPage.submitUsingTheGridFormWithCredentialsAndSelectOption('anhhtv.93@gmail.com', 'abc', 'Option 1')

    await navigateTo.moveToDatepickerPage()
    const datePickerPage = new DatePickerPage(page)
    await datePickerPage.selectCommonDatePickerDateFromToday(5)
    await datePickerPage.selectDatePickerFromTodayWithRange(1, 10)
})

test.only('testing with argos ci', async({page})=>{
    const navigateTo = new NavigationPage(page)
    await navigateTo.moveToFormLayoutsPage()
    await navigateTo.moveToDatepickerPage()
})