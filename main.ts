const { createHash } = require("crypto");

interface BlockHeader {
  index: number;
  timestamp: number; // Seconds since epoch
  previousHash: string;
}

interface Block {
  header: BlockHeader; 
  transactions: Transaction[];
  hash: string;
}

interface Transaction {
  structureId: number;
  reporterPublicKey: string;
  structureCondition: "very poor" | "poor" | "fair" | "good" | "very good";
  reportSummary: string;
  reportLink: string;
  reportChecksum: string;
  followUpDeadline: number; // unix timestamp
  signature: string;
}

class BlockHeader {
  constructor(index: number, previousHash: string) {
    this.index = index;
    this.timestamp = new Date('Mon, 27 Nov 2024 08:09:50 GMT').getTime();
    this.previousHash = previousHash;
  }
}

class Block {
  constructor(header: BlockHeader, transactions: Transaction[]) {
    this.header = header;
    this.transactions = transactions;
    this.hash = this.calculateHash();
  }

  calculateHash = () => {
    const hash = createHash('sha256')

    const hashedValues = [
      this.header.index.toString(),
      this.header.timestamp.toString(), 
      this.header.previousHash,
      JSON.stringify(this.transactions)
    ]
    
    hashedValues.map((elem) => hash.update(elem));

    return hash.digest().toString('hex');
  } 
}

const firstTransaction : Transaction = {
  structureId: 1,
  reporterPublicKey: "sAmPlEkEy",
  structureCondition: "fair",
  reportSummary: "This building is fine",
  reportLink: "https://localhost:3000/yeet",
  reportChecksum: "12345abcde",
  followUpDeadline: new Date('Mon, 27 Nov 2023 08:09:50 GMT').setFullYear(2024),
  signature: createHash("sha256", "Test")
};
const originBlockHeader : BlockHeader = new BlockHeader(0, "0".repeat(64));
const originBlock : Block = new Block(originBlockHeader, [firstTransaction]);

console.log(originBlock.header);
console.log(originBlock.hash);
