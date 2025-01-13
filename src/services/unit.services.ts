import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { roles } from "../object/roles.object";
import { returnObj } from "../utils/returnObj";
import { Equal, Repository } from "typeorm";
import { Companies } from "src/entities/Company.entities";
import { Users } from "src/entities/user.entities";
import { Units } from "src/entities/units.entities";
import { createUnitsDto } from "src/dtos/createDtos/addunit.dtos";
import { UpdateUnitDto } from "src/dtos/updateDtos/updateunit.dtos";


@Injectable()
export class UnitService{
    
    
    
    constructor(
        @InjectRepository(Units) private readonly unitRepo:Repository<Units>,
        @InjectRepository(Companies) private readonly companyRepo:Repository<Companies>,
        @InjectRepository(Users) private readonly userRepo:Repository<Users>,
    ){}
    
    async addUnit(req: any, createUnit: createUnitsDto) {
        try {
            if (roles.SuperAdmin == req.user.role) {
                let company: Companies | null = null;
                if (createUnit.companyId) {
                    company = await this.companyRepo.findOne({ where: { id: Equal(createUnit.companyId) } });
                    if (!company) {
                        throw new HttpException('invalid company id', HttpStatus.NOT_FOUND);
                    }
                    const units = await this.unitRepo.findOne({ where: { name: Equal(createUnit.name), company: Equal(company.id) } });
                    if (units) {
                        throw new HttpException(`${createUnit.name} unit already exists in the company`, HttpStatus.CONFLICT);
                    }
                }
                const unit = this.unitRepo.create({ ...createUnit, company: company,createdBy:req.user.id});
                const result = await this.unitRepo.save(unit);
                if (!result) {
                    throw new HttpException("cannot save unit", HttpStatus.INTERNAL_SERVER_ERROR);
                }
                return returnObj(HttpStatus.OK, "success", result);
            } else {
                const company = (await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } }))?.company;
                if (!company) {
                    throw new HttpException('company not found', HttpStatus.NOT_FOUND);
                }

                const unit = await this.unitRepo.findOne({ where: { name: Equal(createUnit.name), company: Equal(company.id) } });
                if (unit) {
                    throw new HttpException("unit already exists", HttpStatus.CONFLICT);
                }
                const result = await this.unitRepo.save(this.unitRepo.create({ ...createUnit, company: company, createdBy: req.user.id }));
                if (!result) {
                    throw new HttpException("cannot save unit", HttpStatus.INTERNAL_SERVER_ERROR);
                }
                return returnObj(HttpStatus.OK, "success", result);
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllUnits(req: any,page:number) {
        try {
            if (roles.SuperAdmin == req.user.role) {
                const units = await this.unitRepo.find({skip:page * 10, take:10 , relations: { company: true } });
                if (!units) {
                    throw new HttpException("no units found", HttpStatus.NOT_FOUND);
                }
                return returnObj(HttpStatus.OK, "Success", units);
            } else {
                const company = (await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } }))?.company;
                if (!company) {
                    throw new HttpException('company not found', HttpStatus.NOT_FOUND);
                }
                const units = await this.unitRepo.find({ skip:page * 10,take:10,where: { company: Equal(company.id) } });
                if (!units) {
                    throw new HttpException("no units found", HttpStatus.NOT_FOUND);
                }
                return returnObj(HttpStatus.OK, "success", units);
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
 
    async getUnitById(req: any, id: string) {
        try {
            if (roles.SuperAdmin == req.user.role) {
                const unit = await this.unitRepo.findOne({ where: { id: Equal(id) }, relations: { company: true } });
                if (!unit) {
                    throw new HttpException("invalid unit id", HttpStatus.NOT_FOUND);
                }
                return returnObj(HttpStatus.OK, "success", unit);
            } else {
                const company = (await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } }))?.company;
                if (!company) {
                    throw new HttpException("company not found", HttpStatus.NOT_FOUND);
                }
                const unit = await this.unitRepo.findOne({ where: { id: Equal(id), company: Equal(company.id) }, relations: { company: true } });
                if (!unit) {
                    throw new HttpException("invalid unit id", HttpStatus.NOT_FOUND);
                }
                return returnObj(HttpStatus.OK, "success", unit);
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async getUnitsByCompanyId(req: any, companyId: string,page:number) {
        try {
            if (roles.SuperAdmin == req.user.role) {
                const units = await this.unitRepo.find({skip:page * 10, take:10, where: { company: Equal(companyId) }, relations: { company: true } });
                if (!units || units.length === 0) {
                    throw new HttpException("no units found", HttpStatus.NOT_FOUND);
                }
                return returnObj(HttpStatus.OK, "success", units);
            } else {
                const company = (await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } }))?.company;
                if (!company || company.id !== companyId) {
                    throw new HttpException("invalid company id", HttpStatus.NOT_FOUND);
                }
                const units = await this.unitRepo.find({skip:page * 10, take:10, where: { company: Equal(company.id) }, relations: { company: true } });
                if (!units || units.length === 0) {
                    throw new HttpException("no units found", HttpStatus.NOT_FOUND);
                }
                return returnObj(HttpStatus.OK, "success", units);
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async deleteUnit(req: any, id: string) {
        try {
            if (roles.SuperAdmin == req.user.role) {
                const unit = await this.unitRepo.findOne({ where: { id: Equal(id) } });
                if (!unit) {
                    throw new HttpException("invalid unit id", HttpStatus.NOT_FOUND);
                }
                await this.unitRepo.remove(unit);
                return returnObj(HttpStatus.OK, "success", null);
            } else {
                const company = (await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } }))?.company;
                if (!company) {
                    throw new HttpException("company not found", HttpStatus.NOT_FOUND);
                }
                const unit = await this.unitRepo.findOne({ where: { id: Equal(id), company: Equal(company.id) } });
                if (!unit) {
                    throw new HttpException("invalid unit id", HttpStatus.NOT_FOUND);
                }
                await this.unitRepo.remove(unit);
                return returnObj(HttpStatus.OK, "success", null);
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateUnit(req: any, id: string, updateUnitDto: UpdateUnitDto) {
        try {
            if (roles.SuperAdmin == req.user.role) {
                const unit = await this.unitRepo.findOne({ where: { id: Equal(id) } });
                if (!unit) {
                    throw new HttpException("invalid unit id", HttpStatus.NOT_FOUND);
                }
                if (updateUnitDto.companyId) {
                    const company = await this.companyRepo.findOne({ where: { id: Equal(updateUnitDto.companyId) } });
                    if (!company) {
                        throw new HttpException("invalid company id", HttpStatus.NOT_FOUND);
                    }
                    const existingUnit = await this.unitRepo.findOne({ where: { name: Equal(updateUnitDto.name), company: Equal(company.id) } });
                    if (existingUnit) {
                        throw new HttpException(`${updateUnitDto.name} unit already exists in the company`, HttpStatus.CONFLICT);
                    }
                }
                Object.assign(unit, updateUnitDto);
                const result = await this.unitRepo.save(unit);
                return returnObj(HttpStatus.OK, "success", result);
            } else {
                const company = (await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } }))?.company;
                if (!company) {
                    throw new HttpException("company not found", HttpStatus.NOT_FOUND);
                }
                const unit = await this.unitRepo.findOne({ where: { id: Equal(id), company: Equal(company.id) } });
                if (!unit) {
                    throw new HttpException("invalid unit id", HttpStatus.NOT_FOUND);
                }
                Object.assign(unit, updateUnitDto);
                const result = await this.unitRepo.save(unit);
                return returnObj(HttpStatus.OK, "success", result);
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}