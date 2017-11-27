import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the DetalleNoticiaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.s
 */

@IonicPage()
@Component({
  selector: 'page-detalle-noticia',
  templateUrl: 'detalle-noticia.html',
})
export class DetalleNoticiaPage {

  urlImagen :any;
  tituloNoticia:any;
  nombreCreador:any;
  imagenCreador:any;
  descripcion:any;
  uidNoticia:any;
  fechaCreacion:any ; 
  fotos:any ;
  fotosNoticia:any = [];
  departamentoApp :any = "/Cundinamarca";
  fuente:any ; 
  guardado :any  = false ; 
  uidCliente : any ; 
  objetoNoticia :any ; 
  constructor(public navCtrl: NavController, public navParams: NavParams,public af: AngularFireDatabase,private photoViewer: PhotoViewer ,public storage:Storage ) {



    console.log("Nombre " + this.navParams.data.nombre);
    this.urlImagen =  this.navParams.data.urlImagen ;
    this.tituloNoticia = this.navParams.data.tituloNoticia;
    this.nombreCreador =  this.navParams.data.nombreCreador;
    this.imagenCreador =  this.navParams.data.imagenCreador;
    this.descripcion=  this.navParams.data.descripcion;
    this.uidNoticia = this.navParams.data.uidNoticia;
    this.fechaCreacion = this.navParams.data.fechaCreacion;
    this.fotos = this.navParams.data.fotos;
    this.fotosNoticia.push(this.urlImagen);
    console.log("fotos c valor en detalle = " + this.fotos) ;


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
          console.log("finaliza");
           this.uidCliente = data.uid ; 

              let infoGuardado = this.af.object(this.departamentoApp+'/NoticiasGuardadasUsuario/'+data.uid+"/"+this.uidNoticia, { preserveSnapshot: true });
              infoGuardado.subscribe(snapshot => {
                console.log("entra consulta si guardo noticia ");
              //  console.log(snapshot.key);
              //  console.log(snapshot.val());
                if(snapshot.val() === null ){
                   console.log("snoticia no guardada");
                    this.guardado = false ;
                }else{
                  console.log("niticia  guardada");
                    this.guardado  = true ;
                }
               });

        });

     

    let fuenteData = this.af.object(this.departamentoApp+'/Noticias/' + this.uidNoticia, { preserveSnapshot: true });
    fuenteData.subscribe(snapshot => {
      this.objetoNoticia = snapshot.val();
      this.fuente = snapshot.val().fuente; 
      console.log("fuente noticia" + this.fuente);


    });

    
  }


  zoom(url){
    this.photoViewer.show(url ,'', {share: false});
  }



  guardarNoticia(noticia){
 
    //console.log("id  = " +  noticia.index);
    //console.log("id  perfil= " +  this.perfil.uid);

     if(this.guardado){
       const itemsTattoo = this.af.object(this.departamentoApp+'/NoticiasGuardadasUsuario/'+this.uidCliente+"/"+this.uidNoticia);
        itemsTattoo.remove();
        this.guardado = false;
        //this.tatuajeGuardado = false ;
     }else{
       const itemsTattoo = this.af.object(this.departamentoApp+'/NoticiasGuardadasUsuario/'+this.uidCliente+"/"+this.uidNoticia);
       const promise1 =   itemsTattoo.set(
                                     {
                                        noticia : this.objetoNoticia,
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


  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleNoticiaPage');
  }

}
