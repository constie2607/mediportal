import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';

const routes: Routes = [
  {path: 'adminDashboard', component: AdminDashboard}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
