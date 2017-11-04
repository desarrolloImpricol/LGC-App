var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { RecuperarClavePage } from '../../pages/recuperar-clave/recuperar-clave';
import firebase from 'firebase';
import { RegistroPage } from '../../pages/registro/registro';
import { Facebook } from '@ionic-native/facebook';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
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
var InicioSesionPage = /** @class */ (function () {
    function InicioSesionPage(navCtrl, navParams, fb, af, storage, twitter, googlePlus, alertCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.fb = fb;
        this.af = af;
        this.storage = storage;
        this.twitter = twitter;
        this.googlePlus = googlePlus;
        this.alertCtrl = alertCtrl;
    }
    InicioSesionPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad InicioSesionPage');
        //this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    };
    //Direccion a pagina de recuperar clave
    InicioSesionPage.prototype.irRecuperarClave = function () {
        this.navCtrl.push(RecuperarClavePage);
    };
    //evento de inicio de sesion con email
    InicioSesionPage.prototype.loginUser = function () {
        var _this = this;
        return firebase.auth().signInWithEmailAndPassword(this.email, this.clave).then(function (loginResultado) {
            // alert("Email correcto");
            console.log(JSON.stringify(loginResultado));
            //alamacena resultado para persisitir la sesion
            _this.storage.set('userData', loginResultado)
                .then(function () {
                console.log('Stored item!');
                _this.navCtrl.popToRoot();
            }, function (error) { return console.error('Error storing item', error); });
            // this.navCtrl.pop();
        }).catch(function (_error) {
            console.log("Error!");
            var erroInfo = JSON.stringify(_error);
            console.log(JSON.stringify(_error));
            console.log(_error.message);
            if (_error.message === 'The email address is badly formatted.') {
                alert("Formato email incorrecto");
            }
            if (_error.message === 'The password is invalid or the user does not have a password.') {
                alert("Clave incorrecta");
            }
        });
    };
    InicioSesionPage.prototype.loginFacebook = function () {
        var _this = this;
        this.fb.login(['email']).then(function (response) {
            var facebookCredential = firebase.auth.FacebookAuthProvider
                .credential(response.authResponse.accessToken);
            firebase.auth().signInWithCredential(facebookCredential)
                .then(function (success) {
                console.log("Firebase success: " + JSON.stringify(success));
                _this.userProfile = success;
                var uidCliente = _this.userProfile.uid;
                var email = _this.userProfile.email;
                var fotoPerfil = _this.userProfile.photoURL;
                var nombreCliente = _this.userProfile.displayName;
                console.log("uidCliente =" + uidCliente);
                console.log("foto perfil =" + fotoPerfil);
                console.log("nombre cliente =" + nombreCliente);
                _this.item = _this.af.object('/userProfile/' + uidCliente, { preserveSnapshot: true });
                _this.item.subscribe(function (snapshot) {
                    console.log("*****************");
                    console.log("*****************");
                    console.log("*****************");
                    console.log(snapshot.key);
                    console.log(snapshot.val());
                    // this.perfil =  snapshot.val();
                    if (snapshot.val() === undefined || snapshot.val() === null) {
                        console.log("usuario no existe");
                        firebase.database().ref('/userProfile').child(uidCliente)
                            .set({
                            email: email,
                            nombreUsuario: nombreCliente,
                            tipoUsuario: 'persona',
                            photoUrl: fotoPerfil
                        });
                        firebase.database().ref('/notificacionesUsuario').child(uidCliente)
                            .set({
                            uid: uidCliente,
                            uidMunicipio: '-',
                            uidDepartamento: '-',
                            interesSoloMunicipio: false
                        });
                        //   this.storage.set('userProfile')
                        _this.storage.set('userData', _this.userProfile)
                            .then(function () {
                            console.log('Stored item!');
                            _this.navCtrl.popToRoot();
                        }, function (error) { return console.error('Error storing item', error); });
                    }
                    else {
                        console.log("usuario  existe");
                        _this.storage.set('userData', _this.userProfile)
                            .then(function () {
                            console.log('Stored item!');
                            _this.navCtrl.popToRoot();
                        }, function (error) { return console.error('Error storing item', error); });
                    }
                });
            })
                .catch(function (error) {
                console.log("Firebase failure: " + JSON.stringify(error));
            });
        }).catch(function (error) { console.log(error); });
    };
    InicioSesionPage.prototype.twLogin = function () {
        var _this = this;
        this.twitter.login().then(function (response) {
            var twitterCredential = firebase.auth.TwitterAuthProvider
                .credential(response.token, response.secret);
            firebase.auth().signInWithCredential(twitterCredential)
                .then(function (userProfile) {
                _this.userProfile = userProfile;
                _this.userProfile.twName = response.userName;
                var uidCliente = _this.userProfile.uid;
                var email = _this.userProfile.email;
                var fotoPerfil = _this.userProfile.photoURL;
                var nombreCliente = _this.userProfile.displayName;
                console.log("uidCliente =" + uidCliente);
                console.log("foto perfil =" + fotoPerfil);
                console.log("nombre cliente =" + nombreCliente);
                _this.item = _this.af.object('/userProfile/' + uidCliente, { preserveSnapshot: true });
                _this.item.subscribe(function (snapshot) {
                    console.log("*****************");
                    console.log("*****************");
                    console.log(snapshot.key);
                    console.log(snapshot.val());
                    // this.perfil =  snapshot.val();
                    if (snapshot.val() === undefined || snapshot.val() === null) {
                        console.log("usuario no existe");
                        firebase.database().ref('/userProfile').child(uidCliente)
                            .set({
                            email: email,
                            nombreUsuario: nombreCliente,
                            tipoUsuario: 'persona',
                            photoUrl: fotoPerfil
                        });
                        firebase.database().ref('/notificacionesUsuario').child(uidCliente)
                            .set({
                            uid: uidCliente,
                            uidMunicipio: '-',
                            uidDepartamento: '-',
                            interesSoloMunicipio: false
                        });
                        //   this.storage.set('userProfile')
                        _this.storage.set('userData', _this.userProfile)
                            .then(function () {
                            console.log('Stored item!');
                            _this.navCtrl.popToRoot();
                        }, function (error) { return console.error('Error storing item', error); });
                    }
                    else {
                        console.log("usuario  existe");
                        _this.storage.set('userData', _this.userProfile)
                            .then(function () {
                            console.log('Stored item!');
                            _this.navCtrl.popToRoot();
                        }, function (error) { return console.error('Error storing item', error); });
                    }
                });
                console.log(_this.userProfile);
                console.log("resultado");
                console.log(JSON.stringify(_this.userProfile));
            }, function (error) {
                console.log(error);
            });
        }, function (error) {
            console.log("Error connecting to twitter: ", error);
        });
    };
    InicioSesionPage.prototype.googleLogin = function () {
        var _this = this;
        this.googlePlus.login({
            'webClientId': '64367296687-r285irt9pip4pij1uj0pp9fnphv0oicp.apps.googleusercontent.com',
            'offline': true
        })
            .then(function (userData) {
            console.log(userData);
            var token = userData.idToken;
            var googleCredential = auth.GoogleAuthProvider.credential(token, null);
            firebase.auth().signInWithCredential(googleCredential).then(function (userProfile) {
                console.log("Login ok");
                console.log(JSON.stringify(userProfile));
                _this.userProfile = userProfile;
                var uidCliente = _this.userProfile.uid;
                var email = _this.userProfile.email;
                var fotoPerfil = _this.userProfile.photoURL;
                var nombreCliente = _this.userProfile.displayName;
                console.log("uidCliente =" + uidCliente);
                console.log("foto perfil =" + fotoPerfil);
                console.log("nombre cliente =" + nombreCliente);
                _this.item = _this.af.object('/userProfile/' + uidCliente, { preserveSnapshot: true });
                _this.item.subscribe(function (snapshot) {
                    console.log("*****************");
                    console.log("*****************");
                    console.log(snapshot.key);
                    console.log(snapshot.val());
                    // this.perfil =  snapshot.val();
                    if (snapshot.val() === undefined || snapshot.val() === null) {
                        console.log("usuario no existe");
                        firebase.database().ref('/userProfile').child(uidCliente)
                            .set({
                            email: email,
                            nombreUsuario: nombreCliente,
                            tipoUsuario: 'persona',
                            photoUrl: fotoPerfil
                        });
                        firebase.database().ref('/notificacionesUsuario').child(uidCliente)
                            .set({
                            uid: uidCliente,
                            uidMunicipio: '-',
                            uidDepartamento: '-',
                            interesSoloMunicipio: false
                        });
                        //   this.storage.set('userProfile')
                        _this.storage.set('userData', _this.userProfile)
                            .then(function () {
                            console.log('Stored item!');
                            _this.navCtrl.popToRoot();
                        }, function (error) { return console.error('Error storing item', error); });
                    }
                    else {
                        console.log("usuario  existe");
                        _this.storage.set('userData', _this.userProfile)
                            .then(function () {
                            console.log('Stored item!');
                            _this.navCtrl.popToRoot();
                        }, function (error) { return console.error('Error storing item', error); });
                    }
                });
                console.log(_this.userProfile);
                console.log("resultado");
                console.log(JSON.stringify(_this.userProfile));
            }).catch(function (error) {
                console.log("errorr firebase   = " + error);
            });
        })
            .catch(function (err) { return console.error("error ++ = " + err); });
    };
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
    InicioSesionPage.prototype.closeLogin = function () {
        this.navCtrl.pop();
    };
    //Direccion a pagina de registro
    InicioSesionPage.prototype.irRegistro = function () {
        this.navCtrl.push(RegistroPage);
    };
    InicioSesionPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-inicio-sesion',
            templateUrl: 'inicio-sesion.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, Facebook, AngularFireDatabase, Storage, TwitterConnect, GooglePlus, AlertController])
    ], InicioSesionPage);
    return InicioSesionPage;
}());
export { InicioSesionPage };
//# sourceMappingURL=inicio-sesion.js.map