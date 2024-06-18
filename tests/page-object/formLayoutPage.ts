import {Page, expect} from '@playwright/test'

export class FormLayoutPage{
    private readonly page: Page

    constructor(page: Page){
        this.page = page
    }

    async submitUsingTheGridFormWithCredentialsAndSelectOption(email: string, password: string, optionText: string){
        const usingTheGrid = this.page.locator('nb-card',{hasText: "Using the Grid"})
        await usingTheGrid.getByRole('textbox', {name: "Email"}).fill(email)
        await usingTheGrid.getByRole('textbox', {name: "Password"}).fill(password)
        await usingTheGrid.getByRole('radio', {name: optionText}).check({force: true})
        await usingTheGrid.getByRole('button').click()
    }

    async submitUsingInlineFormWithNameEmailAndCheckbox(name: string, email: string, rememberMe: boolean){
        const inlineForm = this.page.locator('nb-card',{hasText: "Inline form"})
        await inlineForm.getByRole('textbox', {name: "Jane Doe"}).fill(name)
        await inlineForm.getByRole('textbox', {name: "Email"}).fill(email)

        if(rememberMe)
            await inlineForm.getByRole('checkbox').check({force: true})
        
        await inlineForm.getByRole('button').click()
    }

   
}