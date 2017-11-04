import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { Storage } from '@ionic/storage';
import { DetalleNoticiaPage } from '../../pages/detalle-noticia/detalle-noticia';
import { DetalleEventoPage } from '../../pages/detalle-evento/detalle-evento';
/**
 * Generated class for the FavoritosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-favoritos',
  templateUrl: 'favoritos.html',
})
export class FavoritosPage {

	menuSelect :any = "noticias";
  departamentoApp:any = "/Cundinamarca";

  item :any;
  perfil :any= [];
  eventos:any = [];
  noticias:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams ,public af: AngularFireDatabase , public storage: Storage) {


//veirfica si el usuario esta guardado
    this.storage.get('userData').then(data => {
      //  console.log(JSON.stringify(data)),
          console.log("finaliza");
        //existe usuario
        
        //  console.log(data.uid);
          this.item = this.af.object(this.departamentoApp+'/userProfile/' + data.uid, { preserveSnapshot: true });
          this.item.subscribe(snapshot => {
           // console.log(snapshot.key);
           // console.log(snapshot.val());
            this.perfil = snapshot.val();
            this.perfil.uid =snapshot.key ;

             //consulta la informacion de tdas los eventos 
              this.af.list(this.departamentoApp+'/EventosGuardadosUsuario/'+this.perfil.uid ,{ preserveSnapshot: true})
                  .subscribe(snapshots=>{
                    console.log("entra eventos");
                    this.eventos = [];
                        snapshots.forEach(snapshot1 => {

                             let dataEv = snapshot1.val();
                            // console.log(JSON.stringify(snapshot1.val()));
                             console.log("url  = " + this.departamentoApp+'/municipios/' + dataEv.evento.uidMunicipio );

                             let dataMun= this.af.object(this.departamentoApp+'/municipios/' +dataEv.evento.uidMunicipio , { preserveSnapshot: true });
                              dataMun.subscribe(snapshotMuni => {

                                console.log("info municipio EVENTO  ");
                                console.log(JSON.stringify(snapshotMuni.val()));
                                dataEv.evento.nombreMunicipio  = snapshotMuni.val().nombreMunicipio ; 
                                this.eventos.push(dataEv);

                              });
                             

                        });

                  });

                     //consulta la informacion de tdas las noticias 
              this.af.list(this.departamentoApp+'/NoticiasGuardadasUsuario/'+this.perfil.uid ,{ preserveSnapshot: true})
                  .subscribe(snapshots=>{
                   this.noticias = [];
                        snapshots.forEach(snapshot1 => {

                             let data = snapshot1.val();
                             //console.log(JSON.stringify(snapshot1.val()));

                              let dataMun1= this.af.object(this.departamentoApp+'/municipios/' +data.noticia.uidMunicipio , { preserveSnapshot: true });
                              dataMun1.subscribe(snapshot => {

                                //console.log("info municipio" );
                                //console.log(JSON.stringify(snapshot.val()));
                                //console.log(" municipio = "  + snapshot.val().nombreMunicipio  );
                                data.noticia.nombreMunicipio  = snapshot.val().nombreMunicipio ; 
                                this.noticias.push(data);
                              });
                             

                        });

                  });
          });
        
      },
      error => {
        //si no esta guardado envia a la pagina de login
        console.error("error = " + error);
        //this.navCtrl.push(InicioSesionPage);
      }
      );
 

  }

  selectTab(data){

  	if(data === 'noticias'){
  		this.menuSelect = "noticias";
  	}
    
    if(data === 'eventos'){
  		this.menuSelect = "eventos";
  	}

  	if(data === 'municipios'){
  		this.menuSelect = "municipios";
  	}

  }


 detalleNoticia(noticia){
   console.log("entra detalle noticia");
    
      this.navCtrl.push(DetalleNoticiaPage , {urlImagen  :noticia.urlImagen ,tituloNoticia :noticia.tituloNoticia ,  nombreCreador :noticia.nombreUsuario , descripcion :noticia.descripcion  , imagenCreador :noticia.urlImagenCreador  ,uidNoticia:noticia.index,fechaCreacion:noticia.fechaNoticia });
  }

  //funcon que envia a la pantalla de detalle de evento con su respecitva inv
  detalleEvento(evento) {

    //envia a la pantalla  
    this.navCtrl.push(DetalleEventoPage, { urlImagen: evento.urlImagen, tituloEvento: evento.tituloEvento, nombreCreador: evento.nombreUsuario, descripcion: evento.descripcionEvento, imagenCreador: evento.urlImagenCreador, uidNoticia: evento.index, fechaInicio: evento.fechaInicio, fechaFin: evento.fechaFin });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad FavoritosPage');
  }

}
