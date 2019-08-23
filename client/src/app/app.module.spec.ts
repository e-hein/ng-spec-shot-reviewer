import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { APP_BASE_HREF } from '@angular/common';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ AppModule ],
    providers: [
      { provide: APP_BASE_HREF, useValue: '/app/' },
    ],
  }).compileComponents()  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
