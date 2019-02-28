import { NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { Routes, RouterModule } from '@angular/router';
import { ClipboardModule } from 'ngx-clipboard';
import { Chart } from 'chart.js';

import { AxiosService } from '../services/axios.service';
import { CurrenciesService } from '../services/app.currencies.service';
import { AppChartedListService } from '../services/app.charted.list.service';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add( fas );

import { AppPreloader } from '../components/app.preloader/app.preloader';
import { AppCurrencyItem } from '../components/app.currency.item/app.currency.item';
import { AppCurrencyList } from '../components/app.currency.list/app.currency.list';
import { AppCurrencyFilter } from '../components/app.currency.filter/app.currency.filter';
import { AppCurrencyView } from '../components/app.currency.view/app.currency.view';
import { AppViewTable } from '../components/app.view.table/app.view.table';
import { AppViewChart } from '../components/app.view.chart/app.view.chart'

import { AppHomepage } from '../components/app.homepage/app.homepage';
import { AppCalculator } from '../components/app.calculator/app.calculator';
 import { AppFavoritesList } from '../components/app.favorites.list/app.favorites.list';

import { Calendar } from '../components/app.calendar/app.calendar';
import { Datepicker } from '../components/app.datepicker/app.datepicker';
import { AppAbout } from '../components/app.about/app.about';
import { AppRouting } from '../components/app.routing/app.routing';


const appRoutes : Routes = [
    { path: '', component: AppHomepage, pathMatch : 'full' }, 
    { path: 'calc', component: AppCalculator, pathMatch : 'full' }, 
    { path: 'favorites', component: AppFavoritesList, pathMatch : 'full' }, 
    { path: 'about', component: AppAbout, pathMatch : 'full' }, 
    { path: 'contact', redirectTo: '/about', pathMatch : 'full' },
    { path: 'currency-list', redirectTo : '/', pathMatch : 'full' },

]


@NgModule({
    imports : [
        BrowserModule,
        FormsModule,
        DragDropModule,
        FontAwesomeModule,
        ClipboardModule,
        // Chart,
        RouterModule.forRoot( appRoutes ),

    ],
    declarations : [
        AppPreloader,
        AppCurrencyItem,
        AppCurrencyList,
        AppCurrencyFilter,
        AppViewTable,
        AppViewChart,
        AppCurrencyView,
        Calendar, Datepicker,
        AppCalculator,
        AppAbout,
        AppHomepage,
        AppFavoritesList,
        AppRouting,

    ],
    entryComponents : [
        AppRouting, 
    ],
    providers : [
        CurrenciesService,
        AppChartedListService,
        AxiosService,
    ],
    bootstrap : [
        AppRouting,
    ]
})

export class AppModule{

}