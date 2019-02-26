import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AppPreloader } from '../app.preloader/app.preloader';
import { LogicCalendar } from '../../classes/logic.calendar';
import { Helpers } from '../../classes/helpers.class';

@Component({
    selector: 'app-calendar',
    templateUrl : 'app.calendar.html',
    styleUrls: ['app.calendar.css']
})
export class Calendar implements OnInit{
    @Input() initDate?: Date;
    @Input() initMaxDate?: Date;
    @Input() initMinDate?: Date;
    private arrMonths : Array< string > = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
    private arrDOWs : Array< string > = [ 'Sun', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat' ];
    private logCalendar : LogicCalendar;
    public dateSelected: Date;
    @Output() dateClickedEE : EventEmitter< Date > = new EventEmitter;

    constructor(){
        
    }

    ngOnInit(){
        if( this.initDate ){
            this.dateSelected = new Date(
                this.initDate.getFullYear(),
                this.initDate.getMonth(), 
                this.initDate.getDate()
            );
        } else {
            this.dateSelected = new Date();
        }
        this.logCalendar = new LogicCalendar( this.dateSelected );
        if( this.initMaxDate ){
            this.logCalendar.setMaxDate( this.initMaxDate );
        }
        if( this.initMinDate ){
            this.logCalendar.setMinDate( this.initMinDate );
        }
    }

    public nextMonth(){
        this.logCalendar.nextMonth();
    }

    public prevMonth(){
        this.logCalendar.prevMonth();
    }

    public nextYear(){
        this.logCalendar.nextYear();
    }

    public prevYear(){
        this.logCalendar.prevYear();
    }

    public getDOWs():Array<string>{
        return this.arrDOWs;
    }

    public getMonths(): Array<string>{
        return this.arrMonths;
    }

    public getGrid(){
        return this.logCalendar.datesGRID;
    }

    public getMonth() : string {
        let resStr = this.arrMonths[ this.logCalendar.startDate.getMonth() ];
        return resStr;
    }

    public getYear() : string {
        let resStr = this.logCalendar.startDate.getFullYear().toString();
        return resStr ;
    }

    public isCurrentDate( aItem : any ):boolean{
        let retRes: boolean = false;
        let itemDate = aItem.aDate;
        let today = new Date();
        retRes = Helpers.hDatesEqual( itemDate, today );
        return retRes;
    } // Calendar.isCurrentDate()

    public isDateInitDate( aItem: any ) : boolean {
        let retRes = false;
        let itemDate = aItem.aDate;
        if( this.initDate ){
            retRes = Helpers.hDatesEqual( this.initDate, aItem.aDate );
        }
        return retRes;
    }

    public dateClicked( cellData: { aDate: Date, aValid: boolean} ){
        if( cellData.aValid ){
            this.dateClickedEE.emit( cellData.aDate );
            this.initDate = cellData.aDate;
        }
    }



}