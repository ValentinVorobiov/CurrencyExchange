import { Helpers } from './helpers.class';
import { AxiosService } from '../services/axios.service';
import { CurrencyRate } from './currency.rate.class';


import {    faMoneyBillWaveAlt, faDollarSign, faEuroSign,
            faPoundSign, faRubleSign, faLiraSign, 
            faRupeeSign, faShekelSign, faTenge, faCoffee,
            faWonSign, faYenSign, faHryvnia, IconDefinition
        } from '@fortawesome/free-solid-svg-icons';

export class Currency{

    public cID : number;
    public cNumCode: number;
    public cISOCode : string;
    private _cNeedsUpdate: boolean = false;
    public cMinDate : Date;
    public cMaxDate : Date;
    public cName: string;
    public cTodayRate : number;
    public cPrevRate: number;
    public cDailyDiff : number;
    public cDiffNegative: boolean = false;
    public cStartDate : Date;
    public cEndDate : Date = new Date();
    public cStart2W: Date;
    public cEnd2W: Date;
    public filterRejects: boolean = false;
    public cStrForFilter : string;
    public cIcon : IconDefinition = faMoneyBillWaveAlt; 
    public cActive : boolean = true;
    public cRatesArray : Array<CurrencyRate> = new Array();
    public cRates2W: Array<CurrencyRate> = new Array();
    public cScaler : number;
    private workerAxios : AxiosService;
    public cIsSelected: boolean = false;
    private _isBusy : boolean = false;
    private _isSlow : boolean = false;

    constructor(){}

    public get cNeedsUpdate() : boolean {
        return this._cNeedsUpdate;
    }

    public set cNeedsUpdate( needsUpdate : boolean ){
        this._cNeedsUpdate = true;
    }

    public cSetUpdateDone(){
        this._cNeedsUpdate = false;
    }

    public cToggleNeedsUpdate(){
        this._cNeedsUpdate = !this._cNeedsUpdate;
    }

    public get cIsBusy(){
        return this._isBusy;
    }

    public set cIsBusy( isBusy : boolean ){
        if( isBusy === true ) {
            this._isBusy = true;
        } else {
            this._isBusy = false;
        }
    }

    public get cIsSlow() : boolean {
        return this._isSlow;
    }

    public set cIsSlow( isSlow: boolean ) {
        if( isSlow === true ){
            this._isSlow = true;
        } else {
            this._isSlow = false;
        }
    }

    private cSelectIcon(){
        // dollar : faDollarSign
        if( this.cName.toLocaleLowerCase().indexOf('dollar') > -1 ){
            this.cIcon = faDollarSign;
        }
        // euro : faEuroSign
        if( this.cName.toLocaleLowerCase().indexOf('euro') > -1 ){
            this.cIcon = faEuroSign;
        }
        // pound: faPoundSign
        if( this.cName.toLocaleLowerCase().indexOf('pound') > -1 ){
            this.cIcon = faPoundSign;
        }
        // lira: faLiraSign
        if( this.cName.toLocaleLowerCase().indexOf('lira') > -1 ){
            this.cIcon = faLiraSign;
        }
        // rupee: faRupeeSign
        if( this.cName.toLocaleLowerCase().indexOf('rupe') > -1 ){
            this.cIcon = faLiraSign;
        }
        // shekel: faShekelSign
        if( this.cName.toLocaleLowerCase().indexOf('shekel') > -1 ){
            this.cIcon = faLiraSign;
        }
        // tenge: faTenge, 
        if( this.cName.toLocaleLowerCase().indexOf('tenge') > -1 ){
            this.cIcon = faTenge;
        }
        // won : faWonSign
        if( this.cName.toLocaleLowerCase().indexOf('won') > -1 ){
            this.cIcon = faWonSign;
        }
        // yen: faYenSign
        if( this.cName.toLocaleLowerCase().indexOf('yen') > -1 ){
            this.cIcon = faYenSign;
        }
        // hryvnia : faHryvnia
        if( this.cName.toLocaleLowerCase().indexOf('hryvn') > -1 ){
            this.cIcon = faHryvnia;
        }
    }

    public cMakeFilterString(){
        this.cStrForFilter = [
            this.cID.toString(),
            this.cNumCode.toString(), 
            this.cISOCode.toLocaleLowerCase(),
            this.cName.toLocaleLowerCase()
        ].join( ' ' );
    }

