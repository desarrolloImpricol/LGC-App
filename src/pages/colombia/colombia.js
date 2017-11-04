var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Subject } from 'rxjs/Subject';
import { DetalleDepartamentoPage } from '../../pages/detalle-departamento/detalle-departamento';
/**
 * Generated class for the ColombiaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ColombiaPage = /** @class */ (function () {
    function ColombiaPage(navCtrl, navParams, af) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.af = af;
        this.departamentos = [];
        this.finFoto = 3;
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
        var subject = new Subject();
        var queryObservable = this.af.list('/Colombia', {
            query: {
                orderByChild: 'id',
                //startAt: 0,
                limitToFirst: 5,
            }
        });
        // subscribe to changes
        //this.tatuajesArtistas = [];
        queryObservable.subscribe(function (queriedItems) {
            //console.log("tataujes de artista");
            //console.log(queriedItems);
            //console.log(JSON.stringify(queriedItems));
            _this.filtro2 = queriedItems;
            _this.filtro2.forEach(function (item, index) {
                console.log("agregar foto ");
                _this.departamentos.push(item);
            });
            //this.tatuajesArtistas.reverse();
        });
    }
    ColombiaPage.prototype.cargarMasDepartamentos = function (infiniteScroll) {
        var _this = this;
        console.log("entra scroll");
        var finF = this.finFoto;
        var subject = new Subject();
        var queryObservable = this.af.list('/Colombia', {
            query: {
                orderByChild: 'id',
                //startAt: 0,
                limitToFirst: finF,
            }
        });
        // subscribe to changes
        //this.tatuajesArtistas = [];
        queryObservable.subscribe(function (queriedItems) {
            //console.log("tataujes de artista");
            //console.log(queriedItems);
            //console.log(JSON.stringify(queriedItems));
            _this.filtro2 = queriedItems;
            _this.departamentos = [];
            _this.filtro2.forEach(function (item, index) {
                console.log("agregar foto ");
                _this.departamentos.push(item);
            });
            //this.tatuajesArtistas.reverse();
        });
        // trigger the query
        //    subject.next(this.uidArtista);
        setTimeout(function () {
            console.log('Async operation has ended');
            _this.finFoto = _this.finFoto + 3;
            infiniteScroll.complete();
        }, 2000);
    };
    ColombiaPage.prototype.abrirMunicipio = function (departamento) {
        this.navCtrl.push(DetalleDepartamentoPage, { nombreDepartamento: departamento });
    };
    ColombiaPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ColombiaPage');
    };
    ColombiaPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-colombia',
            templateUrl: 'colombia.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, AngularFireDatabase])
    ], ColombiaPage);
    return ColombiaPage;
}());
export { ColombiaPage };
//# sourceMappingURL=colombia.js.map