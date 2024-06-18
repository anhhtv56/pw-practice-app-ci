import {test, expect} from '@playwright/test'

test.beforeEach(async({page})=>{
    await page.goto('http://localhost:4200')

    await page.getByText('Forms').click()

    await page.getByText('Form Layouts').click()
})

test('locator sysntax rule', async({page}) => {
    // by tag name
    await page.locator('input').first().click()
    
    // by id
    page.locator('#inputEmail')

    // by class value
    page.locator('.shape-rectangle')

    // by attribute
    page.locator('[placeholder="Email"]')

    // combine
    page.locator('input[placeholder="Email"]')

    // by xpath
    page.locator('//*[id="InputEmail"]')

    // by partial text match
    page.locator(':text("Using")')

    // by extract match
    page.locator(':text-is("Using the Grid")')
})

test('User facing locators', async({page}) => {
   await page.getByRole('textbox', {name : "Email"}).first().click() 
   await page.getByRole('button', {name: "Sign in"}).first().click()
   await page.getByLabel('Email').first().click()
   await page.getByPlaceholder('Jane Doe').click()
   await page.getByTitle('IoT Dashboard').click()
})

test ('locating child element', async({page})=>{
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').nth(3).getByRole('button').click()
})

test ('locating parent', async({page})=>{
    await page.locator('nb-card', {hasText: "Using the grid"}).getByRole('textbox', {name : "Email"}).click()
    await page.locator('nb-card', {has: page.locator('#inputEmail')}).getByRole('textbox', {name : "Email"}).click()

    await page.locator('nb-card').filter({hasText: "Basic Form"}).getByRole('textbox', {name : "Email"}).click()
})

test('reuse the locator', async({page})=>{
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const emailField = basicForm.getByRole('textbox', {name: "Email"})

    await emailField.fill('test@test.com')
    await basicForm.getByRole('textbox', {name: "Password"}).fill('Welcome123')

    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button').click()

    await expect(emailField).toHaveValue('test@test.com')
})

test ('extracting value', async({page})=>{
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual('Submit')

    // Get all text
    const radioBtn = await page.locator('nb-radio').allTextContents()
    expect(radioBtn).toContain('Option 1')

    // get input text value
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    await emailField.fill('test@test.com')
    const emailValue = await emailField.inputValue()

    expect(emailValue).toEqual('test@test.com')
})