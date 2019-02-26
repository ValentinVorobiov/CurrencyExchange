import { NgModule, Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard';
import { Helpers } from '../../classes/helpers.class';
import { CurrencyRate } from '../../classes/currency.rate.class';

export interface RateForTable{
    rftDate: string;
    rftRate : number;
}

@Component({
    selector: '<app-view-table>',
    templateUrl : 'app.view.table.html',
    styleUrls: ['app.view.table.css'],
})

export class AppViewTable implements OnInit{
    avtDisplayedColumns: string[] = [ 'Date', 'Ex.Rate' ] ;
    @Input() inData: Array< CurrencyRate >

    constructor( private _avtClipboardService : ClipboardService ){}

    ngOnInit(){ 
    }

    public avtStringifyDate( aDate : Date ) : string {
        return Helpers.hDateToHumanString( aDate );
    }

    public avtConvertRate( aRate : CurrencyRate ) : RateForTable {
        let cnvDate = Helpers.hDateToHumanString( aRate.crDate );
        let cnvRate = aRate.crRate;
        const singleRate : RateForTable = { rftDate : cnvDate, rftRate : cnvRate };
        return singleRate;
    }

    public avtGetConvertedRates() : RateForTable[] {
        let actConvertedRates = new Array< RateForTable >();
        this.inData.forEach( ( rateElement ) => {
            actConvertedRates = [ 
                ...actConvertedRates, 
                this.avtConvertRate( rateElement )
            ];
        }  );
        return actConvertedRates;
    }

    public avtRateClipboard( aRate: CurrencyRate ) : string {
        return Helpers.hDateToHumanString( aRate.crDate ) + '\t\t\t' + aRate.crRate.toFixed(5).toString();
    }

    public avtCopyRow( aRate : CurrencyRate ){
        this._avtClipboardService.copyFromContent(
            this.avtRateClipboard( aRate )
        );
        alert( 'Rate on Date copied.' );
    }

    public avtCopyTable(){
        let strData = 'Date \t Exchange Rate \n';

        this.inData.forEach( 
            ( anElement ) => {
                strData = strData + this.avtRateClipboard( anElement ) + '\n';
            } 
        );
        this._avtClipboardService.copyFromContent( strData );
        alert( 'Rate Table copied.' );
    }

}