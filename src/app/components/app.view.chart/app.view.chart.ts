import { NgModule, Component, OnInit, Input, Output, EventEmitter, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js';

import { Helpers } from '../../classes/helpers.class';
import { ChartedCurrency,  } from '../../classes/charted.currency.class';
import { CurrencyRate, CurrencyChartData } from '../../classes/currency.rate.class';

@Component({
    selector: '<app-view-chart>',
    templateUrl : 'app.view.chart.html',
    styleUrls: ['app.view.chart.css'],
    changeDetection : ChangeDetectionStrategy.OnPush,
})

export class AppViewChart implements OnInit{
    @Input() inCurrency: ChartedCurrency;
    public avcChart : Chart;
    constructor( private _ElementRef : ElementRef, private _cdr: ChangeDetectorRef ){}

    ngOnInit(){ 
        this.avcChart = this.avcPrepareChart();
    }


    public avcStringifyDate( aDate : Date ) : string {
        return Helpers.hDateToHumanString( aDate );
    }


    public avcPrepareChart() : Chart {
        let labelsDate = new Array<string>();
        let valuesRate = new Array<number>();
        // let aChartData = ChartedCurrency.ccGetChartData( this.inCurrency );
        ChartedCurrency.ccGetChartData( this.inCurrency ).forEach( 
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