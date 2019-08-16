import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewDetailsPageComponent } from './review-details-page.component';

describe('ReviewDetailsPageComponent', () => {
  let component: ReviewDetailsPageComponent;
  let fixture: ComponentFixture<ReviewDetailsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewDetailsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
