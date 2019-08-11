import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { SpecShotListComponent } from './spec-shot-list/spec-shot-list.component';
import { ReviewPageComponent } from './review-page/review-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    SpecShotListComponent,
    ReviewPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
