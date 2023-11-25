interface BlockHeader {
  index: number;
  timestamp: Date;
  previousHash: string;
}

interface Block {
  header: BlockHeader;
  transactions: Transaction[];
}

interface Transaction {
  report: string;
  followUpDeadline: Date;
  signature: string;
}

class BlockHeader {
  constructor(index: number, timestamp: Date, previousHash: string) {
    this.index = index;
    this.timestamp = timestamp;
    this.previousHash = previousHash;
  }
}

class Block {
  constructor(header: BlockHeader, transactions: Transaction[] ) {
    this.header = header;
    this.transactions = transactions;
  }
}
