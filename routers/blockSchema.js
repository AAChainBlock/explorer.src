const mongoose = require("mongoose") 
const TransactionSchema = mongoose.Schema({
    // actions:Object
})

const ActionStracesSchema = mongoose.Schema({
    // actions:Object
})

const PublicKeySchema = mongoose.Schema({
    // actions:Object
})

const AccountSchema = mongoose.Schema({
    // actions:Object
})

const TransactionTracesSchema = mongoose.Schema({
    // actions:Object
})



const Transaction = mongoose.model("transactions", TransactionSchema)
const ActionStraces = mongoose.model("action_traces", ActionStracesSchema)
const Block = mongoose.model("blocks", ActionStracesSchema)
const Accounts = mongoose.model("accounts", AccountSchema)
const PublicKey = mongoose.model("pub_keys", PublicKeySchema)
const TransactionTraces =  mongoose.model("transaction_traces", TransactionTracesSchema)
module.exports = {
    Transaction,
    ActionStraces,
    Block,
    Accounts,
    PublicKey,
    TransactionTraces
}