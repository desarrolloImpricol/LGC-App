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
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Camera } from '@ionic-native/camera';
import { Ng2ImgToolsService } from 'ng2-img-tools';
import firebase from 'firebase';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the CrearEventoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var CrearEventoPage = /** @class */ (function () {
    function CrearEventoPage(navCtrl, navParams, af, camera, ng2ImgToolsService, loadingCtrl, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.af = af;
        this.camera = camera;
        this.ng2ImgToolsService = ng2ImgToolsService;
        this.loadingCtrl = loadingCtrl;
        this.storage = storage;
        this.departamentoApp = "/Cundinamarca";
        //inicializa la foto de evento
        this.fotoEvento = "-";
        this.foto1 = "-";
        this.foto2 = "-";
        this.foto3 = "-";
        this.foto4 = "-";
        this.foto5 = "-";
        //veirfica si el usuario esta guardado
        this.storage.get('userData')
            .then(function (data) {
            //console.log(JSON.stringify(data)),
            //console.log(data.uid);
            //consulta informacion del usuario
            _this.item = _this.af.object(_this.departamentoApp + '/userProfile/' + data.uid, { preserveSnapshot: true });
            _this.item.subscribe(function (snapshot) {
                //console.log(snapshot.key);
                //console.log(snapshot.val());
                //objeto con la informacion del cliente
                _this.perfil = snapshot.val();
                _this.perfil.uid = data.uid;
            });
        }, function (error) {
            console.error("error = " + error);
        });
        //Consume lista de departamentos
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
        //reinicializa el arreglo demunicipios
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
    }
    //funcion que se ejecuta cuando se cambia el departamento
    CrearEventoPage.prototype.onSelecDepartamento = function () {
        var _this = this;
        this.municipios = [];
        var subject = new Subject();
        //Crea consulta
        var queryObservable = this.af.list(this.departamentoApp + '/Municipios', {
            query: {
                orderByChild: 'uidDepartamento',
                equalTo: subject
            }
        });
        // subscribe to changes
        queryObservable.subscribe(function (queriedItems) {
            console.log("*************************Municipios*************************************");
            console.log(JSON.stringify(queriedItems));
            //alamacena resultado del query
            _this.filtroMunicipios = queriedItems;
            //recorre municipios
            _this.filtroMunicipios.forEach(function (item, index) {
                //         console.log("item municipio = " + JSON.stringify(item));
                //alamcena objeto que itera
                var dataI = item;
                //
                //agrega al arreglo de municipios el objeto
                _this.municipios.push(dataI);
            });
        });
        // trigger the query
        subject.next(this.uidDepartamento);
    };
    //Funcion que crea un evento
    CrearEventoPage.prototype.publicarEvento = function () {
        var _this = this;
        console.log("tituo noticia = " + this.tituloEvento);
        console.log("descripcion noticia = " + this.descripcionEvento);
        console.log("imagen noticia = " + this.imagenNoticia);
        console.log("uid municipio = " + this.uidMunicipio);
        console.log("uid departamento= " + this.uidDepartamento);
        console.log("uid creador= " + this.perfil.uid);
        //valida que exista el titulo
        if (this.tituloEvento === null || this.tituloEvento === "" || this.tituloEvento === undefined) {
            alert("Falta titulo");
            return;
        }
        //valida que la descripcion no este vacia
        if (this.descripcionEvento === null || this.descripcionEvento === "" || this.descripcionEvento === undefined) {
            alert("Falta descripcion");
            return;
        }
        //valia que la foto  ya este cargada
        if (this.fotoEvento === "-") {
            alert("Falta foto");
            return;
        }
        //valida que la fecha de iniio del evento este cargada
        if (this.fechaEvento === null || this.fechaEvento === "0" || this.fechaEvento === undefined) {
            alert("Falta fecha inicio");
            return;
        }
        //valida que la fecha de fin del evento este seleccionada
        if (this.fechaFinEvento === null || this.fechaFinEvento === "0" || this.fechaFinEvento === undefined) {
            alert("Falta fecha fin");
            return;
        }
        //valida que se tenga seleccionado un municipio
        if (this.uidMunicipio === null || this.uidMunicipio === "0" || this.uidMunicipio === undefined) {
            alert("Falta municipio");
            return;
        }
        //valida que se tenfa seccionado el departamento
        //if (this.uidDepartamento === null || this.uidDepartamento === "0" || this.uidDepartamento === undefined) {
        //  alert("Falta departamento");
        //  return;
        //}
        //valida horario
        if (this.horario === null || this.horario === "0" || this.horario === undefined) {
            alert("Falta horario");
            return;
        }
        //valida ubicacion
        if (this.ubicacion === null || this.ubicacion === "0" || this.ubicacion === undefined) {
            alert("Falta ubicacion");
            return;
        }
        //valida datos de contacto 
        if (this.datosContacto === null || this.datosContacto === "0" || this.datosContacto === undefined) {
            alert("Faltan datos contacto");
            return;
        }
        //valida datos de contacto 
        if (this.telefonoContacto === null || this.telefonoContacto === "0" || this.telefonoContacto === undefined) {
            alert("Faltan datos contacto");
            return;
        }
        //valida datos de contacto 
        if (this.organizador === null || this.organizador === "0" || this.organizador === undefined) {
            alert("Faltan datos contacto");
            return;
        }
        //referencia de la tabla
        var itemRef = this.af.list(this.departamentoApp + '/Eventos');
        var uid = this.uidMunicipio - 1;
        //crea evento
        itemRef.push({
            uidMunicipio: uid.toString(),
            uidCategoriaEvento: this.uidCategoria,
            tituloEvento: this.tituloEvento,
            descripcionEvento: this.descripcionEvento,
            //uidDepartamento: this.uidDepartamento,
            uidCreador: this.perfil.uid,
            fechaInicio: this.fechaEvento,
            fechaFin: this.fechaFinEvento,
            horario: this.horario,
            ubicacion: this.ubicacion,
            datosContacto: this.datosContacto,
            telefonoContacto: this.telefonoContacto,
            organizador: this.organizador
        }).then(function (item) {
            console.log("llave = " + item.key);
            //luego de tener el uid del evento creado se ejecuta la funcion que sube una imagen
            _this.subirImagen(item.key);
        });
    };
    //funcion que agrega la url de l imagen a un evento seleccionado
    CrearEventoPage.prototype.updateFotoNoticia = function (uid, url) {
        firebase.database().ref(this.departamentoApp + '/Eventos/').child(uid)
            .update({ urlImagen: url });
        alert("Evento registrado");
        this.navCtrl.popToRoot();
    };
    CrearEventoPage.prototype.cargarOtrasImagenes = function (numero) {
        var _this = this;
        var options = {
            quality: 10,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.PNG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            correctOrientation: true,
            saveToPhotoAlbum: true
        };
        this.camera.getPicture(options).then(function (imageData) {
            if (numero === 1) {
                _this.foto1 = 'data:image/jpeg;base64,' + imageData;
            }
            if (numero === 2) {
                _this.foto2 = 'data:image/jpeg;base64,' + imageData;
            }
            if (numero === 3) {
                _this.foto3 = 'data:image/jpeg;base64,' + imageData;
            }
            if (numero === 4) {
                _this.foto4 = 'data:image/jpeg;base64,' + imageData;
            }
            if (numero === 5) {
                _this.foto5 = 'data:image/jpeg;base64,' + imageData;
            }
            //this.fotoEventoPura = imageData;
            //let fotoCliente = this.b64toBlob(this.fotoEventoPura, null, null);
        }, function (err) {
            console.log("error 2");
            console.log(err);
            //this.loading.dismiss();
            // Handle error
        });
    };
    //funcion que carga la imagen dese la libreria o dirctamento una foto de la camara, dependiento el tipo
    CrearEventoPage.prototype.cargarImagen = function (tipo) {
        var _this = this;
        //valida tipo y carga imagen
        if (tipo === 'foto') {
            var options = {
                quality: 10,
                destinationType: this.camera.DestinationType.DATA_URL,
                encodingType: this.camera.EncodingType.PNG,
                mediaType: this.camera.MediaType.PICTURE,
                sourceType: this.camera.PictureSourceType.CAMERA,
                correctOrientation: true,
                saveToPhotoAlbum: true
            };
            this.camera.getPicture(options).then(function (imageData) {
                _this.fotoEvento = 'data:image/jpeg;base64,' + imageData;
                _this.fotoEventoPura = imageData;
                var fotoCliente = _this.b64toBlob(_this.fotoEventoPura, null, null);
                //   this.loading.dismiss();
            }, function (err) {
                console.log("error 2");
                console.log(err);
                //this.loading.dismiss();
                // Handle error
            });
        }
        else {
            var options = {
                quality: 10,
                destinationType: this.camera.DestinationType.DATA_URL,
                encodingType: this.camera.EncodingType.PNG,
                mediaType: this.camera.MediaType.PICTURE,
                sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
                correctOrientation: true,
                saveToPhotoAlbum: true
            };
            this.camera.getPicture(options).then(function (imageData) {
                _this.fotoEvento = 'data:image/jpeg;base64,' + imageData;
                _this.fotoEventoPura = imageData;
                var fotoCliente = _this.b64toBlob(_this.fotoEventoPura, null, null);
                //   this.loading.dismiss();
            }, function (err) {
                console.log("error 2");
                console.log(err);
                //this.loading.dismiss();
                // Handle error
            });
        }
    };
    //muestra imagen de carga
    CrearEventoPage.prototype.presentLoadingDefault = function () {
        this.loading = this.loadingCtrl.create({
            content: 'Cargando...'
        });
        this.loading.present();
        /*setTimeout(() => {
          loading.dismiss();
        }, 5000);
        */
    };
    //funcion que sube la imagen
    CrearEventoPage.prototype.subirImagen = function (uid) {
        var _this = this;
        this.presentLoadingDefault();
        this.promise = new Promise(function (res, rej) {
            var fotoCompress = _this.b64toBlob(_this.fotoEventoPura, 'image/png', null);
            //comprimir imagen para subir
            var file = _this.blobToFile(fotoCompress, 'imagen.png');
            _this.ng2ImgToolsService.compress([file], 3, false, false).subscribe(function (result) {
                //all good, result is a file
                _this.fotoComprimidaCliente = result;
                console.log(result);
                console.log(JSON.stringify(result));
                var storage = firebase.storage().ref();
                var loading = _this.loading2;
                var thiss = _this;
                var storageRef = storage.child(_this.departamentoApp + 'eventos/' + uid + '/fotoPrincipal.png').put(_this.fotoComprimidaCliente).then(function (snapshot) {
                    console.log('Uploaded an array!');
                    //  this.downloadURL = snapshot.downloadURL;
                    console.log("sanpchot");
                    console.log(snapshot.downloadURL);
                    // this.dataChangeObserver.next(this.downloadURL);
                    //  console.log("url descarga imagen " + this.downloadURL);
                    //  thiss.generarRegistroFoto();
                    //    this.entra = true ;
                    //  this.downloadURL = snapshot.downloadURL ;
                    //    thiss.updateFotoPerfil(uid , snapshot.downloadURL);
                    thiss.updateFotoNoticia(uid, snapshot.downloadURL);
                    thiss.loading.dismiss();
                    //this.imagenSubida = false  ;
                });
            }, function (error) {
                console.log("error comprimir  " + JSON.stringify(error));
                //something went wrong
                //use result.compressedFile or handle specific error cases individually
            });
            //  this.loading.dismiss();
        });
    };
    //convierte archivo blod  a file 
    CrearEventoPage.prototype.blobToFile = function (theBlob, fileName) {
        var b = theBlob;
        //A Blob() is almost a File() - it's just missing the two properties below which we will add
        b.lastModifiedDate = new Date();
        b.name = fileName;
        //Cast to a File() type
        return theBlob;
    };
    //convierte a formato blob
    CrearEventoPage.prototype.b64toBlob = function (b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
        var byteCharacters = atob(b64Data);
        var byteArrays = [];
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    };
    CrearEventoPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad CrearEventoPage');
    };
    CrearEventoPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-crear-evento',
            templateUrl: 'crear-evento.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, AngularFireDatabase, Camera, Ng2ImgToolsService, LoadingController, Storage])
    ], CrearEventoPage);
    return CrearEventoPage;
}());
export { CrearEventoPage };
//# sourceMappingURL=crear-evento.js.map