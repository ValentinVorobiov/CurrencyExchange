export class Helpers{

    public static hTrimLeadingZeroes( aStr: string ) : string {
        var resStr = aStr;
        while( resStr[0]=='0' ){
            resStr = resStr.slice( 1 );
        }
        return resStr;
    }

    public static hStrLookupKeys( lMainStr : string, ...strKeys: Array<string> ) : Boolean {
        let mainStr = lMainStr.toLocaleLowerCase();
        let partFound : boolean = false;
        for( let k:number=0; (k < strKeys.length) && !partFound; k++ ){
            let iStrKey = strKeys[ k ].toLocaleLowerCase();
            partFound = ( mainStr.indexOf( iStrKey ) > -1 );
        }
        return partFound;
    }

    public static hMmakeGUIDPart() : string {
        return  Math.floor( ( 1 + Math.random() ) * 0x10000 )
        .toString(16)
        .substring(1);
    }

    public static hMakeGUID() : string {
        let resStr : string = ("ss-s-s-s-sss").replace( /s/g, Helpers.hMmakeGUIDPart() );
        return resStr;
    }

    public static hRemoveDoubleSlashes( aString : string ) : string {
        var resStr = aString;
        while(
            resStr.indexOf( '\/\/' ) > -1
        ){
            resStr = resStr.replace( '\/\/', '\/' );
        }
        return resStr;
    }

    public static hDaysInMonth( aDate : Date ) : number {
        let tmpDate = new Date(
            aDate.getFullYear(),
            aDate.getMonth()+1,
            0
        );
        return tmpDate.getDate();
    }

    public static hDateToString( aDate?: Date ) : string {
        let hDate: Date;
        let resStr: string = '';
        if( aDate ){ hDate = new Date(aDate); } else { hDate = new Date(); }
        resStr = hDate.getFullYear().toString() + '-' + ( hDate.getMonth()+ 1).toString() + '-' + hDate.getDate().toString();
        return resStr;
    }

    public static hDateToHumanString( aDate?: Date ) : string {
        let arrMonths : Array< string > = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
        let arrDOWs : Array< string > = [ 'Sun', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat' ];
        let hDate: Date;
        let resStr : string = '';
        if( aDate ){ hDate = new Date(aDate); } else { hDate = new Date(); }
        resStr +=   arrDOWs[ hDate.getDay() ] + '   '
                    + hDate.getFullYear().toString()
                    + '-' + arrMonths[ hDate.getMonth() ]
                    + '-' + hDate.getDate().toString();
        return resStr;
    }

    public static hStringToDate( aDateStr : string ) : Date {
        let pDateArr = aDateStr.split('-');
        let hDateArr = new Array<number>();
        for( let aEl of pDateArr ){
            // hDateArr.push( parseInt( aEl ) );
            // hDateArr = hDateArr.concat( parseInt( aEl ) );
            hDateArr = [ ...hDateArr, parseInt( aEl ) ]
        }
        hDateArr[1] = hDateArr[1] -1;
        return new Date( hDateArr[0], hDateArr[1], hDateArr[2] );
    }
    
    public static hMonthAgo( aDate : Date ) : Date {
        var hDate = aDate;
        hDate = new Date( aDate.getFullYear(), aDate.getMonth()-1, aDate.getDate() );
        return hDate;
    }

    public static hMonthFurther( aDate: Date ){
        var hDate = aDate;
        hDate.setMonth( aDate.getMonth() +1 );
        return hDate;
    }

    public static hGetPrevMonth( aDate : Date ) : Date {
        return new Date(
            aDate.getFullYear(),
            aDate.getMonth() - 1,
            1
        );
    }

    public static hGetNextMonth( aDate: Date ) : Date {
        return new Date(
            aDate.getFullYear(),
            aDate.getMonth() + 1,
            1
        );
    }

    public static hGetDaysInMonth( aDate : Date ) {
        let tmpDate = new Date(
            aDate.getFullYear(),
            aDate.getMonth()+1,
            0
        );
        return tmpDate.getDate();
    }

    public static hDatesEqual( date1: Date, date2 : Date ){
        let retRes: boolean = false;
        retRes = (
            date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
        );
        return retRes;
    }

    public static hMakeDatesArray( startDate: Date, endDate: Date ) : Array<Date> {
        let resArr = new Array<Date>();
        let hDate = new Date( startDate );

        while( hDate.valueOf() < endDate.valueOf() ){
            let inDate = new Date( hDate.getFullYear(), hDate.getMonth(), hDate.getDate() );
            if( inDate.valueOf() <= endDate.valueOf()  ){
                // resArr.push( inDate );
                // resArr = resArr.concat( inDate );
                resArr = [ ...resArr, inDate ];
            }
            hDate.setDate( hDate.getDate() + 1 );
        }

        return resArr;
    }

    public static hMakeBoundaryDates( startDate: Date, endDate: Date, maxDays: number = 100 ) : Array<Date> {
        let retArr = new Array<Date>();
        let mbdStart = new Date( startDate ); 
        let mbdEnd = new Date( endDate );
        let aDiffer: number;
        // retArr.push( startDate );
        // retArr = retArr.concat( startDate );
        retArr = [ ...retArr, startDate ];
        aDiffer = mbdEnd.getTime() - mbdStart.getTime();
        if( aDiffer > maxDays ){
            while( aDiffer > maxDays ){
                mbdStart = new Date( 
                    mbdStart.getFullYear(),
                    mbdStart.getMonth(),
                    mbdStart.getDate() + maxDays
                );
                if( mbdStart.getTime() < mbdEnd.getTime()  ){
                    // retArr.push( mbdStart );
                    // retArr = retArr.concat( mbdStart );
                    retArr = [ ...retArr, mbdStart ];
                }
                aDiffer = mbdEnd.getTime() - mbdStart.getTime();
            }
        }
        // retArr.push( endDate );
        // retArr = retArr.concat( endDate );
        retArr = [ ...retArr, endDate ];
        return retArr;
    }

    public static hGetDaysDiffer( date1: Date, date2: Date ):number{
        let retRes : number = 0;
        retRes = Math.round( ( date1.getTime() - date2.getTime() ) / ( 1000*60*24*24 ) );
        return retRes;
    }

    public static hMakeDaysArray( startDate : Date, endDate : Date ) : Array< Date > {
        let resArr = new Array<Date>();
        let hDate = new Date( startDate );
        while( hDate.valueOf() < endDate.valueOf() ){
            let inDate = new Date( hDate.getFullYear(), hDate.getMonth(), hDate.getDate() );
            if( inDate.valueOf() <= endDate.valueOf()  ){
                // resArr.push( inDate );
                // resArr = resArr.concat( inDate );
                resArr = [ ...resArr, inDate ];
            }
            hDate.setDate( hDate.getDate() + 1 );
        }
        return resArr;
    }

    public static hMakeDisperseDaysArray( startDate :  Date, endDate : Date, maxCount : number = 30 ) : Array< Date > {
        let resArr = new Array<Date>();
        let mddaStart = new Date( startDate );
        let mddaEnd = new Date( endDate );
        let daysRange = Helpers.hGetDaysDiffer( mddaStart, mddaEnd );

        if( !( daysRange > maxCount ) ){
            resArr = Helpers.hMakeDatesArray( startDate, endDate );
        } else {
            // resArr.push( startDate );
            // resArr = resArr.concat( startDate );
            resArr = [ ...resArr, startDate ];
            let mddaInc = daysRange / ( maxCount-2 );
            let mddaCurr = new Date( 
                mddaStart.getFullYear(),
                mddaStart.getMonth(),
                mddaStart.getDate()+mddaInc
             );
            while( mddaCurr.valueOf() < mddaEnd.valueOf() ){
                // resArr.push( mddaCurr );
                // resArr = resArr.concat( mddaCurr );
                resArr = [ ...resArr, mddaCurr ];
                mddaCurr = new Date(
                    mddaCurr.getFullYear(),
                    mddaCurr.getMonth(),
                    mddaCurr.getDate()+mddaInc
                );
            }
            // resArr.push( endDate );
            // resArr = resArr.concat( endDate );
            resArr = [ ...resArr, endDate ];
        }
        return resArr;
    }

    public static hMakeSingleDayRateUrl( currID: number, aDate: Date ) : string {
        let resQryUrl : string = '';
        resQryUrl = 'http://www.nbrb.by/API/ExRates/Rates'
                    + '/' + currID.toString()
                    + '?onDate=' + Helpers.hDateToString( aDate );
        return resQryUrl;
    }

    public static hMakeDynamicRateUrl( currID: number, dateStart : Date, dateEnd : Date ) : string {
        let resQryUrl : string = '';
        resQryUrl = 'http://www.nbrb.by/API/ExRates/Rates/Dynamics'
                    +'/'+ currID.toString()
                    +'?startDate=' + Helpers.hDateToString( dateStart )
                    +'&endDate=' + Helpers.hDateToString( dateEnd );
        return resQryUrl;
    }

}
