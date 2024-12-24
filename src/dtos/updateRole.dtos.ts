import { PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './addRoles.dtos';

export class UpdateRoleDto extends PartialType(CreateRoleDto){
  // @ApiProperty({
  //   description: 'Name of the role',
  //   example: 'Admin',
  //   required: false,
  // })
  // @IsOptional()
  // @IsString()
  // @Length(1, 200)
  // name?: string;

  // @ApiProperty({
  //   description: 'Description of the role',
  //   example: 'Administrator role with full access',
  //   required: false,
  // })
  // @IsOptional()
  // @IsString()
  // description?: string;

  // @ApiProperty({
  //     description: 'Array of permission IDs associated with this role',
  //     example: [1, 2, 3],
  //     required: false,
  //   })
  //   @IsOptional()
  //   @IsArray()
  //   permission?: string[]; 
}
