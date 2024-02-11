import { expect, test } from '@fixtures/searchPage/SearchPage';
import { CarColors } from '@utils/enum/CarColors/CarColors';
import { Location } from '@utils/enum/Location/Location';
import { PostalCode } from '@utils/enum/PostalCode/Location';
import { Purpose } from '@utils/enum/Purpose/Purpose';
import ENV from 'env';

test.describe('Search Used Cars Workflow', () => {
    test.beforeEach(async ({ searchPage }) => {
        await searchPage.navigateToDemoPage();
        await searchPage.acceptCookies();
    });

    test('Validate Location, Pre-Owner and Colour filter functionality', async ({ page, searchPage }) => {
        // Select location, pre-owner, and color filters
        await searchPage.applyFilters(Location.NewSouthWales, PostalCode.PT, Purpose.Private, CarColors.BlackNonMetallic);

        // Validate location filter is applied correctly
        await expect(page.locator('a').filter({ hasText: `Your Location: ${Location.NewSouthWales}` })).toBeVisible();

        // Validate pre-owner filter is applied correctly
        expect(page.url()).toContain(`${String(ENV.baseURL)}used?sort=relevance-ucos&assortment=vehicle`);

        // Validate color filter is applied correctly
        await expect(page.locator('#app .dcp-selected-filters-widget-tag__name').filter({ hasText: CarColors.BlackNonMetallic })).toBeVisible();

        // Validate at least one vehicle is shown
        await expect(page.locator('#app .dcp-cars-srp-result-amount__number')).toHaveText(/1/);

        // Click explore button and verify redirection
        const exploreButton = page.locator('a').filter({ hasText: 'Explore' });
        await expect(exploreButton).toBeVisible();
        await expect(exploreButton).toBeEnabled();
        await exploreButton.click();
        await page.waitForURL(`${String(ENV.detailsURL)}/**`);
        await page.waitForLoadState('networkidle');
    });
});
