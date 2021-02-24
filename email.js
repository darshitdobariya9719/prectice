const nodemailer=require('nodemailer');

const sendEmail=async (prosses)=>{
    const transporter=nodemailer.createTransport({
        host:'smtp.mailtrap.io',
        port:587,
        auth:{
            user:'2437399b459127',
            pass:'02a8ae03dd45aa'
        }
    });
    const mailoption={
        from:'darshit <hellow@darshit.io>',
        to:prosses.email,
        subject:prosses.subject,
        text:prosses.message
    };
    await transporter.sendMail(mailoption);
};
module.exports=sendEmail;