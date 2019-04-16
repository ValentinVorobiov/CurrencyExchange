import { Helpers } from './helpers.class';
import { CurrencyRate, CurrencyShortRate } from './currency.rate.class';
import{ AxiosService } from '../services/axios.service';
import { Currency } from '../classes/currency.class';

import {    faMoneyBillWaveAlt, faDollarSign, faEuroSign,
    faPoundSign, faRubleSign, faLiraSign, 
    faRupeeSign, faShekelSign, faTenge, faCoffee,
    faWonSign, faYenSign, faHryvnia, IconDefinition
        } from '@fortawesome/free-solid-svg-icons';

export class ChartedCurrency{
    public ccCurrency: Currency = new Currency();
    public ccRates: Array< CurrencyRate > = new Array< CurrencyRate >();
    // public isFavorite: boolean = false; 
    private _isBusy : boolean = false;
    private _isSlow : boolean = false;
    public ccEndDate: Date = new Date();
    public ccStartDate: Date = new Date(
        this.ccEndDate.getFullYear(),
        this.ccEndDate.getMonth(),
        this.ccEndDate.getDate() - 30
    )
    public ccMinDate : Date;
    public ccMaxDate : Date;
    private _isFavorite : boolean = false;
    constructor( ){
    }

    public get ccIsBusy() : boolean{
        return this._isBusy
    }

    public set ccIsBusy( isBusy : boolean ){
        if( isBusy == true ){
            this._isBusy = true;
        } else {
            this._isBusy = false;
        }
    }

    public get ccIsSlow() : boolean {
        return this._isSlow;
    }

    public set ccIsSlow( isSlow : boolean ){
        if( this.ccIsSlow == true ){
            this._isSlow = true;
        } else {
            this._isSlow = false;
        }
    }

    public ccBorrowCurrency( aCurrency: Currency ){
        this.ccCurrency.cID = aCurrency.cID;
        this.ccCurrency.cISOCode = aCurrency.cISOCode;
        this.ccCurrency.cNumCode = aCurrency.cNumCode;
        this.ccCurrency.cIcon = aCurrency.cIcon;
        this.ccCurrency.cName = aCurrency.cName;
        this.ccCurrency.cScaler = aCurrency.cScaler;
        this.ccCurrency.cStrForFilter = aCurrency.cStrForFilter;
        this.ccCurrency.cMinDate = new Date( aCurrency.cMinDate ) ;
        this.ccCurrency.cMaxDate = new Date( aCurrency.cMaxDate );
        this.ccCurrency.cStartDate = new Date( aCurrency.cStartDate );
        this.ccCurrency.cEndDate = new Date( aCurrency.cEndDate );

        this.ccStartDate = new Date( aCurrency.cStartDate );
        this.ccEndDate = new Date( aCurrency.cEndDate );
        this.ccMinDate = new Date( aCurrency.cMinDate );
        this.ccMaxDate = new Date( aCurrency.cMaxDate );
    }

    public static compareRateDates( rate1:CurrencyRate, rate2:CurrencyRate ){
        let retRes: number = 0;
        let date1 = new Date( rate1.crDate );
        let date2 = new Date( rate2.crDate );
        if( date1.valueOf() > date2.valueOf() ){
            retRes = 1;
        }
        if ( date1.valueOf() < date2.valueOf() ){
            retRes = -1;
        }
        return retRes;
    }

    public sortRates(){
        this.ccRates.sort( ChartedCurrency.compareRateDates );
    }

    public ccBorrowChartedBase( sourceCharted: ChartedCurrency ){
        this.ccCurrency.cID = sourceCharted.ccCurrency.cID;
        this.ccCurrency.cISOCode = sourceCharted.ccCurrency.cISOCode;
        this.ccCurrency.cNumCode = sourceCharted.ccCurrency.cNumCode;
        this.ccCurrency.cIcon = sourceCharted.ccCurrency.cIcon;
        this.ccCurrency.cName = sourceCharted.ccCurrency.cName;
        this.ccCurrency.cScaler = sourceCharted.ccCurrency.cScaler;
        this.ccCurrency.cStrForFilter = sourceCharted.ccCurrency.cStrForFilter;

        this.ccCurrency.cMinDate = new Date( sourceCharted.ccCurrency.cMinDate ) ;
        this.ccCurrency.cMaxDate = new Date( sourceCharted.ccCurrency.cMaxDate );
        this.ccCurrency.cStartDate = new Date( sourceCharted.ccCurrency.cStartDate );
        this.ccCurrency.cEndDate = new Date( sourceCharted.ccCurrency.cEndDate );
        this.ccCurrency.cRates2W = sourceCharted.ccCurrency.cRates2W.slice();
        this.ccCurrency.cRatesArray = sourceCharted.ccCurrency.cRatesArray.slice();

        this.ccStartDate = new Date( sourceCharted.ccStartDate );
        this.ccEndDate = new Date( sourceCharted.ccEndDate );
        this.ccMinDate = new Date( sourceCharted.ccMinDate );
        this.ccMaxDate = new Date( sourceCharted.ccMaxDate );

        this.ccSetFavorite( sourceCharted.ccGetFavorite() );
        this.ccIsSlow = sourceCharted.ccIsSlow;
    }

    public ccBorrowChartedFull( sourceCharted : ChartedCurrency ){
        this.ccBorrowChartedBase( sourceCharted );
        this.ccRates = [ ...sourceCharted.ccRates];
    }

    public ccSetFavorite( aFavState?: boolean ){
        this._isFavorite = aFavState ? true : false ;
    }

    public ccGetFavorite() : boolean {
        return this._isFavorite;
    }

}