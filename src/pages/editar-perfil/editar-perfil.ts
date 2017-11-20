import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';
/**
 * Generated class for the EditarPerfilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editar-perfil',
  templateUrl: 'editar-perfil.html',
})
export class EditarPerfilPage {
  municipios:any ; 
  departamentoApp :any = "/Cundinamarca";
  filtroMunicipios :any;
  item :any ;
  perfil:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams ,public af: AngularFireDatabase , public storage :Storage) {

  this.storage.get('userData')
      .then(
      data => {
           console.log(JSON.stringify(data)),
          console.log("finaliza");
        //existe usuario
     
          console.log(data.uid);
            this.item = this.af.object(this.departamentoApp+'/userProfile/' + data.uid, { preserveSnapshot: true });
          	this.item.subscribe(snapshot => {
	            console.log(snapshot.key);
	            console.log(snapshot.val());
	            this.perfil = snapshot.val();
	            this.perfil.uid =snapshot.key ;
       		 });


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
  }

  validarActualizar(){
  	 if (this.perfil.nombreUsuario === "" || this.perfil.nombreUsuario === null || this.perfil.nombreUsuario === undefined) {
      alert("Falta nombre de usuario");
      return;
    }
    this.editarPerfil();


  }


  editarPerfil(){

  	  if(this.perfil.numeroTelefono  === undefined){
  	  	 this.perfil.numeroTelefono  = " " ;
  	  }
  	  if(this.perfil.numeroCelular  === undefined){
  	  	 this.perfil.numeroCelular  = " " ;
  	  }
  	  if(this.perfil.sitioWeb  === undefined){
  	  	 this.perfil.sitioWeb  = " " ;
  	  }
  	  if(this.perfil.direccion  === undefined){
  	  	 this.perfil.direccion  = " " ;
  	  }
  	  if(this.perfil.numeroTelefono  === undefined){
  	  	 this.perfil.descripcion  = " " ;
  	  }
      firebase.database().ref(this.departamentoApp+'/userProfile').child(this.perfil.uid)
      .update(
     	 { 
      		nombreUsuario: this.perfil.nombreUsuario ,
      		email2:this.perfil.email2, 
      		numeroTelefono:this.perfil.numeroTelefono ,
      		numeroCelular:this.perfil.numeroCelular ,
      		sitioWeb :this.perfil.sitioWeb ,
      		direccion :this.perfil.direccion ,
      		descripcion :this.perfil.descripcion,
      		uidMunicipio:this.perfil.uidMunicipio

      	}
      );
      alert("Perfil actualizado");

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditarPerfilPage');
  }

}
