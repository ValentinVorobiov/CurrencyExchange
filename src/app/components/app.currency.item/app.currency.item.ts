import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Currency } from '../../classes/currency.class';
import { CurrencyRate } from '../../classes/currency.rate.class';
import {    faMoneyBillWaveAlt, faDollarSign, faEuroSign,
             faPoundSign, faRubleSign, faLiraSign, 
            faRupeeSign, faShekelSign, faTenge, 
            faWonSign, faYenSign, faHryvnia, IconDefinition
        } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'currency-item',
    templateUrl : 'currency.item.html',
    styleUrls: ['currency.item.css'],
})

export class AppCurrencyItem{
    @Input() currencyItem : Currency;
}