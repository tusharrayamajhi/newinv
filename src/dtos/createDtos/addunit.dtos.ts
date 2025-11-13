import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';


export class createUnitsDto {

    @ApiProperty({
        description: 'The name of the unit',
        example: 'Kilogram'
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'The short name of the unit',
        example: 'kg'
    })
    @IsNotEmpty()
    @IsString()
    shortName: string;


    @ApiProperty({
        description: 'The ID of the company',
        example: '12345'
    })
    @IsOptional()
    @IsString()
    companyId?: string;

}