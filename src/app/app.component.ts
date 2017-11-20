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

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen ,public menu :MenuController ,public storage: Storage ,public alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
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
    this.navCtrl.setRoot(CrearNoticiaPage);
    this.menu.close();
  }

  irCreaEventos() {
    this.navCtrl.setRoot(CrearEventoPage);
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


}

