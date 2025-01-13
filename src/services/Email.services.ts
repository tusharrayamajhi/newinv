import { HttpException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from 'nodemailer';



@Injectable()
export class EmailService {

    private transporter: nodemailer.Transporter;
    constructor(
        private configService: ConfigService,
        
    ) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.configService.get('EMAIL_USER'),
                pass: this.configService.get('EMAIL_PASSWORD')
            }
        });
    }

    async sendForgetPasswordEmailOtp(email: string, otp: string,subject:string) {
        try {

            await this.transporter.sendMail({
                from: this.configService.get('EMAIL_USER'),
                to: email,
                subject: subject,
                html: `<h1>Your OTP is ${otp}. valid for 2 min</h1>`
            })

        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }
            console.log(err)
        }
    }


    

}