import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { reviewRoute } from './review/review.routes';


const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'review',
    ...reviewRoute,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
