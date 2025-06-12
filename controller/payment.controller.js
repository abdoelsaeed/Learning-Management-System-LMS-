const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const AppError = require('./../error/err');
const catchAsync = require('./../error/catchAsyn');
const paymentService = require('./../services/payment.service');
const enrollmentService = require('./../services/enrollments.service');
const courseService = require('./../services/course.service');

exports.createPaymentCheckout = catchAsync(async (req, res, next) => {
    // This will be called after a successful checkout session.
    // The actual payment creation happens in the webhook handler.
    res.status(200).json({
        status: 'success',
        message: 'Checkout session created, awaiting webhook confirmation',
    });
});

exports.stripeWebhook = catchAsync(async (req, res, next) => {
    const signature = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.client_reference_id;
        const courseId = session.metadata.courseId; // Assuming you add courseId to metadata
        const amount = session.amount_total / 100; // Convert cents to dollars
        const sessionId = session.id;

        if (!userId || !courseId || !amount || !sessionId) {
            return next(new AppError('Missing data in Stripe session for payment creation', 400));
        }

        // Check if payment already exists to prevent duplicates
        const existingPayment = await paymentService.getPaymentBySessionId(sessionId);
        if (existingPayment) {
            return res.status(200).json({ received: true, message: 'Payment already processed.' });
        }

        const course = await courseService.getCourseById(courseId);
        if (!course) {
            return next(new AppError('Course not found for completed session', 404));
        }

        const enrollment = await enrollmentService.createEnrollment({
            user: userId,
            course: courseId,
        });

        const payment = await paymentService.createPayment({
            user: userId,
            course: courseId,
            sessionId: sessionId,
            amount: amount,
            status: 'completed',
        });

        console.log('Payment and Enrollment created successfully:', payment, enrollment);
    }

    res.status(200).json({ received: true });
}); 