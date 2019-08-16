import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecShotDetailsComponent } from './spec-shot-details.component';
import { appModulesBundles } from '../app-module-bundles';
import { createSpecShot } from 'src/utils/testing/spec-shot.test-data';

describe('SpecShotDetailsComponent', () => {
  let component: SpecShotDetailsComponent;
  let fixture: ComponentFixture<SpecShotDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ...appModulesBundles.material,
      ],
      declarations: [ SpecShotDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecShotDetailsComponent);
    component = fixture.componentInstance;
    component.specShot = createSpecShot('test');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
