import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { DetalleNoticiaPage } from '../../pages/detalle-noticia/detalle-noticia';
import { DetalleEventoPage } from '../../pages/detalle-evento/detalle-evento';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the CundiEventosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cundi-eventos',
  templateUrl: 'cundi-eventos.html',
})
export class CundiEventosPage {
  //variables de la calse 
  eventos: any = [];
  itemRef: any;
  departamentoApp :any = "/Cundinamarca";
  item:any;
  perfil :any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFireDatabase, private socialSharing: SocialSharing, private transfer: FileTransfer, private file: File,public storage: Storage) {
      //obtiene informacion del usuario
    this.storage.get('userData')
      .then(
      data => {
        console.log(JSON.stringify(data)),
        console.log("finaliza");
        console.log(data.uid);
        //consulta informacion de perfil 
        this.item = this.af.object(this.departamentoApp+'/userProfile/' + data.uid, { preserveSnapshot: true });
        this.item.subscribe(snapshot => {
          console.log(snapshot.key);
          console.log(snapshot.val());
          //carga informacion a las variables 
          this.perfil = snapshot.val();
          this.perfil.uid = data.uid;

           //recibe informacion de los eventos
              this.af.list(this.departamentoApp+'/Eventos/', { preserveSnapshot: true })
                .subscribe(snapshots => {
                  //reinicializa eventos
                  this.eventos = [];
                  //recorre resultado de la consulta 
                  snapshots.forEach(snapshot1 => {
                    let data = snapshot1.val();
                    console.log("uid creador = " + data.uidCreador);
                    //consulta informacion del creador del evento
                    this.itemRef = this.af.object(this.departamentoApp+'/userProfile/' + data.uidCreador, { preserveSnapshot: true });
                    this.itemRef.subscribe(snapshot => {
                      //console.log(action.type);

                      console.log("llave" + snapshot.key)
                      console.log('data ' + JSON.stringify(snapshot.val()));
                      data.urlImagenCreador = snapshot.val().photoUrl;
                      data.nombreUsuario = snapshot.val().nombreUsuario;
                      data.index = snapshot1.key;

                      //verifica si esa noticia esta guardada  como favorita 
                       let infoGuardado = this.af.object(this.departamentoApp+'/EventosGuardadosUsuario/'+this.perfil.uid+"/"+ snapshot1.key, { preserveSnapshot: true });
                        infoGuardado.subscribe(snapshot => {
                          console.log("entra consulta si guardo evento ");
                        //  console.log(snapshot.key);
                        //  console.log(snapshot.val());
                          if(snapshot.val() === null ){
                             console.log("evento no guardada");
                              data.guardado = false ;
                          }else{
                            console.log("evento guardada");
                              data.guardado  = true ;
                          }
                         });
                      //setea eventos 
                      this.eventos.push(data);
                    });
                    console.log("key =" + snapshot1.key);
                    console.log("Value =" + JSON.stringify(snapshot1.val()));
                  });
                });

        });
      },
      error => { //si no esta guardado envia a la pagina de login
        console.error("error = " + error);
      }
      );




  }

  //comparte la imagen 
  compartir(urlImg) {
//TODO deeplinks

    console.log("entra a compartir");
    const fileTransfer: FileTransferObject = this.transfer.create();
    let data = urlImg.split("?");
    let data1 = data[0].split("/");
    let total = data1.length;
    console.log("total" + total);
    console.log(data1[total - 1]);
    let nombre = data1[total - 1];
    const url = urlImg;
     
     //descarga imagen 
    fileTransfer.download(url, this.file.externalApplicationStorageDirectory + nombre).then((entry) => {
      console.log('download complete: ' + entry.toURL());
      //comparte imagen 
      this.socialSharing.share("Compartido desde la guía cundinamarca, http://laguiacundinamarca.com/", null, entry.toURL()).then(() => {
        // Success!

        console.log("entra");
      }).catch(() => {
        console.log("error1");
      });
      //this.presentAlert(entry.toURL()) ;
    }, (error) => {
      console.log("error");
      console.log(error);
      // handle error
    });

  }


  //funcon que envia a la pantalla de detalle de evento con su respecitva inv
  detalleNoticia(urlImagen, tituloEvento, nombreCreador, imagenCreador, descripcion, uidNoticia, fechaInicio, fechaFin) {
    console.log("url imagen = " + urlImagen);
    console.log("titulo noticia = " + tituloEvento);
    console.log("nombre creador = " + nombreCreador);
    console.log("imagen creador = " + imagenCreador);
    console.log("descripcion = " + descripcion);
    console.log("uid noticia = " + uidNoticia);
    //envia a la pantalla  
    this.navCtrl.push(DetalleEventoPage, { urlImagen: urlImagen, tituloEvento: tituloEvento, nombreCreador: nombreCreador, descripcion: descripcion, imagenCreador: imagenCreador, uidNoticia: uidNoticia, fechaInicio: fechaInicio, fechaFin: fechaFin });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CundiEventosPage');
  }

  guardarEvento(evento){
 
    console.log("id  = " +  evento.index);
    console.log("id  perfil= " +  this.perfil.uid);

     if(evento.guardado){
       const itemsTattoo = this.af.object(this.departamentoApp+'/EventosGuardadosUsuario/'+this.perfil.uid+"/"+evento.index);
        itemsTattoo.remove();
        evento.guardado = false;
        //this.tatuajeGuardado = false ;
     }else{
       const itemsTattoo = this.af.object(this.departamentoApp+'/EventosGuardadosUsuario/'+this.perfil.uid+"/"+evento.index);
       const promise1 =   itemsTattoo.set(
                                     {
                                        evento : evento,
                                        uid : evento.index          
                                     }
                                   );
        promise1.then(_ =>
          console.log('Noticia guardaa !!!')


        ).catch(err => console.log(err, 'You dont have access!'));
       // this.tatuajeGuardado = true;
       evento.guardado = true;


     }

  }

}
