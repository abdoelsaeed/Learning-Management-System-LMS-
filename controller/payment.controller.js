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
        console.log('Webhook event constructed successfully. Event type:', event.type);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        console.log('Received checkout.session.completed event.');
        const session = event.data.object;
        const userId = session.client_reference_id;
        const courseId = session.metadata.courseId; // Assuming you add courseId to metadata
        const amount = session.amount_total / 100; // Convert cents to dollars
        const sessionId = session.id;

        console.log('Extracted Session Data:', { userId, courseId, amount, sessionId });

        if (!userId || !courseId || !amount || !sessionId) {
            console.error('Missing data in Stripe session for payment creation', { userId, courseId, amount, sessionId });
            return next(new AppError('Missing data in Stripe session for payment creation', 400));
        }

        // Check if payment already exists to prevent duplicates
        const existingPayment = await paymentService.getPaymentBySessionId(sessionId);
        console.log('Existing Payment Check:', existingPayment ? 'Payment already processed.' : 'No existing payment found.');
        if (existingPayment) {
            return res.status(200).json({ received: true, message: 'Payment already processed.' });
        }

        const course = await courseService.getCourseById(courseId);
        console.log('Course found:', course ? course.title : 'No course found');
        if (!course) {
            return next(new AppError('Course not found for completed session', 404));
        }

        console.log('Attempting to create Enrollment...');
        const enrollment = await enrollmentService.createEnrollment({
            user_id: userId,
            course_id: courseId,
        });
        console.log('Enrollment created successfully:', enrollment);

        console.log('Attempting to create Payment...');
        const payment = await paymentService.createPayment({
            user_id: userId,
            course_id: courseId,
            sessionId: sessionId,
            amount: amount,
            status: 'completed',
        });
        console.log('Payment created successfully:', payment);

    }

    res.status(200).json({ received: true });
}); 