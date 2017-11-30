import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,MenuController ,AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { CundiAmarillasPage } from '../../pages/cundi-amarillas/cundi-amarillas';
import { CundiEmpleosPage } from '../../pages/cundi-empleos/cundi-empleos';
import { CundiEventosPage } from '../../pages/cundi-eventos/cundi-eventos';
import { CundiNoticiasPage } from '../../pages/cundi-noticias/cundi-noticias';
import { ColombiaPage } from '../../pages/colombia/colombia';
import { DepartamentoPage } from '../../pages/departamento/departamento';
import { Subject } from 'rxjs/Subject';
import firebase from 'firebase';
import { EditarNoticiasPage } from '../../pages/editar-noticias/editar-noticias';
import { EditarEventoPage } from '../../pages/editar-evento/editar-evento';

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
  menuSelect  :any ; 
  noticias:any = [] ; 
  filtroMunicipios:any ;
  itemRef:any ; 
  filtroEventos:any;
  eventos:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams ,public storage: Storage  ,public af: AngularFireDatabase , public menuCtrl :MenuController , public alertCtrl :AlertController) {
  this.menuSelect ="noticias";
  	 //veirfica si el usuario esta guardado
    this.storage.get('userData')
      .then(
      data => {
       // console.log(JSON.stringify(data)),
        //  console.log("finaliza");
        //existe usuario
          console.log("uid " + data.uid);
          this.item = this.af.object(this.departamentoApp+'/userProfile/' + data.uid, { preserveSnapshot: true });
          this.item.subscribe(snapshot => {
          	//console.log("Perifl  info ");
            //console.log(snapshot.key);
          //  console.log(JSON.stringify(snapshot.val()));
            this.perfil =snapshot.val();
              this.perfil.uid = data.uid
            console.log("consulta por :" + this.perfil.uid);
            this.noticias=[];
            let subject = new Subject();


            const queryObservable = this.af.list(this.departamentoApp+'/Noticias/', {
              query: {
                orderByChild: 'uidCreador',
                equalTo : subject
              }
            });
            //manjo de respuesta 
            // subscribe to changes
            queryObservable.subscribe(queriedItems => {
              this.noticias = [];
           //   console.log(JSON.stringify(queriedItems));
              //alamaenca resultado del filtro en arreglo 
              this.filtroMunicipios = queriedItems;
              //recorre arreglo para setelartl en la lista 
              this.filtroMunicipios.forEach((item, index) => {
             
                   let data =item;
                   this.noticias.push(data);                 

              });
            });

            subject.next(this.perfil.uid);

            let subjectEventos = new Subject();
            



            const queryObservableEventos = this.af.list(this.departamentoApp+'/Eventos/', {
              query: {
                orderByChild: 'uidCreador',
                equalTo : subjectEventos
              }
            });
            //manjo de respuesta 
            // subscribe to changes
            queryObservableEventos.subscribe(queriedItems => {
           //   console.log(JSON.stringify(queriedItems));
              //alamaenca resultado del filtro en arreglo 
              this.filtroEventos = queriedItems;
              this.eventos = [];
              //recorre arreglo para setelartl en la lista 
              this.filtroEventos.forEach((item, index) => {
             
                   let data =item;
                   this.eventos.push(data);                 

              });
            });

            subjectEventos.next(this.perfil.uid);
            
          });
       
      },
      error => {
        //si no esta guardado envia a la pagina de login
        console.error("error = " + error);
      //  this.navCtrl.push(InicioSesionPage);
      }
      );
  }

   eliminarNoticia(uid) {
    let alert = this.alertCtrl.create({
      title: 'Eliminar noticia',
      message: '¿Esta seguro que desea eliminar la noticia?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            console.log('Buy clicked');
             firebase.database().ref(this.departamentoApp+'/Noticias/').child(uid)
              .update(
              { 
                disponible: false
                
              }
              );
          }//fin handelr
        }
      ]
    });
    alert.present();
  }


   eliminarEvento(uid) {
    let alert = this.alertCtrl.create({
      title: 'Eliminar noticia',
      message: '¿Esta seguro que desea eliminar el evento?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            console.log('Buy clicked');
             firebase.database().ref(this.departamentoApp+'/Eventos/').child(uid)
              .update(
              { 
                disponible: false
                
              }
              );
          }//fin handelr
        }
      ]
    });
    alert.present();
  }

  editarNoticia(uid){
    this.navCtrl.push(EditarNoticiasPage ,{uid:uid});

  }
  editarEvento(uid){
    this.navCtrl.push(EditarEventoPage,{uid:uid});

  }


 selectTab(data){
 console.log(data);
    if(data === 'noticias'){
      this.menuSelect = "noticias";
    }
    
    if(data === 'eventos'){
      this.menuSelect = "eventos";
    }

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
