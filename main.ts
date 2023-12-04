const { createHash } = require("crypto");

interface Blockchain {
  blocks: Block[];
}

interface Block {
  timestamp: number; // Seconds since epoch
  previousHash: string;
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

class Block {
  constructor(previousHash: string, transactions: Transaction[]) {
    this.timestamp = new Date('Mon, 27 Nov 2024 08:09:50 GMT').getTime();
    this.previousHash = previousHash;
    this.transactions = transactions;
    this.hash = this.calculateHash();
  }

  calculateHash = () => {
    const hash = createHash('sha256')

    const hashedValues = [
      this.timestamp.toString(), 
      this.previousHash,
      JSON.stringify(this.transactions)
    ];
    
    hashedValues.map((elem) => hash.update(elem));

    return hash.digest().toString('hex');
  } 
}

class Blockchain {
  constructor() {
    this.blocks = [];
  }

  addBlock = (block: Block) => { this.blocks.push(block); }

  createGenesisBlock = () => {
    if (this.blocks.length !== 0) return;

    const sampleTransaction : Transaction = {
      structureId: -1,
      reporterPublicKey: "SAMPLEKEY",
      structureCondition: "fair",
      reportSummary: "No building was examined; this is a test.",
      reportLink: "https://localhost:3000",
      reportChecksum: "12345abcde",
      followUpDeadline: new Date('Mon, 27 Nov 2023 08:09:50 GMT').setFullYear(2024),
      signature: createHash("sha256", "Test")
    };

    const genesisBlock : Block = new Block("0".repeat(64), [sampleTransaction]);

    this.addBlock(genesisBlock);
  }
}


const infraChain : Blockchain = new Blockchain();
infraChain.createGenesisBlock();
console.log(infraChain.blocks[0].hash);
