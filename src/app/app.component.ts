import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { JsonReaderService } from './json-reader.service';
import { TransactionModel } from './transaction';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  checkingBalance = 5824.76;
  title = 'Backbase-Interview';
  previewPage = false;
  checkingAccountName = 'Free Checking(4692)';
  dollarAmount;
  recipientAccount;
  userForm;
  transactionData: any;
  unfilteredData;
  @ViewChild('searchField') searchField: ElementRef;
  constructor(private jsonReader: JsonReaderService,
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe) { }
  ngOnInit() {
    this.jsonReader.getJSON().subscribe(data =>
      this.formatDate(data.data)
    );
    this.setFormGroup();
  }
  formatDate(transactionData: any) {
    this.transactionData = transactionData;
    this.transactionData?.forEach(item => {
      this.datePipe.transform(item.dates.valueDate);
    })
    this.sortTransactions('date');
    this.unfilteredData = this.transactionData;
  }
  setFormGroup() {
    this.userForm = new FormGroup({
      fromAccount: new FormControl({ value: this.checkingAccountName + ' - $' + this.checkingBalance, disabled: true }, [Validators.required]),
      toAccount: new FormControl('', Validators.required),
      dollarAmount: new FormControl('', Validators.required)
    });
  }
  sortTransactions(sortBy: string) {
    if (this.transactionData) {
      if (sortBy === 'date') {
        this.transactionData.sort((a, b) => {
          return <any>new Date(b.dates.valueDate) - <any>new Date(a.dates.valueDate);
        });
      } else if (sortBy === 'beneficiary') {
        this.transactionData.sort((a, b) => a.merchant.name.localeCompare(b.merchant.name))
      } else if (sortBy === 'amount') {
        this.transactionData.sort((a, b) => b.transaction.amountCurrency.amount - a.transaction.amountCurrency.amount);
      }
    }
  }
  onSubmitForm() {
    this.dollarAmount = Number(this.userForm.value.dollarAmount);
    if ((this.checkingBalance - this.dollarAmount) < -500) {
      this.userForm.controls.dollarAmount.setErrors({ invalidAmount: true })
    } else {
      this.recipientAccount = this.userForm.value.toAccount;
      this.previewPage = true;
    }
  }
  onCancel() {
    this.setFormGroup();
    this.previewPage = false;
  }
  onTransfer() {
    this.checkingBalance -= this.dollarAmount;
    this.checkingBalance = Number(this.decimalPipe.transform(this.checkingBalance, '1.2-2'));
    this.transactionData.unshift({
      dates: {
        valueDate: new Date().toString()
      },
      transaction: {
        amountCurrency: {
          amount: this.dollarAmount
        }
      },
      merchant: {
        name: this.recipientAccount
      }
    });
    this.unfilteredData = this.transactionData;
    this.setFormGroup();
    this.previewPage = false;
  }
  onSearch(event) {
    let value = event?.target?.value;
    if (!value) {
      this.searchField.nativeElement.value = '';
      this.transactionData = this.unfilteredData;
    } else {
      this.transactionData = Object.assign([], this.unfilteredData).filter(
        item => item.merchant.name.toLowerCase().indexOf(value.toLowerCase()) > -1
      )
    }
  }
  findImage() {
  }
}
