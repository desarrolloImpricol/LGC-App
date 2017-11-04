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
import { Storage } from '@ionic/storage';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
/**
 * Generated class for the PerfilClientePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var PerfilClientePage = /** @class */ (function () {
    function PerfilClientePage(navCtrl, navParams, storage, af) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        this.af = af;
        this.perfil = [];
        //veirfica si el usuario esta guardado
        this.storage.get('userData')
            .then(function (data) {
            console.log(JSON.stringify(data)),
                console.log("finaliza");
            //existe usuario
            console.log(data.uid);
            _this.item = _this.af.object('/userProfile/' + data.uid, { preserveSnapshot: true });
            _this.item.subscribe(function (snapshot) {
                console.log("Perifl  info ");
                console.log(snapshot.key);
                console.log(JSON.stringify(snapshot.val()));
                _this.perfil = snapshot.val();
            });
        }, function (error) {
            //si no esta guardado envia a la pagina de login
            console.error("error = " + error);
            //  this.navCtrl.push(InicioSesionPage);
        });
    }
    PerfilClientePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad PerfilClientePage');
    };
    PerfilClientePage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-perfil-cliente',
            templateUrl: 'perfil-cliente.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, Storage, AngularFireDatabase])
    ], PerfilClientePage);
    return PerfilClientePage;
}());
export { PerfilClientePage };
//# sourceMappingURL=perfil-cliente.js.map