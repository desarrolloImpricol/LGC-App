var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
/*
  Generated class for the ListasProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var ListasProvider = /** @class */ (function () {
    function ListasProvider(http, af) {
        this.http = http;
        this.af = af;
        console.log('Hello ListasProvider Provider');
    }
    ListasProvider.prototype.getDepartamentos = function () {
        var _this = this;
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
        return this.departamentos;
    };
    ListasProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http, AngularFireDatabase])
    ], ListasProvider);
    return ListasProvider;
}());
export { ListasProvider };
//# sourceMappingURL=listas.js.map