import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewOverviewPageComponent } from './review-overview-page.component';

describe('ReviewOverviewPageComponent', () => {
  let component: ReviewOverviewPageComponent;
  let fixture: ComponentFixture<ReviewOverviewPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewOverviewPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewOverviewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
