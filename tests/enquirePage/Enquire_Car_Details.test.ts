import { expect, test } from '@fixtures/searchPage/SearchPage';
import { CarsUtil } from '@utils/dataUtils/CarsUtil';
import FileUtils from '@utils/dataUtils/fileUtils/FileUtils';

test.describe('Enquire Used Cars Workflow', () => {
    // Define the URL or identifier of the car details page
    const carDetailsPageURL = 'AU2300089847T';
    // Define the target car name
    const targetCarName = 'Mercedes-AMG GT R PRO';
    // path of the folder for files to be saved
    const pathFolder = './test-data/temp-data/test.txt';

    // i see this before each is similar to all the pages
    // we could simple re-use like a setup page to avoid having this repetition code at the tests
    test.beforeEach(async ({ page, searchPage, enquirePage }) => {
        await searchPage.navigateToDemoPage();
        await searchPage.acceptCookies();

        await enquirePage.navigateToSpecificCarDetailsPage(carDetailsPageURL);
        // assert that we are displaying the correct car
        const carNameElement = page.getByTestId(enquirePage.carNameTestId);
        await expect(carNameElement).toContainText(targetCarName);
        const contactSellerButton = page.getByTestId(enquirePage.contactSellerTestId);
        await expect(contactSellerButton).toBeVisible();
    });

    test('Gather the VIN and Model and save it to txt file', async ({ page, enquirePage }) => {
        // get the values
        const modelYear = await enquirePage.getCarModelYear();
        const VIN = await enquirePage.getCarVIN();

        // confirm that values are correct as per the test data
        const carUtil = new CarsUtil();
        const carInfoDetailed = carUtil.getCarDetails(targetCarName);
        expect(modelYear).toBe(carInfoDetailed.find(x => x.modelYear)?.modelYear);
        expect(VIN).toBe(carInfoDetailed.find(x => x.VIN)?.VIN);

        // insert the values as a single string and save to txt file
        const data = [modelYear, VIN].join(', ');
        FileUtils.saveDataToFile(data, pathFolder);
    });

    test('Fill in the incorrect contact details at the enquire form', async ({ page, enquirePage }) => {
        await page.getByTestId(enquirePage.contactSellerTestId).click();
        await page.waitForLoadState('domcontentloaded');

        await expect(page.getByText(enquirePage.contactDetailsHeader)).toBeVisible();
        await expect(page.getByText(enquirePage.contactDetailsValidationMessage)).toBeVisible();

        // fill in the contact details form
        await enquirePage.fillContactDetails(
            'Thomas',
            'Jeff',
            'Thomas_Jeffdemo.com',
            '+564122558921',
            '1000',
            'just for adding something here',
        );

        // validate those that should give an error and that message is at the correct place
        await expect(page.getByTestId(enquirePage.emailLocatorId).locator(enquirePage.errorLocatorId)).toContainText(enquirePage.emailValidationError);
        await expect(page.getByTestId(enquirePage.phoneLocatorId).locator(enquirePage.errorLocatorId)).toContainText(enquirePage.phoneValidationError);

        // tick all the checkboxes
        await enquirePage.tickCheckboxes([
            'I have read and understood',
            'SMS/MMS/IM',
            'Phone',
            'Email',
        ]);

        // Press the button to proceed
        await page.getByTestId(enquirePage.proceedButtonLocatorId).click();

        // verify that does not allow to move forward and it provides a error message
        await expect(page.getByText(enquirePage.popupValidationError)).toBeVisible();
        await expect(page.getByText(enquirePage.popupMessageValidationError)).toBeVisible();
    });
});
