import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProformaPage } from './proforma.page';

const routes: Routes = [
  {
    path: '',
    component: ProformaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProformaPageRoutingModule {}
