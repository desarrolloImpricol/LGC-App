import { Component } from '@angular/core';
import { NavController, Platform , MenuController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { CundiAmarillasPage } from '../../pages/cundi-amarillas/cundi-amarillas';
import { CundiEmpleosPage } from '../../pages/cundi-empleos/cundi-empleos';
import { CundiEventosPage } from '../../pages/cundi-eventos/cundi-eventos';
import { CundiNoticiasPage } from '../../pages/cundi-noticias/cundi-noticias';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { LoginPage } from '../../pages/login/login';
import { InicioSesionPage } from '../../pages/inicio-sesion/inicio-sesion';
import { Deeplinks } from '@ionic-native/deeplinks';
import { PublicarPage } from '../../pages/publicar/publicar';
import { Storage } from '@ionic/storage';
import { DepartamentoPage } from '../../pages/departamento/departamento';
import { ColombiaPage } from '../../pages/colombia/colombia';
import { CrearNoticiaPage } from '../../pages/crear-noticia/crear-noticia';
import { CrearEventoPage } from '../../pages/crear-evento/crear-evento';
import { Subject } from 'rxjs/Subject';
import { BusquedaAvanzadaPage } from '../../pages/busqueda-avanzada/busqueda-avanzada';
import { DetalleNoticiaPage } from '../../pages/detalle-noticia/detalle-noticia';
import { DetalleEventoPage } from '../../pages/detalle-evento/detalle-evento';
import { Media, MediaObject } from '@ionic-native/media'; 
import { NativeAudio } from '@ionic-native/native-audio';
import { PerfilClientePage } from '../../pages/perfil-cliente/perfil-cliente';
import { FavoritosPage } from '../../pages/favoritos/favoritos';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //info de perfil
  perfil: any = [];
  departamentos:any;
  municipios:any;
  filtroMunicipios:any;
  uidDepartamento:any;
  eventos :any ; 
  itemRef:any ;
  noticias:any = [] ;
  itemRefNoticias:any;
  departamentoApp :any = "/Cundinamarca";
  mostrarBusqueda :any =false ;
  categoriasEventos:any;
  queBusca :any ; 
  mostrarMenuPerfil :any = false  ;
  dondebusca:any;
  itemRefNombre:any;
  itemRefNombreCategoria :any ; 
 // file:MediaObject;
  constructor(public navCtrl: NavController, public af: AngularFireDatabase, public secureStorage: SecureStorage, private deeplinks: Deeplinks, public platform: Platform, public storage: Storage ,private media: Media ,private nativeAudio: NativeAudio,public menuCtrl :MenuController) {

 


    this.queBusca  = '-'; 
   //this.nativeAudio.preloadSimple('uniqueId12', 'assets/sounds/inicio1.mp3');
    //this.platform = this.platform;

     //acceso a links  con enlaces profundos
    this.deeplinks.route({
      '/noticias': CundiNoticiasPage,
      '/eventos': CundiEventosPage,
      '/empleos': CundiEmpleosPage,
      '/amarillas': CundiAmarillasPage
    }).subscribe((match) => {
      // match.$route - the route we matched, which is the matched entry from the arguments to route()
      // match.$args - the args passed in the link
      // match.$link - the full link data
      console.log('Successfully matched route', match);
      //console.log("ruta = " + match.$route );
      //console.log("link = " + JSON.stringify(match.$link ));
      //console.log("************path***********" + match.$link.path);
      if (match.$link.path === "/noticias") {
        this.navCtrl.push(CundiNoticiasPage);
      }
      if (match.$link.path === "/eventos") {
        this.navCtrl.push(CundiEventosPage);
      }
      if (match.$link.path === "/empleos") {
        this.navCtrl.push(CundiEmpleosPage);
      }
      if (match.$link.path === "/amarillas") {
        this.navCtrl.push(CundiAmarillasPage);
      }

      //console.log("ruta = " + match.$route );
    }, (nomatch) => {
      // nomatch.$link - the full link data
      console.error('Got a deeplink that didn\'t match', nomatch);
    });



  }


    //funcion que  se llama cuando se elecciona un departamento
  onSelecDepartamento() {
    
        //reinicializa el arreglo demunicipios
      this.municipios = [];
      let subject = new Subject();
      const queryObservable = this.af.list(this.departamentoApp+'/Municipios', {
        query: {
          orderByKey: true,


        }
      });
    

  }

  //elimina los datos guardados del usuario
  cerrarSesion() {
    this.storage.remove('userData')
      .then(
      data => {
        console.log("eliminado = " + data);
        //    this.platform.exitApp();
        //luego de eliminado envia a pantalla de  login
        this.navCtrl.push(InicioSesionPage);
      },
      error => console.error(error)
      );

  }
  item: any;
  //evento que se ejecuta cada vez que se ingres a ala pantalla
  ionViewWillEnter() {

          //veirfica si el usuario esta guardado
    this.storage.get('userData')
      .then(
      data => {
        console.log(JSON.stringify(data)),
          console.log("finaliza");
        //existe usuario
        if (data != null) {
          console.log(data.uid);
          this.item = this.af.object(this.departamentoApp+'/userProfile/' + data.uid, { preserveSnapshot: true });
          this.item.subscribe(snapshot => {
            console.log(snapshot.key);
            console.log(snapshot.val());
            this.perfil = snapshot.val();
            this.perfil.uid =snapshot.key ;

              //reinicializa el arreglo demunicipios
      this.eventos = [];
      let subject = new Subject();
      const queryObservable = this.af.list(this.departamentoApp+'/Eventos', {
        query: {
          orderByChild: 'disponible',
          equalTo : true,
          limitToLast :5 
          

        }
      });
      //manjo de respuesta 
      // subscribe to changes
      queryObservable.subscribe(queriedItems => {
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


                          //setea  un valor de inicio para la foto
            //this.perfil.photoUrl = "-";

             //consulta departamentos  
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

             this.af.list(this.departamentoApp+'/CategoriasEventos/', { preserveSnapshot: true })
              .subscribe(snapshots => {
                this.categoriasEventos = [];
                snapshots.forEach(snapshot1 => {
                  let data = snapshot1.val();
                  data.uid = snapshot1.key;
                  //   console.log("uid creador = " + data.uidCreador);
                  console.log("departamento key  =" + snapshot1.key);
                  console.log("departamento Value =" + JSON.stringify(snapshot1.val()));
                  this.categoriasEventos.push(data);
                });
              });

             


                this.onSelecDepartamento(); 

          });
        } else {
          this.navCtrl.push(InicioSesionPage);
        }
      },
      error => {
        //si no esta guardado envia a la pagina de login
        console.error("error = " + error);
        this.navCtrl.push(InicioSesionPage);
      }
    );
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
  //redireccion a colombia
  irColombia(){
    this.navCtrl.setRoot(DepartamentoPage);

  }
  //redirecciona a noticias
  irNoticias() {
    //this.navCtrl.setRoot(CundiNoticiasPage);
    this.navCtrl.setRoot(CundiNoticiasPage);
  }
  //redirecciona a eventos
  irEventos() {
    //this.navCtrl.push(CundiEventosPage);
    this.navCtrl.setRoot(CundiEventosPage);
  }
  //redireccion a empleos
  irEmpleos() {
    alert("Proximamente");
    //this.navCtrl.setRoot(CundiEmpleosPage);
  }
  //redireccion a amarillas
  irAmarillas() {
    alert("Proximamente");
    //this.navCtrl.setRoot(CundiAmarillasPage);
  }
  irPromociones(){
    alert("Proximamente");
  }
  //redireccion a publicar
  irPublicar() {
    this.navCtrl.setRoot(PublicarPage);
  }

  irCrearNoticias() {
    this.navCtrl.setRoot(CrearNoticiaPage);
  }

  irCreaEventos() {
    this.navCtrl.setRoot(CrearEventoPage);
  }

  irCrearNoticiasFab() {
    this.navCtrl.push(CrearNoticiaPage);
  }

  irCreaEventosFab() {
    this.navCtrl.push(CrearEventoPage);
  }


  irBusquedaAvanzada() {
    this.navCtrl.push(BusquedaAvanzadaPage);
  }
  irPerfilCliente() {

   //this.navCtrl.push(PerfilClientePage);
    this.navCtrl.setRoot(PerfilClientePage);
  }
  irFavoritos() {
    this.navCtrl.push(FavoritosPage);
  }


 playSonido(){
   console.log("play sonido");
       //this.file = this.media.create('/assets/sounds/inicio1.mp3');
    const file: MediaObject = this.media.create('./assets/sounds/inicio1.mp3');
     console.log("creado");
     // get file duration
    let duration = file.getDuration();
    console.log("duracion = " + duration);
    // to listen to plugin events:

    file.onStatusUpdate.subscribe(status => console.log(status)); // fires when file status changes

    file.onSuccess.subscribe(() => console.log('Action is successful'));

    file.onError.subscribe(error => console.log('Error!', JSON.stringify(error)));

    // play the file
    file.play();



 }

 file1:any ;
  audioPlay() {
    console.log("audio play");
   
   this.nativeAudio.play('uniqueId12', () => console.log('uniqueId1 is done playing'));

  }

  audioStop(){
    console.log("stop");
    //this.nativeAudio.stop('uniqueId1') ;
    
    this.nativeAudio.stop('uniqueId12');
  }
   
  openBusquedaMenu(){
    if(this.mostrarBusqueda){
       this.mostrarBusqueda = false ;
    }else{
       this.mostrarBusqueda = true ;
    }
  }

  openPerfilMenu(){
    if(this.mostrarMenuPerfil){
       this.mostrarMenuPerfil = false ;
    }else{
       this.mostrarMenuPerfil = true ;
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


  
  buscarMenu(){
    if(this.queBusca === 'noticias'){
      this.navCtrl.push(CundiNoticiasPage);
    }
    if(this.queBusca === 'eventos'){
      this.navCtrl.push(CundiEventosPage);
    }
  }



   busquedaAvanzada(){
  console.log("busqueda avanzada antes de if = " + this.dondebusca );  
   if(this.queBusca === 'noticias'){
     if(this.dondebusca === undefined || this.dondebusca === "" || this.dondebusca === null  ){
       this.navCtrl.setRoot(CundiNoticiasPage);
     }else{

       console.log("busqueda avanzada = " + this.dondebusca );  
       this.navCtrl.setRoot(CundiNoticiasPage , {uidMunicipio:this.dondebusca});
     }
      
      //this.menu.close();
    }
    if(this.queBusca === 'eventos'){
      if(this.dondebusca === undefined || this.dondebusca === "" || this.dondebusca === null  ){
        this.navCtrl.setRoot(CundiEventosPage);
      }else{
        console.log("busqueda avanzada = " + this.dondebusca );  
        this.navCtrl.setRoot(CundiEventosPage, {uidMunicipio:this.dondebusca});
      }      
      //this.menu.close();
    }


     
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
