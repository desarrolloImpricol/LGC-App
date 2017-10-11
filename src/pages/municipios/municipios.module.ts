import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MunicipiosPage } from './municipios';

@NgModule({
  declarations: [
    MunicipiosPage,
  ],
  imports: [
    IonicPageModule.forChild(MunicipiosPage),
  ],
})
export class MunicipiosPageModule {}
