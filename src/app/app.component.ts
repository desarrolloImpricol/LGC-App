import { Component , ViewChild} from '@angular/core';
import { Platform , NavController ,App ,MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CundiAmarillasPage } from '../pages/cundi-amarillas/cundi-amarillas';
import { CundiEmpleosPage } from '../pages/cundi-empleos/cundi-empleos';
import { CundiEventosPage } from '../pages/cundi-eventos/cundi-eventos';
import { CundiNoticiasPage } from '../pages/cundi-noticias/cundi-noticias';
import { PublicarPage } from '../pages/publicar/publicar';
import { CrearNoticiaPage } from '../pages/crear-noticia/crear-noticia';
import { CrearEventoPage } from '../pages/crear-evento/crear-evento';
import { BusquedaAvanzadaPage } from '../pages/busqueda-avanzada/busqueda-avanzada';
import { PerfilClientePage } from '../pages/perfil-cliente/perfil-cliente';
import { FavoritosPage } from '../pages/favoritos/favoritos';
import { DepartamentoPage } from '../pages/departamento/departamento';
import { Storage } from '@ionic/storage';
import { InicioSesionPage } from '../pages/inicio-sesion/inicio-sesion';
import { HomePage } from '../pages/home/home';
import { AlertController } from 'ionic-angular';
import { EditarPerfilPage } from '../pages/editar-perfil/editar-perfil';
import { Subject } from 'rxjs/Subject';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { ToastController } from 'ionic-angular';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('content') navCtrl: NavController
  rootPage:any = HomePage;
  mostrarMenuPerfil:any;
  protected app: App;
  mostrarBusqueda :any ;
  queBusca:any ;
  municipios:any;
  filtroMunicipios:any;
  departamentoApp :any = "/Cundinamarca";
  dondebusca:any;
  alert:any;

  constructor(public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen ,public menu :MenuController ,public storage: Storage ,public alertCtrl: AlertController ,public af: AngularFireDatabase ,private toastCtrl: ToastController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();


       platform.registerBackButtonAction(() => {


                //uncomment this and comment code below to to show toast and exit app
                // if (this.backButtonPressedOnceToExit) {
                //   this.platform.exitApp();
                // } else if (this.nav.canGoBack()) {
                //   this.nav.pop({});
                // } else {
                //   this.showToast();
                //   this.backButtonPressedOnceToExit = true;
                //   setTimeout(() => {

                //     this.backButtonPressedOnceToExit = false;
                //   },2000)
                // }

                if(this.navCtrl.canGoBack()){
                  this.navCtrl.pop();
                }else{
                  if(this.alert){ 
                    this.alert.dismiss();
                    this.alert =null;     
                  }else{
                    this.showAlert();
                   }
                }
              });
       


    });

    

     //reinicializa el arreglo demunicipios
      this.municipios = [];
      let subject = new Subject();
      const queryObservable = this.af.list(this.departamentoApp+'/Municipios', {
        query: {
          orderByKey: true
        }
      });
      //manjo de respuesta 
      // subscribe to changes
      queryObservable.subscribe(queriedItems => {
        console.log(JSON.stringify(queriedItems));
        //alamaenca resultado del filtro en arreglo 
        this.filtroMunicipios = queriedItems;
        //recorre arreglo para setelartl en la lista 
        this.filtroMunicipios.forEach((item, index) => {
          //         console.log("item municipio = " + JSON.stringify(item));

          let dataI = item;

          this.municipios.push(dataI);
        });
      });
  }


 showAlert() {
          this.alert = this.alertCtrl.create({
            title: 'Salir',
            message: 'Esta seguro que desea salir de la app?',
            buttons: [
              {
                text: 'Cancelar',
                role: 'cancel',
                handler: () => {
                  this.alert =null;
                }
              },
              {
                text: 'Salir',
                handler: () => {
                 this.platform.exitApp();
                }
              }
            ]
          });
          
          this.alert.present();
    }


 openBusquedaMenu(){
    if(this.mostrarBusqueda){
       this.mostrarBusqueda = false ;
    }else{
       this.mostrarBusqueda = true ;
    }
  } 


  openPerfilMenu(){
    if(this.mostrarMenuPerfil){
       this.mostrarMenuPerfil = false ;
    }else{
       this.mostrarMenuPerfil = true ;
    }
  }

  buscarMenu(){
    if(this.queBusca === 'noticias'){
      this.navCtrl.setRoot(CundiNoticiasPage);
      this.menu.close();
    }
    if(this.queBusca === 'eventos'){
      this.navCtrl.setRoot(CundiEventosPage);
      this.menu.close();
    }
  }
  irHome(){
    this.navCtrl.setRoot(HomePage);
    this.menu.close();
  }

  //redireccion a colombia
  irColombia(){
    this.navCtrl.setRoot(DepartamentoPage);
    this.menu.close();
  }
  //redirecciona a noticias
  irNoticias() {
    //this.navCtrl.setRoot(CundiNoticiasPage);
    this.navCtrl.setRoot(CundiNoticiasPage);
    this.menu.close();
  }
  //redirecciona a eventos
  irEventos() {
    //this.navCtrl.push(CundiEventosPage);
    this.navCtrl.setRoot(CundiEventosPage);
    this.menu.close();
  }
  //redireccion a empleos
  irEmpleos() {
    this.navCtrl.setRoot(CundiEmpleosPage);
    this.menu.close();
  }
  //redireccion a amarillas
  irAmarillas() {
    this.navCtrl.setRoot(CundiAmarillasPage);
    this.menu.close();
  }
  //redireccion a publicar
  irPublicar() {
    this.navCtrl.setRoot(PublicarPage);
    this.menu.close();
  }

  irCrearNoticias() {
    this.navCtrl.push(CrearNoticiaPage);
    this.menu.close();
  }

  irCreaEventos() {
    this.navCtrl.push(CrearEventoPage);
    this.menu.close();
  }

  irBusquedaAvanzada() {
    this.navCtrl.setRoot(BusquedaAvanzadaPage);
    this.menu.close();
  }

  irEditarPerfil(){
    this.navCtrl.setRoot(EditarPerfilPage);
    this.menu.close();
  }


  irPerfilCliente() {

   //this.navCtrl.push(PerfilClientePage);
    this.navCtrl.setRoot(PerfilClientePage);
    this.menu.close();
  }
  irFavoritos() {
    this.navCtrl.setRoot(FavoritosPage);
    this.menu.close();
  }
      //elimina los datos guardados del usuario
  cerrarSesion() {
    this.storage.remove('userData')
      .then(
      data => {
        console.log("eliminado = " + data);
        //    this.platform.exitApp();
        //luego de eliminado envia a pantalla de  login
        this.navCtrl.push(InicioSesionPage);
        this.menu.close();
      },
      error => console.error(error)
      );

  }


  showRadio() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Publicar');

    alert.addInput({
      type: 'radio',
      label: 'Noticia',
      value: 'noticia',
      checked: false
    });


    alert.addInput({
      type: 'radio',
      label: 'Evento',
      value: 'evento',
      checked: false
    });


    alert.addButton('Cancelar');
    alert.addButton({
      text: 'OK',
      handler: data => {
        //this.testRadioOpen = false;
        //this.testRadioResult = data;
        console.log(data);
        if(data === 'noticia'){
            this.irCrearNoticias();
        }
        if(data === 'evento'){
            this.irCreaEventos();
        }  
      }
    });
    alert.present();
  }



 busquedaAvanzada(){
  console.log("busqueda avanzada antes de if = " + this.dondebusca );  
   if(this.queBusca === 'noticias'){
     if(this.dondebusca === undefined || this.dondebusca === "" || this.dondebusca === null  ){
       this.navCtrl.setRoot(CundiNoticiasPage);
     }else{

       console.log("busqueda avanzada = " + this.dondebusca );  
       this.navCtrl.setRoot(CundiNoticiasPage , {uidMunicipio:this.dondebusca});
     }
      
      this.menu.close();
    }
    if(this.queBusca === 'eventos'){
      if(this.dondebusca === undefined || this.dondebusca === "" || this.dondebusca === null  ){
        this.navCtrl.setRoot(CundiEventosPage);
      }else{
        console.log("busqueda avanzada = " + this.dondebusca );  
        this.navCtrl.setRoot(CundiEventosPage, {uidMunicipio:this.dondebusca});
      }      
      this.menu.close();
    }
     
  }


  presentToast() {
  let toast = this.toastCtrl.create({
    message: 'User was added successfully',
    duration: 3000,
    position: 'top'
  });

  toast.onDidDismiss(() => {
    console.log('Dismissed toast');
  });

  toast.present();
}


}

