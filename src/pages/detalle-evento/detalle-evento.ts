import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log("Nombre " + this.navParams.data.nombre);
    this.urlImagen = this.navParams.data.urlImagen;
    this.tituloEvento = this.navParams.data.tituloEvento;
    this.nombreCreador = this.navParams.data.nombreCreador;
    this.imagenCreador = this.navParams.data.imagenCreador;
    this.descripcion = this.navParams.data.descripcion;
    this.uidNoticia = this.navParams.data.uidNoticia;
    this.fechaInicio = this.navParams.data.fechaInicio;
    this.fechaFin = this.navParams.data.fechaFin;
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleEventoPage');
  }

}
