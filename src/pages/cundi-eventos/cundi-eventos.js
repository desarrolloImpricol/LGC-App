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
import { DetalleEventoPage } from '../../pages/detalle-evento/detalle-evento';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Storage } from '@ionic/storage';
import { Subject } from 'rxjs/Subject';
/**
 * Generated class for the CundiEventosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var CundiEventosPage = /** @class */ (function () {
    function CundiEventosPage(navCtrl, navParams, af, socialSharing, transfer, file, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.af = af;
        this.socialSharing = socialSharing;
        this.transfer = transfer;
        this.file = file;
        this.storage = storage;
        //variables de la calse 
        this.eventos = [];
        this.departamentoApp = "/Cundinamarca";
        this.perfil = [];
        //obtiene informacion del usuario
        console.log("Valor inicial  categoria " + this.uidCategoria);
        console.log("Valor inicial  municipio " + this.uidMunicipio);
        //arreglo de municipios
        this.municipios = [];
        var subject = new Subject();
        var queryObservable = this.af.list(this.departamentoApp + '/Municipios', {
            query: {
                orderByKey: true
            }
        });
        //manjo de respuesta 
        // subscribe to changes
        queryObservable.subscribe(function (queriedItems) {
            // console.log(JSON.stringify(queriedItems));
            //alamaenca resultado del filtro en arreglo 
            _this.filtroMunicipios = queriedItems;
            //recorre arreglo para setelartl en la lista 
            _this.filtroMunicipios.forEach(function (item, index) {
                //         console.log("item municipio = " + JSON.stringify(item));
                var dataI = item;
                _this.municipios.push(dataI);
            });
        });
        //arreglo de tipo evento
        this.categoriasEventos = [];
        //let subject = new Subject();
        var queryObservableCategorias = this.af.list(this.departamentoApp + '/CategoriasEventos', {
            query: {
                orderByKey: true
            }
        });
        //manjo de respuesta 
        // subscribe to changes
        queryObservableCategorias.subscribe(function (queriedItems) {
            console.log(JSON.stringify(queriedItems));
            //alamaenca resultado del filtro en arreglo 
            _this.filtroEventos = queriedItems;
            //recorre arreglo para setelartl en la lista 
            _this.filtroEventos.forEach(function (item, index) {
                //         console.log("item municipio = " + JSON.stringify(item));
                var dataI = item;
                _this.categoriasEventos.push(dataI);
            });
        });
        // trigger the query
        //  subject.next(this.uidDepartamento);
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
                _this.cargarTodosEventos();
            });
        }, function (error) {
            console.error("error = " + error);
        });
    }
    CundiEventosPage.prototype.cargarTodosEventos = function () {
        var _this = this;
        //recibe informacion de los eventos
        this.af.list(this.departamentoApp + '/Eventos/', { preserveSnapshot: true })
            .subscribe(function (snapshots) {
            //reinicializa eventos
            _this.eventos = [];
            //recorre resultado de la consulta 
            snapshots.forEach(function (snapshot1) {
                var data = snapshot1.val();
                console.log("uid creador = " + data.uidCreador);
                //consulta informacion del creador del evento
                _this.itemRef = _this.af.object(_this.departamentoApp + '/userProfile/' + data.uidCreador, { preserveSnapshot: true });
                _this.itemRef.subscribe(function (snapshot) {
                    //console.log(action.type);
                    console.log("llave" + snapshot.key);
                    console.log('data ' + JSON.stringify(snapshot.val()));
                    data.urlImagenCreador = snapshot.val().photoUrl;
                    data.nombreUsuario = snapshot.val().nombreUsuario;
                    data.index = snapshot1.key;
                    //verifica si esa noticia esta guardada  como favorita 
                    var infoGuardado = _this.af.object(_this.departamentoApp + '/EventosGuardadosUsuario/' + _this.perfil.uid + "/" + snapshot1.key, { preserveSnapshot: true });
                    infoGuardado.subscribe(function (snapshot) {
                        console.log("entra consulta si guardo evento ");
                        //  console.log(snapshot.key);
                        //  console.log(snapshot.val());
                        if (snapshot.val() === null) {
                            console.log("evento no guardada");
                            data.guardado = false;
                        }
                        else {
                            console.log("evento guardada");
                            data.guardado = true;
                        }
                    });
                    //setea eventos 
                    _this.eventos.push(data);
                });
                console.log("key =" + snapshot1.key);
                console.log("Value =" + JSON.stringify(snapshot1.val()));
            });
        });
    };
    //comparte la imagen 
    CundiEventosPage.prototype.compartir = function (urlImg) {
        //TODO deeplinks
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
        //descarga imagen 
        fileTransfer.download(url, this.file.externalApplicationStorageDirectory + nombre).then(function (entry) {
            console.log('download complete: ' + entry.toURL());
            //comparte imagen 
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
    CundiEventosPage.prototype.mostrarFiltro = function () {
        if (this.mostrarBusqueda) {
            this.mostrarBusqueda = false;
        }
        else {
            this.mostrarBusqueda = true;
        }
    };
    //funcon que envia a la pantalla de detalle de evento con su respecitva inv
    CundiEventosPage.prototype.detalleNoticia = function (urlImagen, tituloEvento, nombreCreador, imagenCreador, descripcion, uidNoticia, fechaInicio, fechaFin) {
        console.log("url imagen = " + urlImagen);
        console.log("titulo noticia = " + tituloEvento);
        console.log("nombre creador = " + nombreCreador);
        console.log("imagen creador = " + imagenCreador);
        console.log("descripcion = " + descripcion);
        console.log("uid noticia = " + uidNoticia);
        //envia a la pantalla  
        this.navCtrl.push(DetalleEventoPage, { urlImagen: urlImagen, tituloEvento: tituloEvento, nombreCreador: nombreCreador, descripcion: descripcion, imagenCreador: imagenCreador, uidNoticia: uidNoticia, fechaInicio: fechaInicio, fechaFin: fechaFin });
    };
    CundiEventosPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad CundiEventosPage');
    };
    CundiEventosPage.prototype.guardarEvento = function (evento) {
        console.log("entra a guardar");
        console.log("id  = " + evento.index);
        console.log("id  perfil= " + this.perfil.uid);
        if (evento.guardado) {
            var itemsTattoo = this.af.object(this.departamentoApp + '/EventosGuardadosUsuario/' + this.perfil.uid + "/" + evento.index);
            itemsTattoo.remove();
            evento.guardado = false;
            //this.tatuajeGuardado = false ;
        }
        else {
            var itemsTattoo = this.af.object(this.departamentoApp + '/EventosGuardadosUsuario/' + this.perfil.uid + "/" + evento.index);
            var promise1 = itemsTattoo.set({
                evento: evento,
                uid: evento.index
            });
            promise1.then(function (_) {
                return console.log('Noticia guardaa !!!');
            }).catch(function (err) { return console.log(err, 'You dont have access!'); });
            // this.tatuajeGuardado = true;
            evento.guardado = true;
        }
    };
    CundiEventosPage.prototype.filtraMunicipios = function () {
        var _this = this;
        if (this.uidCategoria === undefined) {
            var newMunicipio = this.uidMunicipio - 1;
            console.log("id municipio " + newMunicipio);
            //arreglo de municipios
            this.eventos = [];
            var subject = new Subject();
            var queryObservable = this.af.list(this.departamentoApp + '/Eventos', {
                query: {
                    orderByChild: 'uidMunicipio',
                    equalTo: subject
                }
            });
            //manjo de respuesta 
            // subscribe to changes
            queryObservable.subscribe(function (queriedItems) {
                console.log(JSON.stringify(queriedItems));
                //alamaenca resultado del filtro en arreglo 
                _this.filtroMunicipios = queriedItems;
                //recorre arreglo para setelartl en la lista 
                _this.filtroMunicipios.forEach(function (item, index) {
                    //         console.log("item municipio = " + JSON.stringify(item));
                    //let dataI = item;
                    //        this.eventos.push(dataI);
                    var data = item;
                    console.log("uid creador = " + data.uidCreador);
                    //consulta informacion del creador del evento
                    _this.itemRef = _this.af.object(_this.departamentoApp + '/userProfile/' + data.uidCreador, { preserveSnapshot: true });
                    _this.itemRef.subscribe(function (snapshot) {
                        //console.log(action.type);
                        console.log("llave" + snapshot.key);
                        console.log('data ' + JSON.stringify(snapshot.val()));
                        data.urlImagenCreador = snapshot.val().photoUrl;
                        data.nombreUsuario = snapshot.val().nombreUsuario;
                        data.index = index;
                        //verifica si esa noticia esta guardada  como favorita 
                        var infoGuardado = _this.af.object(_this.departamentoApp + '/EventosGuardadosUsuario/' + _this.perfil.uid + "/" + index, { preserveSnapshot: true });
                        infoGuardado.subscribe(function (snapshot) {
                            console.log("entra consulta si guardo evento ");
                            //  console.log(snapshot.key);
                            //  console.log(snapshot.val());
                            if (snapshot.val() === null) {
                                console.log("evento no guardada");
                                data.guardado = false;
                            }
                            else {
                                console.log("evento guardada");
                                data.guardado = true;
                            }
                        });
                        //setea eventos 
                        _this.eventos.push(data);
                    });
                    // console.log("key =" + snapshot1.key);
                    //console.log("Value =" + JSON.stringify(snapshot1.val()));
                });
            });
            subject.next(newMunicipio.toString());
        }
        else {
            console.log("entra consulta anidad");
            this.busquedaAnidada('municipio');
        }
    };
    CundiEventosPage.prototype.filtraCategoria = function () {
        var _this = this;
        console.log("id categoria " + this.uidCategoria);
        //arreglo de municipios
        this.eventos = [];
        var subject = new Subject();
        var queryObservable = this.af.list(this.departamentoApp + '/Eventos', {
            query: {
                orderByChild: 'uidCategoriaEvento',
                equalTo: subject
            }
        });
        //manjo de respuesta 
        // subscribe to changes
        queryObservable.subscribe(function (queriedItems) {
            console.log(JSON.stringify(queriedItems));
            //alamaenca resultado del filtro en arreglo 
            _this.filtroMunicipios = queriedItems;
            //recorre arreglo para setelartl en la lista 
            _this.filtroMunicipios.forEach(function (item, index) {
                //         console.log("item municipio = " + JSON.stringify(item));
                //let dataI = item;
                //        this.eventos.push(dataI);
                var data = item;
                console.log("uid creador = " + data.uidCreador);
                //consulta informacion del creador del evento
                _this.itemRef = _this.af.object(_this.departamentoApp + '/userProfile/' + data.uidCreador, { preserveSnapshot: true });
                _this.itemRef.subscribe(function (snapshot) {
                    //console.log(action.type);
                    console.log("llave" + snapshot.key);
                    console.log('data ' + JSON.stringify(snapshot.val()));
                    data.urlImagenCreador = snapshot.val().photoUrl;
                    data.nombreUsuario = snapshot.val().nombreUsuario;
                    data.index = index;
                    //verifica si esa noticia esta guardada  como favorita 
                    var infoGuardado = _this.af.object(_this.departamentoApp + '/EventosGuardadosUsuario/' + _this.perfil.uid + "/" + index, { preserveSnapshot: true });
                    infoGuardado.subscribe(function (snapshot) {
                        console.log("entra consulta si guardo evento ");
                        //  console.log(snapshot.key);
                        //  console.log(snapshot.val());
                        if (snapshot.val() === null) {
                            console.log("evento no guardada");
                            data.guardado = false;
                        }
                        else {
                            console.log("evento guardada");
                            data.guardado = true;
                        }
                    });
                    //setea eventos 
                    _this.eventos.push(data);
                });
                // console.log("key =" + snapshot1.key);
                //console.log("Value =" + JSON.stringify(snapshot1.val()));
            });
        });
        subject.next(this.uidCategoria);
    };
    CundiEventosPage.prototype.reiniciarBusqueda = function () {
        this.uidCategoria = undefined;
        this.uidMunicipio = undefined;
        this.mostrarBusqueda = false;
        this.cargarTodosEventos();
    };
    CundiEventosPage.prototype.busquedaAnidada = function (anidaPor) {
        var _this = this;
        if (anidaPor === "municipio") {
            var nuevoData_1 = [];
            this.filtroMunicipios.forEach(function (item, index) {
                console.log("itera  = " + JSON.stringify(item));
                if (item.uidMunicipio === (_this.uidMunicipio - 1)) {
                    console.log("entra if  de filtro anidado  municipio ");
                    nuevoData_1.push(item);
                }
            });
            this.eventos = [];
            this.eventos = nuevoData_1;
        } //end  if 
        if (anidaPor === "tipoEvento") {
            var nuevoData_2 = [];
            this.filtroMunicipios.forEach(function (item, index) {
                console.log("itera  = " + JSON.stringify(item));
                if (item.uidCategoriaEvento === _this.uidCategoria) {
                    console.log("entra if  de filtro anidado  cateogoria");
                    nuevoData_2.push(item);
                }
            });
            this.eventos = [];
            this.eventos = nuevoData_2;
        } //end if 
    };
    CundiEventosPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-cundi-eventos',
            templateUrl: 'cundi-eventos.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, AngularFireDatabase, SocialSharing, FileTransfer, File, Storage])
    ], CundiEventosPage);
    return CundiEventosPage;
}());
export { CundiEventosPage };
//# sourceMappingURL=cundi-eventos.js.map