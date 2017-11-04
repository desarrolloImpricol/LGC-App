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
/**
 * Generated class for the BusquedaAvanzadaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var BusquedaAvanzadaPage = /** @class */ (function () {
    function BusquedaAvanzadaPage(navCtrl, navParams, af) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.af = af;
        //consulta departamentos  
        this.af.list('/departamentos/', { preserveSnapshot: true })
            .subscribe(function (snapshots) {
            _this.departamentos = [];
            snapshots.forEach(function (snapshot1) {
                var data = snapshot1.val();
                data.uid = snapshot1.key;
                //   console.log("uid creador = " + data.uidCreador);
                console.log("departamento key  =" + snapshot1.key);
                console.log("departamento Value =" + JSON.stringify(snapshot1.val()));
                _this.departamentos.push(data);
            });
        });
    }
    //funcion que  se llama cuando se elecciona un departamento
    BusquedaAvanzadaPage.prototype.onSelecDepartamento = function () {
        var _this = this;
        //reinicializa el arreglo demunicipios
        this.municipios = [];
        var subject = new Subject();
        var queryObservable = this.af.list('/municipios', {
            query: {
                orderByChild: 'uidDepartamento',
                equalTo: subject
            }
        });
        //manjo de respuesta 
        // subscribe to changes
        queryObservable.subscribe(function (queriedItems) {
            console.log(JSON.stringify(queriedItems));
            //alamaenca resultado del filtro en arreglo 
            _this.filtroMunicipios = queriedItems;
            //recorre arreglo para setelartl en la lista 
            _this.filtroMunicipios.forEach(function (item, index) {
                //         console.log("item municipio = " + JSON.stringify(item));
                var dataI = item;
                _this.municipios.push(dataI);
            });
        });
        // trigger the query
        subject.next(this.uidDepartamento);
    };
    BusquedaAvanzadaPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad BusquedaAvanzadaPage');
    };
    BusquedaAvanzadaPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-busqueda-avanzada',
            templateUrl: 'busqueda-avanzada.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, AngularFireDatabase])
    ], BusquedaAvanzadaPage);
    return BusquedaAvanzadaPage;
}());
export { BusquedaAvanzadaPage };
//# sourceMappingURL=busqueda-avanzada.js.map