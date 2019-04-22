import { InjectFlags, Injectable, Inject } from '@angular/core';
import { Helpers } from '../classes/helpers.class';
import { Currency } from '../classes/currency.class';
import { CurrencyRate, CurrencyChartData } from '../classes/currency.rate.class';
import { AxiosService } from '../services/axios.service';
import { ChartedCurrency } from '../classes/charted.currency.class';
import { IfStmt } from '@angular/compiler';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';


@Injectable( { providedIn: 'root' } )  export class AppChartedListService{
    public clsChartedCurrencies: Array< ChartedCurrency > = new Array();
    public clsSelectedCharted: ChartedCurrency;
    public clsAxios :  AxiosService;
    public clsStorage: WebStorageService;

    constructor( anAxios : AxiosService, @Inject(LOCAL_STORAGE) aStorage: WebStorageService ){
        this.clsAxios = anAxios;
        this.clsStorage = aStorage;
    }

    public async aclsSelectCurrency( aCurrency: Currency ){
        if( this.aclsInList( aCurrency ) || false ){
            this.clsSelectedCharted = this.aclsGetByID( aCurrency.cID ) ;
        } else {
            let tmpCharted = new ChartedCurrency();
            tmpCharted.ccBorrowCurrency( aCurrency );
            tmpCharted.ccIsBusy = true;
            await this.aclsGetCurrencyRates( tmpCharted );
            tmpCharted.ccIsBusy = false;
            this.clsChartedCurrencies = [... this.clsChartedCurrencies, tmpCharted ];
            this.clsSelectedCharted = tmpCharted;
        }
    } // aclsSelectCurrency()

    public async aclsTryFastRates( aCharted: ChartedCurrency ) : Promise<boolean> {
        let retResult : boolean = true;
        let today = new Date();
        let x2WAgo = new Date(
            today.getFullYear(),
            today.getMonth(), 
            today.getDate()-14
        );
        let demoRateURL = Helpers.hMakeDynamicRateUrl(
            aCharted.ccCurrency.cID,
            x2WAgo,
            today
        );
        let tmpArr = new Array< CurrencyRate >();
        let tryoutAxios = new AxiosService();
        aCharted.ccIsBusy = true;
        let tmpRes = await tryoutAxios.requestGet( demoRateURL )
            .then( (tryResponce)=>{
                if( tryResponce.length ){ 
                    retResult = true;
                    aCharted.ccIsSlow = false;
                } else {
                    retResult = false;
                    aCharted.ccIsSlow = true;
                }
            } )
            .catch( (tryError) => {
                retResult = false;
                aCharted.ccIsSlow = true;
            } );
        aCharted.ccIsBusy = false;
        return retResult;
    }

    public async aclsGetFastRates( fastCharted: ChartedCurrency ) : Promise< Array< CurrencyRate > >{
        let retArr : Array< CurrencyRate > = new Array< CurrencyRate >( );
        let boundDays = Helpers.hMakeBoundaryDates( fastCharted.ccStartDate, fastCharted.ccEndDate );
        for( let ccfrI=1; ccfrI < boundDays.length; ccfrI++ ){
            let ccfrStartDate = new Date( boundDays[ ccfrI -1 ] );
            let ccfrEndDate = new Date( boundDays[ ccfrI ] );
            let ccfrUrl = Helpers.hMakeDynamicRateUrl(
                fastCharted.ccCurrency.cID, ccfrStartDate, ccfrEndDate
            );
            fastCharted.ccIsBusy = true;
            let cffrTmp = await this.clsAxios.requestGet( ccfrUrl )
                .then( (ccfrResp)=>{
                    if( ccfrResp.length ){
                        for( let ccfrRespIterator=0; ccfrRespIterator < ccfrResp.length; ccfrRespIterator++ ){
                            let ccfrTmpRate = new CurrencyRate;
                            ccfrTmpRate.crBorrowShortResponce( ccfrResp[ ccfrRespIterator ], fastCharted.ccCurrency );
                            // retArr.push( ccfrTmpRate );
                            retArr = [ ...retArr, ccfrTmpRate];
                        }
                    }
                } )
                .catch();
            fastCharted.ccIsBusy = false;
        }
        return retArr;
    } // aclsGetFastRates()


    public async aclsGetSlowRates( slowCharted: ChartedCurrency ) : Promise< Array< CurrencyRate > >{
        let qryDates = Helpers.hMakeDisperseDaysArray( slowCharted.ccStartDate, slowCharted.ccEndDate );
        let retArr = new Array< CurrencyRate >()
        for( let scc:number = 0; scc < qryDates.length; scc++ ){
            let currQryUrl = Helpers.hMakeSingleDayRateUrl( slowCharted.ccCurrency.cID, qryDates[ scc ] );
            slowCharted.ccIsBusy = true;
            await this.clsAxios.requestGet( currQryUrl )
                .then( (slowResp) =>{ 
                    let tmpRate = new CurrencyRate;
                    tmpRate.crBorrowResponse( slowResp );
                    // retArr.push( tmpRate );
                    retArr = [ ...retArr, tmpRate ];
                } );
            slowCharted.ccIsBusy = false;
        }
        return retArr;
    } // aclsGetSlowRates()

    public async aclsGetCurrencyRates( aCharted: ChartedCurrency ) : Promise< Array< CurrencyRate > > {
        let resArray : Array< CurrencyRate > = new Array< CurrencyRate >();
        let tryoutVal = await this.aclsTryFastRates( aCharted ) ;
        aCharted.ccRates = new Array< CurrencyRate >();
        let promisedResArr : Promise< any >;
        if( tryoutVal ){
            promisedResArr = this.aclsGetFastRates( aCharted );
        } else {
            promisedResArr = this.aclsGetSlowRates( aCharted ) ;
        }
        resArray = await Promise.resolve( promisedResArr ).then(
            ( resolvedData : any )=>{ 
                aCharted.ccRates = resolvedData.slice();
                return resolvedData;
            }
        );
        return resArray;
    } // aclsGetCurrencyRates()

