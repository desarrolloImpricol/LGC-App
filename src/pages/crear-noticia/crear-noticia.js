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
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Camera } from '@ionic-native/camera';
import { Ng2ImgToolsService } from 'ng2-img-tools';
import firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
/**
 * Generated class for the CrearNoticiaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var CrearNoticiaPage = /** @class */ (function () {
    function CrearNoticiaPage(navCtrl, navParams, af, camera, ng2ImgToolsService, loadingCtrl, storage, fileChooser, transfer, Toast, filePath) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.af = af;
        this.camera = camera;
        this.ng2ImgToolsService = ng2ImgToolsService;
        this.loadingCtrl = loadingCtrl;
        this.storage = storage;
        this.fileChooser = fileChooser;
        this.transfer = transfer;
        this.Toast = Toast;
        this.filePath = filePath;
        //inicializa  variable de foto de  noticia
        this.fotoNoticia = "-";
        //obtiene informacion del usuario
        this.storage.get('userData')
            .then(function (data) {
            console.log(JSON.stringify(data)),
                console.log("finaliza");
            console.log(data.uid);
            //consulta informacion de perfil 
            _this.item = _this.af.object('/userProfile/' + data.uid, { preserveSnapshot: true });
            _this.item.subscribe(function (snapshot) {
                console.log(snapshot.key);
                console.log(snapshot.val());
                //carga informacion a las variables 
                _this.perfil = snapshot.val();
                _this.perfil.uid = data.uid;
            });
        }, function (error) {
            console.error("error = " + error);
        });
        //consulta departamentos  
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
    //funcion que  se llama cuando se elecciona un departamento
    CrearNoticiaPage.prototype.onSelecDepartamento = function () {
        var _this = this;
        //reinicializa el arreglo demunicipios
        this.municipios = [];
        var subject = new Subject();
        var queryObservable = this.af.list('/municipios', {
            query: {
                orderByChild: 'uidDepartamento',
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
                var dataI = item;
                _this.municipios.push(dataI);
            });
        });
        // trigger the query
        subject.next(this.uidDepartamento);
    };
    //funcion que publica una noticia 
    CrearNoticiaPage.prototype.publicarNoticia = function () {
        var _this = this;
        console.log("tituo noticia = " + this.tituloNoticia);
        console.log("descripcion noticia = " + this.descripcionNoticia);
        console.log("imagen noticia = " + this.imagenNoticia);
        console.log("uid municipio = " + this.uidMunicipio);
        console.log("uid departamento= " + this.uidDepartamento);
        console.log("uid creador= " + this.perfil.uid);
        //valida que se tenga un nombre en la noticia
        if (this.tituloNoticia === null || this.tituloNoticia === "" || this.tituloNoticia === undefined) {
            alert("Falta titulo");
            return;
        }
        //valida que se tenga un nombre en al descripcion
        if (this.descripcionNoticia === null || this.descripcionNoticia === "" || this.descripcionNoticia === undefined) {
            alert("Falta descripcion");
            return;
        }
        //valida que se tenga foto de la noticia
        if (this.fotoNoticia === "-") {
            alert("Falta foto");
            return;
        }
        //valida que se tenga la fecha de notica
        if (this.fechaNoticia === null || this.fechaNoticia === "0" || this.fechaNoticia === undefined) {
            alert("Falta fecha");
            return;
        }
        //valida que se tenga seleccionado un municipio 
        if (this.uidMunicipio === null || this.uidMunicipio === "0" || this.uidMunicipio === undefined) {
            alert("Falta municipio");
            return;
        }
        if (this.uidDepartamento === null || this.uidDepartamento === "0" || this.uidDepartamento === undefined) {
            alert("Falta departamento");
            return;
        }
        //conslta noticias 
        var itemRef = this.af.list('Noticias');
        itemRef.push({
            tituloNoticia: this.tituloNoticia,
            descripcion: this.descripcionNoticia,
            uidMunicipio: this.uidMunicipio,
            uidDepartamento: this.uidDepartamento,
            uidCreador: this.perfil.uid,
            fechaNoticia: this.fechaNoticia
        }).then(function (item) {
            console.log("llave = " + item.key);
            _this.subirImagen(item.key);
        });
    };
    CrearNoticiaPage.prototype.updateFotoNoticia = function (uid, url) {
        firebase.database().ref('/Noticias/').child(uid)
            .update({ urlImagen: url });
        alert("Noticia registrada");
        this.navCtrl.popToRoot();
    };
    CrearNoticiaPage.prototype.cargarImagen = function (tipo) {
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
                _this.fotoNoticia = 'data:image/jpeg;base64,' + imageData;
                _this.fotoNoticiaPura = imageData;
                var fotoCliente = _this.b64toBlob(_this.fotoNoticiaPura, null, null);
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
                _this.fotoNoticia = 'data:image/jpeg;base64,' + imageData;
                _this.fotoNoticiaPura = imageData;
                var fotoCliente = _this.b64toBlob(_this.fotoNoticiaPura, null, null);
                //   this.loading.dismiss();
            }, function (err) {
                console.log("error 2");
                console.log(err);
                //this.loading.dismiss();
                // Handle error
            });
        }
    };
    //mostrar vendata modal
    CrearNoticiaPage.prototype.presentLoadingDefault = function () {
        this.loading = this.loadingCtrl.create({
            content: 'Cargando...'
        });
        this.loading.present();
    };
    CrearNoticiaPage.prototype.subirImagen = function (uid) {
        var _this = this;
        this.presentLoadingDefault();
        this.promise = new Promise(function (res, rej) {
            // let fotoCompress = this.dataURLtoFile( this.fotoCliente , 'nombre.jpeg');
            //  let fotoCompress  = this.base64ToFile( this.fotoClientePura  , 'comprimida' ,'image/png');
            var fotoCompress = _this.b64toBlob(_this.fotoNoticiaPura, 'image/png', null);
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
    //funcion que convierte el 
    CrearNoticiaPage.prototype.blobToFile = function (theBlob, fileName) {
        var b = theBlob;
        //A Blob() is almost a File() - it's just missing the two properties below which we will add
        b.lastModifiedDate = new Date();
        b.name = fileName;
        //Cast to a File() type
        return theBlob;
    };
    //convierte a formato blob
    CrearNoticiaPage.prototype.b64toBlob = function (b64Data, contentType, sliceSize) {
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
    CrearNoticiaPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad CrearNoticiaPage');
    };
    CrearNoticiaPage.prototype.seleccionarArchivo = function () {
        var _this = this;
        this.fileChooser.open()
            .then(function (uri) {
            console.log(uri);
            var data = uri.split("/");
            console.log("cantidad = " + data.length);
            console.log(data[data.length - 1]);
            var data22 = data[data.length - 1];
            _this.filePath.resolveNativePath(uri)
                .then(function (filePath) {
                console.log("file ok");
                console.log(filePath);
            })
                .catch(function (err) {
                console.log("file path error");
                console.log(err);
            });
            // this.readimage(uri);
        })
            .catch(function (e) {
            console.log(e);
        });
    };
    /*upload2() {
  
  
  this.filee = { name: "copoutrecording.mp3" };
  
     File.readAsDataURL(cordova.file.externalRootDirectory, this.filee.name).then((data: any) => {
     if (data) {
     var blob = new Blob([data], { type: "audio/mp3" });
     this.fbd.uploadrecording(blob);
    }
  });
  }*/
    CrearNoticiaPage.prototype.readimage = function (url) {
        window.resolveLocalFileSystemURL(url, function (res) {
            res.file(function (resFile) {
                var reader = new FileReader();
                reader.readAsArrayBuffer(resFile);
                reader.onloadend = function (evt) {
                    var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
                    //do what you want to do with the file
                };
            });
        });
    };
    CrearNoticiaPage.prototype.upload = function (url) {
        var options = {
            fileKey: 'file',
            fileName: 'name.mp3',
            headers: {}
        };
        var fileTransfer = this.transfer.create();
        fileTransfer.upload(url, '<api endpoint>', options)
            .then(function (data) {
            console.log("pasa");
            console.log(data);
            // success
        }, function (err) {
            console.log("error");
            console.log(JSON.stringify(err));
            // error
        });
    };
    CrearNoticiaPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-crear-noticia',
            templateUrl: 'crear-noticia.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, AngularFireDatabase, Camera, Ng2ImgToolsService, LoadingController, Storage, FileChooser, FileTransfer, ToastController, FilePath])
    ], CrearNoticiaPage);
    return CrearNoticiaPage;
}());
export { CrearNoticiaPage };
//# sourceMappingURL=crear-noticia.js.map