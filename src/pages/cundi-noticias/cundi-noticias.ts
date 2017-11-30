import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { DetalleNoticiaPage } from '../../pages/detalle-noticia/detalle-noticia';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Storage } from '@ionic/storage';
import { Subject } from 'rxjs/Subject';
import firebase from 'firebase';

/**
 * Generated class for the CundiNoticiasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cundi-noticias',
  templateUrl: 'cundi-noticias.html',
})

export class CundiNoticiasPage {
  noticias:any = [] ;
  itemRef :any ;
  departamentoApp  = "/Cundinamarca";
  item:any ; 
  perfil :any  = []; 
  mostrarBusqueda :any;
  municipios:any ;
  filtroMunicipios:any;
  uidMunicipio:any;
  uidMunicipioCargado :any ;
  itemRefNombre:any; 
  itemRefNoticias:any;
  referenceToOldestKey :any;
  filtro  :any = [];
  count :any  = 0 ; 
  enFiltro:any = false  ;
  
  constructor(public navCtrl: NavController, public navParams: NavParams , public af: AngularFireDatabase ,private socialSharing: SocialSharing  ,private transfer: FileTransfer, private file: File ,public storage: Storage) {
    this.uidMunicipioCargado  =  this.navParams.data.uidMunicipio ;

    console.log("uidMunicipioCargado  = "  +this.uidMunicipioCargado);
    
    //obtiene informacion del usuario
    this.storage.get('userData')
      .then(
      data => {
       // console.log(JSON.stringify(data)),
       // console.log("finaliza");
       // console.log(data.uid);
        //consulta informacion de perfil 
        this.item = this.af.object(this.departamentoApp+'/userProfile/' + data.uid, { preserveSnapshot: true });
        this.item.subscribe(snapshot => {
         // console.log(snapshot.key);
         // console.log(snapshot.val());
          //carga informacion a las variables 
          this.perfil = snapshot.val();
          this.perfil.uid = data.uid;


          if(this.uidMunicipioCargado != undefined){
              this.uidMunicipio = this.uidMunicipioCargado;
              this.filtraMunicipios();
          }else{
            this.enFiltro = false ;

            firebase.database().ref(this.departamentoApp+"/Noticias/").once('value').then((snapshot1 ) => {
               this.count = 0;
               let thiss = this ; 
               snapshot1.forEach(function(v) {
                   thiss.count++;
               });
               console.log("total" + this.count); 
               //count is now safe to use.
            });

            this.noticias= [];
              firebase.database().ref(this.departamentoApp+"/Noticias/")
                 .orderByKey()
                 .limitToLast(5)
                 .once("value")
                 .then((snapshot ) => {
                      let arrayOfkeys = Object.keys(snapshot.val());
                      let results = arrayOfkeys
                         .map(key => snapshot.val()[key])
                         .reverse();

                         this.referenceToOldestKey = arrayOfkeys[0];

                         console.log("entra  ultima referencia " +this.referenceToOldestKey );
                        // console.log(JSON.stringify(snapshot.val()));

                         this.filtro  = snapshot.val();
                         
                            // console.log("entra for normalito "+ this.filtro.length);
                             //console.log("entra for normalito "+ this.filtro.length());
                          let thisInterno = this ; 
                           snapshot.forEach(function(item) {
                               console.log("item" );
                               console.log(JSON.stringify(item)); 
                               let data = item.val();
                               //console.log("uid creador = " + item.uidCreador);
                               console.log("uid creador = " + data.uidCreador);
                         //      console.log("NOTICIAS");
                                   console.log(thisInterno.departamentoApp+'/userProfile/'+data.uidCreador);
                                    thisInterno.itemRefNoticias = thisInterno.af.object(thisInterno.departamentoApp+'/userProfile/'+data.uidCreador,  { preserveSnapshot: true });
                                    thisInterno.itemRefNoticias.subscribe(snapshot => {
                                      //console.log(action.type);
                           //           console.log("llave" + snapshot.key)
                            //          console.log('data ' + JSON.stringify(snapshot.val()));
                                      let url = snapshot.val().photoUrl ; 
                                      data.urlImagenCreador  = url;
                                      data.nombreUsuario = snapshot.val().nombreUsuario;
                                      data.index =  data.uid ;
                                      //verifica si esa noticia esta guardada  como favorita 
                                      //console.log("url="+this.departamentoApp+'/NoticiasGuardadasUsuario/'+this.perfil.uid+"/"+ snapshot1.key);
                                       let infoGuardado = thisInterno.af.object(thisInterno.departamentoApp+'/NoticiasGuardadasUsuario/'+thisInterno.perfil.uid+"/"+ data.uid, { preserveSnapshot: true });
                                        infoGuardado.subscribe(snapshot => {
                              //            console.log("entra consulta si guardo noticia ");
                                        //  console.log(snapshot.key);
                                        //  console.log(snapshot.val());
                                          if(snapshot.val() === null ){
                                //             console.log("noticia no guardada");
                                              data.guardado = false ;
                                          }else{
                                  //          console.log("noticia guardada");
                                              data.guardado  = true ;
                                          }
                                         });
                                            thisInterno.itemRefNombre = thisInterno.af.object(thisInterno.departamentoApp+'/Municipios/' + data.uidMunicipio, { preserveSnapshot: true });
                                                  thisInterno.itemRefNombre.subscribe(snapshot => {
                                                    
                                                      data.nombreMunicipio = snapshot.val().municipio; 
                                                  });

                                //      console.log("add noticia");
                                      thisInterno.noticias.push(data);
                                    });

                           });
                  })
                 .catch((error) => {
                   console.log("error  firebase  nativo " + error);
                  } );
               


            
          }


            


        });
      },
      error => { //si no esta guardado envia a la pagina de login
        console.error("error = " + error);
      }
      );

      //arreglo de municipios
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
     // console.log(JSON.stringify(queriedItems));
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

    //funcion que comparte las imagenes de la notica 
    compartir(urlImg){


      console.log("entra a compartir");
      const fileTransfer: FileTransferObject = this.transfer.create();
      let data =  urlImg.split("?");
      let data1 = data[0].split("/");
      let total  = data1.length;
      console.log("total" + total );
      console.log(data1[total-1]);
      let nombre = data1[total-1] ;
      const url = urlImg;

      fileTransfer.download(url, this.file.externalApplicationStorageDirectory+nombre).then((entry) => {
        console.log('download complete: ' + entry.toURL());
          this.socialSharing.share("Compartido desde la guía cundinamarca, http://laguiacundinamarca.com/", null, entry.toURL()).then(() => {
            // Success!

            console.log("entra");
          }).catch(() => {
            console.log("error1");
          });
        //this.presentAlert(entry.toURL()) ;
      }, (error) => {
        console.log("error");
        console.log(error);
        // handle error
      });

    }


  detalleNoticia(urlImagen,tituloNoticia , nombreCreador , imagenCreador , descripcion ,uidNoticia,fechaCreacion ,fotos){
      console.log("url imagen = " + urlImagen);
      console.log("titulo noticia = " + tituloNoticia);
      console.log("nombre creador = " + nombreCreador);
      console.log("imagen creador = " + imagenCreador);
      console.log("descripcion = " + descripcion);
      console.log("uid noticia = " + uidNoticia);
      console.log("fecha noticia = " + fechaCreacion);
      this.navCtrl.push(DetalleNoticiaPage , {urlImagen  :urlImagen ,tituloNoticia :tituloNoticia ,  nombreCreador :nombreCreador , descripcion :descripcion  , imagenCreador :imagenCreador  ,uidNoticia:uidNoticia,fechaCreacion:fechaCreacion ,fotos:fotos});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CundiNoticiasPage');
  }



  guardarNoticia(noticia){
 
    console.log("id  = " +  noticia.index);
    console.log("id  perfil= " +  this.perfil.uid);

     if(noticia.guardado){
       const itemsTattoo = this.af.object(this.departamentoApp+'/NoticiasGuardadasUsuario/'+this.perfil.uid+"/"+noticia.index);
        itemsTattoo.remove();
        noticia.guardado = false;
        //this.tatuajeGuardado = false ;
     }else{
       const itemsTattoo = this.af.object(this.departamentoApp+'/NoticiasGuardadasUsuario/'+this.perfil.uid+"/"+noticia.index);
       const promise1 =   itemsTattoo.set(
                                     {
                                        noticia : noticia,
                                        uid : noticia.index          
                                     }
                                   );
        promise1.then(_ =>
          console.log('Noticia guardaa !!!')


        ).catch(err => console.log(err, 'You dont have access!'));
       // this.tatuajeGuardado = true;
       noticia.guardado = true;


     }

  }


  mostrarFiltro(){
      if(this.mostrarBusqueda){
        this.mostrarBusqueda = false;
      }else{
        this.mostrarBusqueda = true;
      }
    
  }

  filtraMunicipios(){

    this.enFiltro = true ;

            let newMunicipio =this.uidMunicipio-1; 
            console.log("id municipio " +newMunicipio);
            //arreglo de municipios
            this.noticias=[];
            let subject = new Subject();
            const queryObservable = this.af.list(this.departamentoApp+'/Noticias', {
              query: {
                orderByChild: 'uidMunicipio',
                equalTo : subject
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

                //let dataI = item;

        //        this.eventos.push(dataI);
                           let data =item;
                            console.log("uid creador = " + data.uidCreador);
                            //consulta informacion del creador del evento
                            this.itemRef = this.af.object(this.departamentoApp+'/userProfile/' + data.uidCreador, { preserveSnapshot: true });
                            this.itemRef.subscribe(snapshot => {
                              //console.log(action.type);

                              console.log("llave" + snapshot.key)
                              console.log('data ' + JSON.stringify(snapshot.val()));
                              data.urlImagenCreador = snapshot.val().photoUrl;
                              data.nombreUsuario = snapshot.val().nombreUsuario;
                              data.index = index;

                              //verifica si esa noticia esta guardada  como favorita 
                               let infoGuardado = this.af.object(this.departamentoApp+'/NoticiasGuardadasUsuario/'+this.perfil.uid+"/"+ index, { preserveSnapshot: true });
                                infoGuardado.subscribe(snapshot => {
                                  console.log("entra consulta si guardo evento ");
                                //  console.log(snapshot.key);
                                //  console.log(snapshot.val());
                                  if(snapshot.val() === null ){
                                     console.log("evento no guardada");
                                      data.guardado = false ;
                                  }else{
                                    console.log("evento guardada");
                                      data.guardado  = true ;
                                  }
                                 });
                                this.itemRefNombre = this.af.object(this.departamentoApp+'/Municipios/' + data.uidMunicipio, { preserveSnapshot: true });
                                this.itemRefNombre.subscribe(snapshot => {
                                    console.log("NBOMBRE  MUNICIPIO  ^!^!^!^!^!^!^!^!^!^!^!^!^!^!^!" + snapshot.val().municipio);
                                    data.nombreMunicipio = snapshot.val().municipio; 
                                });



                              //setea eventos 
                              this.noticias.push(data);
                            });
                           // console.log("key =" + snapshot1.key);
                            //console.log("Value =" + JSON.stringify(snapshot1.val()));

              });
            });

            subject.next(newMunicipio);

 


  }


  cargarTodasNoticias (){

              this.noticias= [];
              firebase.database().ref(this.departamentoApp+"/Noticias/")
                 .orderByKey()
                 .limitToLast(5)
                 .once("value")
                 .then((snapshot ) => {
                      let arrayOfkeys = Object.keys(snapshot.val());
                      let results = arrayOfkeys
                         .map(key => snapshot.val()[key])
                         .reverse();

                         this.referenceToOldestKey = arrayOfkeys[0];

                         console.log("entra  ultima referencia " +this.referenceToOldestKey );
                        // console.log(JSON.stringify(snapshot.val()));

                         this.filtro  = snapshot.val();
                         
                            // console.log("entra for normalito "+ this.filtro.length);
                             //console.log("entra for normalito "+ this.filtro.length());
                          let thisInterno = this ; 
                           snapshot.forEach(function(item) {
                               console.log("item" );
                               console.log(JSON.stringify(item)); 
                               let data = item.val();
                               //console.log("uid creador = " + item.uidCreador);
                               console.log("uid creador = " + data.uidCreador);
                         //      console.log("NOTICIAS");
                                   console.log(thisInterno.departamentoApp+'/userProfile/'+data.uidCreador);
                                    thisInterno.itemRefNoticias = thisInterno.af.object(thisInterno.departamentoApp+'/userProfile/'+data.uidCreador,  { preserveSnapshot: true });
                                    thisInterno.itemRefNoticias.subscribe(snapshot => {
                                      //console.log(action.type);
                           //           console.log("llave" + snapshot.key)
                            //          console.log('data ' + JSON.stringify(snapshot.val()));
                                      let url = snapshot.val().photoUrl ; 
                                      data.urlImagenCreador  = url;
                                      data.nombreUsuario = snapshot.val().nombreUsuario;
                                      data.index =  data.uid ;
                                      //verifica si esa noticia esta guardada  como favorita 
                                      //console.log("url="+this.departamentoApp+'/NoticiasGuardadasUsuario/'+this.perfil.uid+"/"+ snapshot1.key);
                                       let infoGuardado = thisInterno.af.object(thisInterno.departamentoApp+'/NoticiasGuardadasUsuario/'+thisInterno.perfil.uid+"/"+ data.uid, { preserveSnapshot: true });
                                        infoGuardado.subscribe(snapshot => {
                              //            console.log("entra consulta si guardo noticia ");
                                        //  console.log(snapshot.key);
                                        //  console.log(snapshot.val());
                                          if(snapshot.val() === null ){
                                //             console.log("noticia no guardada");
                                              data.guardado = false ;
                                          }else{
                                  //          console.log("noticia guardada");
                                              data.guardado  = true ;
                                          }
                                         });
                                            thisInterno.itemRefNombre = thisInterno.af.object(thisInterno.departamentoApp+'/Municipios/' + data.uidMunicipio, { preserveSnapshot: true });
                                                  thisInterno.itemRefNombre.subscribe(snapshot => {
                                                    
                                                      data.nombreMunicipio = snapshot.val().municipio; 
                                                  });

                                //      console.log("add noticia");
                                      thisInterno.noticias.push(data);
                                    });

                           });
                  })
                 .catch((error) => {
                   console.log("error  firebase  nativo " + error);
                  } );
  }
reiniciarBusqueda(){

 
  this.uidMunicipio = undefined;
  this.mostrarBusqueda = false ;
  this.enFiltro = false ;
  this.cargarTodasNoticias();
}


  finFoto: any = 5;
  filtro2: any;
  cargarMasNoticias(infiniteScroll) {
    if(this.enFiltro){
        setTimeout(() => {
          console.log('Async operation has ended');
          infiniteScroll.complete();
        }, 2000);
        return ;
    }
  
 
    firebase.database().ref(this.departamentoApp+"/Noticias")
       .orderByKey()
       .endAt(this.referenceToOldestKey)
       .limitToLast(6)
       .once('value')
       .then((snapshot) => {

              let arrayOfkeys = Object.keys(snapshot.val());
              let results = arrayOfkeys
                 .map(key => snapshot.val()[key])
                 .reverse()
                 .slice(1);

                 this.referenceToOldestKey = arrayOfkeys[0];

                   let thisInterno = this ; 
                           snapshot.forEach(function(item) {
                               console.log("item" );
                               console.log(JSON.stringify(item)); 
                               let data = item.val();
                               //console.log("uid creador = " + item.uidCreador);
                               console.log("uid creador = " + data.uidCreador);
                         //      console.log("NOTICIAS");
                                   console.log(thisInterno.departamentoApp+'/userProfile/'+data.uidCreador);
                                    thisInterno.itemRefNoticias = thisInterno.af.object(thisInterno.departamentoApp+'/userProfile/'+data.uidCreador,  { preserveSnapshot: true });
                                    thisInterno.itemRefNoticias.subscribe(snapshot => {
                                      //console.log(action.type);
                           //           console.log("llave" + snapshot.key)
                            //          console.log('data ' + JSON.stringify(snapshot.val()));
                                      let url = snapshot.val().photoUrl ; 
                                      data.urlImagenCreador  = url;
                                      data.nombreUsuario = snapshot.val().nombreUsuario;
                                      data.index =  data.uid ;
                                      //verifica si esa noticia esta guardada  como favorita 
                                      //console.log("url="+this.departamentoApp+'/NoticiasGuardadasUsuario/'+this.perfil.uid+"/"+ snapshot1.key);
                                       let infoGuardado = thisInterno.af.object(thisInterno.departamentoApp+'/NoticiasGuardadasUsuario/'+thisInterno.perfil.uid+"/"+ data.uid, { preserveSnapshot: true });
                                        infoGuardado.subscribe(snapshot => {
                              //            console.log("entra consulta si guardo noticia ");
                                        //  console.log(snapshot.key);
                                        //  console.log(snapshot.val());
                                          if(snapshot.val() === null ){
                                //             console.log("noticia no guardada");
                                              data.guardado = false ;
                                          }else{
                                  //          console.log("noticia guardada");
                                              data.guardado  = true ;
                                          }
                                         });
                                            thisInterno.itemRefNombre = thisInterno.af.object(thisInterno.departamentoApp+'/Municipios/' + data.uidMunicipio, { preserveSnapshot: true });
                                                  thisInterno.itemRefNombre.subscribe(snapshot => {
                                                    
                                                      data.nombreMunicipio = snapshot.val().municipio; 
                                                  });

                                //      console.log("add noticia");
                                          if(thisInterno.count >  thisInterno.noticias.length){
                                            thisInterno.noticias.push(data);
                                          }
                                    });

                           });



        } )
       .catch((error) => {
         console.log("error nativo firebase" +error);
       } );


          


    setTimeout(() => {
      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 2000);


  }


}
