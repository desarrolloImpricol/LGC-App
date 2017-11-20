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
import { Subject } from 'rxjs/Subject';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Storage } from '@ionic/storage';
import { DetalleSitioInteresPage } from '../../pages/detalle-sitio-interes/detalle-sitio-interes';
/**
 * Generated class for the MunicipiosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var MunicipiosPage = /** @class */ (function () {
    function MunicipiosPage(navCtrl, navParams, af, storage) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.af = af;
        this.storage = storage;
        this.departamentoApp = "/Cundinamarca";
        this.municipio = {};
        this.filtroMunicipios = [];
        console.log("data " + this.navParams.data.municipioInfo);
        this.idMunicipio = this.navParams.data.municipioInfo;
        //this.municipio = [];
        this.storage.get('userData').then(function (data) {
            _this.item = _this.af.object('/userProfile/' + data.uid, { preserveSnapshot: true });
            _this.item.subscribe(function (snapshot) {
                console.log(snapshot.key);
                console.log(snapshot.val());
                _this.perfil = snapshot.val();
                _this.perfil.uid = snapshot.key;
                var subject = new Subject();
                var queryObservable = _this.af.list(_this.departamentoApp + '/Municipios', {
                    query: {
                        orderByChild: 'id',
                        equalTo: subject
                    }
                });
                //manjo de respuesta 
                // subscribe to changes
                queryObservable.subscribe(function (queriedItems) {
                    //console.log(JSON.stringify(queriedItems));
                    //alamaenca resultado del filtro en arreglo 
                    _this.filtroMunicipios = queriedItems;
                    _this.municipio = queriedItems[0];
                    //recorre arreglo para setelartl en la lista 
                    console.log("entraa municipio ");
                    console.log(JSON.stringify(_this.municipio));
                    // console.log("Municipio =  " + this.municipio.eslogan);
                    var id = _this.municipio.id - 1;
                    console.log('url =' + _this.departamentoApp + '/MunicipiosGuardadosUsuario/' + _this.perfil.uid + "/" + id);
                    var infoGuardado = _this.af.object(_this.departamentoApp + '/MunicipiosGuardadosUsuario/' + _this.perfil.uid + "/" + id, { preserveSnapshot: true });
                    infoGuardado.subscribe(function (snapshot) {
                        console.log("entra consulta si guardo municipio ");
                        //  console.log(snapshot.key);
                        //  console.log(snapshot.val());
                        if (snapshot.val() === null) {
                            console.log("sitio no guardada");
                            _this.municipio.guardado = false;
                        }
                        else {
                            console.log("sitio  guardada");
                            _this.municipio.guardado = true;
                        }
                    });
                });
                // trigger the query
                subject.next(parseInt(_this.idMunicipio));
                //consulta de sisitios de interes 
                //recibe informacion de los eventos
                _this.af.list(_this.departamentoApp + '/SitiosInteres/', { preserveSnapshot: true })
                    .subscribe(function (snapshots) {
                    //reinicializa eventos
                    _this.sitiosInteres = [];
                    //recorre resultado de la consulta 
                    snapshots.forEach(function (snapshot1) {
                        var data = snapshot1.val();
                        // console.log("uid creador = " + data.uidCreador);
                        console.log("Sitios interes");
                        //consulta informacion del creador del evento
                        _this.itemRef = _this.af.object(_this.departamentoApp + '/userProfile/' + data.uidCreador, { preserveSnapshot: true });
                        _this.itemRef.subscribe(function (snapshot) {
                            //console.log(action.type);
                            console.log("llave" + snapshot.key);
                            console.log('data ' + JSON.stringify(snapshot.val()));
                            data.urlImagenCreador = snapshot.val().photoUrl;
                            data.nombreUsuario = snapshot.val().nombreUsuario;
                            data.index = snapshot1.key;
                            //verifica si esa noticia esta guardada  como favorita 
                            var infoGuardado = _this.af.object(_this.departamentoApp + '/SitiosGuardadosUsuario/' + _this.perfil.uid + "/" + snapshot1.key, { preserveSnapshot: true });
                            infoGuardado.subscribe(function (snapshot) {
                                console.log("entra consulta si guardo evento ");
                                //  console.log(snapshot.key);
                                //  console.log(snapshot.val());
                                if (snapshot.val() === null) {
                                    console.log("evento no guardada");
                                    data.guardado = false;
                                }
                                else {
                                    console.log("evento guardada");
                                    data.guardado = true;
                                }
                            });
                            //setea eventos 
                            _this.sitiosInteres.push(data);
                        });
                        console.log("key =" + snapshot1.key);
                        console.log("Value =" + JSON.stringify(snapshot1.val()));
                    });
                });
            });
        });
    }
    MunicipiosPage.prototype.guardarMunicipio = function (municipio) {
        municipio = this.municipio;
        //console.log("id  = " +  municipio.index);
        //console.log("id  perfil= " +  this.municipio.uid);
        var id = this.municipio.id - 1;
        console.log("id = " + id);
        if (municipio.guardado) {
            var itemsTattoo = this.af.object(this.departamentoApp + '/MunicipiosGuardadosUsuario/' + this.perfil.uid + "/" + id);
            itemsTattoo.remove();
            municipio.guardado = false;
            //this.tatuajeGuardado = false ;
        }
        else {
            var itemsTattoo = this.af.object(this.departamentoApp + '/MunicipiosGuardadosUsuario/' + this.perfil.uid + "/" + id);
            var promise1 = itemsTattoo.set({
                municipio: municipio,
                uid: id
            });
            promise1.then(function (_) {
                return console.log('Sitio guardaa !!!');
            }).catch(function (err) { return console.log(err, 'You dont have access!'); });
            // this.tatuajeGuardado = true;
            municipio.guardado = true;
        }
    };
    MunicipiosPage.prototype.openSitioInteres = function (sitio) {
        this.navCtrl.push(DetalleSitioInteresPage, { sitioInfo: sitio });
    };
    MunicipiosPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad MunicipiosPage');
    };
    MunicipiosPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-municipios',
            templateUrl: 'municipios.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, AngularFireDatabase, Storage])
    ], MunicipiosPage);
    return MunicipiosPage;
}());
export { MunicipiosPage };
//# sourceMappingURL=municipios.js.map