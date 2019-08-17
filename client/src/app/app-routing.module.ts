import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { reviewRoute } from './review/review.routes';
import { ReviewPageComponent } from './review-page/review-page.component';


const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'review',
    component: ReviewPageComponent,
    children: reviewRoute.children,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
