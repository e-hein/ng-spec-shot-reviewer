import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { PageLayoutComponent } from './page-layout/page-layout.component';
import { ReviewPageComponent } from './review-page/review-page.component';
import { SpecShotListComponent } from './spec-shot-list/spec-shot-list.component';
import { SpecShotDetailsComponent } from './spec-shot-details/spec-shot-details.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    SpecShotListComponent,
    ReviewPageComponent,
    PageLayoutComponent,
    SpecShotDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
