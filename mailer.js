const nodemailer = require('nodemailer');

module.exports = (formulaire) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hackathon3wildtours@gmail.com', // generated ethereal user
            pass: 'jecode4tours' // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"RDV site" <email', // sender address
        to: formulaire.attendees[0].email, // list of receivers
        subject: 'Votre rendez-vous', // Subject line
        text: '', // plain text body
        html: '<p>Bonjour,</p> <p>Votre demande de rendez-vous a bien été enregistrée.</p>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });

}
