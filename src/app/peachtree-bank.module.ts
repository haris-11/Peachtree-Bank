import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { PeachtreeBank } from './peachtree-bank.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PeachtreeBankService } from './peachtree-bank.service';


@NgModule({
  declarations: [
    PeachtreeBank
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [PeachtreeBankService],
  bootstrap: [PeachtreeBank]
})
export class AppModule { }
