import { NgModule, Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { AppChartedListService } from '../../services/app.charted.list.service';

import { Currency } from '../../classes/currency.class';
import{ ChartedCurrency } from '../../classes/charted.currency.class';

import { AppCurrencyView } from '../../components/app.currency.view/app.currency.view';
import { AppPreloader } from '../../components/app.preloader/app.preloader';

@Component({
    selector: 'app-favorites-list',
    templateUrl : 'app.favorites.list.html',
    styleUrls: ['app.favorites.list.css'],
})

export class AppFavoritesList implements OnInit{

    public aflSelected : ChartedCurrency;
    constructor( private _aflChartedService : AppChartedListService ){ }

    ngOnInit(){

    }

    public aflHasSelected():boolean{
        let retRes : boolean = false;
        if( this.aflSelected ){ retRes = true; }
        return retRes;
    }

    public aflIsEmpty():boolean{
        let retRes : boolean = false;
        retRes = ( this._aflChartedService.aclsGetFavoritesCount() < 1 );
        return retRes;
    }

    public aflGetItems():Array< ChartedCurrency >{
        return this._aflChartedService.aclsGetFavorites();
    }

    public aflItemClicked( anItem : ChartedCurrency ){
        this.aflSelected = anItem;
    }

    public aflGetSelected():ChartedCurrency{
        return this.aflSelected;
    }

}