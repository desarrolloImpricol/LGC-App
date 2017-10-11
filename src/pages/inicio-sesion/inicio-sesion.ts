import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RecuperarClavePage } from '../../pages/recuperar-clave/recuperar-clave';
import firebase from 'firebase';
import { RegistroPage } from '../../pages/registro/registro';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the InicioSesionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-inicio-sesion',
  templateUrl: 'inicio-sesion.html',
})
export class InicioSesionPage {

  email: any;
  clave: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: Facebook, public af: AngularFireDatabase, public storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InicioSesionPage');
  }

  //Direccion a pagina de recuperar clave
  irRecuperarClave() {
    this.navCtrl.push(RecuperarClavePage);
  }


  //evento de inicio de sesion con email
  loginUser(): firebase.Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(this.email, this.clave).then(loginResultado => {

      // alert("Email correcto");
      console.log(JSON.stringify(loginResultado));
      //alamacena resultado para persisitir la sesion
      this.storage.set('userData', loginResultado)
        .then(
        () => {
          console.log('Stored item!');
          this.navCtrl.popToRoot();
        },
        error => console.error('Error storing item', error)
        );
      // this.navCtrl.pop();
    }).catch((_error) => { //validacion de errores
      console.log("Error!");
      let erroInfo = JSON.stringify(_error);
      console.log(JSON.stringify(_error));
      console.log(_error.message);

      if (_error.message === 'The email address is badly formatted.') {
        alert("Formato email incorrecto");
      }
      if (_error.message === 'The password is invalid or the user does not have a password.') {
        alert("Clave incorrecta");
      }
    });
  }
  userProfile: any;
  item: any;

  loginFacebook() {
    this.fb.login(['email']).then((response) => {
      const facebookCredential = firebase.auth.FacebookAuthProvider
        .credential(response.authResponse.accessToken);

      firebase.auth().signInWithCredential(facebookCredential)
        .then((success) => {
          console.log("Firebase success: " + JSON.stringify(success));
          this.userProfile = success;
          let uidCliente = this.userProfile.uid;
          let email = this.userProfile.email;
          let fotoPerfil = this.userProfile.photoURL;
          let nombreCliente = this.userProfile.displayName;
          console.log("uidCliente =" + uidCliente);
          console.log("foto perfil =" + fotoPerfil);
          console.log("nombre cliente =" + nombreCliente);

          this.item = this.af.object('/userProfile/' + uidCliente, { preserveSnapshot: true });
          this.item.subscribe(snapshot => {
            console.log("*****************");
            console.log("*****************");
            console.log("*****************");

            console.log(snapshot.key);
            console.log(snapshot.val());

            // this.perfil =  snapshot.val();

            if (snapshot.val() === undefined || snapshot.val() === null) {
              console.log("usuario no existe");
              firebase.database().ref('/userProfile').child(uidCliente)
                .set(
                {
                  email: email,
                  nombreUsuario: nombreCliente,
                  tipoUsuario: 'persona',
                  photoUrl: fotoPerfil
                }
                );

              firebase.database().ref('/notificacionesUsuario').child(uidCliente)
                .set(
                {
                  uid: uidCliente,
                  uidMunicipio: '-',
                  uidDepartamento: '-',
                  interesSoloMunicipio: false
                }
                );
              //   this.storage.set('userProfile')
              this.storage.set('userData', this.userProfile)
                .then(
                () => {
                  console.log('Stored item!');
                  this.navCtrl.popToRoot();
                },
                error => console.error('Error storing item', error)
                );
            } else {
              console.log("usuario  existe");
              this.storage.set('userData', this.userProfile)
                .then(
                () => {
                  console.log('Stored item!');
                  this.navCtrl.popToRoot();
                },

                error => console.error('Error storing item', error)
                );
            }
          });
        })
        .catch((error) => {
          console.log("Firebase failure: " + JSON.stringify(error));
        });
    }).catch((error) => { console.log(error) });
  }



  //Direccion a pagina de registro
  irRegistro() {
    this.navCtrl.push(RegistroPage);
  }

}
