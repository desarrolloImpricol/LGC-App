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
import { Camera } from '@ionic-native/camera';
import { Ng2ImgToolsService } from 'ng2-img-tools';
import { Subject } from 'rxjs/Subject';
import firebase from 'firebase';
/**
 * Generated class for the CrearAmarillaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var CrearAmarillaPage = /** @class */ (function () {
    function CrearAmarillaPage(navCtrl, navParams, camera, ng2ImgToolsService, af, loadingCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.camera = camera;
        this.ng2ImgToolsService = ng2ImgToolsService;
        this.af = af;
        this.loadingCtrl = loadingCtrl;
        this.fotoAmarilla = "-";
        this.af.list('/departamentos/', { preserveSnapshot: true })
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
    }
    CrearAmarillaPage.prototype.onSelecDepartamento = function () {
        var _this = this;
        this.municipios = [];
        var subject = new Subject();
        var queryObservable = this.af.list('/municipios', {
            query: {
                orderByChild: 'uidDepartamento',
                equalTo: subject
            }
        });
        // subscribe to changes
        queryObservable.subscribe(function (queriedItems) {
            console.log(JSON.stringify(queriedItems));
            _this.filtroMunicipios = queriedItems;
            _this.filtroMunicipios.forEach(function (item, index) {
                //         console.log("item municipio = " + JSON.stringify(item));
                var dataI = item;
                _this.municipios.push(dataI);
            });
        });
        // trigger the query
        subject.next(this.uidDepartamento);
    };
    CrearAmarillaPage.prototype.cargarImagen = function (tipo) {
        var _this = this;
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
    CrearAmarillaPage.prototype.presentLoadingDefault = function () {
        this.loading = this.loadingCtrl.create({
            content: 'Cargando...'
        });
        this.loading.present();
        /*setTimeout(() => {
          loading.dismiss();
        }, 5000);
        */
    };
    CrearAmarillaPage.prototype.subirImagen = function (uid) {
        var _this = this;
        this.presentLoadingDefault();
        this.promise = new Promise(function (res, rej) {
            // let fotoCompress = this.dataURLtoFile( this.fotoCliente , 'nombre.jpeg');
            //  let fotoCompress  = this.base64ToFile( this.fotoClientePura  , 'comprimida' ,'image/png');
            var fotoCompress = _this.b64toBlob(_this.fotoEventoPura, 'image/png', null);
            //  const file = new File(fotoCompress,'image/png');
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
                var storageRef = storage.child('noticias/' + uid + '/fotoPrincipal.png').put(_this.fotoComprimidaCliente).then(function (snapshot) {
                    console.log('Uploaded an array!');
                    //  this.downloadURL = snapshot.downloadURL;
                    console.log("sanpchot");
                    console.log(snapshot.downloadURL);
                    // this.dataChangeObserver.next(this.downloadURL);
                    console.log("url descarga imagen " + this.downloadURL);
                    //  thiss.generarRegistroFoto();
                    //    this.entra = true ;
                    //  this.downloadURL = snapshot.downloadURL ;
                    //    thiss.updateFotoPerfil(uid , snapshot.downloadURL);
                    // thiss.updateFotoNoticia(uid, snapshot.downloadURL);
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
    CrearAmarillaPage.prototype.publicarAmarilla = function () {
        if (this.nombreAmarilla === null || this.nombreAmarilla === "" || this.nombreAmarilla === undefined) {
            alert("Falta nombre amarilla");
            return;
        }
        if (this.direccion === null || this.direccion === "" || this.direccion === undefined) {
            alert("Falta direccion");
            return;
        }
        if (this.telefonos === null || this.telefonos === "" || this.telefonos === undefined) {
            alert("Falta telefono");
            return;
        }
        if (this.tipoEmpresa === null || this.tipoEmpresa === "" || this.tipoEmpresa === undefined) {
            alert("Falta empresa");
            return;
        }
        if (this.categorias === null || this.categorias === "" || this.categorias === undefined) {
            alert("Falta categorias");
            return;
        }
        if (this.descripcion === null || this.descripcion === "" || this.descripcion === undefined) {
            alert("Falta categorias");
            return;
        }
    };
    CrearAmarillaPage.prototype.blobToFile = function (theBlob, fileName) {
        var b = theBlob;
        //A Blob() is almost a File() - it's just missing the two properties below which we will add
        b.lastModifiedDate = new Date();
        b.name = fileName;
        //Cast to a File() type
        return theBlob;
    };
    CrearAmarillaPage.prototype.b64toBlob = function (b64Data, contentType, sliceSize) {
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
    CrearAmarillaPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad CrearAmarillaPage');
    };
    CrearAmarillaPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-crear-amarilla',
            templateUrl: 'crear-amarilla.html'
        }),
        __metadata("design:paramtypes", [NavController, NavParams, Camera, Ng2ImgToolsService, AngularFireDatabase, LoadingController])
    ], CrearAmarillaPage);
    return CrearAmarillaPage;
}());
export { CrearAmarillaPage };
//# sourceMappingURL=crear-amarilla.js.map