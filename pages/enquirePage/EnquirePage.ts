import { Page } from '@playwright/test';
import ENV from 'env';

export class enquirePage {
    constructor(public readonly page: Page) {
    }

    public readonly carNameTestId = 'dcp-cars-buy-box__product-variation-name';
    public readonly contactSellerTestId = 'dcp-buy-box__contact-seller';
    public readonly modeYearLocatorId = 'dcp-vehicle-details-list-item-2';
    public readonly vinLocatorId = 'dcp-vehicle-details-list-item-11';

    // Request form locators
    public readonly contactDetailsHeader = 'Contact Details and Account';
    public readonly contactDetailsValidationMessage = 'Please put in your contact';
    public readonly firstNameLocatorId = 'rfq-contact__first-name';
    public readonly lastNameLocatorId = 'rfq-contact__last-name';
    public readonly emailLocatorId = 'rfq-contact__email';
    public readonly phoneLocatorId = 'rfq-contact__phone';
    public readonly postalCodeLocatorId = 'rfq-contact__postal-code';
    public readonly contactCommentsLocatorId = 'rfq-contact__comments';
    public readonly errorLocatorId = 'wb-control-error';
    public readonly proceedButtonLocatorId = 'dcp-rfq-contact-button-container__button-next';

    // Errors message
    public readonly emailValidationError = 'Please enter a valid email address using a minimum of six characters.';
    public readonly phoneValidationError = 'Please enter a valid mobile number (Example: 0441234567)';
    public readonly popupValidationError = 'An error has occurred.Please';
    public readonly popupMessageValidationError = 'Please check the data you';

    private readonly listItemValue = '.dcp-vehicle-details-list-item__value';

    /**
     * Navigates to a specific car details page using the provided URL.
     *
     * @param url - The URL of the car details page.
     * @returns - A promise that resolves when the page navigation and loading are completed.
     */
    public async navigateToSpecificCarDetailsPage(url: string) {
        await this.page.goto(`${String(ENV.detailsURL)}/${url}`);
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Retrieves the model year of the car from the current page.
     *
     * @returns - A promise that resolves with the model year of the car.
     */
    public async getCarModelYear() {
        const modelYearLocator = this.page.getByTestId(this.modeYearLocatorId).locator(this.listItemValue);
        const modelYear = await modelYearLocator.textContent();
        return modelYear?.toString();
    }

    /**
     * Retrieves the VIN (Vehicle Identification Number) of the car from the current page.
     *
     * @returns - A promise that resolves with the VIN of the car.
     */
    public async getCarVIN() {
        const VINLocator = this.page.getByTestId(this.vinLocatorId).locator(this.listItemValue);
        const VIN = await VINLocator.textContent();
        return String(VIN);
    }

    /**
     * Fill in the contact details form with the provided data.
     * @param firstName The first name to fill in the form.
     * @param lastName The last name to fill in the form.
     * @param email The email to fill in the form.
     * @param phone The phone number to fill in the form.
     * @param postalCode The postal code to fill in the form.
     * @param comments The comments to fill in the form.
     */
    public async fillContactDetails(firstName: string, lastName: string, email: string, phone: string, postalCode: string, comments: string) {
        await this.page.getByTestId(this.firstNameLocatorId).locator('input').fill(firstName);
        await this.page.getByTestId(this.lastNameLocatorId).locator('input').fill(lastName);
        await this.page.getByTestId(this.emailLocatorId).locator('input').fill(email);
        await this.page.getByTestId(this.phoneLocatorId).locator('input').fill(phone);
        await this.page.getByTestId(this.postalCodeLocatorId).locator('input').fill(postalCode);
        await this.page.getByTestId(this.contactCommentsLocatorId).locator('textarea').fill(comments);
    }

    /**
     * Tick the checkboxes with the specified labels.
     * @param labels Labels of the checkboxes to tick.
     */
    public async tickCheckboxes(labels: string[]) {
        for (const label of labels) {
            const checkboxLocator = this.page.locator('label').filter({ hasText: label }).locator('wb-icon');
            await checkboxLocator.click();
        }
    }
}
