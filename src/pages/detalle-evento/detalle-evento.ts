import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Storage } from '@ionic/storage';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated'; 

/**
 * Generated class for the DetalleEventoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalle-evento',
  templateUrl: 'detalle-evento.html',
})
export class DetalleEventoPage {

  urlImagen: any;
  tituloEvento: any;
  nombreCreador: any;
  imagenCreador: any;
  descripcion: any;
  uidNoticia: any;
  fechaInicio: any;
  fechaFin: any;
  fotos :any ; 
  fotosNoticia :any =[]; 
  uidCliente:any ; 
  departamentoApp :any = "/Cundinamarca";
  guardado:any  = false ;
  objetoEvento:any;
  fuente :any;

  
  constructor(public navCtrl: NavController, public navParams: NavParams ,private photoViewer: PhotoViewer ,public storage:Storage ,public af: AngularFireDatabase ) {
  //  console.log("Nombre " + this.navParams.data.nombre);
    this.urlImagen = this.navParams.data.urlImagen;
    this.tituloEvento = this.navParams.data.tituloEvento;
    this.nombreCreador = this.navParams.data.nombreCreador;
    this.imagenCreador = this.navParams.data.imagenCreador;
    this.descripcion = this.navParams.data.descripcion;
    this.uidNoticia = this.navParams.data.uidNoticia;
    this.fechaInicio = this.navParams.data.fechaInicio;
    this.fechaFin = this.navParams.data.fechaFin;
    this.fotos = this.navParams.data.fotos;
    this.fotosNoticia.push(this.urlImagen);

   
  
    if(this.fotos != undefined){
        if(this.fotos.length > 0 ){
          this.fotos.forEach((item, index) => {
             console.log("fotos " + index );
             //console.log(JSON.stringify(item));
             console.log(JSON.stringify(item.urlImagen));
             //this.fotosNoticia.push(JSON.stringify(item.urlImagen));
             this.fotosNoticia.push(item.urlImagen);
             //this.subirImagenAdicional(uidEvento ,  index , item);      
          });
          this.fotosNoticia.forEach((item, index) => {
             console.log(item);
          });
        }
    }

    //veirfica si el usuario esta guardado
    this.storage.get('userData').then(data => {
      //  console.log(JSON.stringify(data)),
          console.log("entra user data ");
           this.uidCliente = data.uid ; 
              let infoGuardado = this.af.object(this.departamentoApp+'/EventosGuardadosUsuario/'+data.uid+"/"+this.uidNoticia, { preserveSnapshot: true });
              infoGuardado.subscribe(snapshot => {
                console.log("entra consulta si guardo evento ");
              //  console.log(snapshot.key);
              //  console.log(snapshot.val());
                if(snapshot.val() === null ){
                   console.log("evento no guardada");
                    this.guardado = false ;
                }else{
                  console.log("evento  guardada");
                    this.guardado  = true ;
                }
               });

        });

     

    let fuenteData = this.af.object(this.departamentoApp+'/Eventos/' + this.uidNoticia, { preserveSnapshot: true });
    fuenteData.subscribe(snapshot => {
      this.objetoEvento = snapshot.val();
      //this.fuente = snapshot.val().fuente; 
      //console.log("fuente noticia" + this.fuente);


    });


    console.log("Cantidad de fotos  = " + this.fotosNoticia.length );
     
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleEventoPage');
  }
   zoom(url){
    this.photoViewer.show(url ,'', {share: false});
  }

  guardarEvento(evento){
   console.log("entra a guardar");
    //console.log("id  = " +  evento.index);
    //console.log("id  perfil= " +  this.perfil.uid);

     if(this.guardado){
       const itemsTattoo = this.af.object(this.departamentoApp+'/EventosGuardadosUsuario/'+this.uidCliente+"/"+this.uidNoticia);
        itemsTattoo.remove();
        this.guardado = false;
        //this.tatuajeGuardado = false ;
     }else{

       const itemsTattoo = this.af.object(this.departamentoApp+'/EventosGuardadosUsuario/'+this.uidCliente+"/"+this.uidNoticia);
       const promise1 =   itemsTattoo.set(
                                     {
                                        evento : this.objetoEvento,
                                        uid : this.uidNoticia          
                                     }
                                   );
        promise1.then(_ =>
          console.log('Noticia guardaa !!!')


        ).catch(err => console.log(err, 'You dont have access!'));
       // this.tatuajeGuardado = true;
       this.guardado = true;


     }

  }

}
