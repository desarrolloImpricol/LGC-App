import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { CundiAmarillasPage } from '../../pages/cundi-amarillas/cundi-amarillas';
import { CundiEmpleosPage } from '../../pages/cundi-empleos/cundi-empleos';
import { CundiEventosPage } from '../../pages/cundi-eventos/cundi-eventos';
import { CundiNoticiasPage } from '../../pages/cundi-noticias/cundi-noticias';
import { PublicarPage } from '../../pages/publicar/publicar';
import { CrearNoticiaPage } from '../../pages/crear-noticia/crear-noticia';
import { CrearEventoPage } from '../../pages/crear-evento/crear-evento';
import { BusquedaAvanzadaPage } from '../../pages/busqueda-avanzada/busqueda-avanzada';
import { PerfilClientePage } from '../../pages/perfil-cliente/perfil-cliente';
import { FavoritosPage } from '../../pages/favoritos/favoritos';
import { DepartamentoPage } from '../../pages/departamento/departamento';
/*
  Generated class for the DireccionamientosProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class DireccionamientosProvider {


	public nombreApp: any = "CUNDINAMARCA";

  constructor(){

    console.log('Hello DireccionamientosProvider Provider');
    this.nombreApp = "Cundinamarca";
  }



   setMessage(message) {
    this.nombreApp = message;
  }






}
