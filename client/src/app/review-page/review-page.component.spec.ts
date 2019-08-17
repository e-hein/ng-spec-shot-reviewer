import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PageLayoutComponent } from '../page-layout/page-layout.component';
import { ReviewPageComponent } from './review-page.component';

describe('ReviewPageComponent', () => {
  let component: ReviewPageComponent;
  let fixture: ComponentFixture<ReviewPageComponent>;

  beforeEach(async(() => TestBed.configureTestingModule({
    imports: [
      RouterTestingModule.withRoutes([]),
    ],
    declarations: [
      ReviewPageComponent,
      PageLayoutComponent,
    ],
  })
  .compileComponents()));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
