import { NgModule, Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CurrenciesService } from '../../services/app.currencies.service';
import { AppChartedListService } from '../../services/app.charted.list.service';
import { Currency } from '../../classes/currency.class';
import { CurrencyRate } from '../../classes/currency.rate.class';
import { AppPreloader } from '../../components/app.preloader/app.preloader';
import { AppCurrencyItem } from '../app.currency.item/app.currency.item';
import { AppCurrencyFilter } from '../app.currency.filter/app.currency.filter'


@Component({
    selector: 'app-currency-list',
    templateUrl : 'app.currency.list.html',
    styleUrls: ['app.currency.list.css'],
    changeDetection: ChangeDetectionStrategy.Default,
})

export class AppCurrencyList implements OnInit{

    public aclCurrencyList : Array< Currency >;
    @Output() currencyTransferrer = new EventEmitter< Currency >();

    constructor( 
        private _aclInitService : CurrenciesService, 
        private _aclCharteds : AppChartedListService, 
        private _cdr: ChangeDetectorRef 
        ){
    }

    ngOnInit(){
        this.aclCurrencyList = this._aclInitService.csGetCurrencies();
    }

    public async aclSetFilter( filterString : string ){
        this._aclInitService.csSetFilter( filterString );
    }

    public async aclClearFilter(  ){
        this._aclInitService.csSetFilter('');
    }

    public async alcTransfer( aCurrency : Currency ){
        this._aclInitService.csSetSelected( aCurrency, true );
        this._aclCharteds.aclsSelectCurrency( aCurrency );
        this._cdr.detectChanges();
    }

    public alcIsBusy() : boolean {
        let alcBusy : boolean = false;
        this.aclCurrencyList.forEach(element => {
            if( element.cIsBusy ){
                alcBusy = true;
            }
        });
        return alcBusy;
    }

    public alcIsEmpty() : boolean {
        let alcEmpty : boolean = true;
        alcEmpty = ! this.aclCurrencyList.length ;
        return alcEmpty;
    }

}