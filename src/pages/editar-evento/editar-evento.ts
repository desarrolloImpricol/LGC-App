import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,LoadingController , AlertController} from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';
import { Ng2ImgToolsService } from 'ng2-img-tools';
import { Camera, CameraOptions } from '@ionic-native/camera';
/**
 * Generated class for the EditarEventoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editar-evento',
  templateUrl: 'editar-evento.html',
})
export class EditarEventoPage {
  uid:any;
  municipios:any = [];
  departamentoApp :any = "/Cundinamarca";
  filtroMunicipios:any;
  foto1:any = "-";
  foto2:any = "-";
  foto3:any = "-";
  foto4:any = "-";
  foto5:any = "-";
  evento :any ;
  uidMunicipio :any ;
  uidCliente:any; 
  filtroEventos:any;
  categoriasEventos:any = [];
   promise :any ;
   fotoComprimidaCliente :any;
   loading:any;
   foto1Pura:any;
   foto2Pura:any;
   foto3Pura:any;
   foto4Pura:any;
   foto5Pura:any;
   nuevaFoto1:any= [];
   nuevaFoto2:any= [];
   nuevaFoto3:any= [];
   nuevaFoto4:any= [];
   nuevaFoto5:any= [];
   loading2:any;
   fotoNoticia:any;
   fotoNoticiaPura:any;
  constructor(public navCtrl: NavController, public navParams: NavParams ,public af: AngularFireDatabase ,public storage:Storage,public ng2ImgToolsService: Ng2ImgToolsService ,public loadingCtrl: LoadingController ,public camera: Camera , public alertCtrl :AlertController) {

  	this.uid =  this.navParams.data.uid ;
  	console.log("uid = " + this.uid) ;

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
        //console.log(JSON.stringify(queriedItems));
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

    

      	 //veirfica si el usuario esta guardado
    	this.storage.get('userData').then(data => {
      //  console.log(JSON.stringify(data)),	
          console.log("finaliza");
           this.uidCliente = data.uid ; 
            
        });

	    let fuenteData = this.af.object(this.departamentoApp+'/Eventos/' + this.uid, { preserveSnapshot: true });
	    fuenteData.subscribe(snapshot => {
	      this.evento = snapshot.val();
	      //this.fuente = snapshot.val().fuente; 
	      this.uidMunicipio = parseInt(this.evento.uidMunicipio);
	      //console.log("fuente evento" + this.fuente);
	      console.log("uid = " + this.uidMunicipio);
	      if(this.evento.fotos === undefined ){
	      		console.log("no tiene  fotos adiconales");
	      }else{
	      	  console.log("tiene fotos adicionales");
	      /*	  console.log(this.noticia.fotos[0].urlImagen);
	      	  console.log(this.noticia.fotos[1].urlImagen);
	      	  console.log(this.noticia.fotos[2].urlImagen);
	      	  console.log(this.noticia.fotos[3].urlImagen);
	      	  console.log(this.noticia.fotos[4].urlImagen);*/
	      	  if(this.evento.fotos[0] != undefined){
	      	  	//console.log("entra undefined 1");
	      	  	 this.foto1=this.evento.fotos[0].urlImagen;
	      	  }
	      	  if(this.evento.fotos[1] != undefined){
	      	  //	console.log("entra undefined 2");
	      	  	 this.foto2=this.evento.fotos[1].urlImagen;
	      	  }
	      	  if(this.evento.fotos[2] != undefined){
	      	  	//console.log("entra undefined 3");
	      	  	 this.foto3=this.evento.fotos[2].urlImagen;
	      	  }
	      	  if(this.evento.fotos[3] != undefined){
	      	  	//console.log("entra undefined 4");
	      	  	 this.foto4=this.evento.fotos[3].urlImagen;
	      	  }
	      	  if(this.evento.fotos[4] !=undefined){
	      	  	//console.log("entra undefined 5");
	      	  	 this.foto5=this.evento.fotos[4].urlImagen;
	      	  }



	      	 
	      	  
	      	  
	      	  
	      	  

	      }
