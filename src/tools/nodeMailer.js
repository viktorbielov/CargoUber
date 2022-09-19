const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'hw3.node.js@gmail.com',
        pass: 'obdzrbawfgcvatzn'
    }
}, {
    from: 'Nodejs HW-3 <hw3.node.js@gmail.com>'
});

const mail = message => {
    transporter.sendMail(message);
}

module.exports = {mail};


