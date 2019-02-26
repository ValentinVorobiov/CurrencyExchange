import { NgModule, Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Helpers } from '../../classes/helpers.class';
import { CurrencyRate } from '../../classes/currency.rate.class';

export interface RateForTable{
    rftDate: string;
    rftRate : number;
}

@Component({
    selector: '<app-view-chart>',
    templateUrl : 'app.view.chart.html',
    styleUrls: ['app.view.chart.css'],
})

export class AppViewChart implements OnInit{
    @Input() inData: Array< CurrencyRate >

    constructor(){}

    ngOnInit(){ 
    }

    public avcStringifyDate( aDate : Date ) : string {
        return Helpers.hDateToHumanString( aDate );
    }

    public avcConvertRate( aRate : CurrencyRate ) : RateForTable {
        let cnvDate = Helpers.hDateToHumanString( aRate.crDate );
        let cnvRate = aRate.crRate;
        const singleRate : RateForTable = { rftDate : cnvDate, rftRate : cnvRate };
        return singleRate;
    }

    public avcGetChartData() : RateForTable[] {
        let avcConvertedRates = new Array< RateForTable >();
        this.inData.forEach( ( rateElement ) => {
            avcConvertedRates = [ 
                ...avcConvertedRates, 
                this.avcConvertRate( rateElement )
            ];
        }  );
        return avcConvertedRates;
    }

}