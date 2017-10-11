import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Ng2ImgToolsService } from 'ng2-img-tools';
import firebase from 'firebase';
import { Storage } from '@ionic/storage';



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

  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFireDatabase, public camera: Camera, public ng2ImgToolsService: Ng2ImgToolsService, public loadingCtrl: LoadingController, public storage: Storage) {

    this.fotoNoticia = "-";
    /*this.af.list('/municipios/' ,{ preserveSnapshot: true})
        .subscribe(snapshots=>{
            this.municipios = [];
            snapshots.forEach(snapshot1 => {
             let data = snapshot1.val();
          //   console.log("uid creador = " + data.uidCreador);
             console.log("departamento key  ="+snapshot1.key);
             console.log("departamento Value ="+ JSON.stringify(snapshot1.val()));
               this.municipios.push(data);
            });
        });*/

    //veirfica si el usuario esta guardado
    this.storage.get('userData')
      .then(
      data => {
        console.log(JSON.stringify(data)),

          console.log("finaliza");
        console.log(data.uid);

        this.item = this.af.object('/userProfile/' + data.uid, { preserveSnapshot: true });
        this.item.subscribe(snapshot => {
          console.log(snapshot.key);
          console.log(snapshot.val());

          this.perfil = snapshot.val();
          this.perfil.uid = data.uid;

        });
      },
      error => { //si no esta guardado envia a la pagina de login
        console.error("error = " + error);


      }
      );




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
  filtroMunicipios: any;


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

  publicarNoticia() {
    console.log("tituo noticia = " + this.tituloNoticia);
    console.log("descripcion noticia = " + this.descripcionNoticia);
    console.log("imagen noticia = " + this.imagenNoticia);
    console.log("uid municipio = " + this.uidMunicipio);
    console.log("uid departamento= " + this.uidDepartamento);
    console.log("uid creador= " + this.perfil.uid);

    if (this.tituloNoticia === null || this.tituloNoticia === "" || this.tituloNoticia === undefined) {
      alert("Falta titulo");
      return;
    }
    if (this.descripcionNoticia === null || this.descripcionNoticia === "" || this.descripcionNoticia === undefined) {
      alert("Falta descripcion");
      return;
    }
    if (this.fotoNoticia === "-") {
      alert("Falta foto");
      return;
    }

    if (this.fechaNoticia === null || this.fechaNoticia === "0" || this.fechaNoticia === undefined) {
      alert("Falta fecha");
      return;
    }

    if (this.uidMunicipio === null || this.uidMunicipio === "0" || this.uidMunicipio === undefined) {
      alert("Falta municipio");
      return;
    }
    if (this.uidDepartamento === null || this.uidDepartamento === "0" || this.uidDepartamento === undefined) {
      alert("Falta departamento");
      return;
    }

    const itemRef = this.af.list('Noticias');
    itemRef.push({
      tituloNoticia: this.tituloNoticia,
      descripcion: this.descripcionNoticia,
      uidMunicipio: this.uidMunicipio,
      uidDepartamento: this.uidDepartamento,
      uidCreador: this.perfil.uid,
      fechaNoticia: this.fechaNoticia

    }).then((item) => {
      console.log("llave = " + item.key);
      this.subirImagen(item.key);

    });

  }

  updateFotoNoticia(uid, url) {
    firebase.database().ref('/Noticias/').child(uid)
      .update(
      { urlImagen: url }
      );
    alert("Noticia registrada");
    this.navCtrl.popToRoot();
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
        const storageRef = storage.child('noticias/' + uid + '/fotoPrincipal.png').put(this.fotoComprimidaCliente).then(function(snapshot) {
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

}
