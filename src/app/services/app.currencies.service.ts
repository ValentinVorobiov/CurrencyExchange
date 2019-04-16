import { InjectFlags, Injectable, Inject } from '@angular/core';
import { Helpers } from '../classes/helpers.class';
import { Currency } from '../classes/currency.class';
import { CurrencyRate, CurrencyShortRate } from '../classes/currency.rate.class';
import { AxiosService } from './axios.service';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';


@Injectable({ providedIn: 'root' }) export class CurrenciesService{
    public csCurrencyList: Array<Currency> = new Array();
    private csAxios : AxiosService;
    public csResponse : any;
    public clsStorage: WebStorageService;
    public tmpRatesArr : Array<CurrencyRate>;

    constructor( 
        anAxios : AxiosService, 
        @Inject(LOCAL_STORAGE) aStorage: WebStorageService ) {
        this.csAxios = anAxios;
    }


    public async csGetSource() : Promise< Array< Currency > >{
        let csLink = this.csCurrencyList;
        return await this.csAxios.requestGet('http://www.nbrb.by/API/ExRates/Currencies')
        .then( aResponse => {
            let tmpCurrencyArr = new Array<Currency>();
            for (  let j=0; j< aResponse.length; j++  ){
                let tmpCurr = new Currency();
                tmpCurr.cIsBusy = true;
                tmpCurr.cBorrowResponse( aResponse[j] );
                if( tmpCurr.cActive ){
                    tmpCurr.cRatesArray = this.csCurrGetRates( tmpCurr );
                    tmpCurr.cSetUpdateDone();
                    tmpCurrencyArr.push( tmpCurr );
                    csLink.push( tmpCurr );
                }
            }
            return tmpCurrencyArr;
        })
        .catch( aError => { console.log( 'csGetSource got an error: ', aError ) } );

    } // csGetSource()

    public csCurrGetRates( aCurrency: Currency ): CurrencyRate[] {
        let cRatesAxios = new AxiosService();
        let cDatesArr = Helpers.hMakeDaysArray( aCurrency.cStartDate, aCurrency.cEndDate );
        this.tmpRatesArr = new Array();
        aCurrency.cRatesArray = new Array();

        let innerTmpRates = new Array<CurrencyRate>();
        aCurrency.cIsBusy = true;
        for( let k=0; k < cDatesArr.length; k++ ){
            let kDate = cDatesArr[k];
            let kURL = Helpers.hMakeSingleDayRateUrl( aCurrency.cID, kDate );
            innerTmpRates = cRatesAxios.requestGet( kURL )
            .then( aResponce => {
                let tmpRate = new CurrencyRate();
                tmpRate.crBorrowResponse( aResponce );
                // this.tmpRatesArr.push( tmpRate );
                this.tmpRatesArr = [ ...this.tmpRatesArr, tmpRate ];
                // aCurrency.cRatesArray.push( tmpRate );
                aCurrency.cRatesArray = [ ...aCurrency.cRatesArray, tmpRate ];
                if( 
                    tmpRate.crDate.valueOf() >= aCurrency.cStart2W.valueOf() &&
                    tmpRate.crDate.valueOf() <= aCurrency.cEnd2W.valueOf()
                ){
                    // aCurrency.cRates2W.push( tmpRate );
                    aCurrency.cRates2W = [ ...aCurrency.cRates2W, tmpRate ]
                }
            })
            .then( aResponce =>{
                aCurrency.calcTodayDiff();
                aCurrency.cIsBusy = false;
            })
            .catch( anError => { 
            });
        }
        return this.tmpRatesArr;
    }


    public csGetISOCodeIndex( anISOCode : string ){
        let retIndex : number = -1; 
        let notFound: boolean = true;

        for( let aci = 0; aci < this.csCurrencyList.length && notFound; aci++ ){
            if( this.csCurrencyList[aci].cISOCode === anISOCode ){
                notFound = false;
                retIndex = aci;
            }
        }

        return retIndex;
    }

    public csGetISOCodeCurrency( anISOCode : string ) : Currency {
        return this.csCurrencyList[ this.csGetISOCodeIndex( anISOCode ) ];
    }

    public csGetCurrencies() : Currency[] {
        if( ! this.hasItems() ){
            let tmpRes = Promise.resolve( 
                this.csGetSource() )
                    .then( 
                            (aResolved : Array< Currency >) =>{
                                if( aResolved.length ){
                                    this.csCurrencyList = [ ...aResolved ];
                                }
                    } )
                    .catch( (err) => { console.log( 'csGetCurrencies got an error: ', err )  } );
        }
        return this.csCurrencyList;
    }

    public csSetFilter( filterString?: string ){
        let fltPromise = Promise
            .resolve( this.csCurrencyList )
            .then( 
                ( innerList : any ) => {
                    for( let k=0; k<innerList.length; k++ ){
                        innerList[ k ].cSetFilter( filterString );
                    }
            } );
    }

    public hasItems():boolean{
        return (this.csCurrencyList.length > 0);
    }

    public csGetIndex( aCurrency : Currency ) : number {
        let retIndex : number = -1; 
        let notFound: boolean = true;
        for( let giIterator : number = 0; giIterator < this.csCurrencyList.length && notFound; giIterator++ ){
            if( this.csCurrencyList[ giIterator ].cID == aCurrency.cID ){
                notFound = false;
                retIndex = giIterator;
            }
        }
        return retIndex;
    }

    public csSetSelected( aCurrency : Currency, selValue: boolean = true ){
        aCurrency.cIsSelected = selValue;
        let notFound : boolean = true;
        let itemIndex = this.csGetIndex( aCurrency );
        for( let ssIterator : number = 0; ssIterator < this.csCurrencyList.length; ssIterator++ ){
            this.csCurrencyList[ ssIterator ].cIsSelected = false;
        }
        this.csCurrencyList[ itemIndex ].cIsSelected = selValue;
    }

}