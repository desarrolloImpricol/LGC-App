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
/**
 * Generated class for the DetalleNoticiaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.s
 */
var DetalleNoticiaPage = /** @class */ (function () {
    function DetalleNoticiaPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        console.log("Nombre " + this.navParams.data.nombre);
        this.urlImagen = this.navParams.data.urlImagen;
        this.tituloNoticia = this.navParams.data.tituloNoticia;
        this.nombreCreador = this.navParams.data.nombreCreador;
        this.imagenCreador = this.navParams.data.imagenCreador;
        this.descripcion = this.navParams.data.descripcion;
        this.uidNoticia = this.navParams.data.uidNoticia;
        this.fechaCreacion = this.navParams.data.fechaCreacion;
    }
    DetalleNoticiaPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad DetalleNoticiaPage');
    };
    DetalleNoticiaPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-detalle-noticia',
            templateUrl: 'detalle-noticia.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams])
    ], DetalleNoticiaPage);
    return DetalleNoticiaPage;
}());
export { DetalleNoticiaPage };
//# sourceMappingURL=detalle-noticia.js.map