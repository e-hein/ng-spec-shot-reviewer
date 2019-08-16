import { ComponentFixture } from '@angular/core/testing';

export async function whenAllChangesDoneFor(fixture: ComponentFixture<any>) {
  fixture.autoDetectChanges(true);
  await fixture.whenStable();
  fixture.autoDetectChanges(false);
}
