import { NgModule, Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { CurrenciesService } from '../../services/app.currencies.service';
import { AppChartedListService } from '../../services/app.charted.list.service';

import{ ChartedCurrency } from '../../classes/charted.currency.class';
import { Currency } from '../../classes/currency.class';

@Component({
    selector: 'app-calculator',
    templateUrl : 'app.calculator.html',
    styleUrls: ['app.calculator.css'],
})

export class AppCalculator implements OnInit{
    public acCurrencyList : Array< Currency >; 
    public acSourceCurrency : Currency;
    public acDestCurrency : Currency;
    public acSourceAmount : number;
    constructor( private _acILSService : CurrenciesService, private _acCLSService: AppChartedListService ){

    }

    ngOnInit(){
        this.acCurrencyList = this._acILSService.csGetCurrencies();
    }

    public acGetISOCodes() : Array<string>{
        let resArr = new Array<string>();
        for( let acIterator : number =0; acIterator < this.acCurrencyList.length; acIterator++ ){
            // resArr.push( this.acCurrencyList[acIterator].cISOCode );
            resArr = [ ...resArr, this.acCurrencyList[acIterator].cISOCode ];
            
        }
        return resArr;
    }

    public acHasItems() : boolean {
        return this._acILSService.hasItems();
    }


    public acLocalGetCurrencyByISOCode( anISOCode : string ) : Currency{
        let acNotFound: boolean = true;
        let acIndex : number = -1;
        let retCurrency: Currency;
        for( let acIter: number = 0; acIter < this.acCurrencyList.length && acNotFound; acIter++ ){
            if( this.acCurrencyList[ acIter ].cISOCode === anISOCode ){
                acIndex = acIter; acNotFound = false; 
            }
        }
        retCurrency = this.acCurrencyList[ acIndex ];
        return retCurrency;
    }

    public acSetSourceCurrency( anEvent : any ){
        let acSourceISOCode = anEvent.target.value;
        this.acSourceCurrency = this.acLocalGetCurrencyByISOCode( acSourceISOCode );
    }

    public acSetDestCurrency( anEvent : any ){
        let acDestISOCode = anEvent.target.value;
        this.acDestCurrency = this.acLocalGetCurrencyByISOCode( acDestISOCode );
    }

    public acSourceAmountInput( anEvent: any ){
        let inputString = anEvent.target.value;
        let inputNumeric : number;
        if( inputNumeric = parseFloat( inputString ) ){
            this.acSourceAmount = inputNumeric;
            this.acRecalcAmount();
        }
    }

    public acIsSourceCurrencySelected() : boolean {
        let retRes : boolean = false;
        if( this.acSourceCurrency ){
            retRes = true;
        }
        return retRes;
    }

    public acIsDestCurrencySelected() : boolean {
        let retRes : boolean = false;
        if( this.acDestCurrency ){
            retRes = true;
        }
        return retRes;
    }

    public acRecalcAmount() : number | null{
        let retRes = null;
        if( this.acSourceCurrency && this.acDestCurrency && this.acSourceAmount ){
            let acSourceToBYN = this.acSourceCurrency.cTodayRate * this.acSourceAmount;
            retRes = ( acSourceToBYN / this.acDestCurrency.cTodayRate ).toFixed(4);
        }
        return retRes;
    }

}