/*
      this.form = this.formbuilder.group({
		      municipio: [this.noticia.uidMunicipio],
		    });
*/

	    });

  }

   editarEvento(){

  	 firebase.database().ref(this.departamentoApp+'/Eventos/').child(this.uid)
      .update(
      	{
      	    uidMunicipio : parseInt(this.evento.uidMunicipio ), 
      	    uidCategoriaEvento :this.evento.uidCategoriaEvento,
  	        tituloEvento: this.evento.tituloEvento,	        
  	        descripcionEvento :this.evento.descripcionEvento,
  	        fechaInicio :this.evento.fechaInicio ,
  	        fechaFin:this.evento.fechaFin,
  	        horario:this.evento.horario,
  	        ubicacion:this.evento.ubicacion,
  	        datosContacto:this.evento.datosContacto,
  	        telefonoContacto :this.evento.telefonoContacto
      	}
      );
      this.verificarFoto();
      //alert("Datos guardados correctamente");

  }


  verificarFoto(){
    let fotoArray = this.evento.urlImagen.split(":");
       if(fotoArray[0] != 'https'){
         console.log("entra fi verificar fotos");
         this.subirImagen();
       }else{
          this.verificarFotosAdicionales(this.uid);

       }
  }
 
    subirImagen() {
    this.presentLoadingDefault();
    this.promise = new Promise((res, rej) => {
      // let fotoCompress = this.dataURLtoFile( this.fotoCliente , 'nombre.jpeg');
      //  let fotoCompress  = this.base64ToFile( this.fotoClientePura  , 'comprimida' ,'image/png');
      let fotoCompress = this.b64toBlob(this.fotoNoticiaPura, 'image/png', null);
      //  const file = new File(fotoCompress,'image/png');
      //comprimir imagen para subir
      console.log("comprime");
      let file = this.blobToFile(fotoCompress, 'imagen.png');
      this.ng2ImgToolsService.compress([file], 3, false, false).subscribe(result => {
        //all good, result is a file
        this.fotoComprimidaCliente = result;
      //  console.log(result);
      //  console.log(JSON.stringify(result));
        let storage = firebase.storage().ref();
        const loading = this.loading2;
        let thiss = this;
        const storageRef = storage.child(this.departamentoApp+'/eventos/' + this.uid + '/fotoPrincipal.png').put(this.fotoComprimidaCliente).then(function(snapshot) {
          console.log('Uploaded an array!');

          //  this.downloadURL = snapshot.downloadURL;
          console.log("sanpchot SIN ");
          console.log(snapshot.downloadURL);

          // this.dataChangeObserver.next(this.downloadURL);
          //  console.log("url descarga imagen " + this.downloadURL);
          //  thiss.generarRegistroFoto();
          //    this.entra = true ;
          //  this.downloadURL = snapshot.downloadURL ;
          //    thiss.updateFotoPerfil(uid , snapshot.downloadURL);
            thiss.loading.dismiss();
          thiss.updateFotoNoticia(snapshot.downloadURL);
        //
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

    updateFotoNoticia( url) {
    console.log("entra frebase update " + this.uid);
    //AQUI TAMBIEN AGREGO EL UID DE LA NOTCIA  DENTRO DE LA MISMA 
    firebase.database().ref(this.departamentoApp+'/Eventos/').child(this.uid)
      .update(
      { 
        urlImagen: url 
      }
      );
       this.verificarFotosAdicionales(this.uid);
       this.showAlert();
  
  //  this.loading.dismiss();
    //this.verificarFotosAdicionales(uid);
  
  }


  verificarFotosAdicionales(uidNoticia){
    this.presentLoadingDefault();

    console.log("verificar fotos adicionales ");
     let fotos = []; 
     
     if(this.foto1 != "-"){
       let fotoArray = this.foto1.split(":");
       if(fotoArray[0] != 'https'){
         this.nuevaFoto1.urlImagen = this.foto1Pura;
         this.nuevaFoto1.posicion =0;
         fotos.push(this.nuevaFoto1);
       }
     }
     if(this.foto2 != "-"){
       let fotoArray = this.foto2.split(":");
       if(fotoArray[0] != 'https'){
         this.nuevaFoto2.urlImagen = this.foto2Pura;
         this.nuevaFoto2.posicion =1;
         fotos.push(this.nuevaFoto2);
       }       
     }
     if(this.foto3 != "-"){
       let fotoArray = this.foto3.split(":");
       if(fotoArray[0] != 'https'){
         this.nuevaFoto3.urlImagen = this.foto3Pura;
         this.nuevaFoto3.posicion =2;
         fotos.push(this.nuevaFoto3);
       }
     }
     if(this.foto4 != "-"){
       let fotoArray = this.foto4.split(":");
       if(fotoArray[0] != 'https'){
         this.nuevaFoto4.urlImagen = this.foto4Pura;
         this.nuevaFoto4.posicion =3;
         fotos.push(this.nuevaFoto4);
       }       
     }
     if(this.foto5 != "-"){
       let fotoArray = this.foto5.split(":");
       if(fotoArray[0] != 'https'){
         this.nuevaFoto5.urlImagen = this.foto5Pura;
         this.nuevaFoto5.posicion =4;
         fotos.push(this.nuevaFoto5);
       }
     }
     console.log("fotos para agregar") ; 
     console.log(fotos.length);
     if(fotos.length > 0 ){
       this.subirFotosAdicionales(fotos ,this.uid );  
     }else{
       console.log("entra eliminacion");
       if(this.foto1 === "-"){
           console.log("eliminar  foto 1");
           const itemsTattoo = this.af.object(this.departamentoApp+'/Eventos/'+this.uid+"/fotos/0");
            itemsTattoo.remove();
       }  
        if(this.foto2 === "-"){
         console.log("eliminar  foto 1");
           const itemsTattoo = this.af.object(this.departamentoApp+'/Eventos/'+this.uid+"/fotos/1");
            itemsTattoo.remove();
       }  
       if(this.foto3 != "-"){
         console.log("eliminar  foto 1");
           const itemsTattoo = this.af.object(this.departamentoApp+'/Eventos/'+this.uid+"/fotos/2");
            itemsTattoo.remove();
       }  
       if(this.foto4 != "-"){
         console.log("eliminar  foto 1");
           const itemsTattoo = this.af.object(this.departamentoApp+'/Eventos/'+this.uid+"/fotos/3");
            itemsTattoo.remove();
       }  
       if(this.foto5 != "-"){
         console.log("eliminar  foto 1");
           const itemsTattoo = this.af.object(this.departamentoApp+'/Eventos/'+this.uid+"/fotos/4");
            itemsTattoo.remove();
       }  
 
        //this.guardado = false;
        this.loading.dismiss();
     }
     

  }


  subirFotosAdicionales(fotos , uidNoticia ){
   // this.presentLoadingDefault();
    fotos.forEach((item, index) => {
       console.log("fotos " + index );
       console.log(JSON.stringify(item));
       this.subirImagenAdicional(uidNoticia ,  item.posicion , item.urlImagen);
      // this.loading.dismiss();
    });
    //this.loading.dismiss();


   // alert("Edicion  exitos !!!");
    //this.navCtrl.setRoot(CundiNoticiasPage);

  }

    //sube  fotos  adicionales  sobre  una notcia 
  updateFotoNoticiaAdicional(uid, url ,numeroImagen) {
    //AQUI TAMBIEN AGREGO EL UID DE LA NOTCIA  DENTRO DE LA MISMA 
    firebase.database().ref(this.departamentoApp+'/Eventos/'+uid+'/fotos/').child(numeroImagen)
      .update(
      { 
        urlImagen: url 
      }
      );  
    //alert("foto noticia adicional "+numeroImagen+" registrada");
     //alert("Noticia guardadda correctamente !!!");
     
  // this.loading.dismiss();
    //this.navCtrl.setRoot(CundiNoticiasPage);
  }


   showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Guardado!',
      subTitle: 'Los cambios han sido guardados!',
      buttons: ['OK']
    });
    alert.present();
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
        const storageRef = storage.child(this.departamentoApp+'/eventos/' + uid + '/'+numeroImagen+'.png').put(this.fotoComprimidaCliente).then(function(snapshot) {
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


  eliminarImagen(numero){
      if(numero === 1){
          this.foto1 = "-";
          this.foto1Pura = "-";
        }
        if(numero === 2){
          this.foto2 = "-";
          this.foto2Pura = "-";
        }
        if(numero === 3){
          this.foto3 = "-";
          this.foto3Pura = "-";
        }
        if(numero === 4){
          this.foto4 = "-";
          this.foto4Pura = "-";
        }
        if(numero === 5){
          this.foto5 = "-";
          this.foto5Pura = "-";
        }
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

    cargarImagen() {

   
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
        this.evento.urlImagen = this.fotoNoticia;
        let fotoCliente = this.b64toBlob(this.fotoNoticiaPura, null, null);

        //   this.loading.dismiss();

      }, (err) => {
        console.log("error 2");
        console.log(err);
        //this.loading.dismiss();
        // Handle error
      });
    



  }

 //mostrar vendata modal
  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: 'Cargando...'
    });

    this.loading.present();

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
    console.log('ionViewDidLoad EditarNoticiasPage');
  }




}
