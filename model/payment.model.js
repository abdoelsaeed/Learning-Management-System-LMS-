const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Payment must belong to a User!']
    },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: [true, 'Payment must belong to a Course!']
    },
    sessionId: {
        type: String,
        required: [true, 'Payment must have a sessionId!']
    },
    amount: {
        type: Number,
        required: [true, 'Payment must have an amount!']
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

paymentSchema.pre(/^find/, function(next) {
    this.populate('user').populate('course');
    next();
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment; 