import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecShotListComponent } from './spec-shot-list.component';

describe('SpecShotListComponent', () => {
  let component: SpecShotListComponent;
  let fixture: ComponentFixture<SpecShotListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecShotListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecShotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
