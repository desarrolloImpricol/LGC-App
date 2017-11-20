import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DepartamentoPage } from './departamento';

@NgModule({
  declarations: [
    DepartamentoPage,
  ],
  imports: [
    IonicPageModule.forChild(DepartamentoPage),
  ],
})
export class DepartamentoPageModule {}
