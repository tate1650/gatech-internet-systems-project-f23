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
var firstTransaction = {
    structureId: 1,
    reporterPublicKey: "sAmPlEkEy",
    structureCondition: "fair",
    reportSummary: "This building is fine",
    reportLink: "https://localhost:3000/yeet",
    reportChecksum: "12345abcde",
    followUpDeadline: new Date('Mon, 27 Nov 2023 08:09:50 GMT').setFullYear(2024),
    signature: createHash("sha256", "Test")
};
var originBlock = new Block("0".repeat(64), [firstTransaction]);
console.log(originBlock.hash);
