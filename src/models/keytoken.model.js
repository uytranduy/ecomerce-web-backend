import mongoose, { Schema, model } from "mongoose";


const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = "Keys"

const keyTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
        required: true

    },
    publicKey: {
        type: String, required: true
    },
    privateKey: {
        type: String, required: true
    },
    refreshToken: {
        type: [String],
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})


export default model(DOCUMENT_NAME, keyTokenSchema)
