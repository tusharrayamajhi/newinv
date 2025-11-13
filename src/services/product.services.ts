import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AddProductDto } from "src/dtos/createDtos/addProduct.dtos";
import { UpdateProdcutDtos } from "src/dtos/updateDtos/updateProduct.dtos";
import { Brands } from "src/entities/Brands.entities";
import { Category } from "src/entities/Category.entities";
import { Companies } from "src/entities/Company.entities";
import { Product } from "src/entities/product.entities";
import { Units } from "src/entities/units.entities";
import { Users } from "src/entities/user.entities";
import { roles } from "src/object/roles.object";
import { returnObj } from "src/utils/returnObj";
import { DataSource, Equal, Repository } from "typeorm";

@Injectable()
export class ProductService {




    constructor(
        @InjectRepository(Users) private readonly userRepo: Repository<Users>,
        @InjectRepository(Product) private readonly productRepo: Repository<Product>,
        @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
        @InjectRepository(Units) private readonly unitRepo: Repository<Units>,
        @InjectRepository(Brands) private readonly brandRepo: Repository<Brands>,
        @InjectRepository(Companies) private readonly companyRepo: Repository<Companies>,
        @Inject(DataSource) private readonly dataSource: DataSource
    ) { }



    async addProduct(req: any, createProduct: AddProductDto) {
        try {
            if (roles.SuperAdmin == req.user.role) {
                let company: Companies | null = null;
                let category: Category | null = null;
                let brand: Brands | null = null;
                let unit: Units | null = null;
                if (createProduct.companyId) {
                    company = await this.companyRepo.findOne({ where: { id: Equal(createProduct.companyId) } });
                    if (!company) {
                        throw new HttpException('invalid company id', HttpStatus.NOT_FOUND);
                    }

                    if (createProduct.categoryId) {
                        category = await this.categoryRepo.findOne({ where: { id: Equal(createProduct.categoryId), company: Equal(company.id) } });
                        if (!category) {
                            throw new HttpException('invalid category id', HttpStatus.NOT_FOUND);
                        }
                    }

                    if (createProduct.brandId) {
                        brand = await this.brandRepo.findOne({ where: { id: Equal(createProduct.brandId), company: Equal(company.id) } });
                        if (!brand) {
                            throw new HttpException('invalid brand id', HttpStatus.NOT_FOUND);
                        }
                    }
                    if (createProduct.unitId) {
                        unit = await this.unitRepo.findOne({ where: { id: Equal(createProduct.unitId), company: Equal(company.id) } });
                        if (!unit) {
                            throw new HttpException('invalid unit id', HttpStatus.NOT_FOUND);
                        }
                    }
                }
                const existsProduct = await this.productRepo.findOne({ where: { product_name: Equal(createProduct.product_name), company: Equal(company.id) } })
                if (existsProduct) {
                    throw new HttpException('product already exits in company', HttpStatus.NOT_FOUND)
                }
                const product = this.productRepo.create({ ...createProduct, company: company, category: category, brand: brand, unit: unit, createdBy: req.user.id });
                const result = await this.productRepo.save(product);
                if (!result) {
                    throw new HttpException("cannot save product", HttpStatus.INTERNAL_SERVER_ERROR);
                }
                return returnObj(HttpStatus.OK, "success", result);
            } else {
                const user = await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } });
                if (!user) {
                    throw new HttpException('company not found', HttpStatus.NOT_FOUND);
                }
                const company = user.company;

                let category: Category | null = null;
                let brand: Brands | null = null;
                let unit: Units | null = null;

                if (createProduct.categoryId) {
                    category = await this.categoryRepo.findOne({ where: { id: Equal(createProduct.categoryId), company: Equal(company.id) } });
                    if (!category) {
                        throw new HttpException('invalid category id', HttpStatus.NOT_FOUND);
                    }
                }

                if (createProduct.brandId) {
                    brand = await this.brandRepo.findOne({ where: { id: Equal(createProduct.brandId), company: Equal(company.id) } });
                    if (!brand) {
                        throw new HttpException('invalid brand id', HttpStatus.NOT_FOUND);
                    }
                }

