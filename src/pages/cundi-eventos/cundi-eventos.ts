import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { DetalleNoticiaPage } from '../../pages/detalle-noticia/detalle-noticia';
import { DetalleEventoPage } from '../../pages/detalle-evento/detalle-evento';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

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
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFireDatabase, private socialSharing: SocialSharing, private transfer: FileTransfer, private file: File) {
    //recibe informacion de los eventos
    this.af.list('/Eventos/', { preserveSnapshot: true })
      .subscribe(snapshots => {
        //reinicializa eventos
        this.eventos = [];
        //recorre resultado de la consulta 
        snapshots.forEach(snapshot1 => {
          let data = snapshot1.val();
          console.log("uid creador = " + data.uidCreador);
          //consulta informacion del creador del evento
          this.itemRef = this.af.object('userProfile/' + data.uidCreador, { preserveSnapshot: true });
          this.itemRef.subscribe(snapshot => {
            //console.log(action.type);

            console.log("llave" + snapshot.key)
            console.log('data ' + JSON.stringify(snapshot.val()));
            data.urlImagenCreador = snapshot.val().photoUrl;
            data.nombreUsuario = snapshot.val().nombreUsuario;
            data.index = snapshot1.key;
            //setea eventos 
            this.eventos.push(data);
          });
          console.log("key =" + snapshot1.key);
          console.log("Value =" + JSON.stringify(snapshot1.val()));
        });
      });
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

}
