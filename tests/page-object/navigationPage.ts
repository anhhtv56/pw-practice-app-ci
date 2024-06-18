import {Page, expect} from '@playwright/test'
import { FormLayoutPage } from './formLayoutPage'

export class NavigationPage{
    readonly page: Page

    constructor(page: Page){
        this.page = page
    }

    private async selectGroupMenuItem(grpItemTitle : string){
        const grpMenuItem = this.page.getByTitle(grpItemTitle)
        const expandedState = await grpMenuItem.getAttribute('aria-expanded')
        if(expandedState == "false")
            grpMenuItem.click()
        await expect(grpMenuItem).toHaveAttribute('aria-expanded', 'true')
    }

    private async moveToMenu(menu: string, subMenu: string){
        await this.selectGroupMenuItem(menu)
        await this.page.getByText(subMenu).click()
    }

    async moveToFormLayoutsPage() : Promise<FormLayoutPage>{
        await this.moveToMenu('Forms', 'Form Layouts')
        return new FormLayoutPage(this.page)
    }

    async moveToDatepickerPage(){
        await this.moveToMenu('Forms', 'Datepicker')
    }

    async moveToSmartTablePage(){
        await this.moveToMenu('Tables & Data', 'Smart Table')
    }

    async moveToToastrPage(){
        await this.moveToMenu('Modal & Overlays', 'Toastr')
    }

    async moveToTooltipPage(){
        await this.moveToMenu('Modal & Overlays', 'Tooltip')
    }
}