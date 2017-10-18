import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Subject } from 'rxjs/Subject';
import { DetalleDepartamentoPage } from '../../pages/detalle-departamento/detalle-departamento';

/**
 * Generated class for the ColombiaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-colombia',
  templateUrl: 'colombia.html',
})
export class ColombiaPage {
   departamentos:any =[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public af:AngularFireDatabase) {

  	/*this.af.list('/Colombia/', { preserveSnapshot: true })
      .subscribe(snapshots => {
        this.departamentos = [];
        snapshots.forEach(snapshot1 => {
          let data = snapshot1.val();
          data.uid = snapshot1.key;
          //   console.log("uid creador = " + data.uidCreador);
          console.log("departamento key  =" + snapshot1.key);
          console.log("departamento Value =" + JSON.stringify(snapshot1.val()));
          this.departamentos.push(data);
        });
      });*/
    const subject = new Subject();
    const queryObservable = this.af.list('/Colombia', {
      query: {
        orderByChild: 'id',
        //startAt: 0,
        limitToFirst: 5,
        //limitToLast: finI,
       // equalTo: subject

      }
    });

    // subscribe to changes
    //this.tatuajesArtistas = [];
    queryObservable.subscribe(queriedItems => {
      //console.log("tataujes de artista");
      //console.log(queriedItems);
      //console.log(JSON.stringify(queriedItems));
      this.filtro2 = queriedItems;
      this.filtro2.forEach((item, index) => {
        console.log("agregar foto ");
        this.departamentos.push(item);
      });


      //this.tatuajesArtistas.reverse();
    });



  }


 
  
  finFoto: any = 3;
  filtro2: any;
  cargarMasDepartamentos(infiniteScroll) {

    console.log("entra scroll");
    let finF = this.finFoto;
    
    

    const subject = new Subject();
    const queryObservable = this.af.list('/Colombia', {
      query: {
        orderByChild: 'id',
        //startAt: 0,
        limitToFirst: finF,
        //limitToLast: finI,
       // equalTo: subject

      }
    });

    // subscribe to changes
    //this.tatuajesArtistas = [];

    queryObservable.subscribe(queriedItems => {
      //console.log("tataujes de artista");
      //console.log(queriedItems);
      //console.log(JSON.stringify(queriedItems));
      this.filtro2 = queriedItems;
      this.departamentos = [];
      this.filtro2.forEach((item, index) => {
        console.log("agregar foto ");
        this.departamentos.push(item);
      });

      //this.tatuajesArtistas.reverse();
    });

    // trigger the query
//    subject.next(this.uidArtista);

    setTimeout(() => {
      console.log('Async operation has ended');
      this.finFoto = this.finFoto + 3;
      infiniteScroll.complete();
    }, 2000);


  }

  abrirMunicipio(departamento){
  		this.navCtrl.push(DetalleDepartamentoPage ,{nombreDepartamento : departamento})
;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ColombiaPage');
  }

}
