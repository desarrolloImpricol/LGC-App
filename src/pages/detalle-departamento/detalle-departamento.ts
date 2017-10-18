import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DetalleDepartamentoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalle-departamento',
  templateUrl: 'detalle-departamento.html',
})
export class DetalleDepartamentoPage {
	nombreDepartamento :any;
  constructor(public navCtrl: NavController, public navParams: NavParams ) {

  	this.nombreDepartamento = this.navParams.data.nombreDepartamento;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleDepartamentoPage');
  }

}
