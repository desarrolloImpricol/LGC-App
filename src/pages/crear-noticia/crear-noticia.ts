import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController ,ToastController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Ng2ImgToolsService } from 'ng2-img-tools';
import firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { CundiNoticiasPage } from '../../pages/cundi-noticias/cundi-noticias';
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the CrearNoticiaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-crear-noticia',
  templateUrl: 'crear-noticia.html',
})
export class CrearNoticiaPage {


  municipios: any;
  departamentos: any;
  tituloNoticia: any;
  descripcionNoticia: any;
  imagenNoticia: any;
  uidDepartamento: any;
  uidMunicipio: any;
  loading: any;
  item: any;
  perfil: any;
  fechaNoticia: any;
  departamentoApp :any = "/Cundinamarca";
  fuente :any ;
  foto1 :any;
  foto2 :any;
  foto3 :any;
  foto4 :any;
  foto5 :any;

  foto1Pura :any;
  foto2Pura :any;
  foto3Pura :any;
  foto4Pura :any;
  foto5Pura :any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFireDatabase, public camera: Camera, public ng2ImgToolsService: Ng2ImgToolsService, public loadingCtrl: LoadingController, public storage: Storage,private fileChooser: FileChooser,private transfer: FileTransfer,private Toast:ToastController,private filePath: FilePath , public alertCtrl : AlertController) {
    //inicializa  variable de foto de  noticia
    this.fotoNoticia = "-";
     this.foto1 = "-";
    this.foto2 = "-";
    this.foto3 = "-";
    this.foto4 = "-";
    this.foto5 = "-";
    //obtiene informacion del usuario
    this.storage.get('userData')
      .then(
      data => {
        console.log(JSON.stringify(data)),
        console.log("finaliza");
        console.log(data.uid);
        //consulta informacion de perfil 
        this.item = this.af.object(this.departamentoApp+'/userProfile/' + data.uid, { preserveSnapshot: true });
        this.item.subscribe(snapshot => {
          console.log(snapshot.key);
          console.log(snapshot.val());
          //carga informacion a las variables 
          this.perfil = snapshot.val();
          this.perfil.uid = data.uid;

        });
      },
      error => { //si no esta guardado envia a la pagina de login
        console.error("error = " + error);
      }
      );



    //consulta departamentos  
/*    this.af.list('/departamentos/', { preserveSnapshot: true })
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
      });*/

       //reinicializa el arreglo demunicipios
      this.municipios = [];
      let subject = new Subject();
      const queryObservable = this.af.list(this.departamentoApp+'/Municipios', {
        query: {
          orderByKey: true
        }
      });
      //manjo de respuesta 
      // subscribe to changes
      queryObservable.subscribe(queriedItems => {
        console.log(JSON.stringify(queriedItems));
        //alamaenca resultado del filtro en arreglo 
        this.filtroMunicipios = queriedItems;
        //recorre arreglo para setelartl en la lista 
        this.filtroMunicipios.forEach((item, index) => {
          //         console.log("item municipio = " + JSON.stringify(item));

          let dataI = item;

          this.municipios.push(dataI);
        });
      });




  }
  filtroMunicipios: any;

  //funcion que  se llama cuando se elecciona un departamento
  onSelecDepartamento() {
    
     //reinicializa el arreglo demunicipios
    this.municipios = [];
    let subject = new Subject();
    const queryObservable = this.af.list(this.departamentoApp+'/municipios', {
      query: {
        orderByChild: 'uidDepartamento',
        equalTo: subject

      }
    });
    //manjo de respuesta 
    // subscribe to changes
    queryObservable.subscribe(queriedItems => {
      console.log(JSON.stringify(queriedItems));
      //alamaenca resultado del filtro en arreglo 
      this.filtroMunicipios = queriedItems;
      //recorre arreglo para setelartl en la lista 
      this.filtroMunicipios.forEach((item, index) => {

        //         console.log("item municipio = " + JSON.stringify(item));

        let dataI = item;

        this.municipios.push(dataI);
      });
    });

    // trigger the query
    subject.next(this.uidDepartamento);
  }

  //funcion que publica una noticia 
  publicarNoticia() {
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
  /*  if (this.fechaNoticia === null || this.fechaNoticia === "0" || this.fechaNoticia === undefined) {
      alert("Falta fecha");
      return;
    }*/

    //valida que se tenga seleccionado un municipio 
    if (this.uidMunicipio === null || this.uidMunicipio === "0" || this.uidMunicipio === undefined) {
      alert("Falta municipio");
      return;
    }
     if (this.fuente === null || this.fuente === "" || this.fuente === undefined) {
      alert("Falta fuente");
      return;
    }
    /*if (this.uidDepartamento === null || this.uidDepartamento === "0" || this.uidDepartamento === undefined) {
      alert("Falta departamento");
      return;
    }*/
    let  uid = this.uidMunicipio -1;
    //conslta noticias 
    const itemRef = this.af.list(this.departamentoApp+'/Noticias');
    itemRef.push({
      tituloNoticia: this.tituloNoticia,
      descripcion: this.descripcionNoticia,
      uidMunicipio: uid,
      //uidDepartamento: this.uidDepartamento,
      uidCreador: this.perfil.uid,
      fuente :this.fuente,
      disponible: true
     // fechaNoticia: this.fechaNoticia

    }).then((item) => {
      console.log("llave = " + item.key);
      this.subirImagen(item.key);

    });

  }

  updateFotoNoticia(uid, url) {
    //AQUI TAMBIEN AGREGO EL UID DE LA NOTCIA  DENTRO DE LA MISMA 
    firebase.database().ref(this.departamentoApp+'/Noticias/').child(uid)
      .update(
      { 
        urlImagen: url ,
        uid:uid
      }
      );
  //  alert("Noticia registrada");
  this.loading.dismiss();
    this.verificarFotosAdicionales(uid);
    //this.navCtrl.setRoot(CundiNoticiasPage);
  }
  //sube  fotos  adicionales  sobre  una notcia 
  updateFotoNoticiaAdicional(uid, url ,numeroImagen) {
    //AQUI TAMBIEN AGREGO EL UID DE LA NOTCIA  DENTRO DE LA MISMA 
    firebase.database().ref(this.departamentoApp+'/Noticias/'+uid+'/fotos/').child(numeroImagen)
      .update(
      { 
        urlImagen: url 
      }
      );  
    //alert("foto noticia adicional "+numeroImagen+" registrada");
  // this.loading.dismiss();
    //this.navCtrl.setRoot(CundiNoticiasPage);
  }

  verificarFotosAdicionales(uidNoticia){
    this.presentLoadingDefault();

    console.log("verificar fotos adicionales ");
     let fotos = []; 
     if(this.foto1 != "-"){
       fotos.push(this.foto1Pura);
     }
     if(this.foto2 != "-"){
       fotos.push(this.foto2Pura);
     }
     if(this.foto3 != "-"){
       fotos.push(this.foto3Pura);
     }
     if(this.foto4 != "-"){
       fotos.push(this.foto4Pura);
     }
     if(this.foto5 != "-"){
       fotos.push(this.foto5Pura);
     }
     if(fotos.length > 0 ){
       this.subirFotosAdicionales(fotos ,uidNoticia );  
     }else{
       this.loading.dismiss();
     }
     


  }

  subirFotosAdicionales(fotos , uidNoticia ){
   // this.presentLoadingDefault();
    fotos.forEach((item, index) => {
       console.log("fotos " + index );
       console.log(JSON.stringify(item));
       this.subirImagenAdicional(uidNoticia ,  index , item);
      // this.loading.dismiss();
    });
    //this.loading.dismiss();
    alert("Noticia creada exitosamente !!!");
    this.navCtrl.setRoot(CundiNoticiasPage);

  }



  //carga imagen
  fotoNoticia: any;
  fotoNoticiaPura: any;
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

        this.fotoNoticia = 'data:image/jpeg;base64,' + imageData;
        this.fotoNoticiaPura = imageData;

        let fotoCliente = this.b64toBlob(this.fotoNoticiaPura, null, null);

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

        this.fotoNoticia = 'data:image/jpeg;base64,' + imageData;
        this.fotoNoticiaPura = imageData;

        let fotoCliente = this.b64toBlob(this.fotoNoticiaPura, null, null);

        //   this.loading.dismiss();

      }, (err) => {
        console.log("error 2");
        console.log(err);
        //this.loading.dismiss();
        // Handle error
      });
    }



  }

 //mostrar vendata modal
  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: 'Cargando...'
    });

    this.loading.present();

  }
  promise: any;
  fotoComprimidaCliente: any;
  loading2: any;
  subirImagen(uid) {
    this.presentLoadingDefault();
    this.promise = new Promise((res, rej) => {
      // let fotoCompress = this.dataURLtoFile( this.fotoCliente , 'nombre.jpeg');
      //  let fotoCompress  = this.base64ToFile( this.fotoClientePura  , 'comprimida' ,'image/png');
      let fotoCompress = this.b64toBlob(this.fotoNoticiaPura, 'image/png', null);
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
        const storageRef = storage.child(this.departamentoApp+'/noticias/' + uid + '/fotoPrincipal.png').put(this.fotoComprimidaCliente).then(function(snapshot) {
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

        


      }, error => {
        console.log("error comprimir  " + JSON.stringify(error));
        //something went wrong
        //use result.compressedFile or handle specific error cases individually
      });

      //  this.loading.dismiss();
    });

  }
  //sube las iamgenes adicionales de la noticia 
   subirImagenAdicional(uid , numeroImagen ,  foto ) {
   //this.presentLoadingDefault();
    this.promise = new Promise((res, rej) => {
      // let fotoCompress = this.dataURLtoFile( this.fotoCliente , 'nombre.jpeg');
      //  let fotoCompress  = this.base64ToFile( this.fotoClientePura  , 'comprimida' ,'image/png');
      let fotoCompress = this.b64toBlob(foto, 'image/png', null);
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
        const storageRef = storage.child(this.departamentoApp+'/noticias/' + uid + '/'+numeroImagen+'.png').put(this.fotoComprimidaCliente).then(function(snapshot) {
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
          //
          thiss.loading.dismiss();
          thiss.updateFotoNoticiaAdicional(uid, snapshot.downloadURL , numeroImagen);
         // thiss.loading.dismiss();
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
  
  
  //funcion que convierte el 
  blobToFile(theBlob: Blob, fileName: string) {
    var b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;
    //Cast to a File() type
    return <File>theBlob;
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
    console.log('ionViewDidLoad CrearNoticiaPage');
  }

  seleccionarArchivo(){

    this.fileChooser.open()
        .then(uri => {
             console.log(uri) ;
             let data = uri.split("/");
             console.log("cantidad = " + data.length);
             console.log(data[data.length-1]);
             let data22  = data[data.length-1] ; 
               this.filePath.resolveNativePath(uri)
                .then(filePath =>{ 
                  console.log("file ok");
                  console.log(filePath);
                })
                .catch(err => {
                  console.log("file path error");
                  console.log(err);

                });

            
            // this.readimage(uri);

          })
        .catch(e => {
          console.log(e)
        });
  }



 filee:any;
  /*upload2() {


this.filee = { name: "copoutrecording.mp3" };

   File.readAsDataURL(cordova.file.externalRootDirectory, this.filee.name).then((data: any) => {
   if (data) {
   var blob = new Blob([data], { type: "audio/mp3" }); 
   this.fbd.uploadrecording(blob);
  }
});
}*/


readimage(url) {
    (<any>window).resolveLocalFileSystemURL(url, (res) => {
      res.file((resFile) => {
        var reader = new FileReader();
        reader.readAsArrayBuffer(resFile);
        reader.onloadend = (evt: any) => {
          var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg'});
          //do what you want to do with the file
        }
      })
    })
  }

   upload(url) {
  let options: FileUploadOptions = {
     fileKey: 'file',
     fileName: 'name.mp3',
     headers: {}
    
  }
  const fileTransfer: FileTransferObject = this.transfer.create();


  fileTransfer.upload(url, '<api endpoint>', options)
   .then((data) => {
     console.log("pasa");
     console.log(data);
     // success
   }, (err) => {
     console.log("error");
     console.log(JSON.stringify(err));
     // error
   })
}

  cargarOtrasImagenes(numero){
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
        if(numero === 1){
          this.foto1 = 'data:image/jpeg;base64,' + imageData;
          this.foto1Pura = imageData;
        }
        if(numero === 2){
          this.foto2 = 'data:image/jpeg;base64,' + imageData;
          this.foto2Pura = imageData;
        }
        if(numero === 3){
          this.foto3 = 'data:image/jpeg;base64,' + imageData;
          this.foto3Pura = imageData;
        }
        if(numero === 4){
          this.foto4 = 'data:image/jpeg;base64,' + imageData;
          this.foto4Pura = imageData;
        }
        if(numero === 5){
          this.foto5 = 'data:image/jpeg;base64,' + imageData;
          this.foto5Pura = imageData;
        }
        
        //this.fotoEventoPura = imageData;
        //let fotoCliente = this.b64toBlob(this.fotoEventoPura, null, null);
        
      }, (err) => {
        console.log("error 2");
        console.log(err);
        //this.loading.dismiss();
        // Handle error
      });
  }


  showRadio() {
    let alert = this.alertCtrl.create();
    alert.setTitle('!Noticia creada! , que desea hacer ? ');

    alert.addInput({
      type: 'radio',
      label: 'Compartir',
      value: 'compartir',
      checked: false
    });


    alert.addInput({
      type: 'radio',
      label: 'Crear otra noticia',
      value: 'crearNoticia',
      checked: false
    });

      alert.addInput({
      type: 'radio',
      label: 'Volver',
      value: 'volver',
      checked: false
    });


 //   alert.addButton('Cancelar');
    alert.addButton({
      text: 'OK',
      handler: data => {
        //this.testRadioOpen = false;
        //this.testRadioResult = data;
        console.log(data);
        if(data === 'compartir'){
            //this.irCrearNoticias();
        }
        if(data === 'crearNoticia'){
            //this.irCreaEventos();
        } 
        if(data === 'volver'){
            //this.irCreaEventos();
        } 

      }
    });
    alert.present();
  }

}
