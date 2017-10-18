import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { DetalleNoticiaPage } from '../../pages/detalle-noticia/detalle-noticia';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

/**
 * Generated class for the CundiNoticiasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cundi-noticias',
  templateUrl: 'cundi-noticias.html',
})
export class CundiNoticiasPage {
  noticias:any = [] ;
  itemRef :any ;
  constructor(public navCtrl: NavController, public navParams: NavParams , public af: AngularFireDatabase ,private socialSharing: SocialSharing  ,private transfer: FileTransfer, private file: File) {
    //consulta la informacion de tdas las noticias 
    this.af.list('/Noticias/' ,{ preserveSnapshot: true})
        .subscribe(snapshots=>{
            this.noticias = [];
            snapshots.forEach(snapshot1 => {
             let data = snapshot1.val();
             console.log("uid creador = " + data.uidCreador);
                  this.itemRef = this.af.object('userProfile/'+data.uidCreador,  { preserveSnapshot: true });
                  this.itemRef.subscribe(snapshot => {
                    //console.log(action.type);
                    console.log("llave" + snapshot.key)
                    console.log('data ' + JSON.stringify(snapshot.val()));
                    data.urlImagenCreador  = snapshot.val().photoUrl;
                    data.nombreUsuario = snapshot.val().nombreUsuario;
                    data.index =  snapshot1.key ;
                    console.log("add noticia");
                    this.noticias.push(data);
                  });
             console.log("key ="+snapshot1.key);
             console.log("Value ="+ JSON.stringify(snapshot1.val()));
            });
        });

  }

    //funcion que comparte las imagenes de la notica 
    compartir(urlImg){


      console.log("entra a compartir");
      const fileTransfer: FileTransferObject = this.transfer.create();
      let data =  urlImg.split("?");
      let data1 = data[0].split("/");
      let total  = data1.length;
      console.log("total" + total );
      console.log(data1[total-1]);
      let nombre = data1[total-1] ;
      const url = urlImg;

      fileTransfer.download(url, this.file.externalApplicationStorageDirectory+nombre).then((entry) => {
        console.log('download complete: ' + entry.toURL());
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


  detalleNoticia(urlImagen,tituloNoticia , nombreCreador , imagenCreador , descripcion ,uidNoticia,fechaCreacion){
      console.log("url imagen = " + urlImagen);
      console.log("titulo noticia = " + tituloNoticia);
      console.log("nombre creador = " + nombreCreador);
      console.log("imagen creador = " + imagenCreador);
      console.log("descripcion = " + descripcion);
      console.log("uid noticia = " + uidNoticia);
      console.log("fecha noticia = " + fechaCreacion);
      this.navCtrl.push(DetalleNoticiaPage , {urlImagen  :urlImagen ,tituloNoticia :tituloNoticia ,  nombreCreador :nombreCreador , descripcion :descripcion  , imagenCreador :imagenCreador  ,uidNoticia:uidNoticia,fechaCreacion:fechaCreacion });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CundiNoticiasPage');
  }

}
