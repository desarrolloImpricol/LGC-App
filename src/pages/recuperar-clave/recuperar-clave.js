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
import firebase from 'firebase';
/**
 * Generated class for the RecuperarClavePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var RecuperarClavePage = /** @class */ (function () {
    function RecuperarClavePage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
    }
    RecuperarClavePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad RecuperarClavePage');
    };
    RecuperarClavePage.prototype.resetPassword = function () {
        var _this = this;
        return firebase.auth().sendPasswordResetEmail(this.email.trim()).then(function (newUser) {
            alert("Email enviado");
            _this.navCtrl.pop();
        }).catch(function (_error) {
            console.log("Error!");
            var erroInfo = JSON.stringify(_error);
            console.log(JSON.stringify(_error));
            console.log(_error.message);
            if (_error.message === 'The email address is badly formatted.') {
                alert("Formato email incorrecto");
            }
            if (_error.message === 'There is no user record corresponding to this identifier. The user may have been deleted.') {
                alert("Email no existe");
            }
        });
    };
    RecuperarClavePage.prototype.closeModal = function () {
        this.navCtrl.pop();
    };
    RecuperarClavePage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-recuperar-clave',
            templateUrl: 'recuperar-clave.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams])
    ], RecuperarClavePage);
    return RecuperarClavePage;
}());
export { RecuperarClavePage };
//# sourceMappingURL=recuperar-clave.js.map