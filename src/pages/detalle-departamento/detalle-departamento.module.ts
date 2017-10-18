import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalleDepartamentoPage } from './detalle-departamento';

@NgModule({
  declarations: [
    DetalleDepartamentoPage,
  ],
  imports: [
    IonicPageModule.forChild(DetalleDepartamentoPage),
  ],
})
export class DetalleDepartamentoPageModule {}
