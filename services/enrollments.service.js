const { AppDataSource } = require("./../Database/data_source");
const AppError = require("./../error/err");
exports.createEnrollment = async (enrollmentData) => {
    try {
        const enrollmentRepository = AppDataSource.getRepository("Enrollment");
        const enrollment = enrollmentRepository.create(enrollmentData);
        return await enrollmentRepository.save(enrollment);
    } catch (err) {
        if (err.code === "23505") {
        throw new AppError(err.detail, 400);
        }
        throw err;
    }
}