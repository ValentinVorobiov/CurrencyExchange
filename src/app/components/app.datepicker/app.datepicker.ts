import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Helpers } from '../../classes/helpers.class';
import { AppPreloader } from '../app.preloader/app.preloader';
import { Calendar } from '../app.calendar/app.calendar';
import { faCalendar, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { asTextData } from '@angular/core/src/view';

@Component({
    selector: 'app-datepicker',
    templateUrl : 'app.datepicker.html',
    styleUrls: ['app.datepicker.css']
})

export class Datepicker implements OnInit{
    @Input() DpInDate? : Date;
    @Input() DpInMinDate? : Date;
    @Input() DpInMaxDate?: Date;
    public selectedDate: Date;
    public DpIcon : IconDefinition = faCalendar;
    public DpIsActive: boolean = false;

    @Output() emitSelectedDate = new EventEmitter<Date>();

    constructor(){}

    ngOnInit(){
        
        if( ! this.selectedDate ){
            // this.selectedDate = new Date( '2018-12-20' );
            this.selectedDate = new Date( );
        } else if ( this.DpInDate ){ 
            this.selectedDate = new Date( this.DpInDate );
        }

        if( !this.DpInDate ){
            this.DpInDate = new Date();
        }

    }

    public dpToggleActive(  ){
        this.DpIsActive = !( this.DpIsActive )
    }

    public dpCalendarDateClicked( aDate: Date ){
        this.DpInDate = new Date( aDate );
        this.emitSelectedDate.emit( aDate );
        this.DpIsActive = false;
    }

    public dpStringifyDate( aDate? : Date ) : string {
        if( aDate ){
            return Helpers.hDateToString( aDate )
        } else {
            return Helpers.hDateToString( this.DpInDate );
        }
        
    }
}