import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { EmailService } from 'src/services/Email.services';

@Processor('opt_email')
@Injectable()
export class EmailProcessor extends WorkerHost{
    
    constructor(private readonly emailService:EmailService){
        super()
    }
    
    async process(job: Job<any>) {
        if(job.name == 'forgetPasswordOtp'){
            await this.emailService.sendForgetPasswordEmailOtp(job.data.email,job.data.otp,"Forget Password OTP");
        }else if(job.name == "send_verify_email_otp"){
            await this.emailService.sendForgetPasswordEmailOtp(job.data.email,job.data.otp,"verify email OTP");
        }else{
        }
    }
}