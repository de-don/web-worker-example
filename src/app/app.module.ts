import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import 'reflect-metadata';

import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { StatisticRowComponent } from './components/statistic-row/statistic-row.component';
import { StatisticTableComponent } from './components/statistic-table/statistic-table.component';
import { StatisticChildTableComponent } from './components/statistic-child-table/statistic-child-table.component';

@NgModule({
  declarations: [
    AppComponent,
    StatisticRowComponent,
    StatisticTableComponent,
    StatisticChildTableComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
