import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { Subject } from 'rxjs/Subject';
import { MunicipiosPage } from '../../pages/municipios/municipios';
import { Storage } from '@ionic/storage';
import { DetalleSitioInteresPage } from '../../pages/detalle-sitio-interes/detalle-sitio-interes';
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
  constructor(public navCtrl: NavController, public navParams: NavParams ,public af: AngularFireDatabase ,public storage:Storage) {
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DepartamentoPage');
  }

  ionViewWillEnter(){
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

               //recibe informacion de los eventos
                this.af.list(this.departamentoApp+'/Eventos/', { preserveSnapshot: true })
                  .subscribe(snapshots => {
                    //reinicializa eventos
                    this.eventos = [];
                    //recorre resultado de la consulta 
                    snapshots.forEach(snapshot1 => {
                      let data = snapshot1.val();
                      // console.log("uid creador = " + data.uidCreador);
                      console.log("EVENTOS");
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
                         let infoGuardado = this.af.object(this.departamentoApp+'/EventosGuardadosUsuario/'+this.perfil.uid+"/"+ snapshot1.key, { preserveSnapshot: true });
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
                        this.eventos.push(data);
                      });
                      console.log("key =" + snapshot1.key);
                      console.log("Value =" + JSON.stringify(snapshot1.val()));
                    });
                  });

                  //consulta la informacion de tdas las noticias 
                this.af.list(this.departamentoApp+'/Noticias/' ,{ preserveSnapshot: true})
                    .subscribe(snapshots=>{
                        this.noticias = [];
                        snapshots.forEach(snapshot1 => {
                         let data = snapshot1.val();
                         //console.log("uid creador = " + data.uidCreador);
                         console.log("NOTICIAS");
                              this.itemRefNoticias = this.af.object(this.departamentoApp+'/userProfile/'+data.uidCreador,  { preserveSnapshot: true });
                              this.itemRefNoticias.subscribe(snapshot => {
                                //console.log(action.type);
                                console.log("llave" + snapshot.key)
                                console.log('data ' + JSON.stringify(snapshot.val()));
                                data.urlImagenCreador  = snapshot.val().photoUrl;
                                data.nombreUsuario = snapshot.val().nombreUsuario;
                                data.index =  snapshot1.key ;
                                //verifica si esa noticia esta guardada  como favorita 
                                 let infoGuardado = this.af.object(this.departamentoApp+'/NoticiasGuardadasUsuario/'+this.perfil.uid+"/"+ snapshot1.key, { preserveSnapshot: true });
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


                                console.log("add noticia");
                                this.noticias.push(data);
                              });
                         console.log("key ="+snapshot1.key);
                         console.log("Value ="+ JSON.stringify(snapshot1.val()));
                        });
                    });



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


          });
        
      },
      error => {
        //si no esta guardado envia a la pagina de login
        console.error("error = " + error);
        //this.navCtrl.push(InicioSesionPage);
      }
      );

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



  onSelectMunicipio (municipio){
    console.log("Municipio info" + this.uidMunicipio);

    this.navCtrl.push(MunicipiosPage, {municipioInfo : this.uidMunicipio});
  }

  openSitioInteres(sitio){


   this.navCtrl.push(DetalleSitioInteresPage , {sitioInfo : sitio}); 

  }

}
