import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SalesDetailsDto } from "src/dtos/createDtos/salesDetails.dtos";
import { updateSales } from "src/dtos/updateDtos/updateSales.dtos";
import { Companies } from "src/entities/Company.entities";
import { Customer } from "src/entities/customers.entities";
import { Payment } from "src/entities/payment.entities";
import { Product } from "src/entities/product.entities";
import { PurchaseItem } from "src/entities/PurchaseItem.entities";
import { PurchaseDetails } from "src/entities/purchaseDetails.entities";
import { SalesDetails } from "src/entities/SalesDetails.entities";
import { salesItem } from "src/entities/salesItem.entities";
import { Users } from "src/entities/user.entities";
import { roles } from "src/object/roles.object";
import { returnObj } from "src/utils/returnObj";
import { Between, DataSource, Equal, Repository } from "typeorm";


@Injectable()
export class salesService{
   
    
    
    constructor(
        @InjectRepository(Users) private readonly userRepo:Repository<Users>,
        @InjectRepository(Companies) private readonly companyRepo:Repository<Companies>,
        @InjectRepository(Payment) private readonly paymentRepo:Repository<Payment>,
        @InjectRepository(Product) private readonly productRepo:Repository<Product>,
        @InjectRepository(salesItem) private readonly salesItemRepo:Repository<salesItem>,
        @InjectRepository(PurchaseItem) private readonly purchaseItemRepo:Repository<PurchaseItem>,
        @InjectRepository(SalesDetails) private readonly salesDetailsRepo:Repository<SalesDetails>,
        @InjectRepository(PurchaseDetails) private readonly purchaseDetailsRepo:Repository<PurchaseDetails>,
        @InjectRepository(Customer) private readonly customerRepo:Repository<Customer>,
        private dataSource:DataSource
    ){}


    async getSellsCode(companyId:string,company_code:string){
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        const number = (await this.salesDetailsRepo.find({
             where: {
                company: Equal(companyId),
                createdAt: Between(startOfDay, endOfDay) 
            } 
        })).length
        const date = new Date();
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear().toString();

        const code = `${company_code}-${day}${month}${year}-${number + 1}`;
        return code
    }


    async createSales(salesDetail: SalesDetailsDto, req: any) {
        if(req.user.roles == roles.SuperAdmin){
            throw new HttpException("you can't create sales",HttpStatus.BAD_REQUEST);
        }
        const queryRunner =  this.dataSource.createQueryRunner()
        queryRunner.connect();
        queryRunner.startTransaction();
        try{    
            const user = await queryRunner.manager.findOne(Users,{where:{id:req.user.id},relations:{company:true}});
            if(!user){
                throw new HttpException("User not found",HttpStatus.NOT_FOUND);
            }
            const customer = await queryRunner.manager.findOne(Customer,{where:{id:Equal(salesDetail.customerId),company:Equal(user.company.id)}});
            if(!customer){
                throw new HttpException("Customer not found",HttpStatus.NOT_FOUND);
            }
            const salesItems : salesItem[] = [];
            for(const Item of salesDetail.salesItems){
                const product = await queryRunner.manager.findOne(Product,{where:{id:Item.productId,company:Equal(user.company.id)}});
                if(!product){
                    throw new HttpException("Product not found",HttpStatus.NOT_FOUND);
                }
                if(product.stock < Item.quantity){
                    throw new HttpException("Product out of stock",HttpStatus.BAD_REQUEST);
                }
               
            
                const total = Item.unit_rate * Item.quantity;
                if(!Item.discount_rate){
                    Item.discount_rate = 0;
                }
                if(!salesDetail.tax_in_total_sales){   
                    salesDetail.tax_in_total_sales = 0;
                }
                const discount = total * Item.discount_rate / 100;
                const total_after_discount = total - discount;
                const total_after_tax = total_after_discount + (total_after_discount * salesDetail.tax_in_total_sales / 100);
                product.stock = product.stock - Item.quantity;
                await queryRunner.manager.save(product);
                
                const item = await queryRunner.manager.save(queryRunner.manager.create(salesItem,{
                    company:user.company,
                    product:product,
                    quantity:Item.quantity,
                    unit_rate:Item.unit_rate,
                    total_before_dis:total,
                    discount_rate:Item.discount_rate,
                    total_after_dis:total_after_discount,
                    tax_rate:product.vat,
                    total_after_tax:total_after_tax,
                    remarks:Item.remarks,
                }))
                salesItems.push(item);
            }
          const payments:Payment[] = [];
            for(const payment of salesDetail.payment){
                const pay = await queryRunner.manager.save(queryRunner.manager.create(Payment,{
                    customer:customer,
                    vendor:null,
                    remark:payment.remark,
                    company:user.company,
                    amount:payment.amount,
                    payment_method:payment.payment_method,
                    // payment_date:payment.payment_date,
                }))
                payments.push(pay);
            }

            if(!salesDetail.discount_in_total_sales){
                salesDetail.discount_in_total_sales = 0;
            }
            const total_before_discount = salesItems.map(item=>item.total_after_tax).reduce((a,b)=>a+b);
            const total_after_discount = total_before_discount - (total_before_discount * salesDetail.discount_in_total_sales / 100);
            const total_after_tax = total_after_discount + (total_after_discount * salesDetail.tax_in_total_sales / 100);
            
            const code = await this.getSellsCode(user.company.id,user.company.company_code);
            console.log(code)
            const sales = await queryRunner.manager.save(queryRunner.manager.create(SalesDetails,{
                sales_code:code,
                discount:salesDetail.discount_in_total_sales,
                tax_rate:salesDetail.tax_in_total_sales,
                total_before_discount:total_before_discount,
                total_after_dis:total_after_discount,
                total_after_tax:total_after_tax,
                shipment_status:salesDetail.shipment_status,
                customer:customer,
                company:user.company,
                salesBy:req.user.id,
                sales_item:salesItems,
                payments:payments,
                remarks:salesDetail.remark
            }))
            await queryRunner.commitTransaction();
            return returnObj(HttpStatus.OK,"Sales created successfully",sales);
        }catch(err){
            console.log(err)
            await queryRunner.rollbackTransaction();
            if(err instanceof HttpException){
                throw err;
            }
            throw new HttpException("Internal Server Error",HttpStatus.INTERNAL_SERVER_ERROR);
        }finally{
            await queryRunner.release()
        }
    }
    

