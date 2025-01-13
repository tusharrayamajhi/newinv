import { PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from '../createDtos/addRoles.dtos';

export class UpdateRoleDto extends PartialType(CreateRoleDto){}
