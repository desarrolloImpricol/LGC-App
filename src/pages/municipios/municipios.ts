import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { Storage } from '@ionic/storage';
import { DetalleSitioInteresPage } from '../../pages/detalle-sitio-interes/detalle-sitio-interes';
import { DetalleNoticiaPage } from '../../pages/detalle-noticia/detalle-noticia';
import { DetalleEventoPage } from '../../pages/detalle-evento/detalle-evento';
import { PhotoViewer } from '@ionic-native/photo-viewer';
/**
 * Generated class for the MunicipiosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-municipios',
  templateUrl: 'municipios.html',
})
export class MunicipiosPage {
	departamentoApp:any  = "/Cundinamarca";
    municipio : any = {};
    filtroMunicipios :any =[];
    idMunicipio :any;
    perfil:any;
    item:any;
    sitiosInteres:any = [];
    itemRef:any;
    eventos:any;
    noticias:any;
    filtroMunicipiosNoticias:any;
    filtroMunicipiosSitios:any ;
    mostrarEventos :any ;
    mostrarNoticias :any ;
    mostrarSitios :any ;
    itemRefNombre:any;
    itemRefNombreCategoria:any;

  constructor(public navCtrl: NavController, public navParams: NavParams ,public af: AngularFireDatabase ,public storage:Storage ,private photoViewer: PhotoViewer) {

  	console.log("data " + this.navParams.data.municipioInfo);
    this.idMunicipio = this.navParams.data.municipioInfo -1 ; 
    console.log("id municipio " + this.idMunicipio) ;
  this.mostrarEventos =false;
  this.mostrarNoticias =false;
  this.mostrarSitios =false;



      this.storage.get('userData').then(data => {

            this.item = this.af.object('/userProfile/' + data.uid, { preserveSnapshot: true });
            this.item.subscribe(snapshot => {
            console.log(snapshot.key);
            console.log(snapshot.val());
            this.perfil = snapshot.val();
            this.perfil.uid =snapshot.key ;


             let subject = new Subject();
                const queryObservable = this.af.list(this.departamentoApp+'/Municipios', {
                  query: {
                    orderByChild: 'id',
                    equalTo: subject
                  }
                });

                //manjo de respuesta 
                // subscribe to changes
                queryObservable.subscribe(queriedItems => {
                  //console.log(JSON.stringify(queriedItems));
                  //alamaenca resultado del filtro en arreglo 
                 this.filtroMunicipios = queriedItems;
                 this.municipio = queriedItems[0];
                  //recorre arreglo para setelartl en la lista 
                  console.log("entraa municipio ");
                  console.log(JSON.stringify(this.municipio));
                 // console.log("Municipio =  " + this.municipio.eslogan);
                 let id = this.municipio.id; 
                    console.log('url ='  +  this.departamentoApp+'/MunicipiosGuardadosUsuario/'+this.perfil.uid+"/"+ id);
                 let infoGuardado = this.af.object(this.departamentoApp+'/MunicipiosGuardadosUsuario/'+this.perfil.uid+"/"+id, { preserveSnapshot: true });
                                              infoGuardado.subscribe(snapshot => {
                                                console.log("entra consulta si guardo municipio ");
                                              //  console.log(snapshot.key);
                                              //  console.log(snapshot.val());
                                                if(snapshot.val() === null ){
                                                   console.log("sitio no guardada");
                                                    this.municipio.guardado = false ;
                                                }else{
                                                  console.log("sitio  guardada");
                                                    this.municipio.guardado  = true ;
                                                }
                                               });
                
                });

                // trigger the query
                subject.next(parseInt(this.idMunicipio + 1 ));




                //consulta de eventos 

           //let newMunicipio =this.idMunicipio-1; 
           // console.log("id municipio " +newMunicipio);
            //arreglo de municipios
            this.eventos=[];
            let subjectEvento = new Subject();
            const queryObservableEvento = this.af.list(this.departamentoApp+'/Eventos/', {
              query: {
                orderByChild: 'uidMunicipio',
                equalTo : parseInt(this.idMunicipio)
              }
            });
            //manjo de respuesta 
            // subscribe to changes
            queryObservableEvento.subscribe(queriedItems => {
           //   console.log(JSON.stringify(queriedItems));
              //alamaenca resultado del filtro en arreglo 
              this.filtroMunicipios = queriedItems;
              //recorre arreglo para setelartl en la lista 
              this.filtroMunicipios.forEach((item, index) => {
                //         console.log("item municipio = " + JSON.stringify(item));

                //let dataI = item;

        //        this.eventos.push(dataI);
                 let data =item;
                          //  console.log("uid creador = " + data.uidCreador);
                            //consulta informacion del creador del evento
                            this.itemRef = this.af.object(this.departamentoApp+'/userProfile/' + data.uidCreador, { preserveSnapshot: true });
                            this.itemRef.subscribe(snapshot => {
                              //console.log(action.type);

                          //    console.log("llave" + snapshot.key)
                          //    console.log('data ' + JSON.stringify(snapshot.val()));
                              data.urlImagenCreador = snapshot.val().photoUrl;
                              data.nombreUsuario = snapshot.val().nombreUsuario;
                              data.index = index;
                              //verifica si esa noticia esta guardada  como favorita 
                               let infoGuardado = this.af.object(this.departamentoApp+'/EventosGuardadosUsuario/'+this.perfil.uid+"/"+ data.uid, { preserveSnapshot: true });
                                infoGuardado.subscribe(snapshot => {
                               //   console.log("entra consulta si guardo evento ");
                                //  console.log(snapshot.key);
                                //  console.log(snapshot.val());
                                  if(snapshot.val() === null ){
                                //     console.log("evento no guardada");
                                      data.guardado = false ;
                                  }else{
                                //    console.log("evento guardada");
                                      data.guardado  = true ;
                                  }
                                 });
                              //setea eventos 
                             this.itemRefNombre = this.af.object(this.departamentoApp+'/Municipios/' + data.uidMunicipio, { preserveSnapshot: true });
                            this.itemRefNombre.subscribe(snapshot => {
                              
                                data.nombreMunicipio = snapshot.val().municipio; 
                            });
                              this.mostrarEventos =true;

                               this.itemRefNombreCategoria = this.af.object(this.departamentoApp+'/CategoriasEventos/' + data.uidCategoriaEvento, { preserveSnapshot: true });
                              this.itemRefNombreCategoria.subscribe(snapshot => {
                                
                                  data.nombreCategoria = snapshot.val().nombre; 
                              });
                              let infoData = data.fechaInicio.split("-") ;
                              data.diaEvento = infoData[1]; 
                              data.mesEvento = this.obtenerMes(infoData[2]);
                              this.eventos.push(data);
                            });
                           // console.log("key =" + snapshot1.key);
                            //console.log("Value =" + JSON.stringify(snapshot1.val()));

              });
            });



            //subjectEvento.next(newMunicipio.toString());
          //  subjectEvento.next(this.idMunicipio);
    
          //fin consulta de eventos

                     //consulta de noticias 


           // console.log("id municipio " +newMunicipio);
            //arreglo de municipios
            this.noticias=[];
            let subjectNoticias = new Subject();
            const queryObservableNoticias = this.af.list(this.departamentoApp+'/Noticias', {
              query: {
                orderByChild: 'uidMunicipio',
                equalTo : subjectNoticias
              }
            });
            //manjo de respuesta 
            // subscribe to changes
            queryObservableNoticias.subscribe(queriedItems => {
          //    console.log(JSON.stringify(queriedItems));
              //alamaenca resultado del filtro en arreglo 
              this.filtroMunicipiosNoticias = queriedItems;
              console.log("noticias ????????");
              console.log(JSON.stringify(queriedItems));
              //recorre arreglo para setelartl en la lista 
              this.filtroMunicipiosNoticias.forEach((item, index) => {
                //         console.log("item municipio = " + JSON.stringify(item));

                //let dataI = item;

        //        this.eventos.push(dataI);
                         let data =item;
                           // console.log("uid creador = " + data.uidCreador);
                            //consulta informacion del creador del evento
                            this.itemRef = this.af.object(this.departamentoApp+'/userProfile/' + data.uidCreador, { preserveSnapshot: true });
                            this.itemRef.subscribe(snapshot => {
                              //console.log(action.type);

                           //   console.log("llave" + snapshot.key)
                             // console.log('data ' + JSON.stringify(snapshot.val()));
                              data.urlImagenCreador = snapshot.val().photoUrl;
                              data.nombreUsuario = snapshot.val().nombreUsuario;
                              data.index = index;
                              console.log("noticias vericia guardado *********************@@@@@@@@@@@@@@")
                              console.log(this.departamentoApp+'/NoticiasGuardadasUsuario/'+this.perfil.uid+"/"+ data.uid);
                              //verifica si esa noticia esta guardada  como favorita 
                               let infoGuardado = this.af.object(this.departamentoApp+'/NoticiasGuardadasUsuario/'+this.perfil.uid+"/"+ data.uid, { preserveSnapshot: true });
                                infoGuardado.subscribe(snapshot => {
                              //    console.log("entra consulta si guardo evento ");
                                //  console.log(snapshot.key);
                                //  console.log(snapshot.val());
                                  if(snapshot.val() === null ){
                                //     console.log("evento no guardada");
                                      data.guardado = false ;
                                  }else{
                                //    console.log("evento guardada");
                                      data.guardado  = true ;
                                  }
                                 });
                              //setea eventos 
                              this.mostrarNoticias =true;
                            this.itemRefNombre = this.af.object(this.departamentoApp+'/Municipios/' + data.uidMunicipio, { preserveSnapshot: true });
                            this.itemRefNombre.subscribe(snapshot => {
                              
                                data.nombreMunicipio = snapshot.val().municipio; 
                            });
                              this.noticias.push(data);
                            });
                           // console.log("key =" + snapshot1.key);
                            //console.log("Value =" + JSON.stringify(snapshot1.val()));

              });
            });


            subjectNoticias.next(parseInt(this.idMunicipio +1 ));

          //fin consult de noticias 

           // sitios de interes 
            this.sitiosInteres = [];
             let subjectSitios = new Subject();
            const queryObservableSitios = this.af.list(this.departamentoApp+'/SitiosInteres', {
              query: {
                orderByChild: 'uidMunicipio',
                equalTo : subjectSitios
              }
            });

            //manjo de respuesta 
            // subscribe to changes
            queryObservableSitios.subscribe(queriedItems => {

                this.filtroMunicipiosSitios = queriedItems;
                    this.filtroMunicipiosSitios.forEach((item, index) => {
                      let data = item;
                      // console.log("uid creador = " + data.uidCreador);
                      console.log("Sitios interes");
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
                         let infoGuardado = this.af.object(this.departamentoApp+'/SitiosGuardadosUsuario/'+this.perfil.uid+"/"+ data.uid, { preserveSnapshot: true });
                          infoGuardado.subscribe(snapshot => {
                            console.log("entra consulta si guardo Sitios  ");
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
                        //setea eventos 
                        this.mostrarSitios =true;
                        this.itemRefNombre = this.af.object(this.departamentoApp+'/Municipios/' + data.uidMunicipio, { preserveSnapshot: true });
                            this.itemRefNombre.subscribe(snapshot => {
                              
                                data.nombreMunicipio = snapshot.val().municipio; 
                            });
                        this.sitiosInteres.push(data);
                      });
                    //  console.log("key =" + snapshot1.key);
                    //  console.log("Value =" + JSON.stringify(snapshot1.val()));
                    });



            });

             subjectSitios.next(parseInt(this.idMunicipio));
           //finsitios de interes 



/*
                //consulta de sisitios de interes 
                           //recibe informacion de los eventos
                this.af.list(this.departamentoApp+'/SitiosInteres/', { preserveSnapshot: true })
                  .subscribe(snapshots => {
                    //reinicializa eventos
                    this.sitiosInteres = [];
                    //recorre resultado de la consulta 
                    snapshots.forEach(snapshot1 => {
                      let data = snapshot1.val();
                      // console.log("uid creador = " + data.uidCreador);
                      console.log("Sitios interes");
                      //consulta informacion del creador del evento
                      this.itemRef = this.af.object(this.departamentoApp+'/userProfile/' + data.uidCreador, { preserveSnapshot: true });
                      this.itemRef.subscribe(snapshot => {
                        //console.log(action.type);

                        console.log("llave" + snapshot.key)
                        console.log('data ' + JSON.stringify(snapshot.val()));
                        data.urlImagenCreador = snapshot.val().photoUrl;
                        data.nombreUsuario = snapshot.val().nombreUsuario;
                        data.index = snapshot1.key;

                         //verifica si esa noticia esta guardada  como favorita 
                         let infoGuardado = this.af.object(this.departamentoApp+'/SitiosGuardadosUsuario/'+this.perfil.uid+"/"+ snapshot1.key, { preserveSnapshot: true });
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
                        //setea eventos 
                        this.sitiosInteres.push(data);
                      });
                      console.log("key =" + snapshot1.key);
                      console.log("Value =" + JSON.stringify(snapshot1.val()));
                    });
                  });

*/
          });


      });

  }


  guardarMunicipio(municipio){
   municipio = this.municipio;
    //console.log("id  = " +  municipio.index);
    //console.log("id  perfil= " +  this.municipio.uid);
   let id = this.municipio.id-1; 
   console.log("id = " + id );
     if(municipio.guardado){
       const itemsTattoo = this.af.object(this.departamentoApp+'/MunicipiosGuardadosUsuario/'+this.perfil.uid+"/"+id);
        itemsTattoo.remove();
        municipio.guardado = false;
        //this.tatuajeGuardado = false ;
     }else{
       const itemsTattoo = this.af.object(this.departamentoApp+'/MunicipiosGuardadosUsuario/'+this.perfil.uid+"/"+id);
       const promise1 =   itemsTattoo.set(
                                     {
                                        municipio : municipio,
                                        uid : id          
                                     }
                                   );
        promise1.then(_ =>
          console.log('Sitio guardaa !!!')


        ).catch(err => console.log(err, 'You dont have access!'));
       // this.tatuajeGuardado = true;
       municipio.guardado = true;


     }

  }


   guardarSitio(sitio){
 
    console.log("id  = " +  sitio.index);
    console.log("id  perfil= " +  this.perfil.uid);

     if(sitio.guardado){
       const itemsTattoo = this.af.object(this.departamentoApp+'/SitiosGuardadosUsuario/'+this.perfil.uid+"/"+sitio.uid);
        itemsTattoo.remove();
        sitio.guardado = false;
        //this.tatuajeGuardado = false ;
     }else{
       const itemsTattoo = this.af.object(this.departamentoApp+'/SitiosGuardadosUsuario/'+this.perfil.uid+"/"+sitio.uid);
       const promise1 =   itemsTattoo.set(
                                     {
                                        sitio : sitio,
                                        uid : sitio.index          
                                     }
                                   );
        promise1.then(_ =>
          console.log('Sitio guardaa !!!')


        ).catch(err => console.log(err, 'You dont have access!'));
       // this.tatuajeGuardado = true;
       sitio.guardado = true;


     }

  }

