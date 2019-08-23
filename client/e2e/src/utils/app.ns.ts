import { browser, by, element } from 'protractor';

export namespace App {
  export function navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  export function getTitleText() {
    return element(by.css('ssr-root h1')).getText() as Promise<string>;
  }

  export const mainNav = {
    findNavLink: (targetPageUrl: string) => {
      return element(by.css(`ssr-root .nav-bar a[routerLink='${targetPageUrl}']`));
    },

    navigateTo: (targetPageUrl: string) => {
      return App.mainNav.findNavLink(targetPageUrl).click();
    }
  };
}
