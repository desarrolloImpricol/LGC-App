import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log("Nombre " + this.navParams.data.nombre);
    this.urlImagen =  this.navParams.data.urlImagen ;
    this.tituloNoticia = this.navParams.data.tituloNoticia;
    this.nombreCreador =  this.navParams.data.nombreCreador;
    this.imagenCreador =  this.navParams.data.imagenCreador;
    this.descripcion=  this.navParams.data.descripcion;
    this.uidNoticia = this.navParams.data.uidNoticia;
    this.fechaCreacion = this.navParams.data.fechaCreacion;
    
  }






  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleNoticiaPage');
  }

}
