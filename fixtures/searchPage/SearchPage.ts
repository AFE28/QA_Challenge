import { searchPage } from '@pages/searchPage/SearchPage';
import { test as baseTest } from '@playwright/test';
import { enquirePage } from 'enquirePage/EnquirePage';

type pages = {
    // Fixture Main Pages
    searchPage: searchPage;
    enquirePage: enquirePage;
};

export const test = baseTest.extend<pages>({
    // Fixture Main Pages
    searchPage: async ({ page }, use) => {
        await use(new searchPage(page));
    },
    enquirePage: async ({ page }, use) => {
        await use(new enquirePage(page));
    },
});

export * from '@playwright/test';
