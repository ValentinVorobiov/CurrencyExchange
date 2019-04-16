import { Component, Input, Output, EventEmitter, OnInit,  ChangeDetectionStrategy, ChangeDetectorRef  } from '@angular/core';
import { Helpers } from '../../classes/helpers.class';
import { AppPreloader } from '../app.preloader/app.preloader';
import { Calendar } from '../app.calendar/app.calendar';
import { faCalendar, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { asTextData } from '@angular/core/src/view';

@Component({
    selector: 'app-datepicker',
    templateUrl : 'app.datepicker.html',
    styleUrls: ['app.datepicker.css'],
    changeDetection : ChangeDetectionStrategy.Default,
})

export class Datepicker implements OnInit{
    @Input() DpInDate? : Date;
    @Input() DpInMinDate? : Date;
    @Input() DpInMaxDate?: Date;
    public selectedDate: Date;
    public DpIcon : IconDefinition = faCalendar;
    public DpIsActive: boolean = false;

    @Output() emitSelectedDate = new EventEmitter<Date>();

    constructor( private _cdr: ChangeDetectorRef ){}

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

    public dpWrapperClick( evt : any ){
        // console.log( 'dpWrapperClick, @evt:', evt );
        let senderClasses = evt.target.className;
        if( Helpers.hStrLookupKeys( senderClasses, 'app-datepicker__calendar-wrapper' ) ){
            this.DpIsActive = false;
        }
    }

    public dpCalendarDateClicked( aDate: Date ){
        this.DpInDate = new Date( aDate );
        this.emitSelectedDate.emit( aDate );
        this.DpIsActive = false;
        this._cdr.detectChanges();
    }

    public dpStringifyDate( aDate? : Date ) : string {
        if( aDate ){
            return Helpers.hDateToString( aDate )
        } else {
            return Helpers.hDateToString( this.DpInDate );
        }
        
    }
}