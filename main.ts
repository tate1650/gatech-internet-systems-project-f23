/* 
  InfraChain: A blockchain for infrastructure reporting and documentation
  Author: Tate Mauzy
  For the Georgia Tech CS6675 Final Project
  
  The following blockchain implementation was based heavily on the first
  video in the YouTube blockchain tutorial by Simply Explained, which can be 
  found here: https://www.youtube.com/watch?v=zVqczFZr124&list=PLzvRQMJ9HDiTqZmbtFisdXFxul5k0F-Q4&index=1
*/

import { BSTree } from "typescript-collections";
const { createHash } = require("crypto");
// Use of elliptic library for ECC taken from Simply Explained's YouTube 
// blockchain tutorial Part 4: Signing Transactions, at
// https://www.youtube.com/watch?v=kWQ84S13-hw&list=PLzvRQMJ9HDiTqZmbtFisdXFxul5k0F-Q4&index=4.
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');


interface Blockchain {
  blocks: Block[];
}

interface Block {
  index: number;
  timestamp: number; // Seconds since epoch
  previousHash: string;
  transactions: Transaction[];
  hash: string;
  // TODO: Don't use destructive operations on these objects
  structureMap: Map<number, number> // K: structureId, V: timestamp
  deadlineTable: BSTree<[number, number]> // [timestamp, blockIndex]
}

interface Transaction {
  structureId: number;
  reporterPublicKey: string;
  structureCondition: "very poor" | "poor" | "fair" | "good" | "very good";
  reportSummary: string;
  reportLink: string;
  reportChecksum: string;
  followUpDeadline: number; // unix timestamp
  signature?: string;
}

class Block {
  constructor(
    index: number, 
    previousBlock: Block | null, 
    transactions: Transaction[]
  ) {
    this.index = index;
    this.timestamp = Date.now();
    this.previousHash = previousBlock === null ? "0".repeat(64) : previousBlock.hash;
    this.transactions = transactions;
    this.hash = this.calculateHash();

    const optimizationStructures = this.updatedOptimizationStructures(previousBlock);
    this.structureMap = optimizationStructures[0];
    this.deadlineTable = optimizationStructures[1];
  }

  updatedOptimizationStructures = (previousBlock : Block | null) => {
    const followUpDeadlines = this.transactions.map(
      transaction => transaction.followUpDeadline
    );
    const structureIds = this.transactions.map(
      transaction => transaction.structureId
    );
    
    // TODO: Make this not assume the timestamps will be different
    const minimumTimestamp = Math.min(...followUpDeadlines);
    const timestampIndex = followUpDeadlines.findIndex(
      timestamp => timestamp === minimumTimestamp
    )

    const minTimestampStructureId = structureIds[timestampIndex];

    let structureMap; let deadlineTable;
    if (previousBlock === null) {
      structureMap = new Map();
      deadlineTable = new BSTree<[number, number]>(
        (keyValPair1, keyValPair2) => {
          const key1 = keyValPair1[0];
          const key2 = keyValPair2[0];

          if (key1 < key2) return -1;
          else if (key1 > key2) return 1;
          return 0
        }
      );
    } else {
      structureMap = previousBlock.structureMap;
      deadlineTable = previousBlock.deadlineTable;
    }
    
    structureMap.delete(minTimestampStructureId);
    structureMap.set(minTimestampStructureId, minimumTimestamp);

    // The zero means nothing here; this is effectively a makeshift
    // delete-by-key because I'm pretty sure their BSTreeKV implementation
    // is broken.
    deadlineTable.remove([minimumTimestamp, 0]); 
    deadlineTable.add([minimumTimestamp, this.index])

    return [structureMap, deadlineTable];
  }

  calculateHash = () => {
    const hash = createHash('sha256');

    const hashedValues = [
      this.index.toString(),
      this.timestamp.toString(), 
      this.previousHash,
      JSON.stringify(this.transactions)
    ];
    
    hashedValues.map((elem) => hash.update(elem));

    return hash.digest().toString('hex');
  }

  isTransactionValid = (transaction: Transaction) => {
    const transactionCopy = {...transaction};
    delete transactionCopy.signature; // Since that wasn't signed, of course
    
    const hash = createHash('sha256');
    hash.update(JSON.stringify(transactionCopy));
    const transactionHash = hash.digest().toString('hex');
    const publicKey = ec.keyFromPublic(transaction.reporterPublicKey, 'hex');
    
    return publicKey.verify(transactionHash, transaction.signature);
  }

  areAllTransactionsValid = () => this.transactions.reduce(
    (areAllPreviousTransactionsValid, transaction) => (
      areAllPreviousTransactionsValid && this.isTransactionValid(transaction)
    ),
    true
  )

  isBlockValid = (previousBlock : Block | null) => {
    const isBlockHashValid = (this.calculateHash() == this.hash);

    const isPreviousBlockHashValid = (
      previousBlock == null || previousBlock.hash == this.previousHash
    );

    return isBlockHashValid && isPreviousBlockHashValid;
  }
}

class Blockchain {
  constructor() {
    this.blocks = [];
  }

  addBlock = (block: Block) => {
    if (!block.areAllTransactionsValid()) return;

    this.blocks.push(block); 
  }

  createGenesisBlock = () => {
    if (this.blocks.length !== 0) return;

    const keyPair = ec.genKeyPair();
    const sampleTransaction : Transaction = {
      structureId: -1,
      reporterPublicKey: keyPair.getPublic('hex'),
      structureCondition: "fair",
      reportSummary: "No building was examined; this is a test.",
      reportLink: "https://localhost:3000",
      reportChecksum: "12345abcde",
      followUpDeadline: new Date('Mon, 27 Nov 2023 08:09:50 GMT').setFullYear(2024),
    };
    const hash = createHash('sha256');
    hash.update(JSON.stringify(sampleTransaction));
    const sampleTransactionHash = hash.digest().toString('hex')
    const signature = keyPair.sign(sampleTransactionHash);
    sampleTransaction.signature = signature.toDER('hex');

    const genesisBlock : Block = new Block(0, null, [sampleTransaction]);

    this.addBlock(genesisBlock);
  }

  isChainValid = () => this.blocks.reduce(
    (
      accumulator : [boolean, Block | null], 
      block : Block
    ) => {
      const arePreviousBlocksValid = accumulator[0];
      const previousBlock = accumulator[1];
      
      const areBlocksValid = arePreviousBlocksValid && block.isBlockValid(previousBlock);

      const result : [boolean, Block] = [areBlocksValid, block];
      return result;
    },
    [true, null]
  )[0];
}

const infraChain : Blockchain = new Blockchain();
infraChain.createGenesisBlock();
console.log(infraChain.blocks[0]);
// console.log(infraChain.isChainValid());
