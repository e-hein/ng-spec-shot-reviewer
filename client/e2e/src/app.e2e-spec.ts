import { AppPage } from './app.po';
import { browser, logging } from 'protractor';
import { screensizes } from './screensizes';

describe('workspace-project App', () => {
  let page: AppPage;

  screensizes.forEach((screensize) => {
    describe(screensize.title, () => {
      beforeEach(() => {
        page = new AppPage();
        browser.driver.manage().window().setSize(screensize.x, screensize.y);
      });

      it('should display welcome message', async () => {
        page.navigateTo();
        expect(await browser.imageComparison.checkFullPageScreen('welcome-page-' + screensize.title, { /* some options*/ })).toEqual(0);
      });

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
