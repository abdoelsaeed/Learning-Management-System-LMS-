const { AppDataSource } = require("./../Database/data_source");
const AppError = require("./../error/err");

exports.createPayment = async (paymentData) => {
    try {
        const paymentRepository = AppDataSource.getRepository("Payment");
        const payment = paymentRepository.create(paymentData);
        return await paymentRepository.save(payment);
    } catch (err) {
        throw new AppError("Failed to create payment", 500);
    }
};

exports.getPaymentBySessionId = async (sessionId) => {
    try {
        const paymentRepository = AppDataSource.getRepository("Payment");
        return await paymentRepository.findOneBy({ sessionId: sessionId });
    } catch (err) {
        throw new AppError("Failed to retrieve payment by session ID", 500);
    }
}; 