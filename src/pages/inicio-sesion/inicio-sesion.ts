import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,AlertController} from 'ionic-angular';
import { RecuperarClavePage } from '../../pages/recuperar-clave/recuperar-clave';
import firebase from 'firebase';
import { RegistroPage } from '../../pages/registro/registro';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { Storage } from '@ionic/storage';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { GooglePlus } from '@ionic-native/google-plus';
import { auth } from 'firebase';
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
  //recaptchaVerifier:any;
  public recaptchaVerifier:firebase.auth.RecaptchaVerifier;
  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: Facebook, public af: AngularFireDatabase, public storage: Storage,private twitter: TwitterConnect ,private googlePlus: GooglePlus ,public alertCtrl : AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InicioSesionPage');
    //this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  }

  //Direccion a pagina de recuperar clave
  irRecuperarClave() {
    this.navCtrl.push(RecuperarClavePage);
  }


  //evento de inicio de sesion con email
  loginUser(): Promise<any> {
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
          alert("Firebase failure: " + JSON.stringify(error));
        });
    }).catch((error1) => { 
      console.log(error1) ;
      alert("Facebook error : " + JSON.stringify(error1));
    });
  }


  twLogin(): void {
  this.twitter.login().then( response => {
    const twitterCredential = firebase.auth.TwitterAuthProvider
      .credential(response.token, response.secret);

    firebase.auth().signInWithCredential(twitterCredential)
    .then( userProfile => {
      this.userProfile = userProfile;
      this.userProfile.twName = response.userName;
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
      console.log(this.userProfile);
      console.log("resultado");
      console.log(JSON.stringify(this.userProfile));
    }, error => {
      console.log(error);
    });
  }, error => {
    console.log("Error connecting to twitter: ", error);
  });
}

googleLogin(){

  this.googlePlus.login(
                {  
                  'webClientId': '64367296687-r285irt9pip4pij1uj0pp9fnphv0oicp.apps.googleusercontent.com',
                  'offline': true
                })
  .then(userData => {
        console.log(userData);
         var token = userData.idToken;
          const googleCredential = auth.GoogleAuthProvider.credential(token, null);
          firebase.auth().signInWithCredential(googleCredential).then((userProfile)=>{
            console.log("Login ok");
            console.log(JSON.stringify(userProfile));
                this.userProfile = userProfile;
     
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
      console.log(this.userProfile);
      console.log("resultado");
      console.log(JSON.stringify(this.userProfile));
            
          }).catch(error => {
            console.log( "errorr firebase   = "  + error);
            
          });


  })
  .catch(err => console.error("error ++ = " + err));
}

/*telefono:any;
signIn(phoneNumber: number){
  const appVerifier = this.recaptchaVerifier;
  const phoneNumberString = "+" + this.telefono;

  firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
    .then( confirmationResult => {
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      let prompt = this.alertCtrl.create({
      title: 'Enter the Confirmation code',
      inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
      buttons: [
        { text: 'Cancel',
          handler: data => { console.log('Cancel clicked'); }
        },
        { text: 'Send',
          handler: data => {
            confirmationResult.confirm(data.confirmationCode)
            .then(function (result) {
              // User signed in successfully.
              console.log(result.user);
              // ...
            }).catch(function (error) {
              // User couldn't sign in (bad verification code?)
              // ...
            });
          }
        }
      ]
    });
    prompt.present();
  })
  .catch(function (error) {
    console.error("SMS not sent", error);
    console.log(JSON.stringify(error));
  });

}
*/



closeLogin(){
  this.navCtrl.pop();
}


  //Direccion a pagina de registro
  irRegistro() {
    this.navCtrl.push(RegistroPage);
  }

}
