import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditarNoticiasPage } from './editar-noticias';

@NgModule({
  declarations: [
    EditarNoticiasPage,
  ],
  imports: [
    IonicPageModule.forChild(EditarNoticiasPage),
  ],
})
export class EditarNoticiasPageModule {}
