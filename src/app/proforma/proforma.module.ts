import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProformaPageRoutingModule } from './proforma-routing.module';

import { ProformaPage } from './proforma.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProformaPageRoutingModule
  ],
  declarations: [ProformaPage]
})
export class ProformaPageModule {}
