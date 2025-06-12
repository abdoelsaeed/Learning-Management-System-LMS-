const courseService = require("./../services/course.service");
const catchAsync = require("./../error/catchAsyn");
const AppError = require("./../error/err");
const enrollmentService = require("./../services/enrollments.service");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

exports.createEnrollment = catchAsync(async (req, res, next) => {
    const  userId  = req.user.id;
    const { courseId } = req.params;
    console.log('courseId:', courseId);
    const { success_url, cancel_url } = req.query;

    if (!courseId) {
        return next(new AppError("Please provide courseId", 400));
    }
    const course = await courseService.getCourseById(courseId);
    console.log(course)
    if (!course) {
        return next(new AppError("Course not found", 404));
    }
    let enrollment;
    //& if the course is free 
    if (+course.price == 0.00){
        console.log(+course.price);
        enrollment = await enrollmentService.createEnrollment({user: userId,course: courseId,});
        return res.status(200).json({
            status: "success",
            message: "Enrollment created successfully",
            data: {
            enrollment,
            },
        });
    }
    if (!success_url && !cancel_url && +course.price > 0) {
        return next(
            new AppError("You must put the success_url and cancel_url in query ", 404)
        );
    }
    //^ id course is not free use stripe to create a checkout session
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: "egp", // You might want to make this configurable
                    product_data: {
                        name: course.title,
                        description: course.description,
                        images: [course.image],
                    },
                    unit_amount: course.price * 100, // Stripe expects amount in cents
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: success_url,
        cancel_url: cancel_url,
        client_reference_id: userId.toString(),
        customer_email: req.user.email,
    });
    return res.status(200).json({
        status: "success",
        message: "Enrollment created successfully",
        data: {
            url: session.url,
            success_url: session.success_url,
            cancel_url: session.cancel_url,
            expires_at: new Date(session.expires_at * 1000),
            sessionId: session.id,
            totalPrice: session.amount_total,
        },
    });
});