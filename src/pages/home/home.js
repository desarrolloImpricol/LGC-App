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
import { NavController, Platform } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { CundiAmarillasPage } from '../../pages/cundi-amarillas/cundi-amarillas';
import { CundiEmpleosPage } from '../../pages/cundi-empleos/cundi-empleos';
import { CundiEventosPage } from '../../pages/cundi-eventos/cundi-eventos';
import { CundiNoticiasPage } from '../../pages/cundi-noticias/cundi-noticias';
import { SecureStorage } from '@ionic-native/secure-storage';
import { InicioSesionPage } from '../../pages/inicio-sesion/inicio-sesion';
import { Deeplinks } from '@ionic-native/deeplinks';
import { PublicarPage } from '../../pages/publicar/publicar';
import { Storage } from '@ionic/storage';
import { ColombiaPage } from '../../pages/colombia/colombia';
import { CrearNoticiaPage } from '../../pages/crear-noticia/crear-noticia';
import { CrearEventoPage } from '../../pages/crear-evento/crear-evento';
import { Subject } from 'rxjs/Subject';
import { BusquedaAvanzadaPage } from '../../pages/busqueda-avanzada/busqueda-avanzada';
import { DetalleNoticiaPage } from '../../pages/detalle-noticia/detalle-noticia';
import { DetalleEventoPage } from '../../pages/detalle-evento/detalle-evento';
import { Media } from '@ionic-native/media';
import { NativeAudio } from '@ionic-native/native-audio';
import { PerfilClientePage } from '../../pages/perfil-cliente/perfil-cliente';
import { FavoritosPage } from '../../pages/favoritos/favoritos';
var HomePage = /** @class */ (function () {
    // file:MediaObject;
    function HomePage(navCtrl, af, secureStorage, deeplinks, platform, storage, media, nativeAudio) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.af = af;
        this.secureStorage = secureStorage;
        this.deeplinks = deeplinks;
        this.platform = platform;
        this.storage = storage;
        this.media = media;
        this.nativeAudio = nativeAudio;
        //info de perfil
        this.perfil = [];
        this.noticias = [];
        this.departamentoApp = "/Cundinamarca";
        this.mostrarBusqueda = false;
        this.nativeAudio.preloadSimple('uniqueId12', 'assets/sounds/inicio1.mp3');
        this.platform = platform;
        //acceso a links  con enlaces profundos
        this.deeplinks.route({
            '/noticias': CundiNoticiasPage,
            '/eventos': CundiEventosPage,
            '/empleos': CundiEmpleosPage,
            '/amarillas': CundiAmarillasPage
        }).subscribe(function (match) {
            // match.$route - the route we matched, which is the matched entry from the arguments to route()
            // match.$args - the args passed in the link
            // match.$link - the full link data
            console.log('Successfully matched route', match);
            //console.log("ruta = " + match.$route );
            //console.log("link = " + JSON.stringify(match.$link ));
            //console.log("************path***********" + match.$link.path);
            if (match.$link.path === "/noticias") {
                _this.navCtrl.push(CundiNoticiasPage);
            }
            if (match.$link.path === "/eventos") {
                _this.navCtrl.push(CundiEventosPage);
            }
            if (match.$link.path === "/empleos") {
                _this.navCtrl.push(CundiEmpleosPage);
            }
            if (match.$link.path === "/amarillas") {
                _this.navCtrl.push(CundiAmarillasPage);
            }
            //console.log("ruta = " + match.$route );
        }, function (nomatch) {
            // nomatch.$link - the full link data
            console.error('Got a deeplink that didn\'t match', nomatch);
        });
        //setea  un valor de inicio para la foto
        this.perfil.photoUrl = "-";
        //consulta departamentos  
        this.af.list(this.departamentoApp + '/departamentos/', { preserveSnapshot: true })
            .subscribe(function (snapshots) {
            _this.departamentos = [];
            snapshots.forEach(function (snapshot1) {
                var data = snapshot1.val();
                data.uid = snapshot1.key;
                //   console.log("uid creador = " + data.uidCreador);
                console.log("departamento key  =" + snapshot1.key);
                console.log("departamento Value =" + JSON.stringify(snapshot1.val()));
                _this.departamentos.push(data);
            });
        });
        this.af.list(this.departamentoApp + '/CategoriasEventos/', { preserveSnapshot: true })
            .subscribe(function (snapshots) {
            _this.categoriasEventos = [];
            snapshots.forEach(function (snapshot1) {
                var data = snapshot1.val();
                data.uid = snapshot1.key;
                //   console.log("uid creador = " + data.uidCreador);
                console.log("departamento key  =" + snapshot1.key);
                console.log("departamento Value =" + JSON.stringify(snapshot1.val()));
                _this.categoriasEventos.push(data);
            });
        });
        //recibe informacion de los eventos
        this.af.list(this.departamentoApp + '/Eventos/', { preserveSnapshot: true })
            .subscribe(function (snapshots) {
            //reinicializa eventos
            _this.eventos = [];
            //recorre resultado de la consulta 
            snapshots.forEach(function (snapshot1) {
                var data = snapshot1.val();
                // console.log("uid creador = " + data.uidCreador);
                console.log("EVENTOS");
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
        //consulta la informacion de tdas las noticias 
        this.af.list(this.departamentoApp + '/Noticias/', { preserveSnapshot: true })
            .subscribe(function (snapshots) {
            _this.noticias = [];
            snapshots.forEach(function (snapshot1) {
                var data = snapshot1.val();
                //console.log("uid creador = " + data.uidCreador);
                console.log("NOTICIAS");
                _this.itemRefNoticias = _this.af.object(_this.departamentoApp + '/userProfile/' + data.uidCreador, { preserveSnapshot: true });
                _this.itemRefNoticias.subscribe(function (snapshot) {
                    //console.log(action.type);
                    console.log("llave" + snapshot.key);
                    console.log('data ' + JSON.stringify(snapshot.val()));
                    data.urlImagenCreador = snapshot.val().photoUrl;
                    data.nombreUsuario = snapshot.val().nombreUsuario;
                    data.index = snapshot1.key;
                    //verifica si esa noticia esta guardada  como favorita 
                    var infoGuardado = _this.af.object(_this.departamentoApp + '/NoticiasGuardadasUsuario/' + _this.perfil.uid + "/" + snapshot1.key, { preserveSnapshot: true });
                    infoGuardado.subscribe(function (snapshot) {
                        console.log("entra consulta si guardo noticia ");
                        //  console.log(snapshot.key);
                        //  console.log(snapshot.val());
                        if (snapshot.val() === null) {
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
        this.onSelecDepartamento();
    }
    //funcion que  se llama cuando se elecciona un departamento
    HomePage.prototype.onSelecDepartamento = function () {
        var _this = this;
        //reinicializa el arreglo demunicipios
        this.municipios = [];
        var subject = new Subject();
        var queryObservable = this.af.list(this.departamentoApp + '/municipios', {
            query: {
                orderByKey: true
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
                var dataI = item;
                _this.municipios.push(dataI);
            });
        });
        // trigger the query
        subject.next(this.uidDepartamento);
    };
    //elimina los datos guardados del usuario
    HomePage.prototype.cerrarSesion = function () {
        var _this = this;
        this.storage.remove('userData')
            .then(function (data) {
            console.log("eliminado = " + data);
            //    this.platform.exitApp();
            //luego de eliminado envia a pantalla de  login
            _this.navCtrl.push(InicioSesionPage);
        }, function (error) { return console.error(error); });
    };
    //evento que se ejecuta cada vez que se ingres a ala pantalla
    HomePage.prototype.ionViewWillEnter = function () {
        var _this = this;
        //veirfica si el usuario esta guardado
        this.storage.get('userData')
            .then(function (data) {
            console.log(JSON.stringify(data)),
                console.log("finaliza");
            //existe usuario
            if (data != null) {
                console.log(data.uid);
                _this.item = _this.af.object('/userProfile/' + data.uid, { preserveSnapshot: true });
                _this.item.subscribe(function (snapshot) {
                    console.log(snapshot.key);
                    console.log(snapshot.val());
                    _this.perfil = snapshot.val();
                    _this.perfil.uid = snapshot.key;
                });
            }
            else {
                _this.navCtrl.push(InicioSesionPage);
            }
        }, function (error) {
            //si no esta guardado envia a la pagina de login
            console.error("error = " + error);
            _this.navCtrl.push(InicioSesionPage);
        });
    };
    HomePage.prototype.detalleNoticia = function (urlImagen, tituloNoticia, nombreCreador, imagenCreador, descripcion, uidNoticia, fechaCreacion) {
        console.log("url imagen = " + urlImagen);
        console.log("titulo noticia = " + tituloNoticia);
        console.log("nombre creador = " + nombreCreador);
        console.log("imagen creador = " + imagenCreador);
        console.log("descripcion = " + descripcion);
        console.log("uid noticia = " + uidNoticia);
        console.log("fecha noticia = " + fechaCreacion);
        this.navCtrl.push(DetalleNoticiaPage, { urlImagen: urlImagen, tituloNoticia: tituloNoticia, nombreCreador: nombreCreador, descripcion: descripcion, imagenCreador: imagenCreador, uidNoticia: uidNoticia, fechaCreacion: fechaCreacion });
    };
    //funcon que envia a la pantalla de detalle de evento con su respecitva inv
    HomePage.prototype.detalleEvento = function (urlImagen, tituloEvento, nombreCreador, imagenCreador, descripcion, uidNoticia, fechaInicio, fechaFin) {
        console.log("url imagen = " + urlImagen);
        console.log("titulo noticia = " + tituloEvento);
        console.log("nombre creador = " + nombreCreador);
        console.log("imagen creador = " + imagenCreador);
        console.log("descripcion = " + descripcion);
        console.log("uid noticia = " + uidNoticia);
        //envia a la pantalla  
        this.navCtrl.push(DetalleEventoPage, { urlImagen: urlImagen, tituloEvento: tituloEvento, nombreCreador: nombreCreador, descripcion: descripcion, imagenCreador: imagenCreador, uidNoticia: uidNoticia, fechaInicio: fechaInicio, fechaFin: fechaFin });
    };
    //redireccion a colombia
    HomePage.prototype.irColombia = function () {
        this.navCtrl.push(ColombiaPage);
    };
    //redirecciona a noticias
    HomePage.prototype.irNoticias = function () {
        //this.navCtrl.setRoot(CundiNoticiasPage);
        this.navCtrl.push(CundiNoticiasPage);
    };
    //redirecciona a eventos
    HomePage.prototype.irEventos = function () {
        this.navCtrl.push(CundiEventosPage);
    };
    //redireccion a empleos
    HomePage.prototype.irEmpleos = function () {
        this.navCtrl.push(CundiEmpleosPage);
    };
    //redireccion a amarillas
    HomePage.prototype.irAmarillas = function () {
        this.navCtrl.push(CundiAmarillasPage);
    };
    //redireccion a publicar
    HomePage.prototype.irPublicar = function () {
        this.navCtrl.push(PublicarPage);
    };
    HomePage.prototype.irCrearNoticias = function () {
        this.navCtrl.push(CrearNoticiaPage);
    };
    HomePage.prototype.irCreaEventos = function () {
        this.navCtrl.push(CrearEventoPage);
    };
    HomePage.prototype.irBusquedaAvanzada = function () {
        this.navCtrl.push(BusquedaAvanzadaPage);
    };
    HomePage.prototype.irPerfilCliente = function () {
        this.navCtrl.push(PerfilClientePage);
    };
    HomePage.prototype.irFavoritos = function () {
        this.navCtrl.push(FavoritosPage);
    };
    HomePage.prototype.playSonido = function () {
        console.log("play sonido");
        //this.file = this.media.create('/assets/sounds/inicio1.mp3');
        var file = this.media.create('./assets/sounds/inicio1.mp3');
        console.log("creado");
        // get file duration
        var duration = file.getDuration();
        console.log("duracion = " + duration);
        // to listen to plugin events:
        file.onStatusUpdate.subscribe(function (status) { return console.log(status); }); // fires when file status changes
        file.onSuccess.subscribe(function () { return console.log('Action is successful'); });
        file.onError.subscribe(function (error) { return console.log('Error!', JSON.stringify(error)); });
        // play the file
        file.play();
    };
    HomePage.prototype.audioPlay = function () {
        console.log("audio play");
        this.nativeAudio.play('uniqueId12', function () { return console.log('uniqueId1 is done playing'); });
    };
    HomePage.prototype.audioStop = function () {
        console.log("stop");
        //this.nativeAudio.stop('uniqueId1') ;
        this.nativeAudio.stop('uniqueId12');
    };
    HomePage.prototype.openBusquedaMenu = function () {
        if (this.mostrarBusqueda) {
            this.mostrarBusqueda = false;
        }
        else {
            this.mostrarBusqueda = true;
        }
    };
    HomePage.prototype.guardarNoticia = function (noticia) {
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
    HomePage.prototype.guardarEvento = function (evento) {
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
    HomePage = __decorate([
        Component({
            selector: 'page-home',
            templateUrl: 'home.html'
        }),
        __metadata("design:paramtypes", [NavController, AngularFireDatabase, SecureStorage, Deeplinks, Platform, Storage, Media, NativeAudio])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.js.map