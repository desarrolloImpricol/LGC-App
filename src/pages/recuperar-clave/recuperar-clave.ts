import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';

/**
 * Generated class for the RecuperarClavePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recuperar-clave',
  templateUrl: 'recuperar-clave.html',
})
export class RecuperarClavePage {
  email :any ;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecuperarClavePage');
  }


  resetPassword(): firebase.Promise<void> {
    return firebase.auth().sendPasswordResetEmail(this.email.trim()).then( newUser => {

        alert("Email enviado");
        this.navCtrl.pop();
      }).catch((_error) => {
                    console.log("Error!");
                    let erroInfo = JSON.stringify(_error) ;
                    console.log( JSON.stringify(_error));
                    console.log(_error.message);

                    if(_error.message === 'The email address is badly formatted.'){
                      alert("Formato email incorrecto");
                    }
                    if(_error.message === 'There is no user record corresponding to this identifier. The user may have been deleted.'){
                      alert("Email no existe");
                    }

      });
  }

}
