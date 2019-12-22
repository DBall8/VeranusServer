import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DataViewComponent } from './data-view/data-view.component';
import { TimeStampComponent } from './time-stamp/time-stamp.component';

@NgModule({
  declarations: [
    AppComponent,
    DataViewComponent,
    TimeStampComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
