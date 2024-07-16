import User from "@/Models/user.model";
import nodemailer from "nodemailer";
import bcryptjs from 'bcryptjs'

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        //TODO: configure mail for usage
        const hashedToken = await bcryptjs.hash(userId.toString(), 10)

        if (emailType === "verify" || emailType === "reset") {
            const updatedUser = await User.findByIdAndUpdate(userId, {
              $set: {
                verifyToken: hashedToken,
                verifyTokenExpiry: new Date(Date.now() + 3600000)
              }
            });
      
            if (!updatedUser) {
              throw new Error(`User with ID ${userId} not found`);
            }
          } else {
            throw new Error(`Invalid email type: ${emailType}`);
          }

        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "ae58ec35aed09f",
              pass: "c126762750eaee"
            }
          });

        const mailOptions = {
            from: 'hitesh@gmail.com',
            to: email,
            subject: emailType === "verify" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "verify" ? "Verify your email" : "Reset your password"}
            or copy and paste this URL in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`
        };

        const mailResponse = await transport.sendMail(mailOptions);
        return mailResponse;

    } catch (error: any) {
        throw new Error(error.message);
    }
};
