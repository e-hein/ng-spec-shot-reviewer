import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecShotDetailsComponent } from './spec-shot-details.component';

describe('SpecShotDetailsComponent', () => {
  let component: SpecShotDetailsComponent;
  let fixture: ComponentFixture<SpecShotDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecShotDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecShotDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
