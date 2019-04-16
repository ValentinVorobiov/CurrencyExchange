import { NgModule, Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppChartedListService } from '../../services/app.charted.list.service';
import { Datepicker } from '../app.datepicker/app.datepicker';
import { faTable, faChartBar, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { Helpers } from '../../classes/helpers.class';
import { ChartedCurrency } from '../../classes/charted.currency.class';
import { CurrencyRate } from '../../classes/currency.rate.class';

@Component({
    selector: '<app-currency-view>',
    templateUrl : 'app.currency.view.html',
    styleUrls: ['app.currency.view.css'],
    changeDetection : ChangeDetectionStrategy.Default,
})

// Previously AppChartedView class 
export class AppCurrencyView implements OnInit{
    @Input() aCharted? : ChartedCurrency;
    public acvDisplayMode : string; // can be either 'table' or 'chart'
    public btnTable : IconDefinition = faTable;
    public btnChart : IconDefinition = faChartBar;

    constructor( 
        private _acvChartedService : AppChartedListService,
        private _cdr: ChangeDetectorRef ){ 
    }
    
    ngOnInit(){
        // this.acvSetDisplayMode( 'chart' );
        this.acvSetDisplayMode();
    }

    public acvSetDisplayMode( aDisplayMode? : string ){
        if( aDisplayMode && aDisplayMode.length ){
            this.acvDisplayMode = aDisplayMode
        } else {
            this.acvDisplayMode = 'table';
        }
        this._cdr.detectChanges();
    }

    public acvViewIsTable() : boolean {
        return ( this.acvDisplayMode === 'table' );
    }

    public acvViewIsChart() : boolean {
        return ( this.acvDisplayMode === 'chart' );
    }

    public isEmpty():boolean{
        let retResult : boolean;
        retResult =  this.aCharted == null ;
        return retResult;
    }

    public acvSetFavorite(){
        this._acvChartedService.aclsSetFavorite( this.aCharted );
    }

    public acvUnsetFavorite(){
        this._acvChartedService.aclsUnsetFavorite( this.aCharted );
    }

    public acvIsFavorite(){
        return this.aCharted.ccGetFavorite();
    }

    public acvStringifyDate( aDate : Date ) : string {
        return Helpers.hDateToString( aDate );
    }

    public acvSetStartDate( aNewDate: Date | string ){
        this.aCharted.ccStartDate = new Date( aNewDate );
        this._acvChartedService.aclsUpdateSelected( this.aCharted );
        this._cdr.detectChanges();
    }

    public acvSetEndDate( aNewDate: Date | string ){
        this.aCharted.ccEndDate = new Date( aNewDate );
        this._acvChartedService.aclsUpdateSelected( this.aCharted );
        this._cdr.detectChanges();
    }

    public acvHasChartData(  ): boolean{
        let retRes: boolean = false;
        if( this.aCharted.ccRates && this.aCharted.ccRates.length ){
            retRes = true;
        }
        return retRes;
    }
    public acvPrepareChartData( ): Array<CurrencyRate> | boolean {
        return this.aCharted.ccRates;
    }
}
