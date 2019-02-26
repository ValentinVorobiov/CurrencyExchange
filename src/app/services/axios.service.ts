import { Injectable, Inject } from '@angular/core';

@Injectable() export class AxiosService{

    constructor(){}

    public requestHandle( aUrl: string, aMethod : string = 'GET', aPayload? : any ){
        let retPromise = new Promise(
            ( resolve, reject ) => {
                let XMLRequest = new XMLHttpRequest();
                XMLRequest.open( aMethod, aUrl, true );

                XMLRequest.onload = function(){
                    if( this.status === 200 || this.status === 201 ){
                        resolve( JSON.parse( this.response ) );
                    } else {
                        let err = new Error( this.statusText );
                        err.name = this.status.toString();
                        reject( err );
                    }
                }

                XMLRequest.onerror = function(){
                    let err = new Error( this.statusText || 'Network Error: Destination could not be reached :( ' );
                }

                if( aPayload ){
                    XMLRequest.send( aPayload );
                } else {
                    XMLRequest.send();
                }

            }
        );
        return retPromise;
    }

    public requestGet( aUrl: string ) : any {
        let aResponse : string = '';
        let self = this;
        let retResult = new Promise( ( resolve, reject ) =>{ 
            self.requestHandle( aUrl, 'GET' )
                .then( ( ( responce ) => {
                    return resolve( responce );
                } ) )
                .catch( ( err ) => {
                    reject( err );
                } );
         } );
        return retResult;
    }


} 