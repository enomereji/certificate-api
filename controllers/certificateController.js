const Student = require("../models/userModel");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

// Email transporter setup
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

// Function to generate certificate as a PDF
const generateCertificate = (userName) => {
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, `../certificates/${userName}_certificate.pdf`);

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(30).text("Certificate of Completion", { align: "center" });
    doc.moveDown();
    doc.fontSize(24).text(`This certificate is awarded to`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(36).text(userName, { align: 'center' });
    doc.moveDown();
    doc.fontSize(18).text(`For successfully completing the course`, { align: 'center' });
    doc.end();

    return filePath;
};

// Function to send certificate by email
const sendCertificateByEmail = async (userEmail, userName, filePath) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "Careerex Certificate of Completion",
        text: `Dear ${userName}, \n\nPlease find attached your certificate of completion.`,
        attachments: [
            {
                filename: `${userName}_certificate.pdf`,
                path: filePath,
            }
        ]
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

// Create a student (without verification)
exports.createStudent = async (req, res) => {
    try {
        const { name, email, course, dateOfGraduation } = req.body;

        const student = new Student({ name, email, course, dateOfGraduation });
        await student.save();

        res.status(201).json({ message: "Student created successfully!", student });
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ message: 'Error creating student', error });
    }
};

// Generate and send certificate to student
exports.generateAndSendCertificate = async (req, res) => {
    try {
        const { email } = req.body;

        const student = await Student.findOne({ email });

        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        const filePath = generateCertificate(student.name);
        await sendCertificateByEmail(student.email, student.name, filePath);

        student.certificateSent = true;
        await student.save();

        res.status(200).json({ message: "Certificate sent successfully!" });
    } catch (error) {
        console.error("Error generating or sending certificate:", error);
        res.status(500).json({ error: "An error occurred while generating or sending the certificate" });
    }
};
