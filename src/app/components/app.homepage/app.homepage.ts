import { NgModule, Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppPreloader } from '../app.preloader/app.preloader';
import { CurrenciesService } from '../../services/app.currencies.service';
import { AppChartedListService } from '../../services/app.charted.list.service';
import { AppCurrencyView } from '../../components/app.currency.view/app.currency.view'

import{ ChartedCurrency } from '../../classes/charted.currency.class';


@Component({
    selector: 'app-homepage',
    templateUrl : 'app.homepage.html',
    styleUrls: ['app.homepage.css'],
})

export class AppHomepage{

    constructor( 
        private _ahCurrencyService: CurrenciesService, 
        private _ahChartedService : AppChartedListService 
        ){ }
    
    public ahGetSelectedCharted() : ChartedCurrency{
        return this._ahChartedService.clsSelectedCharted;
    }

    public ahGetFavouritesList():Array< ChartedCurrency >{
        // return this._ahChartedService.aclsGetFavorites();
        return [];
    }

    public ahIsValid(): boolean{
        // return( this._ahChartedService.hasItems() || this._ahCurrencyService.hasItems() );
        return false;
    }

    public ahHasSelected(){
        let retVal: boolean = false;
        // retVal =  this._ahChartedService.aclsHasSelected();
        return retVal;
    }


}