openSitioInteres(sitio){


   this.navCtrl.push(DetalleSitioInteresPage , {sitioInfo : sitio}); 

  }


    guardarNoticia(noticia){
 
    console.log("id  = " +  noticia.index);
    console.log("id  perfil= " +  this.perfil.uid);

     if(noticia.guardado){
       const itemsTattoo = this.af.object(this.departamentoApp+'/NoticiasGuardadasUsuario/'+this.perfil.uid+"/"+noticia.uid);
        itemsTattoo.remove();
        noticia.guardado = false;
        //this.tatuajeGuardado = false ;
     }else{
       const itemsTattoo = this.af.object(this.departamentoApp+'/NoticiasGuardadasUsuario/'+this.perfil.uid+"/"+noticia.uid);
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

   guardarEvento(evento){
 
    console.log("id  = " +  evento.index);
    console.log("id  perfil= " +  this.perfil.uid);

     if(evento.guardado){
       const itemsTattoo = this.af.object(this.departamentoApp+'/EventosGuardadosUsuario/'+this.perfil.uid+"/"+evento.uid);
        itemsTattoo.remove();
        evento.guardado = false;
        //this.tatuajeGuardado = false ;
     }else{
       const itemsTattoo = this.af.object(this.departamentoApp+'/EventosGuardadosUsuario/'+this.perfil.uid+"/"+evento.uid);
       const promise1 =   itemsTattoo.set(
                                     {
                                        evento : evento,
                                        uid : evento.index          
                                     }
                                   );
        promise1.then(_ =>
          console.log('Noticia guardaa !!!')


        ).catch(err => console.log(err, 'You dont have access!'));
       // this.tatuajeGuardado = true;
       evento.guardado = true;


     }

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

  //funcon que envia a la pantalla de detalle de evento con su respecitva inv
  detalleEvento(urlImagen, tituloEvento, nombreCreador, imagenCreador, descripcion, uidNoticia, fechaInicio, fechaFin,fotos) {
    console.log("url imagen = " + urlImagen);
    console.log("titulo noticia = " + tituloEvento);
    console.log("nombre creador = " + nombreCreador);
    console.log("imagen creador = " + imagenCreador);
    console.log("descripcion = " + descripcion);
    console.log("uid noticia = " + uidNoticia);
    //envia a la pantalla  
    this.navCtrl.push(DetalleEventoPage, { urlImagen: urlImagen, tituloEvento: tituloEvento, nombreCreador: nombreCreador, descripcion: descripcion, imagenCreador: imagenCreador, uidNoticia: uidNoticia, fechaInicio: fechaInicio, fechaFin: fechaFin ,fotos:fotos});
  }





  ionViewDidLoad() {
    console.log('ionViewDidLoad MunicipiosPage');
  }

  zoom(url){
    this.photoViewer.show(url ,'', {share: false});
  }

   obtenerMes(numero){
   console.log("entra  numero mes ");
    console.log(numero);
     if(numero === '01'){
       return 'Ene';
     }
      if(numero === '02'){
       return 'Feb';
     }
      if(numero === '03'){
       return 'Mar';
     }
      if(numero === '04'){
       return 'Abr';
     }
      if(numero === '05'){
       return 'May';
     }
      if(numero === '06'){
       return 'Jun';
     }
      if(numero === '07'){
       return 'Jul';
     }
      if(numero === '08'){
       return 'Ago';
     }
      if(numero === '09'){
       return 'Sep';
     }
      if(numero === '10'){
       return 'Oct';
     }
      if(numero === '11'){
       return 'Nov';
     }
      if(numero === '12'){
       return 'Dic';
     }


 }

}