    public cSetFilter( cFilterMask?: string ){
        if( cFilterMask.length ) {
            if( this.cStrForFilter.indexOf( cFilterMask ) > -1 ){

                this.filterRejects = false;
            } else {
                this.filterRejects = true;
            }
        } else {
            this.filterRejects = false;
        }
    }

    public cSeekDateRate( aDate : Date ) : CurrencyRate {
        let retRate = new CurrencyRate;
        let isFound: boolean = false;
        let index: number = 0;
        while( !isFound && index < this.cRatesArray.length ){
            let tmpRate : CurrencyRate = this.cRatesArray[index];
            isFound = Helpers.hDatesEqual( tmpRate.crDate, aDate );
            if( isFound ){ retRate = tmpRate  }
            index +=1;
        }
        index = 0;
        while( !isFound && index < this.cRates2W.length ){
            let tmpRate : CurrencyRate = this.cRates2W[index];
            isFound = Helpers.hDatesEqual( tmpRate.crDate, aDate );
            if( isFound ){ retRate = tmpRate  }
            index +=1;
        }
        return retRate;
    }

    public calcTodayDiff(){
        let today = new Date();
        let ttr = this.cSeekDateRate( today );
        this.cTodayRate = ttr.crEntryRate / ttr.crScaler;
        let yesterday = new Date( today.getFullYear(), today.getMonth(), today.getDate() -1 );
        let ppr = this.cSeekDateRate( yesterday );
        this.cPrevRate = ppr.crEntryRate / ppr.crScaler ;
        this.cDailyDiff = this.cTodayRate - this.cPrevRate;
        this.cDiffNegative = ( this.cDailyDiff < 0 );
    }

    public cCheckActive(){
        let maxRange : number = 1324800000;
        let today = new Date()
        if( ( today.valueOf() - this.cMaxDate.valueOf() ) > maxRange  ){
            this.cActive = false;
        }
    }

    public cCheckDates(){
        let tmpDate: Date;
        let today = new Date();

        if( this.cEndDate.valueOf > today.valueOf ){
            this.cEndDate = new Date( today );
        }

        if( this.cStartDate.valueOf() > this.cEndDate.valueOf() ){
            tmpDate = new Date( 
                this.cEndDate.getFullYear(), 
                this.cEndDate.getMonth(), 
                this.cEndDate.getDate() 
            );
            this.cEndDate = new Date(
                this.cStartDate.getFullYear(),
                this.cStartDate.getMonth(),
                this.cStartDate.getDate()
            );
            this.cStartDate = new Date(
                this.cEndDate.getFullYear(),
                this.cEndDate.getMonth(),
                this.cEndDate.getDate() - 15
            );
        }
    }

    public cInitDates(){
        let dayShift : number = 15;
        this.cEndDate = new Date();

        this.cEnd2W = this.cEndDate;

        this.cStart2W = new Date(
            this.cEnd2W.getFullYear(), 
            this.cEnd2W.getMonth(), 
            this.cEnd2W.getDate() - dayShift
        );

        this.cStartDate = this.cStart2W;
        this.cCheckDates();
        this.cCheckActive();
    }

    public cSetStartDate( aDate ){
        this.cStartDate = aDate;
        this.cCheckDates();
    }

    public cSetEndDate( aDate ){
        this.cEndDate = aDate;
        this.cCheckDates();
    }

    public cGetDailyRateUrl( aDate ) : string {
        let qryString : string = '';
        qryString = Helpers.hMakeSingleDayRateUrl( this.cID, aDate );
        return qryString;
    }

    public cGetDynamicRateUrl( dateStart : Date, dateEnd : Date ) : string {
        let qryString: string = '';
        qryString = Helpers.hMakeDynamicRateUrl( this.cID, dateStart, dateEnd );
        return qryString;
    }

    public cBorrowResponse( aResponce : any){
        let today = new Date();
        this.cID = aResponce.Cur_ID;
        this.cNumCode = aResponce.Cur_Code;
        this.cISOCode = aResponce.Cur_Abbreviation;
        this.cName = aResponce.Cur_Name_Eng;
        this.cMinDate =  new Date( aResponce.Cur_DateStart );
        this.cMaxDate = new Date( aResponce.Cur_DateEnd );
        if( this.cMaxDate.valueOf() > today.valueOf() ){
            this.cMaxDate = new Date( today );
        }
        this.cScaler = aResponce.Cur_Scale;
        this.cSelectIcon();
        this.cInitDates();
        this.cCheckDates();
        this.cCheckActive();
        this.cMakeFilterString();
        this._cNeedsUpdate = true;
    }

}