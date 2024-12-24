import { ApiProperty } from "@nestjs/swagger"
import { IsEmail,  IsNotEmpty, IsString, MaxLength } from "class-validator"


export class LoginDto {
    @ApiProperty({
        description: "enter email id",
        example: 'john.doe3@example.com',
    })
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(100)
    email: string

    @ApiProperty({
      description:"enter password",
      example:"StrongPassword123!"
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(225)
    password: string
}