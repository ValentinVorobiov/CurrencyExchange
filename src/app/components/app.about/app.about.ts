import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-about',
    templateUrl: 'app.about.html',
    styleUrls: ['app.about.css'] 
}) export class AppAbout {
    public aacAuthor: string = 'Vorobiov Valentin';
    public aacGitUrl: string = 'https://github.com/ValentinVorobiov/CurrencyExchange';
    public aacGitPagesUrl : string = '';
    public aacDesign : string = 'Currency.pdf'
}