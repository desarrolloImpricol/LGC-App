import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InicioSesionPage } from '../../pages/inicio-sesion/inicio-sesion';
import { RegistroPage } from '../../pages/registro/registro';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Storage } from '@ionic/storage';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import firebase from 'firebase';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  item: any;
  userProfile: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFireDatabase, public storage: Storage, private fb: Facebook) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  loginFacebook() {
    console.log("ENtra login facebook");
    this.fb.login(['email']).then((response) => {
      console.log("entra obetner credencial");
      const facebookCredential = firebase.auth.FacebookAuthProvider
        .credential(response.authResponse.accessToken);
      console.log("credencial");
      console.log(facebookCredential);

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
                { email: email, nombreUsuario: nombreCliente, tipoUsuario: 'persona', photoUrl: fotoPerfil }
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

    }).catch((error) => {
      console.log(JSON.stringify(error))
    });
  }
  //redirije a la pantalla de inicio de sesion
  irInicioSesion() {
    this.navCtrl.push(InicioSesionPage);

  }
  //redirije a  la pantalla de registro
  irRegistro() {
    this.navCtrl.push(RegistroPage);
  }

}
