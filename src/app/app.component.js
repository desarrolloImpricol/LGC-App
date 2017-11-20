var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, MenuController } from 'ionic-angular';
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
var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen, menu, storage, alertCtrl) {
        this.menu = menu;
        this.storage = storage;
        this.alertCtrl = alertCtrl;
        this.rootPage = HomePage;
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
    MyApp.prototype.openBusquedaMenu = function () {
        if (this.mostrarBusqueda) {
            this.mostrarBusqueda = false;
        }
        else {
            this.mostrarBusqueda = true;
        }
    };
    MyApp.prototype.openPerfilMenu = function () {
        if (this.mostrarMenuPerfil) {
            this.mostrarMenuPerfil = false;
        }
        else {
            this.mostrarMenuPerfil = true;
        }
    };
    MyApp.prototype.buscarMenu = function () {
        if (this.queBusca === 'noticias') {
            this.navCtrl.setRoot(CundiNoticiasPage);
            this.menu.close();
        }
        if (this.queBusca === 'eventos') {
            this.navCtrl.setRoot(CundiEventosPage);
            this.menu.close();
        }
    };
    MyApp.prototype.irHome = function () {
        this.navCtrl.setRoot(HomePage);
        this.menu.close();
    };
    //redireccion a colombia
    MyApp.prototype.irColombia = function () {
        this.navCtrl.setRoot(DepartamentoPage);
        this.menu.close();
    };
    //redirecciona a noticias
    MyApp.prototype.irNoticias = function () {
        //this.navCtrl.setRoot(CundiNoticiasPage);
        this.navCtrl.setRoot(CundiNoticiasPage);
        this.menu.close();
    };
    //redirecciona a eventos
    MyApp.prototype.irEventos = function () {
        //this.navCtrl.push(CundiEventosPage);
        this.navCtrl.setRoot(CundiEventosPage);
        this.menu.close();
    };
    //redireccion a empleos
    MyApp.prototype.irEmpleos = function () {
        this.navCtrl.setRoot(CundiEmpleosPage);
        this.menu.close();
    };
    //redireccion a amarillas
    MyApp.prototype.irAmarillas = function () {
        this.navCtrl.setRoot(CundiAmarillasPage);
        this.menu.close();
    };
    //redireccion a publicar
    MyApp.prototype.irPublicar = function () {
        this.navCtrl.setRoot(PublicarPage);
        this.menu.close();
    };
    MyApp.prototype.irCrearNoticias = function () {
        this.navCtrl.setRoot(CrearNoticiaPage);
        this.menu.close();
    };
    MyApp.prototype.irCreaEventos = function () {
        this.navCtrl.setRoot(CrearEventoPage);
        this.menu.close();
    };
    MyApp.prototype.irBusquedaAvanzada = function () {
        this.navCtrl.setRoot(BusquedaAvanzadaPage);
        this.menu.close();
    };
    MyApp.prototype.irEditarPerfil = function () {
        this.navCtrl.push(EditarPerfilPage);
        this.menu.close();
    };
    MyApp.prototype.irPerfilCliente = function () {
        //this.navCtrl.push(PerfilClientePage);
        this.navCtrl.setRoot(PerfilClientePage);
        this.menu.close();
    };
    MyApp.prototype.irFavoritos = function () {
        this.navCtrl.setRoot(FavoritosPage);
        this.menu.close();
    };
    //elimina los datos guardados del usuario
    MyApp.prototype.cerrarSesion = function () {
        var _this = this;
        this.storage.remove('userData')
            .then(function (data) {
            console.log("eliminado = " + data);
            //    this.platform.exitApp();
            //luego de eliminado envia a pantalla de  login
            _this.navCtrl.push(InicioSesionPage);
            _this.menu.close();
        }, function (error) { return console.error(error); });
    };
    MyApp.prototype.showRadio = function () {
        var _this = this;
        var alert = this.alertCtrl.create();
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
            handler: function (data) {
                //this.testRadioOpen = false;
                //this.testRadioResult = data;
                console.log(data);
                if (data === 'noticia') {
                    _this.irCrearNoticias();
                }
                if (data === 'evento') {
                    _this.irCreaEventos();
                }
            }
        });
        alert.present();
    };
    __decorate([
        ViewChild('content'),
        __metadata("design:type", NavController)
    ], MyApp.prototype, "navCtrl", void 0);
    MyApp = __decorate([
        Component({
            templateUrl: 'app.html'
        }),
        __metadata("design:paramtypes", [Platform, StatusBar, SplashScreen, MenuController, Storage, AlertController])
    ], MyApp);
    return MyApp;
}());
export { MyApp };
//# sourceMappingURL=app.component.js.map