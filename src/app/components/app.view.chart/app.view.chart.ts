import { NgModule, Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js';

import { Helpers } from '../../classes/helpers.class';
import { ChartedCurrency } from '../../classes/charted.currency.class';
import { CurrencyRate } from '../../classes/currency.rate.class';

export interface CurrencyChartData{
    ccdDate : string;
    ccdRate : number;
}

@Component({
    selector: '<app-view-chart>',
    templateUrl : 'app.view.chart.html',
    styleUrls: ['app.view.chart.css'],
})

export class AppViewChart implements OnInit{
    @Input() inCurrency: ChartedCurrency;
    public avcChartData : Array< CurrencyChartData >;
    public avcChart : Chart;

    constructor( private _ElementRef : ElementRef ){}

    ngOnInit(){ 
        console.log( 'AppViewChart component, \ n @Input() inCurrency: ', this.inCurrency );
        this.avcChartData = this.avcGetChartData();
        this.avcChart = this.avcPrepareChart();
    }


    public avcStringifyDate( aDate : Date ) : string {
        return Helpers.hDateToHumanString( aDate );
    }

    public avcCurrencyRateToChartData( aRate: CurrencyRate ) : CurrencyChartData {
        let tmpDateStr = this.avcStringifyDate( aRate.crDate );
        let tmpCurrencyRate = aRate.crRate;
        let tmpChartData : CurrencyChartData = {
            ccdDate: tmpDateStr,
            ccdRate: tmpCurrencyRate
        }
        return tmpChartData;
    }

    public avcGetChartData() : CurrencyChartData[] {
        let tmpChartDataArray = new Array< CurrencyChartData >();
        this.inCurrency.ccRates.forEach( 
            ( rateElement ) => {
                tmpChartDataArray = [ ...tmpChartDataArray, this.avcCurrencyRateToChartData( rateElement ) ];
            } 
        );
        return tmpChartDataArray;
    }

    public avcPrepareChart() : Chart {
        let labelsDate = new Array<string>();
        let valuesRate = new Array<number>();

        this.avcChartData.forEach( 
            ( aCurrencyChartData ) => {
                labelsDate = [ ...labelsDate, aCurrencyChartData.ccdDate ] ;
                valuesRate = [ ...valuesRate, aCurrencyChartData.ccdRate ] ;
            }
        );
        let htmlReference = this._ElementRef.nativeElement.querySelector("#chartCanvas");
        let tmpChart = new Chart(
            htmlReference,
            {
                type: 'line',
                data: {
                    labels: labelsDate,
                    datasets: [
                        {
                            data: valuesRate,
                            borderColor: '#3cba9f',
                            fill: true
                        }
                    ]
                },
                options : {
                    legend: { display : false },
                    scales : {
                        xAxes:[
                            { display: true }
                        ], 
                        yAxes:[
                            { display: true }
                        ]
                    },
                }
            }
        );
        return tmpChart;
    }

}