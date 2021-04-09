import mongoose from 'mongoose'
const DonationSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: 'Amount is required'
    },
    owner: {type: mongoose.Schema.ObjectId, ref: 'User'},
    charity: {type: mongoose.Schema.ObjectId, ref: 'Charity'}
})

export default mongoose.model('Donation', DonationSchema)
