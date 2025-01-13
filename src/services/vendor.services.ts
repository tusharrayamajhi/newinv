import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateVendor } from "src/dtos/createDtos/createVendor.dtos";
import { updateVendor } from "src/dtos/updateDtos/updateVendor.dtos";
import { Companies } from "src/entities/Company.entities";
import { Users } from "src/entities/user.entities";
import { Vendor } from "src/entities/vendors.entities";
import { roles } from "src/object/roles.object";
import { returnObj } from "src/utils/returnObj";
import { Repository, Equal } from "typeorm";

@Injectable()
export class VendorService {

    constructor(
        @InjectRepository(Users) private readonly userRepo: Repository<Users>,
        @InjectRepository(Companies) private readonly companyRepo: Repository<Companies>,
        @InjectRepository(Vendor) private readonly vendorRepo: Repository<Vendor>,
    ) { }

    async addVendor(req: any, createVendorDto: CreateVendor) {
        try {
            if (roles.SuperAdmin == req.user.role) {
                let company: Companies | null = null;
                if (createVendorDto.companyId) {
                    company = await this.companyRepo.findOne({ where: { id: Equal(createVendorDto.companyId) } });
                    if (!company) {
                        throw new HttpException('invalid company id', HttpStatus.NOT_FOUND);
                    }
                    const vendors = await this.vendorRepo.findOne({ where: { tax_number: Equal(createVendorDto.tax_number), company: Equal(company.id) } });
                    if (vendors) {
                        throw new HttpException(`Vendor with tax number ${createVendorDto.tax_number} already exists in the company`, HttpStatus.CONFLICT);
                    }
                }
                const vendor = this.vendorRepo.create({ ...createVendorDto, company: company,createdBy:req.user.id });
                const result = await this.vendorRepo.save(vendor);
                if (!result) {
                    throw new HttpException("cannot save vendor", HttpStatus.INTERNAL_SERVER_ERROR);
                }
                return { statusCode: HttpStatus.OK, message: "success", data: result };
            } else {
                const company = (await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } }))?.company;
                if (!company) {
                    throw new HttpException('company not found', HttpStatus.NOT_FOUND);
                }

