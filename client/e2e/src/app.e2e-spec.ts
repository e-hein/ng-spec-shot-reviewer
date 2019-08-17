import { browser, logging, by } from 'protractor';
import { screensizes } from './screensizes';
import { App } from './utils/app.ns';
import { ReviewPage } from './utils/review-page.ns';

describe('workspace-project App', () => {
  screensizes.forEach((screensize) => {
    describe(screensize.title, () => {
      beforeEach(async () => {
        browser.driver.manage().window().setSize(screensize.x, screensize.y);
        await App.navigateTo();
      });

      it('should display welcome message', async () => {
        expect(await browser.imageComparison.checkFullPageScreen('welcome-page-' + screensize.title, { /* some options*/ })).toEqual(0);
      });

      describe('review page', () => {
        beforeEach(() => App.mainNav.navigateTo('/review'));

        it('should navigate to review page', async () => {
          expect(await browser.imageComparison.checkFullPageScreen('review-page-' + screensize.title, { /* some options*/ })).toEqual(0);
        })

        it('should select spec shot', async () => {
          await ReviewPage.selectSpecShotByIndex(0);
          expect(await browser.imageComparison.checkFullPageScreen('review-page-details-' + screensize.title, { /* some options*/ })).toEqual(0);
        })
      })

      afterEach(async () => {
        // Assert that there are no errors emitted from the browser
        const logs = await browser.manage().logs().get(logging.Type.BROWSER);
        expect(logs).not.toContain(jasmine.objectContaining({
          level: logging.Level.SEVERE,
        } as logging.Entry));
      });
    });
  });
});
