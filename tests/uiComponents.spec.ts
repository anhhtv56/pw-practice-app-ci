import {test, expect, Locator} from '@playwright/test'
import { doesNotThrow } from 'assert'
import { exec } from 'child_process'

test.beforeEach(async({page}) => {
    await page.goto('/')
})

test.describe('Form layout page', () => {
    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('input fields', async({page}) =>{
        const usingTheGridEmailInput = page.locator('nb-card',{hasText: "Using the Grid"}).getByRole('textbox', {name: "email"})
        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('testabc@abc.com', {delay:100})

        await expect(usingTheGridEmailInput).toHaveValue('testabc@abc.com')
    })

    test.only('radio button', async({page})=>{
        const gridFrom = page.locator('nb-card', {hasText: "Using the Grid"})

        await getRadioLocator(gridFrom, "Option 2").check({force: true})
        await expect(gridFrom).toHaveScreenshot()
        //await expect(getRadioLocator(gridFrom, "Option 1")).toBeChecked

        /*await getRadioLocator(gridFrom, "Option 2").check({force: true})
        await expect(getRadioLocator(gridFrom, "Option 2")).toBeChecked
        expect(await getRadioLocator(gridFrom, "Option 1").isChecked).toBeFalsy()*/

    })

    function getRadioLocator(locator : Locator, radioName : string) : Locator{
        return locator.getByRole('radio', {name: radioName})
    }

})

test ('checkboxs', async({page})=>{
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()

    await page.getByRole('checkbox', {name: "Hide on click"}).uncheck({force:true})
    await page.getByRole('checkbox', {name: "Prevent arising of duplicate toast"}).uncheck({force:true})

    const allBoxes = page.getByRole('checkbox')
    for(const box of await allBoxes.all()){
        await box.uncheck({force: true})
        expect(await box.isChecked()).toBeFalsy()
    }

})

test ('lists and dropdown', async({page})=>{
    const dropdownMenu = page.locator('ngx-header nb-select')
    await dropdownMenu.click()

    page.getByRole('list') // when the list has a UL tag
    page.getByRole('listitem') // when the list has LI tag

    const optionList = page.locator('nb-option-list nb-option')
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])

    await optionList.filter({hasText: "Cosmic"}).click()
    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    const colors = {
        "Light" : "rgb(255, 255, 255)",
        "Dark" : "rgb(34, 43, 69)",
        "Cosmic" : "rgb(50, 50, 89)",
        "Corporate" : "rgb(255, 255, 255)"
    }
    await dropdownMenu.click()
    for(const color in colors){
        await optionList.filter({hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if(color != "Corporate")
            await dropdownMenu.click()
    }
})

test ('tooltips', async({page})=> {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    const toolTipCard = page.locator('nb-card', {hasText: "Tooltip Placements"})
    await toolTipCard.getByRole('button', {name : "Top"}).hover()

    page.getByRole('tooltip') // if you have a role tooltip created

    const tooltip = await page.locator('nb-tooltip').textContent()
    expect(tooltip).toEqual('This is a tooltip')
})

test ('dialog box', async({page})=> {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })

    await page.getByRole('table').locator('tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click()
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
})

test ('web tables', async({page})=>{
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    // 1 get the row by any test in this row
    const targetRow = page.getByRole('row', {name: "twitter@outlook.com"})
    await targetRow.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill('35')
    await page.locator('.nb-checkmark').click()

    // 2 get the row based on the value in the specific colum

    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    const targetByRowId = page.getByRole('row').filter({has: page.locator('td').nth(1).getByText('11')})
    await targetByRowId.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('abc@abc.com')
    await page.locator('.nb-checkmark').click()

    await expect(targetByRowId.locator('td').nth(5)).toHaveText('abc@abc.com')

    // 3 test filter of the table
    const ages = ["20", "30", "40", "200"]
    for (let age of ages){
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)

        if(age == "200"){
            await expect (page.getByRole('table').locator('tr td').first()).toContainText('No data found')
        }else{
            const ageRows = page.locator('tbody tr')
            await expect(ageRows.first().locator('td').last()).toHaveText(age);
            for (let row of await ageRows.all()){
                const cellValue = await row.locator('td').last().textContent()
                expect (cellValue).toEqual(age)
            }
        }
        
    }
})