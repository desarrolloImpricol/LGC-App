import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import firebase from 'firebase';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Camera, CameraOptions } from '@ionic-native/camera';
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

@IonicPage()
@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {

  //variables de la clase
  items: FirebaseListObservable<any[]>;
  usuario: any;
  correo: any = "";
  clave: any = "";
  reclave: any = "";
  tipoUsuario: any = false;
  fotoCliente: any;
  fotoClientePura: any;
  promise: any;
  fotoComprimidaCliente: any;
  downloadURL: any;
  loading2: any;
  loading: any;
  uidCliente: any;
  entra: any;
  
  municipios: any;
  filtroMunicipios: any;
  uidDepartamento: any;
  uidMunicipio: any;
  deptos:any;



  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFireDatabase, private _auth: AuthServiceProvider, public afu: AngularFireAuthModule, public camera: Camera, public ng2ImgToolsService: Ng2ImgToolsService, public loadingCtrl: LoadingController) {
    //inicializa la variable de url de cliente
    this.downloadURL = "-";
    //inicializa obejto foto cliente
    this.fotoCliente = "-";
    //Consume lista de departamentos
    //consulta departamentos  
    this.af.list('/departamentos/', { preserveSnapshot: true })
      .subscribe(snapshots => {
        this.deptos = [];
        snapshots.forEach(snapshot1 => {
          let data = snapshot1.val();
          data.uid = snapshot1.key;
          //   console.log("uid creador = " + data.uidCreador);
          console.log("departamento key  =" + snapshot1.key);
          console.log("departamento Value =" + JSON.stringify(snapshot1.val()));
          this.deptos.push(data);
        });
      });
  }

  //funcion que se ejecuta  cuando se cambios la opcion de departamentos
  onSelecDepartamento() {
    //  const size$ = new Subject<string>();
    //  const queryObservable = size$.switchMap(size =>
    //    this.af.list('/items', ref => ref.orderByChild('size').equalTo(size)).valueChanges();
    //  );
    //inicializa arreglo de municipios
    this.municipios = [];
    //objeto rxjs
    let subject = new Subject();
    //crea consulta
    const queryObservable = this.af.list('/municipios', {
      query: {
        orderByChild: 'uidDepartamento',
        equalTo: subject
      }
    });
    // subscribe to changes
    queryObservable.subscribe(queriedItems => {
      console.log(JSON.stringify(queriedItems));
      //almacenta resultado consulta
      this.filtroMunicipios = queriedItems;
      //recorre el resultado
      this.filtroMunicipios.forEach((item, index) => {
        //         console.log("item municipio = " + JSON.stringify(item));
        //alamacena obejto en variable temporal
        let dataI = item;
        //agrega objeto al arreglo
        this.municipios.push(dataI);
      });
    });
    // ejecuta query
    subject.next(this.uidDepartamento);
  }


  //registro via email
  signupUser(email: string, password: string): firebase.Promise<any> {
    //funcion que registra un usuario apartir de un email  y de una clave
    return firebase.auth().createUserWithEmailAndPassword(this.correo.trim(), this.clave.trim())
      .then(newUser => {
        let tipo = "persona";
        //varifica tipo de usuario que se registra
        if (this.tipoUsuario) {
          tipo = "empresa";
        }
        //guarda datos en la tabla
        firebase.database().ref('/userProfile').child(newUser.uid)
          .set(
          {
            email: this.correo,
            nombreUsuario: this.usuario,
            tipoUsuario: tipo
          }
          );
        //actualiza notificaciones de usuario
        firebase.database().ref('/notificacionesUsuario').child(newUser.uid)
          .set(
          {
            uid: newUser.uid,
            uidMunicipio: this.uidMunicipio,
            uidDepartamento: this.uidDepartamento,
            interesSoloMunicipio: true
          }
          );
        //llamado a funcion de subir imagen
        this.subirImagen(newUser.uid);
        //  alert("Registro exitoso");
      }).catch((_error) => {
        //validacion de los errores
        console.log("Error!");
        let erroInfo = JSON.stringify(_error);
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
  }

  //veirifca que lo datos para registro no esten vacios
  validarRegistro() {
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
  }

  //Funcion que carga una imagen para que sea visualizda por el cliente (aun no se ha subido al servidor)
  cargarImagen() {
    //opciones de captura de imagen
    const options: CameraOptions = {
      quality: 10,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true,
      saveToPhotoAlbum: true
    }
    //llamado a camara
    this.camera.getPicture(options).then((imageData) => {
      //crea foto en base64
      this.fotoCliente = 'data:image/jpeg;base64,' + imageData;
      //imagen pura sin formato
      this.fotoClientePura = imageData;
      //convierte y captura la foto del cliente de base 64 a formato blob
      let fotoCliente = this.b64toBlob(this.fotoClientePura, null, null);
    }, (err) => {
      //validacion de errores
      console.log("error 2");
      console.log(err);
      //this.loading.dismiss();
      // Handle error
    });
  }

  //Funcion que se ejecuta  cuando empieza el proceso de registro del usario
  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: 'Cargando...'
    });
    //llamado a ventana
    this.loading.present();
  }

  //funcion que conviente una url en un archivo file
  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  //funcion que conviente un archivo blob a un flie
  blobToFile(theBlob: Blob, fileName: string) {
    var b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;
    //Cast to a File() type
    return <File>theBlob;
  }

  //funcion para subir la imagen a los servidores de firebase
  subirImagen(uid) {
    //se muestra la ventana de  loading  para iniciar la subida de archivos
    this.presentLoadingDefault();
    //Crea la promesa de respuesta
    this.promise = new Promise((res, rej) => {
      // let fotoCompress = this.dataURLtoFile( this.fotoCliente , 'nombre.jpeg');
      //  let fotoCompress  = this.base64ToFile( this.fotoClientePura  , 'comprimida' ,'image/png');
      //convierte  foto a  fotmato blob
      let fotoCompress = this.b64toBlob(this.fotoClientePura, 'image/png', null);
      //  const file = new File(fotoCompress,'image/png');
      //convierte foto a formato file
      let file = this.blobToFile(fotoCompress, 'imagen.png');
      //comprime foto antes de la subida
      this.ng2ImgToolsService.compress([file], 3, false, false).subscribe(result => {
        //resultado de la foto compriida
        this.fotoComprimidaCliente = result;
        console.log(result);
        console.log(JSON.stringify(result));
        //referencia de almacenamiento
        let storage = firebase.storage().ref();
        const loading = this.loading2;
        //almacena el this par poder llamarlo dentro del then de la subida del archivo
        let thiss = this;
        //sube imagen
        const storageRef = storage.child('userProfile/' + uid + '/perfil.png').put(this.fotoComprimidaCliente).then(function(snapshot) {
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


      }, error => {
        console.log("error comprimir  " + JSON.stringify(error));
        //something went wrong
        //use result.compressedFile or handle specific error cases individually
      });
      //  this.loading.dismiss();
    });


  }

  //funcion  que asinga la foto de eprfil del usuario que se rgistra
  updateFotoPerfil(uid, url) {
    //actualiza foto en tabla de perfil
    firebase.database().ref('/userProfile').child(uid)
      .update(
      { photoUrl: url }
      );
    alert("Usuario registrado");
    this.navCtrl.pop();
  }


  //algoritmo de compresion de base 64 a file
  base64ToFile(base64Data, tempfilename, contentType) {
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
  }

  //convierte a formato blob
  b64toBlob(b64Data, contentType, sliceSize) {
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
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistroPage');
  }

}
