import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateCustomerDto } from "src/dtos/createDtos/createCustomer.dtos";
import { updateCustomerDto } from "src/dtos/updateDtos/updateCustomer.dtos";
import { Companies } from "src/entities/Company.entities";
import { Customer } from "src/entities/customers.entities";
import { Users } from "src/entities/user.entities";
import { roles } from "src/object/roles.object";
import { returnObj } from "src/utils/returnObj";
import { Equal, Repository } from "typeorm";

@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(Customer) private readonly customerRepo: Repository<Customer>,
        @InjectRepository(Users) private readonly userRepo: Repository<Users>,
        @InjectRepository(Companies) private readonly companyRepo: Repository<Companies>,
    ) {}

    async addCustomer(req: any, createCustomerDto: CreateCustomerDto) {
        try {
            if (roles.SuperAdmin == req.user.role) {
                let company: Companies | null = null;
                if (createCustomerDto.companyId) {
                    company = await this.companyRepo.findOne({ where: { id: Equal(createCustomerDto.companyId) } });
                    if (!company) {
                        throw new HttpException('invalid company id', HttpStatus.NOT_FOUND);
                    }
                    const customers = await this.customerRepo.findOne({ where: { pan: Equal(createCustomerDto.pan), company: Equal(company.id) } });
                    if (customers) {
                        throw new HttpException(`Customer with PAN ${createCustomerDto.pan} already exists in the company`, HttpStatus.CONFLICT);
                    }
                }
                const customer = this.customerRepo.create({ ...createCustomerDto, company: company,createdBy:req.user.id });
                const result = await this.customerRepo.save(customer);
                if (!result) {
                    throw new HttpException("cannot save customer", HttpStatus.INTERNAL_SERVER_ERROR);
                }
                return returnObj(HttpStatus.OK, "success", result);
            } else {
                const company = (await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } }))?.company;
                if (!company) {
                    throw new HttpException('company not found', HttpStatus.NOT_FOUND);
                }

                const customer = await this.customerRepo.findOne({ where: { pan: Equal(createCustomerDto.pan), company: Equal(company.id) } });
                if (customer) {
                    throw new HttpException(`Customer with PAN ${createCustomerDto.pan} already exists in the company`, HttpStatus.CONFLICT);
                }
                const result = await this.customerRepo.save(this.customerRepo.create({ ...createCustomerDto, company: company, createdBy: req.user.id }));
                if (!result) {
                    throw new HttpException("cannot save customer", HttpStatus.INTERNAL_SERVER_ERROR);
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

    async getAllCustomers(req: any,page:number) {
        try {
            if (req.user.role == roles.SuperAdmin) {
                const customers = await this.customerRepo.find({skip:page * 10, take:10, relations: { company: true } });
                if (!customers) {
                    throw new HttpException("no customers found", HttpStatus.NOT_FOUND);
                }
                return returnObj(HttpStatus.OK, "Success", customers);
            } else {
                const company = (await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } }))?.company;
                if (!company) {
                    throw new HttpException('company not found', HttpStatus.NOT_FOUND);
                }
                const customers = await this.customerRepo.find({skip:page * 10, take: 10, where: { company: Equal(company.id) } });
                if (!customers) {
                    throw new HttpException("no customers found", HttpStatus.NOT_FOUND);
                }
                return returnObj(HttpStatus.OK, "success", customers);
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getCustomerById(req: any, id: string) {
        try {
            if (roles.SuperAdmin == req.user.role) {
                const customer = await this.customerRepo.findOne({ where: { id: Equal(id) } });
                if (!customer) {
                    throw new HttpException("invalid customer id", HttpStatus.NOT_FOUND);
                }
                return returnObj(HttpStatus.OK, "success", customer);
            } else {
                const company = (await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } }))?.company;
                if (!company) {
                    throw new HttpException("company not found", HttpStatus.NOT_FOUND);
                }
                const customer = await this.customerRepo.findOne({ where: { id: Equal(id), company: Equal(company.id) } });
                if (!customer) {
                    throw new HttpException("invalid customer id", HttpStatus.NOT_FOUND);
                }
                return returnObj(HttpStatus.OK, "success", customer);
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getCustomersByCompanyId(req: any, companyId: string,page:number) {
        try {
            if (roles.SuperAdmin == req.user.role) {
                const customers = await this.customerRepo.find({skip:page * 10,take:10, where: { company: Equal(companyId) } });
                if (!customers || customers.length == 0) {
                    throw new HttpException("no data found", HttpStatus.NOT_FOUND);
                }
                return returnObj(HttpStatus.OK, "success", customers);
            } else {
                const company = (await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } }))?.company;
                if (company.id != companyId || !company) {
                    throw new HttpException("invalid company id", HttpStatus.NOT_FOUND);
                }
                const customers = await this.customerRepo.find({skip:page * 10,take:10, where: { company: Equal(company.id) } });
                if (!customers) {
                    throw new HttpException("no customer found", HttpStatus.NOT_FOUND);
                }
                return returnObj(HttpStatus.OK, "success", customers);
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteCustomer(req: any, id: string) {
        try {
            if (roles.SuperAdmin == req.user.role) {
                const customer = await this.customerRepo.findOne({ where: { id: Equal(id) } });
                if (!customer) {
                    throw new HttpException("invalid customer id", HttpStatus.NOT_FOUND);
                }
                await this.customerRepo.remove(customer);
                return returnObj(HttpStatus.OK, "success", null);
            } else {
                const company = (await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } }))?.company;
                if (!company) {
                    throw new HttpException("company not found", HttpStatus.NOT_FOUND);
                }
                const customer = await this.customerRepo.findOne({ where: { id: Equal(id), company: Equal(company.id) } });
                if (!customer) {
                    throw new HttpException("invalid customer id", HttpStatus.NOT_FOUND);
                }
                await this.customerRepo.remove(customer);
                return returnObj(HttpStatus.OK, "success", null);
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateCustomer(req: any, id: string, updateCustomerDto: updateCustomerDto) {
        try {
            if (roles.SuperAdmin == req.user.role) {
                const customer = await this.customerRepo.findOne({ where: { id: Equal(id) } });
                if (!customer) {
                    throw new HttpException("invalid customer id", HttpStatus.NOT_FOUND);
                }
                if (updateCustomerDto.companyId) {
                    const company = await this.companyRepo.findOne({ where: { id: Equal(updateCustomerDto.companyId) } });
                    if (!company) {
                        throw new HttpException("invalid company id", HttpStatus.NOT_FOUND);
                    }
                    const existingCustomer = await this.customerRepo.findOne({ where: { pan: Equal(updateCustomerDto.pan), company: Equal(company.id) } });
                    if (existingCustomer && existingCustomer.id !== id) {
                        throw new HttpException(`Customer with PAN ${updateCustomerDto.pan} already exists in the company`, HttpStatus.CONFLICT);
                    }
                }
                Object.assign(customer, updateCustomerDto);
                const result = await this.customerRepo.save(customer);
                return returnObj(HttpStatus.OK, "success", result);
            } else {
                const company = (await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } }))?.company;
                if (!company) {
                    throw new HttpException("company not found", HttpStatus.NOT_FOUND);
                }
                const customer = await this.customerRepo.findOne({ where: { id: Equal(id), company: Equal(company.id) } });
                if (!customer) {
                    throw new HttpException("invalid customer id", HttpStatus.NOT_FOUND);
                }
                if (updateCustomerDto.pan) {
                    const existingCustomer = await this.customerRepo.findOne({ where: { pan: Equal(updateCustomerDto.pan), company: Equal(company.id) } });
                    if (existingCustomer && existingCustomer.id !== id) {
                        throw new HttpException(`Customer with PAN ${updateCustomerDto.pan} already exists in the company`, HttpStatus.CONFLICT);
                    }
                }
                Object.assign(customer, updateCustomerDto);
                const result = await this.customerRepo.save(customer);
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
