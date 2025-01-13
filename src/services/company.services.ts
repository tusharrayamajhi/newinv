import { Companies } from 'src/entities/Company.entities';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Equal, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { returnObj } from 'src/utils/returnObj';
import { roles } from 'src/object/roles.object';
import { Roles } from 'src/entities/Roles.entities';
import { Permission } from 'src/entities/permission.entites';
import { baseDto } from 'src/dtos/createDtos/addCompany.dtos';
import { baseUpdateDto } from 'src/dtos/updateDtos/updateCompany.dtos';


@Injectable()
export class CompanyService {
   

    constructor(
        @InjectRepository(Companies) private readonly companyRepo: Repository<Companies>,
        @InjectRepository(Roles) private readonly roleRepo: Repository<Roles>,
        @InjectRepository(Permission) private readonly permissionRepo: Repository<Permission>
    ) { }

    async getCompanyById(id: string,req:any) {
        try {
            if(req.user.role != roles.SuperAdmin){
                const company = await this.companyRepo.findOneBy({ id: Equal(id),users:{id:req.user.id}})
                if(!company){
                    throw new HttpException("company not found",HttpStatus.NOT_FOUND)
                }
                return returnObj(HttpStatus.OK, "success", company);
            }
            const company = await this.companyRepo.findOneBy({ id: Equal(id)})
            if(!company){
                throw new HttpException("invalid company id",HttpStatus.NOT_FOUND)
            }
            return returnObj(HttpStatus.OK, "success", company);
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getAllCompany(page:number) {
        try {
            const Companies = await this.companyRepo.find({skip:page*10,take:10});
            if(!Companies || Companies.length == 0){
                throw new HttpException("no companies found",HttpStatus.NOT_FOUND)
            }
            return returnObj(HttpStatus.OK, "successfully get All companies", Companies);
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async addCompany(createCompany: baseDto,req:any) {
        try {
            const queryRunner = this.companyRepo.manager.connection.createQueryRunner();
            await queryRunner.startTransaction()
            try {
            const company = await queryRunner.manager.findOne(Companies, {
                where: [
                { email: Equal(createCompany.email) },
                { company_code: Equal(createCompany.company_code) },
                { pan_vat_no: Equal(createCompany.pan_vat_no) },
                ]
            })
            if (company) {
                if (company.email == createCompany.email) {
                throw new HttpException('email already in used', HttpStatus.CONFLICT)
                }
                if (company.pan_vat_no == createCompany.pan_vat_no) {
                throw new HttpException("pan vat number are already in used", HttpStatus.CONFLICT)
                }
                if (company.company_code == createCompany.company_code) {
                throw new HttpException("company code is already in used", HttpStatus.CONFLICT)
                } 
            }
            const final = this.companyRepo.create({...createCompany, createdBy: req.user.id});
            await queryRunner.manager.save(final);

            const permissions = await this.permissionRepo.find()
            const adminRole = this.roleRepo.create({name: roles.Admin,permission:permissions, company: final, description: "this is admin role and have full access to the company"});
            await queryRunner.manager.save(adminRole);

            await queryRunner.commitTransaction()
            return returnObj(HttpStatus.OK, "company register successfully", final)
            } catch (err) {
            await queryRunner.rollbackTransaction()
            console.log(err)
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
            } finally {
            await queryRunner.release()
            }
        } catch (err) {
            console.log(err)
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateCompany(company_id: string, updateCompanyDto: baseUpdateDto) {
        try {
            const company = await this.companyRepo.findOne({ where: { id: Equal(company_id) } })
            if (!company) {
                throw new HttpException("invalid compnay id", HttpStatus.NOT_FOUND)
            }
            if (updateCompanyDto.company_code) {
                const existingCompany = await this.companyRepo.findOne({ where: { company_code: updateCompanyDto.company_code } })
                if (existingCompany && existingCompany.id != company_id) {
                    throw new HttpException("company code already exists", HttpStatus.BAD_REQUEST)
                }
            }
            if (updateCompanyDto.email) {
                const existingCompany = await this.companyRepo.findOne({ where: { email: Equal(updateCompanyDto.email) } })
                if (existingCompany && existingCompany.id != company_id) {
                    throw new HttpException("company email already exists", HttpStatus.BAD_REQUEST)
                }
            }
            if (updateCompanyDto.pan_vat_no) {
                const existingCompany = await this.companyRepo.findOne({ where: { pan_vat_no: Equal(updateCompanyDto.pan_vat_no) } })
                if (existingCompany && existingCompany.id != company_id) {
                    throw new HttpException("pan/vat no already exits", HttpStatus.BAD_REQUEST)
                }
            }
            Object.assign(company,updateCompanyDto)
            const result = await this.companyRepo.save(company);
            // const data = await this.companyRepo.findOne({ where: { id: Equal(company_id) } })
            return returnObj(HttpStatus.OK, 'success', result)
        } catch (err) {
            console.log(err)
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async deleteCompany(company_id: string) {
        try{
            const company = await this.companyRepo.findOne({where:{id:Equal(company_id)},relations:{users:true}})
            if(!company){
                throw new HttpException("company not found",HttpStatus.NOT_FOUND)
            }
            if(company.users.length > 0){
                throw new HttpException("cannot delete company",HttpStatus.FORBIDDEN)
            }
            await this.companyRepo.remove(company);
            return returnObj(HttpStatus.OK,"successfully deleted",company);
        }catch(err){
            if(err instanceof HttpException){
                throw err
            }
            if (err.code === 'ER_ROW_IS_REFERENCED_2') { // MySQL foreign key constraint error code
                throw new HttpException(
                    "Cannot delete user because it is linked to other records",
                    HttpStatus.CONFLICT
                );
            }
            throw new HttpException("internal server error",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


}