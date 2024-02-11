import { expect, Page } from '@playwright/test';
import ENV from 'env';

export class searchPage {
    constructor(public readonly page: Page) { }

    public readonly spinnerSelector = '.dcp-loading-spinner__spinner';
    public readonly locationHeadingSelector = 'Please select your location';
    public readonly continueButtonSelector = 'Continue';
    public readonly showButtonSelector = 'div.sidebar span svg.show';

    /**
     * Navigates to the demo page.
     *
     * @returns - A promise that resolves when the navigation to the demo page is complete.
     */
    public async navigateToDemoPage() {
        await this.page.goto(`${String(ENV.baseURL)}demo?error=login_required&sort=relevance-demo&assortment=vehicle`);
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Accepts cookies by clicking on the "Agree to all" button.
     *
     * @returns - A promise that resolves when the cookies are accepted.
     */
    public async acceptCookies() {
        await this.page.getByRole('button', { name: 'Agree to all' }).click();
    }

    /**
     * Selects location, postal code, and purpose.
     *
     * @param location - The location to select.
     * @param postalCode - The postal code to fill.
     * @param purpose - The purpose to select.
     * @returns - A promise that resolves when the location, postal code, and purpose are selected.
     */
    public async selectLocation(location: string, postalCode: string, purpose: string) {
        const heading = this.page.getByRole('heading', { name: this.locationHeadingSelector });
        await expect(heading).toBeVisible();
        const locationDropDown = this.page.getByLabel('Your state');
        await locationDropDown.click();
        await locationDropDown.selectOption({ label: location });
        await heading.click(); // Collapse location dropdown
        await this.page.getByText('* Postal Code').fill(postalCode);
        await this.page.locator('label').filter({ hasText: purpose }).locator('div').click();
        await this.page.getByRole('button', { name: this.continueButtonSelector }).click();
    }

    /**
     * Applies location, pre-owner, and color filters.
     *
     * @param location - The location filter value.
     * @param postalCode - The postal code filter value.
     * @param purpose - The purpose filter value.
     * @param color - The color filter value.
     * @returns - A promise that resolves when all filters are applied.
     */
    public async applyFilters(location: string, postalCode: string, purpose: string, color: string) {
        await this.selectLocation(location, postalCode, purpose);
        await this.applyPreOwnedFilter();
        await this.applyColorFilter(color);
    }

    /**
     * Applies the pre-owned filter to the search results.
     *
     * @returns - A promise that resolves when the filter is applied.
     */
    private async applyPreOwnedFilter() {
        const preOwnedButton = this.page.locator(this.showButtonSelector);
        await preOwnedButton.click();
        await this.page.getByRole('button', { name: 'Pre-Owned' }).click();
        await this.page.waitForURL(`${String(ENV.baseURL)}used?sort=relevance-ucos&assortment=vehicle`);
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Applies the color filter to the search results.
     *
     * @param color - The color to filter by.
     * @returns - A promise that resolves when the filter is applied.
     */
    private async applyColorFilter(color: string) {
        const colorButton = this.page.locator(this.showButtonSelector);
        await colorButton.click();
        await this.page.locator('p').filter({ hasText: 'Colour' }).click();
        await this.page.getByText('Colour').last().click();
        await this.page.getByText(color, { exact: true }).click();
    }
}
