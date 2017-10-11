import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CundiNoticiasPage } from './cundi-noticias';

@NgModule({
  declarations: [
    CundiNoticiasPage,
  ],
  imports: [
    IonicPageModule.forChild(CundiNoticiasPage),
  ],
})
export class CundiNoticiasPageModule {}
