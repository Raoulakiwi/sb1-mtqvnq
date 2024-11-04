export interface TokenHolder {
  address: string;
  balance: string;
}

export interface Token {
  address: string;
  symbol: string;
  balance: string;
}

export interface Distribution {
  address: string;
  amount: bigint;
}