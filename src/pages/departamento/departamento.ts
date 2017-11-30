import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { Subject } from 'rxjs/Subject';
import { MunicipiosPage } from '../../pages/municipios/municipios';
import { Storage } from '@ionic/storage';
import { DetalleSitioInteresPage } from '../../pages/detalle-sitio-interes/detalle-sitio-interes';
import { DetalleNoticiaPage } from '../../pages/detalle-noticia/detalle-noticia';
import { DetalleEventoPage } from '../../pages/detalle-evento/detalle-evento';
import { PhotoViewer } from '@ionic-native/photo-viewer';
//import { DireccionamientosProvider } from '../../providers/direccionamientos/direccionamientos';
/**
 * Generated class for the DepartamentoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-departamento',
  templateUrl: 'departamento.html',
})
export class DepartamentoPage {
 
 
departamentoApp :any = "/Cundinamarca";
item :any ;
dataDepartamento:any = [];
municipios:any = [];
filtroMunicipios :any = [];
uidMunicipio :any ;
noticias :any;
itemRef:any;
eventos:any;
itemRefNoticias:any;
perfil:any=[];
sitiosInteres :any ;
itemRefNombre:any;
itemRefNombreCategoria:any;
  constructor(public navCtrl: NavController, public navParams: NavParams ,public af: AngularFireDatabase ,public storage:Storage ,private photoViewer: PhotoViewer) {
            this.storage.get('userData')
      .then(
      data => {
        console.log(JSON.stringify(data)),
          console.log("finaliza");
        //existe usuario
     
          console.log(data.uid);
          this.item = this.af.object('/userProfile/' + data.uid, { preserveSnapshot: true });
          this.item.subscribe(snapshot => {
            console.log(snapshot.key);
            console.log(snapshot.val());
            this.perfil = snapshot.val();
            this.perfil.uid =snapshot.key ;

                            //  this.direccioamiento.setMessage("Cundinamarca");
                  this.item = this.af.object(this.departamentoApp+'/InformacionDepartamento' , { preserveSnapshot: true });
                        this.item.subscribe(snapshot => {
                          console.log("entra");
                          console.log(JSON.stringify(snapshot.val()));
                          this.dataDepartamento = snapshot.val() ;
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

                  

                  // trigger the query
                //  subject.next(this.uidDepartamento);

              //reinicializa el arreglo demunicipios
      this.eventos = [];
      //let subject = new Subject();
      const queryObservableEventos = this.af.list(this.departamentoApp+'/Eventos', {
        query: {
          orderByChild: 'disponible',
          equalTo : true,
          limitToLast :5 
          

        }
      });
      //manjo de respuesta 
      // subscribe to changes
      queryObservableEventos.subscribe(queriedItems => {
        console.log(JSON.stringify(queriedItems));
        //alamaenca resultado del filtro en arreglo 
        this.filtroMunicipios = queriedItems;
        //recorre arreglo para setelartl en la lista 
        this.eventos
        this.filtroMunicipios.forEach((item, index) => {
          //         console.log("item municipio = " + JSON.stringify(item));

          let data = item;

          this.itemRef = this.af.object(this.departamentoApp+'/userProfile/' + item.uidCreador, { preserveSnapshot: true });
          this.itemRef.subscribe(snapshot => {
            //console.log(action.type);

            console.log("llave" + snapshot.key)
            console.log('data ' + JSON.stringify(snapshot.val()));
            data.urlImagenCreador = snapshot.val().photoUrl;
            data.nombreUsuario = snapshot.val().nombreUsuario;
            data.index = item.uid;

             //verifica si esa noticia esta guardada  como favorita 
             let infoGuardado = this.af.object(this.departamentoApp+'/EventosGuardadosUsuario/'+this.perfil.uid+"/"+ item.uid, { preserveSnapshot: true });
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
                                  
                                    data.nombreMunicipio = snapshot.val().municipio; 
                                });

                this.itemRefNombreCategoria = this.af.object(this.departamentoApp+'/CategoriasEventos/' + data.uidCategoriaEvento, { preserveSnapshot: true });
                this.itemRefNombreCategoria.subscribe(snapshot => {
                  
                    data.nombreCategoria = snapshot.val().nombre; 
                });
                let infoData = data.fechaInicio.split("-") ;
                data.diaEvento = infoData[1]; 
                data.mesEvento = this.obtenerMes(infoData[2]);

            //setea eventos 
            this.eventos.push(data);
          });
        //  console.log("key =" + snapshot1.key);
        //  console.log("Value =" + JSON.stringify(snapshot1.val()));

         // this.municipios.push(dataI);
        });
      });


        //reinicializa el arreglo demunicipios
      this.noticias = [];
      let subjectNoticia = new Subject();
      const queryObservableNoticias = this.af.list(this.departamentoApp+'/Noticias', {
        query: {
          orderByChild: 'disponible',
          equalTo : true,
          limitToLast :5 
          

        }
      });
      //manjo de respuesta 
      // subscribe to changes
      queryObservableNoticias.subscribe(queriedItems => {

           console.log(JSON.stringify(queriedItems));
            //alamaenca resultado del filtro en arreglo 
            this.filtroMunicipios = queriedItems;
            //recorre arreglo para setelartl en la lista 
            this.filtroMunicipios.forEach((item, index) => {
                   let data = item;
             //console.log("uid creador = " + data.uidCreador);
                   console.log("NOTICIAS");
                        this.itemRefNoticias = this.af.object(this.departamentoApp+'/userProfile/'+data.uidCreador,  { preserveSnapshot: true });
                        this.itemRefNoticias.subscribe(snapshot => {
                          //console.log(action.type);
                          console.log("llave" + snapshot.key)
                          console.log('data ' + JSON.stringify(snapshot.val()));
                          let url = snapshot.val().photoUrl ; 
                          data.urlImagenCreador  = url;
                          data.nombreUsuario = snapshot.val().nombreUsuario;
                          data.index =  item.uid ;
                          //verifica si esa noticia esta guardada  como favorita 
                          //console.log("url="+this.departamentoApp+'/NoticiasGuardadasUsuario/'+this.perfil.uid+"/"+ snapshot1.key);
                           let infoGuardado = this.af.object(this.departamentoApp+'/NoticiasGuardadasUsuario/'+this.perfil.uid+"/"+ item.uid, { preserveSnapshot: true });
                            infoGuardado.subscribe(snapshot => {
                              console.log("entra consulta si guardo noticia ");
                            //  console.log(snapshot.key);
                            //  console.log(snapshot.val());
                              if(snapshot.val() === null ){
                                 console.log("noticia no guardada");
                                  data.guardado = false ;
                              }else{
                                console.log("noticia guardada");
                                  data.guardado  = true ;
                              }
                             });
                                this.itemRefNombre = this.af.object(this.departamentoApp+'/Municipios/' + data.uidMunicipio, { preserveSnapshot: true });
                                      this.itemRefNombre.subscribe(snapshot => {
                                        
                                          data.nombreMunicipio = snapshot.val().municipio; 
                                      });

                          console.log("add noticia");
                          this.noticias.push(data);
                        });
                 //  console.log("key ="+snapshot1.key);
                 //  console.log("Value ="+ JSON.stringify(snapshot1.val()));
            });




      })



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
                            this.itemRefNombre = this.af.object(this.departamentoApp+'/Municipios/' + data.uidMunicipio, { preserveSnapshot: true });
                            this.itemRefNombre.subscribe(snapshot => {
                              
                                data.nombreMunicipio = snapshot.val().municipio; 
                            });

                        //setea eventos 
                        this.sitiosInteres.push(data);
                      });
                      console.log("key =" + snapshot1.key);
                      console.log("Value =" + JSON.stringify(snapshot1.val()));
                    });
                  });


          });
        
      },
      error => {
        //si no esta guardado envia a la pagina de login
        console.error("error = " + error);
        //this.navCtrl.push(InicioSesionPage);
      }
      );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DepartamentoPage');
  }

  ionViewWillEnter(){
  

  }

   guardarEvento(evento){
 
    console.log("id  = " +  evento.index);
    console.log("id  perfil= " +  this.perfil.uid);

     if(evento.guardado){
       const itemsTattoo = this.af.object(this.departamentoApp+'/EventosGuardadosUsuario/'+this.perfil.uid+"/"+evento.index);
        itemsTattoo.remove();
        evento.guardado = false;
        //this.tatuajeGuardado = false ;
     }else{
       const itemsTattoo = this.af.object(this.departamentoApp+'/EventosGuardadosUsuario/'+this.perfil.uid+"/"+evento.index);
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


  guardarSitio(sitio){
 
    console.log("id  = " +  sitio.index);
    console.log("id  perfil= " +  this.perfil.uid);

     if(sitio.guardado){
       const itemsTattoo = this.af.object(this.departamentoApp+'/SitiosGuardadosUsuario/'+this.perfil.uid+"/"+sitio.index);
        itemsTattoo.remove();
        sitio.guardado = false;
        //this.tatuajeGuardado = false ;
     }else{
       const itemsTattoo = this.af.object(this.departamentoApp+'/SitiosGuardadosUsuario/'+this.perfil.uid+"/"+sitio.index);
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



  onSelectMunicipio (municipio){
    console.log("Municipio info" + this.uidMunicipio);

    this.navCtrl.push(MunicipiosPage, {municipioInfo : this.uidMunicipio});
  }

  openSitioInteres(sitio){


   this.navCtrl.push(DetalleSitioInteresPage , {sitioInfo : sitio}); 

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
