import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CundiEventosPage } from './cundi-eventos';

@NgModule({
  declarations: [
    CundiEventosPage,
  ],
  imports: [
    IonicPageModule.forChild(CundiEventosPage),
  ],
})
export class CundiEventosPageModule {}
