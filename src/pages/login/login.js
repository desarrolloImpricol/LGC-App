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
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InicioSesionPage } from '../../pages/inicio-sesion/inicio-sesion';
import { RegistroPage } from '../../pages/registro/registro';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Storage } from '@ionic/storage';
import { Facebook } from '@ionic-native/facebook';
import firebase from 'firebase';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var LoginPage = /** @class */ (function () {
    function LoginPage(navCtrl, navParams, af, storage, fb) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.af = af;
        this.storage = storage;
        this.fb = fb;
    }
    LoginPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad LoginPage');
    };
    LoginPage.prototype.loginFacebook = function () {
        var _this = this;
        console.log("ENtra login facebook");
        this.fb.login(['email']).then(function (response) {
            console.log("entra obetner credencial");
            var facebookCredential = firebase.auth.FacebookAuthProvider
                .credential(response.authResponse.accessToken);
            console.log("credencial");
            console.log(facebookCredential);
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
                            .set({ email: email, nombreUsuario: nombreCliente, tipoUsuario: 'persona', photoUrl: fotoPerfil });
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
        }).catch(function (error) {
            console.log(JSON.stringify(error));
        });
    };
    //redirije a la pantalla de inicio de sesion
    LoginPage.prototype.irInicioSesion = function () {
        this.navCtrl.push(InicioSesionPage);
    };
    //redirije a  la pantalla de registro
    LoginPage.prototype.irRegistro = function () {
        this.navCtrl.push(RegistroPage);
    };
    LoginPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-login',
            templateUrl: 'login.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, AngularFireDatabase, Storage, Facebook])
    ], LoginPage);
    return LoginPage;
}());
export { LoginPage };
//# sourceMappingURL=login.js.map