                const vendor = await this.vendorRepo.findOne({ where: { tax_number: Equal(createVendorDto.tax_number), company: Equal(company.id) } });
                if (vendor) {
                    throw new HttpException(`Vendor with PAN ${createVendorDto.tax_number} already exists in the company`, HttpStatus.CONFLICT);
                }
                const result = await this.vendorRepo.save(this.vendorRepo.create({ ...createVendorDto, company: company, createdBy: req.user.id }));
                if (!result) {
                    throw new HttpException("cannot save vendor", HttpStatus.INTERNAL_SERVER_ERROR);
                }
                return returnObj(HttpStatus.OK, "success", result);
            }
        } catch (err) {
            console.log(err)
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllVendors(req: any,page:number) {
        try {
            if (req.user.role == roles.SuperAdmin) {
                const vendors = await this.vendorRepo.find({skip:page * 10, take:10, relations: { company: true } });
                if (!vendors) {
                    throw new HttpException("no vendors found", HttpStatus.NOT_FOUND);
                }
                return returnObj(HttpStatus.OK, "Success", vendors);
            } else {
                const company = (await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } }))?.company;
                if (!company) {
                    throw new HttpException('company not found', HttpStatus.NOT_FOUND);
                }
                const vendors = await this.vendorRepo.find({skip:page * 10,take:10, where: { company: Equal(company.id) } });
                if (!vendors) {
                    throw new HttpException("no vendors found", HttpStatus.NOT_FOUND);
                }
                return returnObj(HttpStatus.OK, "success", vendors);
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getVendorById(req: any, id: string) {
        try {
            if (roles.SuperAdmin == req.user.role) {
                const vendor = await this.vendorRepo.findOne({ where: { id: Equal(id) } });
                if (!vendor) {
                    throw new HttpException("invalid vendor id", HttpStatus.NOT_FOUND);
                }
                return { statusCode: HttpStatus.OK, message: "success", data: vendor };
            } else {
                const company = (await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } }))?.company;
                if (!company) {
                    throw new HttpException("company not found", HttpStatus.NOT_FOUND);
                }
                const vendor = await this.vendorRepo.findOne({ where: { id: Equal(id), company: Equal(company.id) } });
                if (!vendor) {
                    throw new HttpException("invalid vendor id", HttpStatus.NOT_FOUND);
                }
                return returnObj(HttpStatus.OK, "success", vendor);
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getVendorsByCompanyId(req: any, companyId: string) {
        try {
            if (roles.SuperAdmin == req.user.role) {
                const vendors = await this.vendorRepo.find({ where: { company: Equal(companyId) } });
                if (!vendors || vendors.length == 0) {
                    throw new HttpException("no data found", HttpStatus.NOT_FOUND);
                }
                return returnObj(HttpStatus.OK, "success", vendors);
            } else {
                const company = (await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } }))?.company;
                if (company.id != companyId || !company) {
                    throw new HttpException("invalid company id", HttpStatus.NOT_FOUND);
                }
                const vendors = await this.vendorRepo.find({ where: { company: Equal(company.id) } });
                if (!vendors) {
                    throw new HttpException("no vendor found", HttpStatus.NOT_FOUND);
                }
                return returnObj(HttpStatus.OK, "success", vendors);
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteVendor(req: any, id: string) {
        try {
            if (roles.SuperAdmin == req.user.role) {
                const vendor = await this.vendorRepo.findOne({ where: { id: Equal(id) } });
                if (!vendor) {
                    throw new HttpException("invalid vendor id", HttpStatus.NOT_FOUND);
                }
                await this.vendorRepo.remove(vendor);
                return { statusCode: HttpStatus.OK, message: "success", data: null };
            } else {
                const company = (await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } }))?.company;
                if (!company) {
                    throw new HttpException("company not found", HttpStatus.NOT_FOUND);
                }
                const vendor = await this.vendorRepo.findOne({ where: { id: Equal(id), company: Equal(company.id) } });
                if (!vendor) {
                    throw new HttpException("invalid vendor id", HttpStatus.NOT_FOUND);
                }
                await this.vendorRepo.remove(vendor);
                return returnObj(HttpStatus.OK, "success", null);
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateVendor(req: any, id: string, updateVendorDto: updateVendor) {
        try {
            if (roles.SuperAdmin == req.user.role) {
                const vendor = await this.vendorRepo.findOne({ where: { id: Equal(id) } });
                if (!vendor) {
                    throw new HttpException("invalid vendor id", HttpStatus.NOT_FOUND);
                }
                if (updateVendorDto.companyId) {
                    const company = await this.companyRepo.findOne({ where: { id: Equal(updateVendorDto.companyId) } });
                    if (!company) {
                        throw new HttpException("invalid company id", HttpStatus.NOT_FOUND);
                    }
                    const existingVendor = await this.vendorRepo.findOne({ where: { tax_number: Equal(updateVendorDto.tax_number), company: Equal(company.id) } });
                    if (existingVendor && existingVendor.id !== id) {
                        throw new HttpException(`Vendor with PAN ${updateVendorDto.tax_number} already exists in the company`, HttpStatus.CONFLICT);
                    }
                    vendor.company = company
                }
                Object.assign(vendor, updateVendorDto);
                const result = await this.vendorRepo.save(vendor);
                return returnObj(HttpStatus.OK, "success", result);
            } else {
                const company = (await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } }))?.company;
                if (!company) {
                    throw new HttpException("company not found", HttpStatus.NOT_FOUND);
                }
                const vendor = await this.vendorRepo.findOne({ where: { id: Equal(id), company: Equal(company.id) } });
                if (!vendor) {
                    throw new HttpException("invalid vendor id", HttpStatus.NOT_FOUND);
                }
                if (updateVendorDto.tax_number) {
                    const existingVendor = await this.vendorRepo.findOne({ where: { tax_number: Equal(updateVendorDto.tax_number), company: Equal(company.id) } });
                    if (existingVendor && existingVendor.id !== id) {
                        throw new HttpException(`Vendor with PAN ${updateVendorDto.tax_number} already exists in the company`, HttpStatus.CONFLICT);
                    }
                }
                Object.assign(vendor, updateVendorDto);
                const result = await this.vendorRepo.save(vendor);
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
