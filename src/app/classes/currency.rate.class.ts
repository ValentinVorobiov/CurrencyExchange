import { Helpers } from './helpers.class';
import { Currency } from './currency.class';

export interface CurrencyChartData{
    ccdDate : string;
    ccdRate : number;
}

export class CurrencyRate{

    public crISOCode : string;
    public crDate: Date;
    public crScaler : number;
    public crEntryRate : number;
    public crRate : number;

    constructor(){

    }

    public crBorrowResponse( aResponce: any ){
        this.crISOCode = aResponce.Cur_Abbreviation;
        this.crDate = new Date( aResponce.Date );
        this.crScaler = aResponce.Cur_Scale;
        this.crEntryRate = aResponce.Cur_OfficialRate;
        this.crRate = this.crEntryRate / this.crScaler;
    }

    public crBorrowShortResponce( aShortResponse: any, linkedCurrency : Currency ){
        this.crDate = aShortResponse.Date;
        this.crEntryRate = aShortResponse.Cur_OfficialRate;
        this.crISOCode = linkedCurrency.cISOCode;
        this.crScaler = linkedCurrency.cScaler;
        this.crRate = this.crEntryRate / this.crScaler
    }

    public crBorrowShortRate( aShortRate : CurrencyShortRate, linkedCurrency: Currency ){
        this.crDate = aShortRate.crDate;
        this.crEntryRate = aShortRate.crEntryRate;
        this.crScaler = linkedCurrency.cScaler;
        this.crRate = this.crEntryRate / this.crScaler;
    }

    public setScaler( aScale: number ){
        this.crScaler = aScale;
        this.crRate = this.crEntryRate / aScale;
    }

}

export class CurrencyShortRate{
    public crID: number;
    public crDate : Date;
    public crEntryRate : number;
    public crRate: number;

    constructor( ){}

    public csrBorrowResponce( aResp: any, linkedCurrency?: Currency ){
        this.crID = parseInt( aResp.Cur_ID );
        this.crDate = new Date( aResp.Date );
        this.crEntryRate = parseFloat( aResp.Cur_OfficialRate );
        if( linkedCurrency ){
            this.crRate = this.crEntryRate / linkedCurrency.cScaler;
        } else {
            this.crRate = this.crEntryRate;
        }
    }

}
