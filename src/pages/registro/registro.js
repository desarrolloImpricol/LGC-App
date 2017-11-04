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
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Camera } from '@ionic-native/camera';
import { Ng2ImgToolsService } from 'ng2-img-tools';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
/**
 * Generated class for the RegistroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var RegistroPage = /** @class */ (function () {
    function RegistroPage(navCtrl, navParams, af, _auth, afu, camera, ng2ImgToolsService, loadingCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.af = af;
        this._auth = _auth;
        this.afu = afu;
        this.camera = camera;
        this.ng2ImgToolsService = ng2ImgToolsService;
        this.loadingCtrl = loadingCtrl;
        this.correo = "";
        this.clave = "";
        this.reclave = "";
        this.tipoUsuario = false;
        this.departamentoApp = "/Cundinamarca";
        //inicializa la variable de url de cliente
        this.downloadURL = "-";
        //inicializa obejto foto cliente
        this.fotoCliente = "-";
        //Consume lista de departamentos
        //consulta departamentos  
        this.af.list(this.departamentoApp + '/departamentos/', { preserveSnapshot: true })
            .subscribe(function (snapshots) {
            _this.deptos = [];
            snapshots.forEach(function (snapshot1) {
                var data = snapshot1.val();
                data.uid = snapshot1.key;
                //   console.log("uid creador = " + data.uidCreador);
                console.log("departamento key  =" + snapshot1.key);
                console.log("departamento Value =" + JSON.stringify(snapshot1.val()));
                _this.deptos.push(data);
            });
        });
    }
    //funcion que se ejecuta  cuando se cambios la opcion de departamentos
    RegistroPage.prototype.onSelecDepartamento = function () {
        var _this = this;
        //  const size$ = new Subject<string>();
        //  const queryObservable = size$.switchMap(size =>
        //    this.af.list('/items', ref => ref.orderByChild('size').equalTo(size)).valueChanges();
        //  );
        //inicializa arreglo de municipios
        this.municipios = [];
        //objeto rxjs
        var subject = new Subject();
        //crea consulta
        var queryObservable = this.af.list(this.departamentoApp + '/municipios', {
            query: {
                orderByChild: 'uidDepartamento',
                equalTo: subject
            }
        });
        // subscribe to changes
        queryObservable.subscribe(function (queriedItems) {
            console.log(JSON.stringify(queriedItems));
            //almacenta resultado consulta
            _this.filtroMunicipios = queriedItems;
            //recorre el resultado
            _this.filtroMunicipios.forEach(function (item, index) {
                //         console.log("item municipio = " + JSON.stringify(item));
                //alamacena obejto en variable temporal
                var dataI = item;
                //agrega objeto al arreglo
                _this.municipios.push(dataI);
            });
        });
        // ejecuta query
        subject.next(this.uidDepartamento);
    };
    //registro via email
    RegistroPage.prototype.signupUser = function (email, password) {
        var _this = this;
        //funcion que registra un usuario apartir de un email  y de una clave
        return firebase.auth().createUserWithEmailAndPassword(this.correo.trim(), this.clave.trim())
            .then(function (newUser) {
            var tipo = "persona";
            //varifica tipo de usuario que se registra
            if (_this.tipoUsuario) {
                tipo = "empresa";
            }
            //guarda datos en la tabla
            firebase.database().ref(_this.departamentoApp + '/userProfile').child(newUser.uid)
                .set({
                email: _this.correo,
                nombreUsuario: _this.usuario,
                tipoUsuario: tipo
            });
            //actualiza notificaciones de usuario
            firebase.database().ref(_this.departamentoApp + '/notificacionesUsuario').child(newUser.uid)
                .set({
                uid: newUser.uid,
                uidMunicipio: _this.uidMunicipio,
                uidDepartamento: _this.uidDepartamento,
                interesSoloMunicipio: true
            });
            //llamado a funcion de subir imagen
            _this.subirImagen(newUser.uid);
            //  alert("Registro exitoso");
        }).catch(function (_error) {
            //validacion de los errores
            console.log("Error!");
            var erroInfo = JSON.stringify(_error);
            console.log(JSON.stringify(_error));
            console.log(_error.message);
            if (_error.message === 'Password should be at least 6 characters') {
                alert("Clave debe tener minimo 6 caracteres");
            }
            if (_error.message === 'The email address is badly formatted.') {
                alert("Formato email incorrecto");
            }
            if (_error.message === 'The password must be 6 characters long or more.') {
                alert("Campo clave vacio");
            }
            if (_error.message === 'The email address is already in use by another account.') {
                alert("Email ya existe");
            }
        });
    };
    //veirifca que lo datos para registro no esten vacios
    RegistroPage.prototype.validarRegistro = function () {
        //verifica que tenga la foto cargada
        if (this.fotoCliente === "-") {
            alert("Falta foto");
            return;
        }
        //veririfca que las claves coincidan
        if (this.clave.trim() != this.reclave.trim()) {
            alert("Claves no coinciden");
            return;
        }
        //verifica que se tenga un usuario para el registros
        if (this.usuario === "" || this.usuario === null || this.usuario === undefined) {
            alert("Falta nombre de usuario");
            return;
        }
        //llamado a suncion der registro
        this.signupUser("nada", "nada");
    };
    //Funcion que carga una imagen para que sea visualizda por el cliente (aun no se ha subido al servidor)
    RegistroPage.prototype.cargarImagen = function () {
        var _this = this;
        //opciones de captura de imagen
        var options = {
            quality: 10,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.PNG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            correctOrientation: true,
            saveToPhotoAlbum: true
        };
        //llamado a camara
        this.camera.getPicture(options).then(function (imageData) {
            //crea foto en base64
            _this.fotoCliente = 'data:image/jpeg;base64,' + imageData;
            //imagen pura sin formato
            _this.fotoClientePura = imageData;
            //convierte y captura la foto del cliente de base 64 a formato blob
            var fotoCliente = _this.b64toBlob(_this.fotoClientePura, null, null);
        }, function (err) {
            //validacion de errores
            console.log("error 2");
            console.log(err);
            //this.loading.dismiss();
            // Handle error
        });
    };
    //Funcion que se ejecuta  cuando empieza el proceso de registro del usario
    RegistroPage.prototype.presentLoadingDefault = function () {
        this.loading = this.loadingCtrl.create({
            content: 'Cargando...'
        });
        //llamado a ventana
        this.loading.present();
    };
    //funcion que conviente una url en un archivo file
    RegistroPage.prototype.dataURLtoFile = function (dataurl, filename) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };
    //funcion que conviente un archivo blob a un flie
    RegistroPage.prototype.blobToFile = function (theBlob, fileName) {
        var b = theBlob;
        //A Blob() is almost a File() - it's just missing the two properties below which we will add
        b.lastModifiedDate = new Date();
        b.name = fileName;
        //Cast to a File() type
        return theBlob;
    };
    //funcion para subir la imagen a los servidores de firebase
    RegistroPage.prototype.subirImagen = function (uid) {
        var _this = this;
        //se muestra la ventana de  loading  para iniciar la subida de archivos
        this.presentLoadingDefault();
        //Crea la promesa de respuesta
        this.promise = new Promise(function (res, rej) {
            // let fotoCompress = this.dataURLtoFile( this.fotoCliente , 'nombre.jpeg');
            //  let fotoCompress  = this.base64ToFile( this.fotoClientePura  , 'comprimida' ,'image/png');
            //convierte  foto a  fotmato blob
            var fotoCompress = _this.b64toBlob(_this.fotoClientePura, 'image/png', null);
            //  const file = new File(fotoCompress,'image/png');
            //convierte foto a formato file
            var file = _this.blobToFile(fotoCompress, 'imagen.png');
            //comprime foto antes de la subida
            _this.ng2ImgToolsService.compress([file], 3, false, false).subscribe(function (result) {
                //resultado de la foto compriida
                _this.fotoComprimidaCliente = result;
                console.log(result);
                console.log(JSON.stringify(result));
                //referencia de almacenamiento
                var storage = firebase.storage().ref();
                var loading = _this.loading2;
                //almacena el this par poder llamarlo dentro del then de la subida del archivo
                var thiss = _this;
                //sube imagen
                var storageRef = storage.child('userProfile/' + uid + '/perfil.png').put(_this.fotoComprimidaCliente).then(function (snapshot) {
                    console.log('Uploaded an array!');
                    //  this.downloadURL = snapshot.downloadURL;
                    console.log("sanpchot");
                    console.log(snapshot.downloadURL);
                    // this.dataChangeObserver.next(this.downloadURL);
                    //  console.log("url descarga imagen " + this.downloadURL);
                    //  thiss.generarRegistroFoto();
                    //    this.entra = true ;
                    //  this.downloadURL = snapshot.downloadURL ;
                    //funcion que se llama cuando se tiene la url en la que quedo alojada la foto
                    thiss.updateFotoPerfil(uid, snapshot.downloadURL);
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
    //funcion  que asinga la foto de eprfil del usuario que se rgistra
    RegistroPage.prototype.updateFotoPerfil = function (uid, url) {
        //actualiza foto en tabla de perfil
        firebase.database().ref(this.departamentoApp + '/userProfile').child(uid)
            .update({ photoUrl: url });
        alert("Usuario registrado");
        this.navCtrl.pop();
    };
    //algoritmo de compresion de base 64 a file
    RegistroPage.prototype.base64ToFile = function (base64Data, tempfilename, contentType) {
        contentType = contentType || '';
        var sliceSize = 1024;
        var byteCharacters = atob(base64Data);
        var bytesLength = byteCharacters.length;
        var slicesCount = Math.ceil(bytesLength / sliceSize);
        var byteArrays = new Array(slicesCount);
        for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            var begin = sliceIndex * sliceSize;
            var end = Math.min(begin + sliceSize, bytesLength);
            var bytes = new Array(end - begin);
            for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }
            byteArrays[sliceIndex] = new Uint8Array(bytes);
        }
        var file = new File(byteArrays, tempfilename, { type: contentType });
        return file;
    };
    //convierte a formato blob
    RegistroPage.prototype.b64toBlob = function (b64Data, contentType, sliceSize) {
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
    RegistroPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad RegistroPage');
    };
    RegistroPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-registro',
            templateUrl: 'registro.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, AngularFireDatabase, AuthServiceProvider, AngularFireAuthModule, Camera, Ng2ImgToolsService, LoadingController])
    ], RegistroPage);
    return RegistroPage;
}());
export { RegistroPage };
//# sourceMappingURL=registro.js.map