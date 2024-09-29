const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    course: {
        type: String,
        required: true,
    },
    dateOfGraduation: {
        type: Date,
        required: true,
    },
    certificateSent: {
        type: Boolean,
        default: false,
    },
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
