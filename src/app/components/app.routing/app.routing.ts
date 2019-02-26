import { Component, OnInit } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CurrenciesService } from '../../services/app.currencies.service';
import { AppChartedListService } from '../../services/app.charted.list.service';

import { Currency } from '../../classes/currency.class';
import { ChartedCurrency } from '../../classes/charted.currency.class';

@Component({
    selector: 'app-routing',
    templateUrl : 'app.routing.html',
    styleUrls: ['app.routing.css'],
})

export class AppRouting implements OnInit{
    public appCurrenciesService : CurrenciesService;
    public appChartedService: AppChartedListService;
    constructor( anCS: CurrenciesService, anCLS: AppChartedListService ){
        this.appCurrenciesService = anCS; this.appChartedService = anCLS;
    }

    ngOnInit(){

    }

    public arGetFavoritesCount():number{
        return this.appChartedService.aclsGetFavoritesCount();
    }

    public arHasFavorites():boolean{
        return ( this.appChartedService.aclsGetFavoritesCount() > 0 );
    }

}