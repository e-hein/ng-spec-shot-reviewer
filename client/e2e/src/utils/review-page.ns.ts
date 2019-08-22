import { element, by } from 'protractor';

export namespace ReviewPage {
  export function findSpecShotLinkByIndex(num: number) {
    return element(by.css(`ssr-spec-shot-list li:nth-of-type(${num + 1})`));
  }
  export function selectSpecShotByIndex(num: number) {
    const specShotLink = ReviewPage.findSpecShotLinkByIndex(num);
    return specShotLink.element(by.css('a')).click();
  }
}
