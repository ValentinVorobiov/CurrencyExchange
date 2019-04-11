import { Helpers } from './helpers.class';

export class LogicCalendar{
    public currDate : Date;
    public _GUID :  string = Helpers.hMakeGUID();
    public datesGRID : Array< { aDate: Date, aValid: boolean} >;
    public startDate: Date;
    public endDate:Date;
    public minDate:Date;
    public maxDate: Date;
    private _tmpDate : Date;

    constructor( aInitDate: Date = new Date() ){
        this.currDate = aInitDate;
        if( aInitDate.getMonth() > -1  &&  aInitDate.getFullYear() ){
            this.startDate = new Date(
                aInitDate.getFullYear(),
                aInitDate.getMonth(),
                1
            );
            this.endDate = new Date(
                aInitDate.getFullYear(),
                aInitDate.getMonth() +1,
                0
            );
        }

        this.minDate = new Date( 1900, 0, 1 );
        this.maxDate = new Date( 2100, 11, 30 );
        this.checkInnerRange();
        this.datesGRID = new Array();
        this.fillGrid();
    }

    public checkInnerRange():void{
        if( 
            this.maxDate.valueOf < this.startDate.valueOf || 
            this.maxDate.valueOf < this.endDate.valueOf
        ){
            this.endDate = new Date(
                this.maxDate.getFullYear(),
                this.maxDate.getMonth()+1,
                0
            );
            this.startDate = new Date(
                this.endDate.getFullYear(),
                this.endDate.getMonth(),
                1
            );
        }

        if(
            this.minDate.valueOf > this.endDate.valueOf ||
            this.minDate.valueOf > this.startDate.valueOf
        ){
            this.startDate = new Date(
                this.minDate.getFullYear(),
                this.minDate.getMonth(),
                1
            );
            this.endDate = new Date(
                this.minDate.getFullYear(),
                this.minDate.getMonth()+1,
                0
            );
        }
        this.validateDates();
    } // checkInnerRange()

    public setMaxDate( aDate: Date ) : void {
        this.maxDate = new Date( 
            aDate.getFullYear(),
            aDate.getMonth(), 
            aDate.getDate()
        );
        if( this.maxDate.valueOf < this.minDate.valueOf ){
            this.minDate = new Date( 
                this.maxDate.getFullYear(),
                this.maxDate.getMonth()-2,
                1
            );
        }
        this.checkInnerRange();
        this.fillGrid();
    } // setMaxDate( @aDate )

    public getYear():number{
        return this.endDate.getFullYear();
    }

    public getMonth():number{
        return this.endDate.getMonth();
    }

    public setMinDate( aDate: Date ) : void {
        this.minDate = new Date(
            aDate.getFullYear(),
            aDate.getMonth(),
            aDate.getDate()
        );

        if( this.maxDate.valueOf < this.minDate.valueOf ){
            this.maxDate = new Date(
                this.minDate.getFullYear(),
                this.minDate.getMonth() + 3,
                0
            );
        }

        this.checkInnerRange();
        this.fillGrid();
    } // setMinDate( @aDate )

    public getGrid() : Array< { aDate: Date, aValid: boolean} >{
        this.fillGrid();
        return this.datesGRID;
    }

    private isValidDate( aDate : Date ):boolean{
        let validDate: boolean = true;
        if( 
            aDate.valueOf < this.startDate.valueOf ||
            aDate.valueOf > this.endDate.valueOf ||
            aDate.valueOf < this.minDate.valueOf ||
            aDate.valueOf > this.maxDate.valueOf
            ){
            validDate = false;
        }
        return validDate;
    }

    public validateDates():void{
        if( this.datesGRID ){
            for( let i : number =0; i< this.datesGRID.length; i++ ){
                this.datesGRID[ i ].aValid = this.isValidDate( this.datesGRID[ i ].aDate );
            }
        }
    } // validateDates();

