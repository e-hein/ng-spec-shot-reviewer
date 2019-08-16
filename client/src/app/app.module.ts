import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { appModulesBundles } from './app-module-bundles';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BackendService } from './backend.service';
import { HomePageComponent } from './home-page/home-page.component';
import { PageLayoutComponent } from './page-layout/page-layout.component';
import { ReviewDetailsPageComponent } from './review-details-page/review-details-page.component';
import { ReviewOverviewPageComponent } from './review-overview-page/review-overview-page.component';
import { ReviewPageComponent } from './review-page/review-page.component';
import { SpecShotDetailsComponent } from './spec-shot-details/spec-shot-details.component';
import { SpecShotListComponent } from './spec-shot-list/spec-shot-list.component';
import { XhrBackendService } from './xhr-backend.service';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    SpecShotListComponent,
    ReviewPageComponent,
    PageLayoutComponent,
    SpecShotDetailsComponent,
    ReviewOverviewPageComponent,
    ReviewDetailsPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ...appModulesBundles.material,
  ],
  providers: [
    { provide: BackendService, useExisting: XhrBackendService, },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
