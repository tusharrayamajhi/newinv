import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brands } from "../entities/Brands.entities";
import { roles } from "../object/roles.object";
import { returnObj } from "../utils/returnObj";
import { Equal, Repository } from "typeorm";
import { Companies } from "src/entities/Company.entities";
import { Users } from "src/entities/user.entities";
import { UpdateBrandDto } from "src/dtos/updateDtos/updateBrands.dtos";
import { addBrandDto } from "src/dtos/createDtos/addBrands.dtos";


@Injectable()
export class BrandService {



    constructor(
        @InjectRepository(Brands) private readonly brandRepo: Repository<Brands>,
        @InjectRepository(Companies) private readonly companyRepo: Repository<Companies>,
        @InjectRepository(Users) private readonly userRepo: Repository<Users>,
    ) { }

    async addBrand(req: any, createBrand: addBrandDto) {
        try {
            if (roles.SuperAdmin == req.user.role) {
                let company: Companies | null = null
                if (createBrand.companyId) {
                    company = await this.companyRepo.findOne({ where: { id: Equal(createBrand.companyId) } })
                    if (!company) {
                        throw new HttpException('invalid company id', HttpStatus.NOT_FOUND)
                    }
                    const brands = await this.brandRepo.findOne({ where: { brandName: Equal(createBrand.brandName), company: Equal(company.id) } })
                    if (brands) {
                        throw new HttpException(`${createBrand.brandName} brand already exits in the company`, HttpStatus.INTERNAL_SERVER_ERROR)
                    }
                }
                const brand = this.brandRepo.create({ ...createBrand, company: company, createdBy: req.user.id })
                const result = await this.brandRepo.save(brand)
                if (!result) {
                    throw new HttpException("cannot save brand", HttpStatus.INTERNAL_SERVER_ERROR)
                }
                return returnObj(HttpStatus.OK, "success", result)
            } else {
                const company = (await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } }))?.company
                if (!company) {
                    throw new HttpException('company not found', HttpStatus.NOT_FOUND)
                }


                const brand = await this.brandRepo.findOne({ where: { brandName: Equal(createBrand.brandName), company: Equal(company.id) } })
                if (brand) {
                    throw new HttpException("brand already exits", HttpStatus.CONFLICT)
                }
                const result = await this.brandRepo.save(this.brandRepo.create({ ...createBrand, company: company, createdBy: req.user.id }))
                if (!result) {
                    throw new HttpException("cannot save brand", HttpStatus.INTERNAL_SERVER_ERROR)
                }
                return returnObj(HttpStatus.OK, "success", result)
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getAllBrands(req: any, page: number) {
        try {
            if (req.user.role == roles.SuperAdmin) {
                const brands = await this.brandRepo.find({
                    skip: page * 10,
                    take: 10,
                    relations: {
                        company: true
                    },
                    order:{
                        createdAt:"ASC"
                    }
                });
                if (!brands) {
                    throw new HttpException("no brands found", HttpStatus.NOT_FOUND)
                }
                return returnObj(HttpStatus.OK, "Success", brands)
            } else {
                const company = (await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } }))?.company
                if (!company) {
                    throw new HttpException('company not found', HttpStatus.NOT_FOUND)
                }
                const brands = await this.brandRepo.find({
                    skip:page * 10,
                    take:10,
                    where: { 
                        company: Equal(company.id) 
                    } 
                })
                if (!brands) {
                    throw new HttpException("no brands found", HttpStatus.NOT_FOUND)
                }
                return returnObj(HttpStatus.OK, "success", brands)
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getBrandById(req: any, id: string) {
        try {
            if (roles.SuperAdmin == req.user.role) {
                const brand = await this.brandRepo.findOne({ where: { id: Equal(id) } })
                if (!brand) {
                    throw new HttpException("invalid brand in", HttpStatus.NOT_FOUND)
                }
                return returnObj(HttpStatus.OK, "success", brand)
            } else {
                const company = (await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } }))?.company
                if (!company) {
                    throw new HttpException("company not found", HttpStatus.NOT_FOUND)
                }
                const brand = await this.brandRepo.findOne({ where: { id: Equal(id), company: Equal(company.id) } })
                if (!brand) {
                    throw new HttpException("invalid brand id", HttpStatus.NOT_FOUND)
                }
                return returnObj(HttpStatus.OK, "success", brand)
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getBrandsByCompanyId(req: any, companyId: string,page:number) {
        try {
            if (roles.SuperAdmin == req.user.role) {
                const brands = await this.brandRepo.find({skip:page * 10,take:10, where: { company: Equal(companyId) } })
                if (!brands || brands.length == 0) {
                    throw new HttpException("no data found", HttpStatus.NOT_FOUND)
                }
                return returnObj(HttpStatus.OK, "success", brands);
            } else {
                const company = (await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } }))?.company
                if (company.id != companyId || !company) {
                    throw new HttpException("invalid company id", HttpStatus.NOT_FOUND)
                }
                const brands = await this.brandRepo.find({skip:page * 10,take:10,where: { company: Equal(company.id) } })
                if (!brands) {
                    throw new HttpException("no brand found", HttpStatus.NOT_FOUND)
                }
                return returnObj(HttpStatus.OK, "success", brands)
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async deleteBrand(req: any, id: string) {
        try {
            if (roles.SuperAdmin == req.user.role) {
                const brand = await this.brandRepo.findOne({ where: { id: Equal(id) } });
                if (!brand) {
                    throw new HttpException("invalid brand id", HttpStatus.NOT_FOUND);
                }
                await this.brandRepo.remove(brand);
                return returnObj(HttpStatus.OK, "success", null);
            } else {
                const company = (await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } }))?.company;
                if (!company) {
                    throw new HttpException("company not found", HttpStatus.NOT_FOUND);
                }
                const brand = await this.brandRepo.findOne({ where: { id: Equal(id), company: Equal(company.id) } });
                if (!brand) {
                    throw new HttpException("invalid brand id", HttpStatus.NOT_FOUND);
                }
                await this.brandRepo.remove(brand);
                return returnObj(HttpStatus.OK, "success", null);
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateBrand(req: any, id: string, updateBrandDto: UpdateBrandDto) {
        try {
            if (roles.SuperAdmin == req.user.role) {
                const brand = await this.brandRepo.findOne({ where: { id: Equal(id) } });
                if (!brand) {
                    throw new HttpException("invalid brand id", HttpStatus.NOT_FOUND);
                }
                if (updateBrandDto.companyId) {
                    const company = await this.companyRepo.findOne({ where: { id: Equal(updateBrandDto.companyId) } })
                    if (!company) {
                        throw new HttpException("invalid company id", HttpStatus.NOT_FOUND)
                    }
                    const brand = await this.brandRepo.findOne({ where: { brandName: Equal(updateBrandDto.brandName), company: Equal(company.id) } })
                    if (brand) {
                        throw new HttpException(`${updateBrandDto.brandName} brand already exists in the company`, HttpStatus.CONFLICT)
                    }
                }
                Object.assign(brand, updateBrandDto);
                const result = await this.brandRepo.save(brand);
                return returnObj(HttpStatus.OK, "success", result);
            } else {
                const company = (await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } }))?.company;
                if (!company) {
                    throw new HttpException("company not found", HttpStatus.NOT_FOUND);
                }
                const brand = await this.brandRepo.findOne({ where: { id: Equal(id), company: Equal(company.id) } });
                if (!brand) {
                    throw new HttpException("invalid brand id", HttpStatus.NOT_FOUND);
                }
                Object.assign(brand, updateBrandDto);
                const result = await this.brandRepo.save(brand);
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