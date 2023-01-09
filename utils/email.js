const nodemailer=require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports= class Email{
  constructor(user,url){
    this.to=user.email;
    this.firstName = user.name.split(' ')[0];
    this.url=url;
    this.from=`${process.env.EMAIL_FROM}`;
  }


//newtransport start...
  newTransport(){
    if(process.env.NODE_ENV==='production'){
        // Sendgrid
        return nodemailer.createTransport({
          service: 'SendGrid',
          auth: {
            user: process.env.SENDGRID_USERNAME,
            pass: process.env.SENDGRID_PASSWORD
          }
        });
    }
    return nodemailer.createTransport({
          host:process.env.EMAIL_HOST,
        //  host:"smtp.mailtrap.io",
          port:process.env.EMAIL_PORT,
        //  port:2525,
          auth:{
              user:process.env.EMAIL_USERNAME,
            // user:"4380f013e94cb4",
              pass:process.env.EMAIL_PASSWORD
              //pass:"ec977fdc615ac3"
          }
      });
  }
  //newtransport end...

  
  // Send the actual email start
  async send(template, subject) {
      // 1) Render HTML based on a pug template
      const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
        firstName: this.firstName,
        url: this.url,
        subject
      });


      const mailOptions={
        from:this.from,
        to:this.to,
        subject,
        html,
        text: htmlToText.fromString(html)
      };
      
    // 3) Create a transport and send email
     await this.newTransport().sendMail(mailOptions);

  };  
  // Send the actual email end

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }

};

