import mongoose from 'mongoose'
const CharitySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    description: {
        type: String,
        trim: true
    },
    updated: Date,
    created: {
        type: Date,
        default: Date.now
    },
    owner: {type: mongoose.Schema.ObjectId, ref: 'User'}
})

export default mongoose.model('Charity', CharitySchema)
