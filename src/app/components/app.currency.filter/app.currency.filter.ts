import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CurrenciesService } from '../../services/app.currencies.service';
import { Currency } from '../../classes/currency.class';

@Component({
    selector: 'app-currency-filter',
    templateUrl : 'app.currency.filter.html',
    styleUrls: ['app.currency.filter.css'],
})

export class AppCurrencyFilter implements OnInit{
    @Input() inFilter : string;
    private _acfInitialService : CurrenciesService;
    @Output() setFilter = new EventEmitter< string >()
    @Output() clearFilter = new EventEmitter();

    public inputString : string = '';

    constructor( aILSService: CurrenciesService ){
        this._acfInitialService = aILSService;
    }

    public acfInputChanged( $event:  any ){
        let tmpStr = $event.target.value;
        this.inputString = tmpStr;
        let self = this;
        setTimeout(  ()=>self.acfSetFilter( tmpStr ), 350 );

    }

    public acfClearFilter(){
        this.inFilter = '';
        this.clearFilter.emit();
    }

    public acfSetFilter( filterString?: string|null ) : void {
        this.inFilter = filterString;
        this.setFilter.emit( this.inFilter );
    }

    public acfResetClick(  ){
        this.inputString = '';
        this.inFilter = '';
        this.acfSetFilter( '' );
    }

    ngOnInit(){
        
    }

}
