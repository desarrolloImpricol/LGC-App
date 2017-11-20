import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DetalleSitioInteresPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalle-sitio-interes',
  templateUrl: 'detalle-sitio-interes.html',
})
export class DetalleSitioInteresPage {
  sitio:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams) {

  		console.log("data  sitio "  + this.navParams.data.sitioInfo);
  		console.log(JSON.stringify(this.navParams.data.sitioInfo));
       this.sitio = this.navParams.data.sitioInfo ; 
  	//this.municipio = [];
    
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleSitioInteresPage');
  }

}
