import {Page, expect} from '@playwright/test'

export class DatePickerPage{
    private readonly page: Page

    constructor(page: Page){
        this.page = page
    }

    async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number){
        const calendarInputField = this.page.getByPlaceholder('Form Picker')
        await calendarInputField.click()

        const dateToAssert = await this.selectDateInTheCalendar(numberOfDaysFromToday)
        await expect(calendarInputField).toHaveValue(dateToAssert)
    }

    async selectDatePickerFromTodayWithRange(startDayFromToday: number, endDayFromToday: number){
        const calendarInputField = this.page.getByPlaceholder('Range Picker')
        await calendarInputField.click()

        const startDateToAssert = await this.selectDateInTheCalendar(startDayFromToday)
        const endDateToAssert = await this.selectDateInTheCalendar(endDayFromToday)
        const dateToAssert = `${startDateToAssert} - ${endDateToAssert}`
        await expect(calendarInputField).toHaveValue(dateToAssert)
    }

    private async selectDateInTheCalendar(numberOfDaysFromToday: number){
        let date = new Date()
        date.setDate(date.getDate() + numberOfDaysFromToday)
        const expectDate = date.getDate().toString()
        const expectMonthShort = date.toLocaleString('En-US', {month: 'short'})
        const expectMonthLong = date.toLocaleString('En-US', {month: 'long'})
        const expectedYear = date.getFullYear()
        const dateToAssert = `${expectMonthShort} ${expectDate}, ${expectedYear}`

        let calenderMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        const expectMonthAndYear = `${expectMonthLong} ${expectedYear}`
        while(!calenderMonthAndYear.includes(expectMonthAndYear)){
            await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
            calenderMonthAndYear = await this.page.locator('nb-calender-view-mode').textContent()
        }
        await this.page.locator('.day-cell:not(.bounding-month)').locator('visible=true').getByText(expectDate, {exact: true}).click()
        return dateToAssert;
    }
    
}