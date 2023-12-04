var createHash = require("crypto").createHash;
var Block = /** @class */ (function () {
    function Block(previousHash, transactions) {
        var _this = this;
        this.calculateHash = function () {
            var hash = createHash('sha256');
            var hashedValues = [
                _this.timestamp.toString(),
                _this.previousHash,
                JSON.stringify(_this.transactions)
            ];
            hashedValues.map(function (elem) { return hash.update(elem); });
            return hash.digest().toString('hex');
        };
        this.timestamp = new Date('Mon, 27 Nov 2024 08:09:50 GMT').getTime();
        this.previousHash = previousHash;
        this.transactions = transactions;
        this.hash = this.calculateHash();
    }
    return Block;
}());
var Blockchain = /** @class */ (function () {
    function Blockchain() {
        var _this = this;
        this.addBlock = function (block) { _this.blocks.push(block); };
        this.createGenesisBlock = function () {
            if (_this.blocks.length !== 0)
                return;
            var sampleTransaction = {
                structureId: -1,
                reporterPublicKey: "SAMPLEKEY",
                structureCondition: "fair",
                reportSummary: "No building was examined; this is a test.",
                reportLink: "https://localhost:3000",
                reportChecksum: "12345abcde",
                followUpDeadline: new Date('Mon, 27 Nov 2023 08:09:50 GMT').setFullYear(2024),
                signature: createHash("sha256", "Test")
            };
            var genesisBlock = new Block("0".repeat(64), [sampleTransaction]);
            _this.addBlock(genesisBlock);
        };
        this.blocks = [];
    }
    return Blockchain;
}());
var infraChain = new Blockchain();
infraChain.createGenesisBlock();
console.log(infraChain.blocks[0]);
