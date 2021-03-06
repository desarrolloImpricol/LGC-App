import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Ng2ImgToolsService } from 'ng2-img-tools';
import firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { CundiEventosPage } from '../../pages/cundi-eventos/cundi-eventos';
/**
 * Generated class for the CrearEventoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-crear-evento',
  templateUrl: 'crear-evento.html',
})
export class CrearEventoPage {


  municipios: any;
  departamentos: any;
  tituloEvento: any;
  descripcionEvento: any;
  imagenNoticia: any;
  uidDepartamento: any;
  uidMunicipio: any;
  loading: any;
  item: any;
  perfil: any;
  fechaEvento: any;
  fotoEvento: any;
  fotoEventoPura: any;
  filtroMunicipios: any;
  promise: any;
  fotoComprimidaCliente: any;
  loading2: any;
  fechaFinEvento: any;
  departamentoApp :any = "/Cundinamarca";
  categoriasEventos:any;
  filtroEventos:any;
  horario:any;
  ubicacion:any;
  datosContacto:any;
  telefonoContacto:any;
  organizador:any;
  uidCategoria:any;
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


  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFireDatabase, public camera: Camera, public ng2ImgToolsService: Ng2ImgToolsService, public loadingCtrl: LoadingController, public storage: Storage) {
    //inicializa la foto de evento
    this.fotoEvento = "-";
    this.foto1 = "-";
    this.foto2 = "-";
    this.foto3 = "-";
    this.foto4 = "-";
    this.foto5 = "-";
    //veirfica si el usuario esta guardado
    this.storage.get('userData')
      .then(
      data => {
        //console.log(JSON.stringify(data)),
        //console.log(data.uid);
        //consulta informacion del usuario
        this.item = this.af.object(this.departamentoApp+'/userProfile/' + data.uid, { preserveSnapshot: true });
        this.item.subscribe(snapshot => {
          //console.log(snapshot.key);
          //console.log(snapshot.val());
          //objeto con la informacion del cliente
          this.perfil = snapshot.val();
          this.perfil.uid = data.uid;
        });
      },
      error => { //si no esta guardado envia a la pagina de login
        console.error("error = " + error);
      }
      );
    //Consume lista de departamentos
    this.af.list(this.departamentoApp+'/departamentos/', { preserveSnapshot: true })
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

         //arreglo de tipo evento
    this.categoriasEventos = [];
    //let subject = new Subject();
    const queryObservableCategorias = this.af.list(this.departamentoApp+'/CategoriasEventos', {
      query: {
        orderByKey: true
      }
    });
    //manjo de respuesta 
    // subscribe to changes
    queryObservableCategorias.subscribe(queriedItems => {
      console.log(JSON.stringify(queriedItems));
      //alamaenca resultado del filtro en arreglo 
      this.filtroEventos = queriedItems;
      //recorre arreglo para setelartl en la lista 
      this.filtroEventos.forEach((item, index) => {
        //         console.log("item municipio = " + JSON.stringify(item));

        let dataI = item;

        this.categoriasEventos.push(dataI);
      });
    });

  }

  //funcion que se ejecuta cuando se cambia el departamento
  onSelecDepartamento() {
    this.municipios = [];
    let subject = new Subject();
    //Crea consulta
    const queryObservable = this.af.list(this.departamentoApp+'/Municipios', {
      query: {
        orderByChild: 'uidDepartamento',
        equalTo: subject
      }
    });
    // subscribe to changes
    queryObservable.subscribe(queriedItems => {
      console.log("*************************Municipios*************************************");
      console.log(JSON.stringify(queriedItems));
      //alamacena resultado del query
      this.filtroMunicipios = queriedItems;
      //recorre municipios
      this.filtroMunicipios.forEach((item, index) => {
        //         console.log("item municipio = " + JSON.stringify(item));
        //alamcena objeto que itera
        let dataI = item;
        //
        //agrega al arreglo de municipios el objeto
        this.municipios.push(dataI);
      });
    });
    // trigger the query
    subject.next(this.uidDepartamento);
  }

  //Funcion que crea un evento
  publicarEvento() {
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
    const itemRef = this.af.list(this.departamentoApp+'/Eventos');
    let  uid = this.uidMunicipio -1;
    //crea evento
    itemRef.push({
      uidMunicipio: uid.toString(),
      uidCategoriaEvento :this.uidCategoria,
      tituloEvento: this.tituloEvento,
      descripcionEvento: this.descripcionEvento,
      //uidDepartamento: this.uidDepartamento,
      uidCreador: this.perfil.uid,
      fechaInicio: this.fechaEvento,
      fechaFin: this.fechaFinEvento,
      horario:this.horario,
      ubicacion:this.ubicacion,
      datosContacto :this.datosContacto,
      telefonoContacto:this.telefonoContacto,
      organizador:this.organizador,
      disponible: true
      

    }).then((item) => {
      console.log("llave = " + item.key);
      //luego de tener el uid del evento creado se ejecuta la funcion que sube una imagen
      this.subirImagen(item.key);
    });
  }

  //funcion que agrega la url de l imagen a un evento seleccionado
  updateFotoNoticia(uid, url) {
    firebase.database().ref(this.departamentoApp+'/Eventos/').child(uid)
      .update(
        {
           urlImagen: url ,
           uid:uid
         }
      );
    //alert("Evento registrado");
    //this.navCtrl.popToRoot();
    this.loading.dismiss();
    this.verificarFotosAdicionales(uid);
  }
    updateFotoNoticiaAdicional(uid, url ,numeroImagen) {
    firebase.database().ref(this.departamentoApp+'/Eventos/'+uid+'/fotos/').child(numeroImagen)
      .update(
      { urlImagen: url 
       
     }
      );
   // alert("Evento registrado");
    //this.navCtrl.popToRoot();
  }
  

   verificarFotosAdicionales(uidEvento){
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
       this.subirFotosAdicionales(fotos ,uidEvento );  
     }else{
       this.loading.dismiss();
     }
     


  }

  subirFotosAdicionales(fotos , uidEvento ){
   // this.presentLoadingDefault();
    fotos.forEach((item, index) => {
       console.log("fotos " + index );
       console.log(JSON.stringify(item));
       this.subirImagenAdicional(uidEvento ,  index , item);
      // this.loading.dismiss();
    });
    //this.loading.dismiss();
    alert("Evento creado exitosamente !!!");
    this.navCtrl.setRoot(CundiEventosPage);

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

  //funcion que carga la imagen dese la libreria o dirctamento una foto de la camara, dependiento el tipo
  cargarImagen(tipo) {
    //valida tipo y carga imagen
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

  //muestra imagen de carga
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
  //funcion que sube la imagen
  subirImagen(uid) {
    this.presentLoadingDefault();
    this.promise = new Promise((res, rej) => {
      let fotoCompress = this.b64toBlob(this.fotoEventoPura, 'image/png', null);
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
        const storageRef = storage.child(this.departamentoApp+'eventos/' + uid + '/fotoPrincipal.png').put(this.fotoComprimidaCliente).then(function(snapshot) {
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
   

  subirImagenAdicional(uid ,numeroImagen , foto ) {
   // this.presentLoadingDefault();
    this.promise = new Promise((res, rej) => {
      let fotoCompress = this.b64toBlob(foto, 'image/png', null);
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
        const storageRef = storage.child(this.departamentoApp+'eventos/' + uid + '/'+numeroImagen+'.png').put(this.fotoComprimidaCliente).then(function(snapshot) {
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
          thiss.loading.dismiss();
          thiss.updateFotoNoticiaAdicional(uid, snapshot.downloadURL ,numeroImagen);
          
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


   //convierte archivo blod  a file 
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
    console.log('ionViewDidLoad CrearEventoPage');
  }

}
