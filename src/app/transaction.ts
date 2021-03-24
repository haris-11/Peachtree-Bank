export interface TransactionModel {
    categoryCode?: string;
    dates: {
        valueDate: string;
    };
    transaction: {
        amountCurrency: {
            amount: number;
            currencyCode?: string;
        },
        type?: string;
        creditDebitIndicator?: string;
    };
    merchant: {
        name: string;
        accountNumber?: string;
    };
    imageURL?: string;
};