    public aclsGetCharteds() : Array< ChartedCurrency > {
        return this.clsChartedCurrencies;
    }

    public aclsInList( aCurrency : Currency ):boolean{
        let retRes: boolean = false;
            for ( let j:number =0; j<this.clsChartedCurrencies.length && retRes == false; j++){
                if(  this.clsChartedCurrencies[ j ].ccCurrency.cID == aCurrency.cID ){
                    retRes = true;
                }
            }
        return retRes;
    }

    public aclsGetByID( aID: number ):ChartedCurrency{
        let resElement = new ChartedCurrency();
        let notFound: boolean = true;
            for( let k:number = 0; k < this.clsChartedCurrencies.length && notFound; k++){
                if( this.clsChartedCurrencies[k].ccCurrency.cID === aID ){
                    notFound = false;
                    resElement = this.clsChartedCurrencies[k];
                }
            }
        return resElement;
    }

    public aclsGetIndexByID( aID: number ) : number {
        let retIndex: number = -1;
        let notFound: boolean = true;
        for( let gibidI = 0; gibidI < this.clsChartedCurrencies.length && notFound; gibidI++ ){
            if( this.clsChartedCurrencies[ gibidI ].ccCurrency.cID === aID ){
                retIndex = gibidI; notFound = false;
            }
        }
        return retIndex;
    }

    public aclsGetIndexByISOCode( anISOCode: string ) : number {
        let retIndex: number = -1;
        let notFound: boolean = true;
        for( let gibidI = 0; gibidI < this.clsChartedCurrencies.length && notFound; gibidI++ ){
            if( this.clsChartedCurrencies[ gibidI ].ccCurrency.cISOCode === anISOCode ){
                retIndex = gibidI; notFound = false;
            }
        }
        return retIndex;
    }

    public async aclsUpdateCharted( aChartedCurrency: ChartedCurrency ) {
        let itemIndex = this.aclsGetIndexByID( aChartedCurrency.ccCurrency.cID );
        let newRatesArr = await this.aclsGetCurrencyRates( aChartedCurrency ).then( ( anArr )=>{
            return [ ...anArr ];
        } );
        console.log( 'aclsUpdateCharted, @newRatesArr: ', newRatesArr );
        aChartedCurrency.ccRates = newRatesArr;
        this.clsChartedCurrencies[ itemIndex ] = ChartedCurrency.ccReplaceBorrowChartedFull( aChartedCurrency );
        return itemIndex;
    }

    public async aclsUpdateSelected( anUpdated : ChartedCurrency ){
        let selIndex = await this.aclsUpdateCharted( anUpdated );
        console.log( 'aclsUpdateSelected, @selIndex:  ', selIndex );
        // this.clsSelectedCharted.ccBorrowChartedFull( anUpdated );
        this.clsSelectedCharted = ChartedCurrency.ccReplaceBorrowChartedFull( anUpdated );
    }

    public aclsGetFavoritesAvailable( ):number{
        let retVal : number = 0;
        for( let k=0; k < this.clsChartedCurrencies.length; k++ ){
            if( this.clsChartedCurrencies[ k ].ccGetFavorite() ){
                retVal +=1;
            }
        }
        return retVal;
    }

    public aclsGetFavorites():Array< ChartedCurrency >{
        let resArr= new Array< ChartedCurrency >();
        for( let k=0; k < this.clsChartedCurrencies.length; k++ ){
            if( this.clsChartedCurrencies[ k ].ccGetFavorite() ){
                // resArr.push( this.clsChartedCurrencies[ k ] );
                resArr = [ ...resArr, this.clsChartedCurrencies[ k ] ];
            }
        }
        return resArr;
    }

    public aclsGetFavoritesCount():number{
        return this.aclsGetFavorites().length;
    }

    public aclsSetFavorite( aCharted: ChartedCurrency ){
        let itemIndex = this.aclsGetIndexByID( aCharted.ccCurrency.cID );
        this.clsChartedCurrencies[ itemIndex ].ccSetFavorite( true );
    }

    public aclsUnsetFavorite( aCharted: ChartedCurrency ){
        let itemIndex = this.aclsGetIndexByID( aCharted.ccCurrency.cID );
        this.clsChartedCurrencies[ itemIndex ].ccSetFavorite();
    }

    public aclsHasSelected():boolean{
        let retVal: boolean = ! ( this.clsSelectedCharted == null );
        return retVal;
    }

    public hasItems():boolean{
        return (this.clsChartedCurrencies.length > 0);
    }

    public aclsClearStorage(){
        for( let clsKey in this.clsStorage ){
            this.clsStorage.remove( clsKey );
        }
    }

    public aclsSaveData(){
        this.aclsClearStorage();
        let dataArray : string[]; let aclsToday = new Date();
        for( let aCurrency of this.clsChartedCurrencies ){
            dataArray = [ ...dataArray, JSON.stringify( aCurrency ) ];
        }
        this.clsStorage.set( 'CECharteds', dataArray );
        this.clsStorage.set( 'CETimestamp', aclsToday.toDateString() );
    }

    public aclsLoadData(){
        let dataArray = this.clsStorage.get( 'CECharteds' );
        if( dataArray ){
            console.log( 'aclsLoadData got @dataArray, \n', dataArray );
            // дописать преобразование JSON-элемента к ChartedCurrency
        }
    }


}