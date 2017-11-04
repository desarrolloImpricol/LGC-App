import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrearNoticiaPage } from './crear-noticia';

@NgModule({
  declarations: [
    CrearNoticiaPage,
  ],
  imports: [
    IonicPageModule.forChild(CrearNoticiaPage),
  ],
})
export class CrearNoticiaPageModule {}
