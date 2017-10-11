import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { CundiAmarillasPage } from '../../pages/cundi-amarillas/cundi-amarillas';
import { CundiEmpleosPage } from '../../pages/cundi-empleos/cundi-empleos';
import { CundiEventosPage } from '../../pages/cundi-eventos/cundi-eventos';
import { CundiNoticiasPage } from '../../pages/cundi-noticias/cundi-noticias';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { LoginPage } from '../../pages/login/login';
import { Deeplinks } from '@ionic-native/deeplinks';
import { PublicarPage } from '../../pages/publicar/publicar';
import { Storage } from '@ionic/storage';
import { ColombiaPage } from '../../pages/colombia/colombia';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //info de perfil
  perfil: any = [];

  constructor(public navCtrl: NavController, public af: AngularFireDatabase, public secureStorage: SecureStorage, private deeplinks: Deeplinks, public platform: Platform, public storage: Storage) {

    this.platform = platform;
    //acceso a links  con enlaces profundos
    this.deeplinks.route({
      '/noticias': CundiNoticiasPage,
      '/eventos': CundiEventosPage,
      '/empleos': CundiEmpleosPage,
      '/amarillas': CundiAmarillasPage
    }).subscribe((match) => {
      // match.$route - the route we matched, which is the matched entry from the arguments to route()
      // match.$args - the args passed in the link
      // match.$link - the full link data
      console.log('Successfully matched route', match);
      //console.log("ruta = " + match.$route );
      //console.log("link = " + JSON.stringify(match.$link ));
      //console.log("************path***********" + match.$link.path);
      if (match.$link.path === "/noticias") {
        this.navCtrl.push(CundiNoticiasPage);
      }
      if (match.$link.path === "/eventos") {
        this.navCtrl.push(CundiEventosPage);
      }
      if (match.$link.path === "/empleos") {
        this.navCtrl.push(CundiEmpleosPage);
      }
      if (match.$link.path === "/amarillas") {
        this.navCtrl.push(CundiAmarillasPage);
      }

      //console.log("ruta = " + match.$route );
    }, (nomatch) => {
      // nomatch.$link - the full link data
      console.error('Got a deeplink that didn\'t match', nomatch);
    });
    //setea  un valor de inicio para la foto
    this.perfil.photoUrl = "-";

  }

  //elimina los datos guardados del usuario
  cerrarSesion() {
    this.storage.remove('userData')
      .then(
      data => {
        console.log("eliminado = " + data);
        //    this.platform.exitApp();
        //luego de eliminado envia a pantalla de  login
        this.navCtrl.push(LoginPage);
      },
      error => console.error(error)
      );

  }
  item: any;
  //evento que se ejecuta cada vez que se ingres a ala pantalla
  ionViewWillEnter() {
    //veirfica si el usuario esta guardado
    this.storage.get('userData')
      .then(
      data => {
        console.log(JSON.stringify(data)),
          console.log("finaliza");
        //existe usuario
        if (data != null) {
          console.log(data.uid);
          this.item = this.af.object('/userProfile/' + data.uid, { preserveSnapshot: true });
          this.item.subscribe(snapshot => {
            console.log(snapshot.key);
            console.log(snapshot.val());
            this.perfil = snapshot.val();
          });
        } else {
          this.navCtrl.push(LoginPage);
        }
      },
      error => {
        //si no esta guardado envia a la pagina de login
        console.error("error = " + error);
        this.navCtrl.push(LoginPage);
      }
      );
  }
  //redireccion a colombia
  irColombia(){
    this.navCtrl.push(ColombiaPage);
  }
  //redirecciona a noticias
  irNoticias() {
    //this.navCtrl.setRoot(CundiNoticiasPage);
    this.navCtrl.push(CundiNoticiasPage);
  }
  //redirecciona a eventos
  irEventos() {
    this.navCtrl.push(CundiEventosPage);
  }
  //redireccion a empleos
  irEmpleos() {
    this.navCtrl.push(CundiEmpleosPage);
  }
  //redireccion a amarillas
  irAmarillas() {
    this.navCtrl.push(CundiAmarillasPage);
  }
  //redireccion a publicar
  irPublicar() {
    this.navCtrl.push(PublicarPage);
  }

}
