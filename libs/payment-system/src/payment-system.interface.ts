export interface PaymentSourceData {
  type: string;
  token: string;
  acceptance_token: string;
  customer_email: string;
}

export interface TransactionData {
  amount_in_cents: number;
  signature?: string;
  currency: string;
  customer_email: string;
  payment_method: {
    installments: number;
  };
  reference: string;
  payment_source_id: string;
}