    async getAllSales(req: any,page:number) {
        try {
            if (roles.SuperAdmin == req.user.role) {
                throw new HttpException("you cannot view sales", HttpStatus.FORBIDDEN);
            }
            const user = await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } });
            if (!user || !user.company) {
                throw new HttpException("user and company not found", HttpStatus.NOT_FOUND);
            }
            if (roles.Admin == req.user.role) {
                const sales = await this.salesDetailsRepo.find({skip:page * 10,take:10, where: { company: Equal(user.company.id) }, relations: { customer:true,sales_item: true, payments: true, salesBy: true } });
                if (!sales || sales.length == 0) {
                    throw new HttpException("no sales found", HttpStatus.NOT_FOUND);
                }
                return returnObj(HttpStatus.OK, "success", sales);
            } else {
                const sales = await this.salesDetailsRepo.find({skip:page*10,take:10, where: { company: Equal(user.company.id), salesBy: user }, relations: { customer:true,sales_item: true, payments: true, salesBy: true } });
                if (!sales || sales.length == 0) {
                    throw new HttpException("no sales found", HttpStatus.NOT_FOUND);
                }
                return returnObj(HttpStatus.OK, "success", sales);
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getSalesBySaleCode(req: any, sales_code: string) {
        try {
            const user = await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } });
            if (!user) {
                throw new HttpException("user not found", HttpStatus.NOT_FOUND);
            }
            if (roles.Admin == req.user.role) {
                const sales = await this.salesDetailsRepo.find({ where: { sales_code: Equal(sales_code), company: Equal(user.company.id) }, relations: { customer:true,sales_item: true, payments: true } });
                if (!sales || sales.length == 0) {
                    throw new HttpException("invalid sales id", HttpStatus.NOT_FOUND);
                }
                return returnObj(HttpStatus.OK, "success", sales);
            } else {
                const sales = await this.salesDetailsRepo.find({ where: { sales_code: Equal(sales_code), salesBy: user, company: Equal(user.company.id) }, relations: { customer:true,sales_item: true, payments: true } });
                if (!sales || sales.length == 0) {
                    throw new HttpException("invalid sales id", HttpStatus.NOT_FOUND);
                }
                return returnObj(HttpStatus.OK, "success", sales);
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getSalesByUser(req: any, user_id: string,page:number,) {
        try {
            if (roles.Admin == req.user.role) {
                const admin = await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } });
                if (!admin) {
                    throw new HttpException("no user found", HttpStatus.NOT_FOUND);
                }
                const user = await this.userRepo.findOne({ where: { id: Equal(user_id), company: Equal(admin.company.id) }});
                if (!user) {
                    throw new HttpException("invalid user id", HttpStatus.NOT_FOUND);
                }
                const sales = await this.salesDetailsRepo.find({skip:page * 10,take:10,where:{salesBy:Equal(user.id)},relations:{sales_item:true,customer:true,payments:true}})
                if (!sales|| sales.length == 0) {
                    throw new HttpException("no sales found", HttpStatus.NOT_FOUND);
                }
                return returnObj(HttpStatus.OK, "success", sales);
            } else {
                throw new HttpException("you are not allowed to view this", HttpStatus.FORBIDDEN);
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getSalesByCustomerId(req: any, customer_id: string,page:number) {
        try {
            const user = await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } });
            if (!user) {
                throw new HttpException("user not found", HttpStatus.NOT_FOUND);
            }
            const customer = await this.customerRepo.findOne({ where: { id: Equal(customer_id), company: Equal(user.company.id) } });
            if (!customer) {
                throw new HttpException('invalid customer id', HttpStatus.NOT_FOUND);
            }
            const sales = await this.salesDetailsRepo.find({skip:page * 10, take:10, where: { customer: { id: Equal(customer.id) } }, relations: { customer:true,sales_item: true, payments: true } });
            if (!sales || sales.length == 0) {
                throw new HttpException("no sales found", HttpStatus.NOT_FOUND);
            }
            return returnObj(HttpStatus.OK, "success", sales);
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getMySales(req: any,page:number) {
        try {
            const user = await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } });
            if (!user) {
                throw new HttpException("user not found", HttpStatus.NOT_FOUND);
            }
            const sales = await this.salesDetailsRepo.find({skip:page * 10, take: 10, where: { salesBy: Equal(req.user.id), company: Equal(user.company.id) }, relations: { customer:true,sales_item: true, payments: true } });
            if (!sales || sales.length == 0) {
                throw new HttpException("no sales found", HttpStatus.NOT_FOUND);
            }
            return returnObj(HttpStatus.OK, "success", sales);
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateSales(req: any, code: string, updateSalesDto: updateSales) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await queryRunner.manager.findOne(Users,{
                where: { id: Equal(req.user.id) },
                relations: { company: true },
            });

            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            const sales = await queryRunner.manager.findOne(SalesDetails,{
                where: { sales_code: Equal(code), company: Equal(user.company.id) },
                relations: { customer: true, sales_item: true, payments: true },
            });

            if (!sales) {
                throw new HttpException('Sales not found', HttpStatus.NOT_FOUND);
            }

            if (updateSalesDto.customerId) {
                const customer = await queryRunner.manager.findOne(Customer,{
                    where: { id: Equal(updateSalesDto.customerId), company: Equal(user.company.id) },
                });

                if (!customer) {
                    throw new HttpException('Invalid customer ID', HttpStatus.NOT_FOUND);
                }

                sales.customer = customer;
            }

            if (updateSalesDto.salesItems) {
                for (const updatedItem of updateSalesDto.salesItems) {
                    const salesItem = sales.sales_item.find(
                        (item) => item.id === updatedItem.id
                    );

                    if (!salesItem) {
                        throw new HttpException(
                            `Sales item id not found`,
                            HttpStatus.NOT_FOUND
                        );
                    }

                    const product = await this.productRepo.findOne({
                        where: { id: Equal(updatedItem.productId), company: Equal(user.company.id) },
                    });

                    if (!product) {
                        throw new HttpException('Invalid product ID', HttpStatus.NOT_FOUND);
                    }

                    product.stock += salesItem.quantity; 
                    product.stock -= updatedItem.quantity; 

                    await queryRunner.manager.save(product);

                    salesItem.quantity = updatedItem.quantity;
                    salesItem.unit_rate = updatedItem.unit_rate;
                    salesItem.discount_rate = updatedItem.discount_rate || 0;

                    const total = updatedItem.quantity * updatedItem.unit_rate;
                    const totalAfterDis = total - (total * updatedItem.discount_rate) / 100;
                    const totalAfterTax = totalAfterDis + (totalAfterDis * product.vat) / 100;

                    salesItem.total_before_dis = total;
                    salesItem.total_after_dis = totalAfterDis;
                    salesItem.total_after_tax = totalAfterTax;

                    await queryRunner.manager.save(salesItem);
                }
            }

            if (updateSalesDto.payment) {
                for (const updatedPayment of updateSalesDto.payment) {
                    const payment = sales.payments.find(
                        (pay) => pay.id === updatedPayment.id
                    );

                    if (!payment) {
                        throw new HttpException(
                            `Payment ID not found`,
                            HttpStatus.NOT_FOUND
                        );
                    }

                    payment.amount = updatedPayment.amount;
                    payment.remark = updatedPayment.remark;
                    payment.payment_method = updatedPayment.payment_method;

                    await queryRunner.manager.save(payment);
                }
            }

            if (updateSalesDto.discount_in_total_sales !== undefined) {
                sales.discount = updateSalesDto.discount_in_total_sales;
            }

            if (updateSalesDto.tax_in_total_sales !== undefined) {
                sales.tax_rate = updateSalesDto.tax_in_total_sales;
            }

            sales.total_after_dis =
                sales.total_before_discount -
                (sales.total_before_discount * sales.discount) / 100;
            sales.total_after_tax =
                sales.total_after_dis +
                (sales.total_after_dis * sales.tax_rate) / 100;

            if (updateSalesDto.shipment_status) {
                sales.shipment_status = updateSalesDto.shipment_status;
            }

            if (updateSalesDto.remark) {
                sales.remarks = updateSalesDto.remark;
            }

            const updatedSales = await queryRunner.manager.save(sales);

            await queryRunner.commitTransaction();

            return returnObj(HttpStatus.OK, 'Sales updated successfully', updatedSales);
        } catch (err) {
            await queryRunner.rollbackTransaction();

            if (err instanceof HttpException) {
                throw err;
            }

            throw new HttpException(
                'Internal server error',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        } finally {
            await queryRunner.release();
        }
    }

}