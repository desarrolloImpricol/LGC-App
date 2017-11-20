import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,MenuController  } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { CundiAmarillasPage } from '../../pages/cundi-amarillas/cundi-amarillas';
import { CundiEmpleosPage } from '../../pages/cundi-empleos/cundi-empleos';
import { CundiEventosPage } from '../../pages/cundi-eventos/cundi-eventos';
import { CundiNoticiasPage } from '../../pages/cundi-noticias/cundi-noticias';
import { ColombiaPage } from '../../pages/colombia/colombia';
import { DepartamentoPage } from '../../pages/departamento/departamento';


/**
 * Generated class for the PerfilClientePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-perfil-cliente',
  templateUrl: 'perfil-cliente.html',
})
export class PerfilClientePage {

  item: any;
  perfil:any = [];
  departamentoApp :any = "/Cundinamarca";
  constructor(public navCtrl: NavController, public navParams: NavParams ,public storage: Storage  ,public af: AngularFireDatabase , public menuCtrl :MenuController) {

  	 //veirfica si el usuario esta guardado
    this.storage.get('userData')
      .then(
      data => {
        console.log(JSON.stringify(data)),
          console.log("finaliza");
        //existe usuario
          console.log(data.uid);
          this.item = this.af.object(this.departamentoApp+'/userProfile/' + data.uid, { preserveSnapshot: true });
          this.item.subscribe(snapshot => {
          	console.log("Perifl  info ");
            console.log(snapshot.key);
            console.log(JSON.stringify(snapshot.val()));
            this.perfil = snapshot.val();
            
          });
       
      },
      error => {
        //si no esta guardado envia a la pagina de login
        console.error("error = " + error);
      //  this.navCtrl.push(InicioSesionPage);
      }
      );
  }
ionViewWillEnter() {
   console.log("activa nav");
     this.menuCtrl.enable(true, 'menuSlide');

   }

 
  ionViewDidLoad() {
    console.log('ionViewDidLoad PerfilClientePage');
  }

  irDepartamentos(){

    this.navCtrl.setRoot(DepartamentoPage);
   //redireccion a colombia
  
  }
  irColombia(){
    this.navCtrl.setRoot(ColombiaPage);
  }
  //redirecciona a noticias
  irNoticias() {
    //this.navCtrl.setRoot(CundiNoticiasPage);
    this.navCtrl.setRoot(CundiNoticiasPage);
  }
  //redirecciona a eventos
  irEventos() {
    this.navCtrl.setRoot(CundiEventosPage);
    //alert("Proximamente");
  }
  //redireccion a empleos
  irEmpleos() {
    //this.navCtrl.setRoot(CundiEmpleosPage);
    alert("Proximamente");
  }
  //redireccion a amarillas
  irAmarillas() {
    alert("Proximamente");
    //this.navCtrl.setRoot(CundiAmarillasPage);
  }

  irPromociones(){
    alert("Proximamente");
  }

}
