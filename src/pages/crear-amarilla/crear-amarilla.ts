import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,LoadingController} from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Ng2ImgToolsService } from 'ng2-img-tools';
import { Subject } from 'rxjs/Subject';
/**
 * Generated class for the CrearAmarillaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-crear-amarilla',
  templateUrl: 'crear-amarilla.html'
  
})
export class CrearAmarillaPage {

  fotoAmarilla: any;
  departamentos:any ; 
  fotoEvento :any ;
  fotoEventoPura :any ; 
  loading :any ;
  promise:any;
  fotoComprimidaCliente:any;
  loading2:any;
  municipios:any;
  filtroMunicipios:any;
  uidDepartamento:any;


  constructor(public navCtrl: NavController, public navParams: NavParams ,public camera: Camera, public ng2ImgToolsService: Ng2ImgToolsService , public af :AngularFireDatabase  , public loadingCtrl : LoadingController) {
    this.fotoAmarilla = "-";
    
    this.af.list('/departamentos/', { preserveSnapshot: true })
      .subscribe(snapshots => {
        this.departamentos = [];
        snapshots.forEach(snapshot1 => {
          let data = snapshot1.val();
          data.uid = snapshot1.key;
          //   console.log("uid creador = " + data.uidCreador);
          console.log("departamento key  =" + snapshot1.key);
          console.log("departamento Value =" + JSON.stringify(snapshot1.val()));
          this.departamentos.push(data);
        });
      });
  }

  onSelecDepartamento() {


    this.municipios = [];
    let subject = new Subject();
    const queryObservable = this.af.list('/municipios', {
      query: {
        orderByChild: 'uidDepartamento',
        equalTo: subject

      }
    });
    // subscribe to changes
    queryObservable.subscribe(queriedItems => {
      console.log(JSON.stringify(queriedItems));
      this.filtroMunicipios = queriedItems;
      this.filtroMunicipios.forEach((item, index) => {

        //         console.log("item municipio = " + JSON.stringify(item));

        let dataI = item;

        this.municipios.push(dataI);
      });
    });

    // trigger the query
    subject.next(this.uidDepartamento);
  }

    cargarImagen(tipo) {

    if (tipo === 'foto') {
      const options: CameraOptions = {
        quality: 10,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.PNG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.camera.PictureSourceType.CAMERA,
        correctOrientation: true,
        saveToPhotoAlbum: true
      }
      this.camera.getPicture(options).then((imageData) => {

        this.fotoEvento = 'data:image/jpeg;base64,' + imageData;
        this.fotoEventoPura = imageData;

        let fotoCliente = this.b64toBlob(this.fotoEventoPura, null, null);

        //   this.loading.dismiss();

      }, (err) => {
        console.log("error 2");
        console.log(err);
        //this.loading.dismiss();
        // Handle error
      });
    } else {
      const options: CameraOptions = {
        quality: 10,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.PNG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        correctOrientation: true,
        saveToPhotoAlbum: true
      }
      this.camera.getPicture(options).then((imageData) => {

        this.fotoEvento = 'data:image/jpeg;base64,' + imageData;
        this.fotoEventoPura = imageData;

        let fotoCliente = this.b64toBlob(this.fotoEventoPura, null, null);

        //   this.loading.dismiss();

      }, (err) => {
        console.log("error 2");
        console.log(err);
        //this.loading.dismiss();
        // Handle error
      });
    }



  }
  
  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: 'Cargando...'
    });

    this.loading.present();

    /*setTimeout(() => {
      loading.dismiss();
    }, 5000);
    */
  }


subirImagen(uid) {
    this.presentLoadingDefault();
    this.promise = new Promise((res, rej) => {
      // let fotoCompress = this.dataURLtoFile( this.fotoCliente , 'nombre.jpeg');
      //  let fotoCompress  = this.base64ToFile( this.fotoClientePura  , 'comprimida' ,'image/png');
      let fotoCompress = this.b64toBlob(this.fotoEventoPura, 'image/png', null);
      //  const file = new File(fotoCompress,'image/png');
      //comprimir imagen para subir
      let file = this.blobToFile(fotoCompress, 'imagen.png');
      this.ng2ImgToolsService.compress([file], 3, false, false).subscribe(result => {
        //all good, result is a file
        this.fotoComprimidaCliente = result;
        console.log(result);
        console.log(JSON.stringify(result));
        let storage = firebase.storage().ref();
        const loading = this.loading2;
        let thiss = this;
        const storageRef = storage.child('noticias/' + uid + '/fotoPrincipal.png').put(this.fotoComprimidaCliente).then(function(snapshot) {
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

      }, error => {
        console.log("error comprimir  " + JSON.stringify(error));
        //something went wrong
        //use result.compressedFile or handle specific error cases individually
      });

      //  this.loading.dismiss();
    });


  }

  nombreAmarilla:any;
  direccion:any;
  telefonos:any;
  tipoEmpresa:any;
  categorias:any;
  descripcion:any;
   
  publicarAmarilla(){

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




  }

   blobToFile(theBlob: Blob, fileName: string) {
    var b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    //Cast to a File() type
    return <File>theBlob;
  }

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
    console.log('ionViewDidLoad CrearAmarillaPage');
  }

}