    public fillGrid(){
        this.datesGRID = new Array();
        let initOffset : number = this.startDate.getDay();
        let startDay : number = this.startDate.getDate();
        let endDay : number = this.endDate.getDate();
        let startOffset : number = initOffset + 1;
        let endOffset : number = endDay + initOffset + 1;
        let mainGrid= new Array< { aDate: Date, aValid: boolean }>();
        let beforeGrid = new Array< { aDate: Date, aValid: boolean }>();
        let afterGrid = new Array< { aDate: Date, aValid: boolean }>();

        for( let i : number = startDay; i <= endDay; i++ ){
            let iDate : Date = new Date(
                this.startDate.getFullYear(),
                this.startDate.getMonth(),
                i
            );
            mainGrid.push( { aDate: iDate, aValid: true } );
            startOffset = initOffset;
            endOffset = endDay + ( initOffset -1 );
        }

        let prevMonthD = Helpers.hGetPrevMonth( this.startDate );
        let prevDays = Helpers.hDaysInMonth( prevMonthD );
        for( let i : number = 0; i <= startOffset-1; i++ ){
            let prevIDate = new Date(
                prevMonthD.getFullYear(),
                prevMonthD.getMonth(),
                prevDays - i
            );

            // beforeGrid.push( { aDate: prevIDate, aValid: false } );
            beforeGrid = [ ...beforeGrid, { aDate: prevIDate, aValid: false } ];
        }
        beforeGrid = beforeGrid.reverse();

        let nextMonthD = Helpers.hGetNextMonth( this.startDate );
        for( let i= endOffset; i < 41; i++ ){
            let nextIDate = new Date(
                nextMonthD.getFullYear(),
                nextMonthD.getMonth(),
                ( i - endOffset + 1 )
            );
            // afterGrid.push( { aDate: nextIDate, aValid: false } );
            afterGrid = [ ...afterGrid, { aDate: nextIDate, aValid: false } ];
        }

        this.datesGRID = [];

        /*
        for( let j:number=0; j< beforeGrid.length ; j++){
            this.datesGRID.push( beforeGrid[ j ] );
        }

        for( let k:number=0; k< mainGrid.length; k++ ){
            this.datesGRID.push( mainGrid[ k ] );
        }

        for( let l:number = 0; l < afterGrid.length; l++ ){
            this.datesGRID.push( afterGrid[ l ] );
        }
        */
       this.datesGRID = [ ...this.datesGRID, ...beforeGrid ] ;
       this.datesGRID = [ ...this.datesGRID, ...mainGrid ];
       this.datesGRID = [ ...this.datesGRID, ...afterGrid ];

    } // fillGrid


    public nextMonth(){
        this._tmpDate = new Date( 
            this.startDate.getFullYear(),
            this.startDate.getMonth(),
            this.startDate.getDate()
        );
        this.startDate = new Date(
            this._tmpDate.getFullYear(),
            this._tmpDate.getMonth() + 1,
            this._tmpDate.getDate()
        );
        this.endDate = new Date(
            this.startDate.getFullYear(),
            this.startDate.getMonth()+1,
            0
        );
        this.checkInnerRange();
        this.fillGrid();
    } // nextMonth()

    public nextYear(){
        this._tmpDate = new Date( 
            this.startDate.getFullYear(),
            this.startDate.getMonth(),
            this.startDate.getDate()
        );
        this.startDate = new Date(
            this._tmpDate.getFullYear() +1 ,
            this._tmpDate.getMonth(),
            this._tmpDate.getDate()
        );
        this.endDate = new Date(
            this.startDate.getFullYear(),
            this.startDate.getMonth()+1,
            0
        );
        this.checkInnerRange();
        this.fillGrid();
    } // nextYear()

    public prevMonth(){
        this._tmpDate = new Date( 
            this.startDate.getFullYear(),
            this.startDate.getMonth(),
            this.startDate.getDate()
        );
        this.startDate = new Date(
            this._tmpDate.getFullYear(),
            this._tmpDate.getMonth() - 1,
            this._tmpDate.getDate()
        );
        this.endDate = new Date(
            this.startDate.getFullYear(),
            this.startDate.getMonth()+1,
            0
        );
        this.checkInnerRange();
        this.fillGrid();
    } // prevMonth()

    public prevYear(){
        this._tmpDate = new Date( 
            this.startDate.getFullYear(),
            this.startDate.getMonth(),
            this.startDate.getDate()
        );
        this.startDate = new Date(
            this._tmpDate.getFullYear()-1,
            this._tmpDate.getMonth(),
            this._tmpDate.getDate()
        );
        this.endDate = new Date(
            this.startDate.getFullYear(),
            this.startDate.getMonth()+1,
            0
        );
        this.checkInnerRange();
        this.fillGrid();
    } // prevYear()

}