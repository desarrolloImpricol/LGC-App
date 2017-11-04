import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CrearNoticiaPage } from '../../pages/crear-noticia/crear-noticia';
import { CrearEventoPage } from '../../pages/crear-evento/crear-evento';
import { CrearAmarillaPage } from '../../pages/crear-amarilla/crear-amarilla';

/**
 * Generated class for the PublicarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-publicar',
  templateUrl: 'publicar.html',
})
export class PublicarPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PublicarPage');
  }

  irCrearNoticias() {
    this.navCtrl.push(CrearNoticiaPage);
  }

  irCreaEventos() {
    this.navCtrl.push(CrearEventoPage);
  }
  irAmarilla() {
    this.navCtrl.push(CrearAmarillaPage);

  }

}