                if (createProduct.unitId) {
                    unit = await this.unitRepo.findOne({ where: { id: Equal(createProduct.unitId), company: Equal(company.id) } });
                    if (!unit) {
                        throw new HttpException('invalid unit id', HttpStatus.NOT_FOUND);
                    }
                }
                const existsProduct = await this.productRepo.findOne({ where: { product_name: Equal(createProduct.product_name), company: Equal(company.id) } })
                if (existsProduct) {
                    throw new HttpException('product already exits in company', HttpStatus.NOT_FOUND)
                }
                const product = this.productRepo.create({ ...createProduct, company: company, category: category, brand: brand, unit: unit, createdBy: req.user.id });
                const result = await this.productRepo.save(product);
                if (!result) {
                    throw new HttpException("cannot save product", HttpStatus.INTERNAL_SERVER_ERROR);
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

    async deleteProduct(req: any, id: string) {
        try {
            if (roles.SuperAdmin == req.user.role) {
                const product = await this.productRepo.findOne({ where: { id: Equal(id) } });
                if (!product) {
                    throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
                }
                await this.productRepo.remove(product);
                return returnObj(HttpStatus.OK, "Product deleted successfully");
            } else {
                const user = await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } });
                if (!user || !user.company) {
                    throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
                }
                const product = await this.productRepo.findOne({ where: { id: Equal(id), company: { id: Equal(user.company.id) } } });
                if (!product) {
                    throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
                }
                await this.productRepo.remove(product);
                return returnObj(HttpStatus.OK, "Product deleted successfully");
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateProduct(req: any, id: string, updateProductDto: UpdateProdcutDtos) {
        try {
            if (roles.SuperAdmin == req.user.role) {
                const product = await this.productRepo.findOne({ where: { id: Equal(id) } });
                let company: Companies | null = product.company;
                let category: Category | null = product.category;
                let brand: Brands | null =product.brand;
                let unit: Units | null = product.unit;
                if (updateProductDto.companyId) {
                    company = await this.companyRepo.findOne({ where: { id: Equal(updateProductDto.companyId) } });
                    if (!company) {
                        throw new HttpException('invalid company id', HttpStatus.NOT_FOUND);
                    }

                    if (updateProductDto.categoryId) {
                        category = await this.categoryRepo.findOne({ where: { id: Equal(updateProductDto.categoryId), company: Equal(company.id) } });
                        if (!category) {
                            throw new HttpException('invalid category id', HttpStatus.NOT_FOUND);
                        }
                    }

                    if (updateProductDto.brandId) {
                        brand = await this.brandRepo.findOne({ where: { id: Equal(updateProductDto.brandId), company: Equal(company.id) } });
                        if (!brand) {
                            throw new HttpException('invalid brand id', HttpStatus.NOT_FOUND);
                        }
                    }

                    if (updateProductDto.unitId) {
                        unit = await this.unitRepo.findOne({ where: { id: Equal(updateProductDto.unitId), company: Equal(company.id) } });
                        if (!unit) {
                            throw new HttpException('invalid unit id', HttpStatus.NOT_FOUND);
                        }
                    }
                }

                if (!product) {
                    throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
                }
                Object.assign(product, updateProductDto, { company, category, brand, unit });
                const result = await this.productRepo.save(product);
                return returnObj(HttpStatus.OK, "Product updated successfully", result);
            } else {
                const user = await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } });
                if (!user) {
                    throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
                }
                const company = user.company;
                
                const product = await this.productRepo.findOne({ where: { id: Equal(id), company: { id: Equal(company.id) } } });
                let category: Category | null = product.category;
                let brand: Brands | null = product.brand;
                let unit: Units | null = product.unit;

                if (updateProductDto.categoryId) {
                    category = await this.categoryRepo.findOne({ where: { id: Equal(updateProductDto.categoryId), company: Equal(company.id) } });
                    if (!category) {
                        throw new HttpException('invalid category id', HttpStatus.NOT_FOUND);
                    }
                }

                if (updateProductDto.brandId) {
                    brand = await this.brandRepo.findOne({ where: { id: Equal(updateProductDto.brandId), company: Equal(company.id) } });
                    if (!brand) {
                        throw new HttpException('invalid brand id', HttpStatus.NOT_FOUND);
                    }
                }

                if (updateProductDto.unitId) {
                    unit = await this.unitRepo.findOne({ where: { id: Equal(updateProductDto.unitId), company: Equal(company.id) } });
                    if (!unit) {
                        throw new HttpException('invalid unit id', HttpStatus.NOT_FOUND);
                    }
                }

                if (!product) {
                    throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
                }
                console.log(updateProductDto);
                console.log(product)
                Object.assign(product, updateProductDto, { category, brand, unit });
                const result = await this.productRepo.save(product);
                return returnObj(HttpStatus.OK, "Product updated successfully", result);
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getProductById(req: any, id: string) {
        try {
            if (roles.SuperAdmin == req.user.role) {
                const product = await this.productRepo.findOne({ where: { id: Equal(id) }, relations: { company: true, category: true, brand: true, unit: true } });
                if (!product) {
                    throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
                }
                return returnObj(HttpStatus.OK, "success", product);
            } else {
                const user = await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } });
                if (!user || !user.company) {
                    throw new HttpException('company not found', HttpStatus.NOT_FOUND);
                }
                const product = await this.productRepo.findOne({ where: { id: Equal(id), company: { id: Equal(user.company.id) } }, relations: { company: true, category: true, brand: true, unit: true } });
                if (!product) {
                    throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
                }
                return returnObj(HttpStatus.OK, "success", product);
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllProducts(req: any, page: number) {
        try {
            if (roles.SuperAdmin == req.user.role) {
                const products = await this.productRepo.find({ skip: page * 10, take: 10, relations: { company: true, category: true, brand: true, unit: true } });
                if (!products.length) {
                    throw new HttpException('No products found', HttpStatus.NOT_FOUND);
                }
                return returnObj(HttpStatus.OK, "success", products);
            } else {
                const user = await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } });
                if (!user || !user.company) {
                    throw new HttpException('company not found', HttpStatus.NOT_FOUND);
                }
                const products = await this.productRepo.find({ skip: page * 10, take: 10, where: { company: { id: Equal(user.company.id) } }, relations: { company: true, category: true, brand: true, unit: true } });
                if (!products.length) {
                    throw new HttpException('No products found', HttpStatus.NOT_FOUND);
                }
                return returnObj(HttpStatus.OK, "success", products);
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getProductsByBrandId(req: any, brandId: string, page: number) {
        try {
            if (roles.SuperAdmin == req.user.role) {
                const products = await this.productRepo.find({ skip: page * 10, take: 10, where: { brand: { id: Equal(brandId) } }, relations: { company: true, category: true, brand: true, unit: true } });
                if (!products.length) {
                    throw new HttpException('No products found for this brand', HttpStatus.NOT_FOUND);
                }
                return returnObj(HttpStatus.OK, "success", products);
            } else {
                const user = await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } });
                if (!user) {
                    throw new HttpException('user not found', HttpStatus.NOT_FOUND);
                }
                const products = await this.productRepo.find({ skip: page * 10, take: 10, where: { brand: { id: Equal(brandId) }, company: { id: Equal(user.company.id) } }, relations: { company: true, category: true, brand: true, unit: true } });
                if (!products.length) {
                    throw new HttpException('No products found for this brand', HttpStatus.NOT_FOUND);
                }
                return returnObj(HttpStatus.OK, "success", products);
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllProductAvailableForSale(req: any, page: number) {
        try {
            const user = await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } })
            if (!user) {
                throw new HttpException("user not found", HttpStatus.NOT_FOUND)
            }
            const product = await this.productRepo.find({ skip: page * 10, take: 10, where: { company: Equal(user.company.id), can_sale: true } })
            if (!product || product.length == 0) {
                throw new HttpException("no product found", HttpStatus.NOT_FOUND)
            }
            return returnObj(HttpStatus.OK, "success", product)
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getProductsByCompanyId(req: any, companyId: string) {
        try {
            if (roles.SuperAdmin == req.user.role) {
                const products = await this.productRepo.find({ where: { company: { id: Equal(companyId) } }, relations: { company: true, category: true, brand: true, unit: true } });
                if (!products.length) {
                    throw new HttpException('No products found for this company', HttpStatus.NOT_FOUND);
                }
                return returnObj(HttpStatus.OK, "success", products);
            } else {
                const user = await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } });
                if (!user || !user.company || user.company.id !== companyId) {
                    throw new HttpException(`You do not have access to this company's products`, HttpStatus.FORBIDDEN);
                }
                const products = await this.productRepo.find({ where: { company: { id: Equal(companyId) } }, relations: { company: true, category: true, brand: true, unit: true } });
                if (!products.length) {
                    throw new HttpException('No products found for this company', HttpStatus.NOT_FOUND);
                }
                return returnObj(HttpStatus.OK, "success", products);
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getProductsByCategoryId(req: any, categoryId: string, page: number) {
        try {
            if (roles.SuperAdmin == req.user.role) {
                const products = await this.productRepo.find({ skip: page * 10, take: 10, where: { category: { id: Equal(categoryId) } }, relations: { company: true, category: true, brand: true, unit: true } });
                if (!products.length) {
                    throw new HttpException('No products found for this company', HttpStatus.NOT_FOUND);
                }
                return returnObj(HttpStatus.OK, "success", products);
            } else {
                const user = await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } });
                if (!user) {
                    throw new HttpException(`You do not have access to this company's products`, HttpStatus.FORBIDDEN);
                }
                const products = await this.productRepo.find({ skip: page * 10, take: 10, where: { category: { id: Equal(categoryId) } }, relations: { company: true, category: true, brand: true, unit: true } });
                if (!products.length) {
                    throw new HttpException('No products found for this company', HttpStatus.NOT_FOUND);
                }
                return returnObj(HttpStatus.OK, "success", products);
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async lowStockNotification(req: any, page: number) {
        try {
            const user = await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } });
            if (!user) {
                throw new HttpException('user not found', HttpStatus.NOT_FOUND);
            }

            const queryBuilder = this.dataSource.getRepository(Product).createQueryBuilder('product')
                .where('product.stock < product.notificationThreshold')
                .andWhere('product.companyId = :companyId', { companyId: user.company.id })
                .skip(page * 10)
                .take(10)

            const products = await queryBuilder.getRawMany()
            const notification  ={
                product_name:"",
                stock:"",
                notificationThreshold:"",
                message:"",
            }
            for (let i = 0; i < products.length; i++) {
                notification.product_name = products[i].product_name
                notification.stock = products[i].stock
                notification.notificationThreshold = products[i].notificationThreshold
                notification.message = `${products[i].product_name} has ${products[i].stock} stock left which is less than the notification threshold of ${products[i].notificationThreshold}`
            }
            if (!products.length) {
                throw new HttpException('No low stock products found', HttpStatus.NOT_FOUND);
            }
            return returnObj(HttpStatus.OK, "success", products);
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



}