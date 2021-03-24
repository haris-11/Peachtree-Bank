import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PeachtreeBankService } from './peachtree-bank.service';

@Component({
  selector: 'app-root',
  templateUrl: './peachtree-bank.component.html',
  styleUrls: ['./peachtree-bank.component.scss']
})

export class PeachtreeBank implements OnInit {
  @ViewChild('searchField') searchField: ElementRef;
  @ViewChild('amountInputField') amountInputField: ElementRef;
  checkingBalance = 5824.76;
  title = 'Backbase-Interview';
  previewPage = false;
  checkingAccountName = 'Free Checking(4692)';
  dollarAmount: number;
  recipientAccount: string;
  userForm: FormGroup;
  transactionData: any;
  unfilteredData: any;
  credit = '+';
  debit = '-';
  constructor(private peachtreeBankService: PeachtreeBankService) { }

  ngOnInit() {
    this.peachtreeBankService.getJSON().subscribe(data =>
      this.setTransactionData(data.data)
    );
    this.setFormGroup();
  }

  async setTransactionData(transactionData: any) {
    this.transactionData = transactionData;
    this.sortTransactions('date')
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
    if (!this.dollarAmount || isNaN(this.dollarAmount)) {
      this.userForm.controls.dollarAmount.setErrors({ required: true });
      this.userForm.controls.dollarAmount.markAsTouched();
    }
    if (!this.userForm.value.toAccount) {
      this.userForm.controls.toAccount.setErrors({ required: true });
      this.userForm.controls.toAccount.markAsTouched();
    }
    if ((this.checkingBalance - this.dollarAmount) < -500) {
      this.userForm.controls.dollarAmount.setErrors({ invalidAmount: true });
    } else if (this.dollarAmount && this.userForm.value.toAccount) {
      this.recipientAccount = this.userForm.value.toAccount;
      this.previewPage = true;
    }
  }

  onCancel() {
    this.setFormGroup();
    this.previewPage = false;
  }

  onTransfer() {
    this.checkingBalance = Number((this.checkingBalance -= this.dollarAmount).toFixed(2));
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
      },
      categoryCode: "#ff2136"
    });
    this.setFormGroup();
    this.unfilteredData = this.transactionData;
    this.dollarAmount = 0;
    this.previewPage = false;
  }

  onSearch(event) {
    let value = event?.target?.value;
    if (!value) {
      this.searchField.nativeElement.value = '';
      this.transactionData = this.unfilteredData;
    } else {
      this.transactionData = Object.assign([], this.unfilteredData).filter(
        item => item.merchant.name.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
          item.transaction.type.toLowerCase().indexOf(value.toLowerCase()) > -1
      )
    }
  }
}
