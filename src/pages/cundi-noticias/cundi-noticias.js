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
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { DetalleNoticiaPage } from '../../pages/detalle-noticia/detalle-noticia';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the CundiNoticiasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var CundiNoticiasPage = /** @class */ (function () {
    function CundiNoticiasPage(navCtrl, navParams, af, socialSharing, transfer, file, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.af = af;
        this.socialSharing = socialSharing;
        this.transfer = transfer;
        this.file = file;
        this.storage = storage;
        this.noticias = [];
        this.departamentoApp = "/Cundinamarca";
        this.perfil = [];
        //obtiene informacion del usuario
        this.storage.get('userData')
            .then(function (data) {
            console.log(JSON.stringify(data)),
                console.log("finaliza");
            console.log(data.uid);
            //consulta informacion de perfil 
            _this.item = _this.af.object(_this.departamentoApp + '/userProfile/' + data.uid, { preserveSnapshot: true });
            _this.item.subscribe(function (snapshot) {
                console.log(snapshot.key);
                console.log(snapshot.val());
                //carga informacion a las variables 
                _this.perfil = snapshot.val();
                _this.perfil.uid = data.uid;
                //consulta la informacion de tdas las noticias 
                _this.af.list(_this.departamentoApp + '/Noticias/', { preserveSnapshot: true })
                    .subscribe(function (snapshots) {
                    _this.noticias = [];
                    snapshots.forEach(function (snapshot1) {
                        var data = snapshot1.val();
                        console.log("uid creador = " + data.uidCreador);
                        _this.itemRef = _this.af.object(_this.departamentoApp + '/userProfile/' + data.uidCreador, { preserveSnapshot: true });
                        _this.itemRef.subscribe(function (snapshot) {
                            //console.log(action.type);
                            console.log("llave" + snapshot.key);
                            console.log('data ' + JSON.stringify(snapshot.val()));
                            data.urlImagenCreador = snapshot.val().photoUrl;
                            data.nombreUsuario = snapshot.val().nombreUsuario;
                            data.index = snapshot1.key;
                            //verifica si esa noticia esta guardada  como favorita 
                            var infoGuardado1 = _this.af.object(_this.departamentoApp + '/NoticiasGuardadasUsuario/' + _this.perfil.uid + "/" + snapshot1.key, { preserveSnapshot: true });
                            infoGuardado1.subscribe(function (snapshot3) {
                                console.log("entra consulta si guardo noticia ");
                                console.log(_this.departamentoApp + '/NoticiasGuardadasUsuario/' + _this.perfil.uid + "/" + snapshot1.key);
                                console.log(snapshot3.val());
                                //  console.log(snapshot.val());
                                if (snapshot3.val() === null) {
                                    console.log("noticia no guardada");
                                    data.guardado = false;
                                }
                                else {
                                    console.log("noticia guardada");
                                    data.guardado = true;
                                }
                            });
                            console.log("add noticia");
                            _this.noticias.push(data);
                        });
                        console.log("key =" + snapshot1.key);
                        console.log("Value =" + JSON.stringify(snapshot1.val()));
                    });
                });
            });
        }, function (error) {
            console.error("error = " + error);
        });
    }
    //funcion que comparte las imagenes de la notica 
    CundiNoticiasPage.prototype.compartir = function (urlImg) {
        var _this = this;
        console.log("entra a compartir");
        var fileTransfer = this.transfer.create();
        var data = urlImg.split("?");
        var data1 = data[0].split("/");
        var total = data1.length;
        console.log("total" + total);
        console.log(data1[total - 1]);
        var nombre = data1[total - 1];
        var url = urlImg;
        fileTransfer.download(url, this.file.externalApplicationStorageDirectory + nombre).then(function (entry) {
            console.log('download complete: ' + entry.toURL());
            _this.socialSharing.share("Compartido desde la guía cundinamarca, http://laguiacundinamarca.com/", null, entry.toURL()).then(function () {
                // Success!
                console.log("entra");
            }).catch(function () {
                console.log("error1");
            });
            //this.presentAlert(entry.toURL()) ;
        }, function (error) {
            console.log("error");
            console.log(error);
            // handle error
        });
    };
    CundiNoticiasPage.prototype.detalleNoticia = function (urlImagen, tituloNoticia, nombreCreador, imagenCreador, descripcion, uidNoticia, fechaCreacion) {
        console.log("url imagen = " + urlImagen);
        console.log("titulo noticia = " + tituloNoticia);
        console.log("nombre creador = " + nombreCreador);
        console.log("imagen creador = " + imagenCreador);
        console.log("descripcion = " + descripcion);
        console.log("uid noticia = " + uidNoticia);
        console.log("fecha noticia = " + fechaCreacion);
        this.navCtrl.push(DetalleNoticiaPage, { urlImagen: urlImagen, tituloNoticia: tituloNoticia, nombreCreador: nombreCreador, descripcion: descripcion, imagenCreador: imagenCreador, uidNoticia: uidNoticia, fechaCreacion: fechaCreacion });
    };
    CundiNoticiasPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad CundiNoticiasPage');
    };
    CundiNoticiasPage.prototype.guardarNoticia = function (noticia) {
        console.log("id  = " + noticia.index);
        console.log("id  perfil= " + this.perfil.uid);
        if (noticia.guardado) {
            var itemsTattoo = this.af.object(this.departamentoApp + '/NoticiasGuardadasUsuario/' + this.perfil.uid + "/" + noticia.index);
            itemsTattoo.remove();
            noticia.guardado = false;
            //this.tatuajeGuardado = false ;
        }
        else {
            var itemsTattoo = this.af.object(this.departamentoApp + '/NoticiasGuardadasUsuario/' + this.perfil.uid + "/" + noticia.index);
            var promise1 = itemsTattoo.set({
                noticia: noticia,
                uid: noticia.index
            });
            promise1.then(function (_) {
                return console.log('Noticia guardaa !!!');
            }).catch(function (err) { return console.log(err, 'You dont have access!'); });
            // this.tatuajeGuardado = true;
            noticia.guardado = true;
        }
    };
    CundiNoticiasPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-cundi-noticias',
            templateUrl: 'cundi-noticias.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, AngularFireDatabase, SocialSharing, FileTransfer, File, Storage])
    ], CundiNoticiasPage);
    return CundiNoticiasPage;
}());
export { CundiNoticiasPage };
//# sourceMappingURL=cundi-noticias.js.map