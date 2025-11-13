import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brands } from "src/entities/Brands.entities";
import { Category } from "src/entities/Category.entities";
import { Companies } from "src/entities/Company.entities";
import { Customer } from "src/entities/customers.entities";
import { Payment } from "src/entities/payment.entities";
import { Product } from "src/entities/product.entities";
import { PurchaseDetails } from "src/entities/purchaseDetails.entities";
import { PurchaseItem } from "src/entities/PurchaseItem.entities";
import { Roles } from "src/entities/Roles.entities";
import { SalesDetails } from "src/entities/SalesDetails.entities";
import { salesItem } from "src/entities/salesItem.entities";
import { Units } from "src/entities/units.entities";
import { Users } from "src/entities/user.entities";
import { Vendor } from "src/entities/vendors.entities";
import { roles } from "src/object/roles.object";
import { returnObj } from "src/utils/returnObj";
import { DataSource, Equal, Repository } from "typeorm";

@Injectable()
export class ReportService {
  

  constructor(
    @InjectRepository(Users) private readonly usersRepo: Repository<Users>,
    @InjectRepository(Companies) private readonly companiesRepo: Repository<Companies>,
    @InjectRepository(Brands) private readonly brandsRepo: Repository<Brands>,
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Customer) private readonly customerRepo: Repository<Customer>,
    @InjectRepository(Payment) private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(PurchaseDetails) private readonly purchaseDetailRepo: Repository<PurchaseDetails>,
    @InjectRepository(PurchaseItem) private readonly purchaseItemRepo: Repository<PurchaseItem>,
    @InjectRepository(Roles) private readonly rolesRepo: Repository<Roles>,
    @InjectRepository(SalesDetails) private readonly salesDetailsRepo: Repository<SalesDetails>,
    @InjectRepository(salesItem) private readonly salesItemRepo: Repository<salesItem>,
    @InjectRepository(Units) private readonly unitsRepo: Repository<Units>,
    @InjectRepository(Vendor) private readonly vendorRepo: Repository<Vendor>,
    @Inject(DataSource) private readonly dataSource: DataSource
  ) { }

  async getTopSellingBrands(req: any, limit: number, startDate: string, endDate: string) {
    try {
      const user = await this.usersRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } })
      if (!user) {
        throw new HttpException("user not found", HttpStatus.NOT_FOUND)
      }
      const companyId = user.company.id

      const start = new Date(startDate)
      const end = new Date(endDate)

      start.setHours(0, 0, 0, 0);

      end.setHours(23, 59, 59, 999);

      const queryBuilder = this.dataSource.getRepository(salesItem)
        .createQueryBuilder('salesItem')
        .innerJoin(
          Product,
          'product',
          'product.id = salesItem.productId AND product.companyId = :companyId AND product.deletedAt IS NULL',
          { companyId }
        )
        .innerJoin(
          Brands,
          'brand',
          'brand.id = product.brandId AND brand.companyId = :companyId AND brand.deletedAt IS NULL',
          { companyId }
        )
        .select('brand.brandName', 'brandName')
        .addSelect('SUM(salesItem.quantity)', 'qnt')
        .where('salesItem.companyId = :companyId AND salesItem.createdAt Between :start and :end', { companyId, start, end })
        .groupBy('brand.brandName')
        .orderBy('qnt', 'DESC')



      const results = await queryBuilder.getRawMany();
      if (limit != 0) {
        while (results.length > limit) {
          results.pop()
        }
      }
      return returnObj(HttpStatus.OK, "success", results)
    } catch (err) {
      if (err instanceof HttpException) {
        throw err
      }
      throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)

    }
  }

  async getTopSellingCustomers(req: any, limit: number, startDate: string, endDate: string) {
    try {

      const user = await this.usersRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } })
      if (!user) {
        throw new HttpException("user not found", HttpStatus.NOT_FOUND)
      }
      const companyId = user.company.id

      const start = new Date(startDate)
      const end = new Date(endDate)

      start.setHours(0, 0, 0, 0);

      end.setHours(23, 59, 59, 999);

      const queryBuilder = this.dataSource.getRepository(SalesDetails)
        .createQueryBuilder('salesDetails')
        .innerJoin(
          Customer,
          'customer',
          'customer.id = salesDetails.customerId AND customer.companyId = :companyId AND customer.deletedAt IS NULL',
          { companyId }
        )
        .select('customer.name', 'customerName')
        .addSelect('customer.id', 'customer_id')
        .addSelect('SUM(salesDetails.total_Amount)', 'total')
        .where('salesDetails.companyId = :companyId  AND salesDetails.createdAt Between :start and :end', { companyId, start, end })
        .groupBy('customer.name, customer.id')
        .orderBy('total', 'DESC')



      const results = await queryBuilder.getRawMany()
      if (limit != 0) {
        while (results.length > limit) {
          results.pop()
        }
      }
      return returnObj(HttpStatus.OK, "success", results)
    } catch (err) {
      if (err instanceof HttpException) {
        throw err
      }
      throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async getTopSellingCategories(req: any, limit: number, startDate: string, endDate: string) {
    try {

      const user = await this.usersRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } })
      if (!user) {
        throw new HttpException("user not found", HttpStatus.NOT_FOUND)
      }
      const companyId = user.company.id

      const start = new Date(startDate)
      const end = new Date(endDate)

      start.setHours(0, 0, 0, 0);

      end.setHours(23, 59, 59, 999);

      const queryBuilder = this.dataSource.getRepository(salesItem)
        .createQueryBuilder('salesItem')
        .innerJoin(
          Product,
          'product',
          'product.id = salesItem.productId AND product.companyId = :companyId AND product.deletedAt IS NULL',
          { companyId }
        )
        .innerJoin(
          Category,
          'category',
          'category.id = product.categoryId AND category.companyId = :companyId AND category.deletedAt IS NULL',
          { companyId }
        )
        .select('category.name', 'categoryName')
        .addSelect('SUM(salesItem.quantity)', 'qnt')
        .where('salesItem.companyId = :companyId  AND salesItem.createdAt Between :start and :end', { companyId, start, end })
        .groupBy('category.name')
        .orderBy('qnt', 'DESC')


      const result = await queryBuilder.getRawMany()
      if (limit != 0) {
        while (result.length > limit) {
          result.pop()
        }
      }
      return returnObj(HttpStatus.OK, "success", result)

    } catch (err) {
      if (err instanceof HttpException) {
        throw err
      }
      throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
    }

  }


  async getTopVendors(req: any, limit: number, startDate: string, endDate: string) {
    try {
      const user = await this.usersRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } })
      if (!user) {
        throw new HttpException("user not found", HttpStatus.NOT_FOUND)
      }
      const companyId = user.company.id

      const start = new Date(startDate)
      const end = new Date(endDate)

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      const queryBuilder = this.dataSource.getRepository(PurchaseDetails)
        .createQueryBuilder('PurchaseDetails')
        .innerJoin(
          Vendor,
          'vendor',
          'vendor.id = PurchaseDetails.vendorId AND vendor.companyId = :companyId AND vendor.deletedAt IS NULL',
          { companyId }
        )
        .select('vendor.vendor_name', 'vendorName')
        .addSelect('SUM(PurchaseDetails.total_after_tax)', 'amount')
        .where('PurchaseDetails.companyId = :companyId  AND PurchaseDetails.createdAt Between :start and :end', { companyId, start, end })
        .groupBy('vendor.vendor_name')
        .orderBy('amount', 'DESC')


      const results = await queryBuilder.getRawMany();
      if (limit != 0) {
        while (results.length > limit) {
          results.pop()
        }
      }
      return returnObj(HttpStatus.OK, "success", results)
    } catch (err) {
      if (err instanceof HttpException) {
        throw err
      }
      throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async getProfitAndLoss(req: any, startDate: string, endDate: string) {
    try {
      const user = await this.usersRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } })
      if (!user) {
        throw new HttpException("user not found", HttpStatus.NOT_FOUND)
      }
      const companyId = user.company.id

      const start = new Date(startDate)
      const end = new Date(endDate)

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      const salesQuery = this.dataSource.getRepository(SalesDetails)
        .createQueryBuilder('salesDetails')
        .select('SUM(salesDetails.total_after_tax)', 'totalSales')
        .where('salesDetails.companyId = :companyId AND salesDetails.createdAt Between :start and :end', { companyId, start, end })

      const purchaseQuery = this.dataSource.getRepository(PurchaseDetails)
        .createQueryBuilder('purchaseDetails')
        .select('SUM(purchaseDetails.total_after_tax)', 'totalPurchases')
        .where('purchaseDetails.companyId = :companyId AND purchaseDetails.createdAt Between :start and :end', { companyId, start, end })

      const salesResult = await salesQuery.getRawOne()
      const purchaseResult = await purchaseQuery.getRawOne()

      const totalSales = parseFloat(salesResult.totalSales) || 0
      const totalPurchases = parseFloat(purchaseResult.totalPurchases) || 0
      const profitOrLoss = totalSales - totalPurchases

      return returnObj(HttpStatus.OK, "success", { totalSales, totalPurchases, profitOrLoss })
    } catch (err) {
      if (err instanceof HttpException) {
        throw err
      }
      throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async getTopSellingProducts(req: any, limit: number, startDate: string, endDate: string) {
    try {
      const user = await this.usersRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } })
      if (!user) {
        throw new HttpException("user not found", HttpStatus.NOT_FOUND)
      }
      const companyId = user.company.id

      const start = new Date(startDate)
      const end = new Date(endDate)

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      const queryBuilder = this.dataSource.getRepository(salesItem)
        .createQueryBuilder('salesItem')
        .innerJoin(
          Product,
          'product',
          'product.id = salesItem.productId AND product.companyId = :companyId AND product.deletedAt IS NULL',
          { companyId }
        )
        .select('product.product_name', 'productName')
        .addSelect('SUM(salesItem.quantity)', 'qnt')
        .where('salesItem.companyId = :companyId  AND salesItem.createdAt Between :start and :end', { companyId, start, end })
        .groupBy('product.product_name')
        .orderBy('qnt', 'DESC')

      const results = await queryBuilder.getRawMany();
      if (limit != 0) {
        while (results.length > limit) {
          results.pop()
        }
      }
      return returnObj(HttpStatus.OK, "success", results)
    } catch (err) {
      if (err instanceof HttpException) {
        throw err
      }
      throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }


  async getTopSellerUsers(req: any, limit: number, startDate: string, endDate: string) {
    try {
      const user = await this.usersRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } });
      if (!user) {
        throw new HttpException("user not found", HttpStatus.NOT_FOUND);
      }
      const companyId = user.company.id;

      const start = new Date(startDate);
      const end = new Date(endDate);

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      const queryBuilder = this.dataSource.getRepository(SalesDetails)
        .createQueryBuilder('salesDetails')
        .innerJoin(
          Users,
          'user',
          'user.id = salesDetails.salesById AND user.companyId = :companyId AND user.deletedAt IS NULL',
          { companyId }
        )
        .select('user.id', 'userId')
        .addSelect('user.first_name', 'first_name')
        .addSelect('user.middle_name', 'middle_name')
        .addSelect('user.last_name', 'last_name')
        .addSelect('SUM(salesDetails.total_after_tax)', 'totalSales')
        .where('salesDetails.companyId = :companyId AND salesDetails.createdAt Between :start and :end', { companyId, start, end })
        .groupBy('user.id, user.first_name, user.middle_name, user.last_name')
        .orderBy('totalSales', 'DESC');

      const results = await queryBuilder.getRawMany();
      if (limit != 0) {
        while (results.length > limit) {
          results.pop();
        }
      }
      return returnObj(HttpStatus.OK, "success", results);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getSales(req: any, startDate: string, endDate: string) {
    try {
      const user = await this.usersRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } });
      if (!user) {
        throw new HttpException("user not found", HttpStatus.NOT_FOUND);
      }
      const companyId = user.company.id;

      const start = new Date(startDate);
      const end = new Date(endDate);

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      const queryBuilder = this.dataSource.getRepository(SalesDetails)
        .createQueryBuilder('salesDetails')
        .select('SUM(salesDetails.total_after_tax)', 'totalSales')
        .where('salesDetails.companyId = :companyId AND salesDetails.createdAt Between :start and :end', { companyId, start, end });

      const result = await queryBuilder.getRawOne();
      return returnObj(HttpStatus.OK, "success", result);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
 

  async getSalesBySeller(req: any, startDate: string, endDate: string, sellerId: string) {
    try {
      const user = await this.usersRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } });
      if (!user) {
        throw new HttpException("user not found", HttpStatus.NOT_FOUND);
      }
      const companyId = user.company.id;

      const start = new Date(startDate);
      const end = new Date(endDate);

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      const queryBuilder = this.dataSource.getRepository(SalesDetails)
        .createQueryBuilder('salesDetails')
        .select('SUM(salesDetails.total_after_tax)', 'totalSales')
        .where('salesDetails.companyId = :companyId AND  salesDetails.createdAt Between :start and :end', { companyId, start, end });

        if(req.user.roles == roles.Admin){
          queryBuilder.andWhere('salesDetails.salesById = :sellerId', { sellerId });
        }else{
          if(sellerId != req.user.id){
            throw new HttpException("you are not allowed to access this data", HttpStatus.FORBIDDEN);
          }
          queryBuilder.andWhere('salesDetails.salesById = :sellerId', { sellerId: req.user.id });
        }
      const result = await queryBuilder.getRawOne();
      return returnObj(HttpStatus.OK, "success", result);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  




}