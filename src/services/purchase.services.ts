import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { PurchaseDetail } from "src/dtos/createDtos/createPurchaseDetails.dtos";
import { updatePurchase } from "src/dtos/updateDtos/updatePurchase.dtos";
import { Companies } from "src/entities/Company.entities";
import { Payment } from "src/entities/payment.entities";
import { Product } from "src/entities/product.entities";
import { PurchaseItem } from "src/entities/PurchaseItem.entities";
import { PurchaseDetails } from "src/entities/purchaseDetails.entities";
import { Users } from "src/entities/user.entities";
import { Vendor } from "src/entities/vendors.entities";
import { roles } from "src/object/roles.object";
import { returnObj } from "src/utils/returnObj";
import { Between, DataSource, Equal, Repository } from "typeorm";

@Injectable()
export class purchaseService {



    constructor(
        @InjectRepository(Users) private readonly userRepo: Repository<Users>,
        @InjectRepository(Product) private readonly productRepo: Repository<Product>,
        @InjectRepository(Companies) private readonly companyRepo: Repository<Companies>,
        @InjectRepository(PurchaseDetails) private readonly purchaseDetailRepo: Repository<PurchaseDetails>,
        @InjectRepository(PurchaseItem) private readonly purchaseItemRepo: Repository<PurchaseItem>,
        @InjectRepository(Vendor) private readonly vendorRepo: Repository<Vendor>,
        @InjectRepository(Payment) private readonly payRepo: Repository<Payment>,
        private dataSource: DataSource
    ) { }

    async getPurchaseCode(companyId: string, company_code: string) {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        const number = (await this.purchaseDetailRepo.find({ where: { 
            company: Equal(companyId),
            createdAt: Between(startOfDay, endOfDay) } })).length
        // const company_code = (await this.companyRepo.findOne({ where: { id: Equal(companyId) } })).company_code
        const date = new Date();
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear().toString();

        const code = `${company_code}-${day}${month}${year}-${number + 1}`;
        return code
    }

    async createPurchase(req: any, purchaseDto: PurchaseDetail) {
        if (roles.SuperAdmin == req.user.role) {
            throw new HttpException("you cannot create a purchase", HttpStatus.FORBIDDEN)
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            const user = await queryRunner.manager.findOne(Users, { where: { id: Equal(req.user.id) }, relations: { company: true } })
            if (!user) {
                throw new HttpException('no user found', HttpStatus.NOT_FOUND)
            }
            const vendor = await queryRunner.manager.findOne(Vendor, { where: { id: Equal(purchaseDto.vendorId), company: Equal(user.company.id) } })
            if (!vendor) {
                throw new HttpException("invalid vendor id", HttpStatus.NOT_FOUND)
            }

            let total_amt: number = 0;

            const purchaseItem: PurchaseItem[] = []
            for (const items of purchaseDto.purchaseItems) {

                const product = await queryRunner.manager.findOne(Product, { where: { id: Equal(items.productId), company: Equal(user.company.id) } })
                if (!product) {
                    throw new HttpException("invalid product id", HttpStatus.NOT_FOUND)
                }
                if(!product.can_sell){
                    throw new HttpException("prodcut is not available for sale",HttpStatus.FORBIDDEN)
                }
                const tax_rate = product.vat
                if (!items.discount_rate) {
                    items.discount_rate = 0;
                }
                const total = items.received_qnt * items.unit_rate;
                const totalAfterDis = (items.received_qnt * items.unit_rate) - ((items.received_qnt * items.unit_rate) * items.discount_rate / 100)
                const totalAfterTax = totalAfterDis + ((totalAfterDis) * tax_rate / 100)
                total_amt += totalAfterTax
                const purItem = queryRunner.manager.create(PurchaseItem, {
                    received_qnt: items.received_qnt,
                    unit_rate: items.unit_rate,
                    tax_rate: tax_rate,
                    purchase_date: items.purchase_date,
                    remarks: items.remarks,
                    total: total,
                    totalAfterDis: totalAfterDis,
                    totalAfterTax: totalAfterTax,
                    product: product,
                    discount_rate: items.discount_rate,
                    company: user.company
                });
                product.stock = product.stock + items.received_qnt;
                await queryRunner.manager.save(product)
                const item = await queryRunner.manager.save(purItem)
                purchaseItem.push(item)
            }

            const paymentDetails: Payment[] = []
            // let totalPayed:number = 0
            for (const payment of purchaseDto.payment) {
                // totalPayed+=payment.amount
                const payments = queryRunner.manager.create(Payment, {
                    amount: payment.amount,
                    company: user.company,
                    remark: payment.remark,
                    vendor: vendor,
                    customer: null,
                    payment_method: payment.payment_method
                })
                const result = await queryRunner.manager.save(payments)
                paymentDetails.push(result)
            }

            const purchaseCode = await this.getPurchaseCode(user.company.id, user.company.company_code);

            if (!purchaseDto.discountInTotalPurchase) {
                purchaseDto.discountInTotalPurchase = 0;
            }
            const totalAfterDiscount = total_amt - (total_amt * purchaseDto.discountInTotalPurchase / 100)

            if (purchaseDto.taxInTotalPurchase) {
                purchaseDto.taxInTotalPurchase = 0;
            }
            const totalAfterTax = totalAfterDiscount + (totalAfterDiscount * purchaseDto.taxInTotalPurchase / 100)
            // if(totalPayed != totalAfterTax){
            //     throw new HttpException("amount didn't match",HttpStatus.CONFLICT)
            // }
            const purchaseDetails = queryRunner.manager.create(PurchaseDetails, {
                purchaseBy: req.user.id,
                total_before_dis: total_amt,
                discountInTotalPurchase: purchaseDto.discountInTotalPurchase,
                total_after_dis: totalAfterDiscount,
                taxInTotalPurchase: purchaseDto.taxInTotalPurchase,
                total_after_tax: totalAfterTax,
                purchaseCode: purchaseCode,
                company: user.company,
                vendor: vendor,
                shipment_status: purchaseDto.shipment_status,
                purchases: purchaseItem,
                payments: paymentDetails,
                remark: purchaseDto.remark
            })
            const savedData = await queryRunner.manager.save(purchaseDetails)
            await queryRunner.commitTransaction()
            return returnObj(HttpStatus.OK, "success", savedData)
        } catch (err) {
            console.log(err)
            await queryRunner.rollbackTransaction()
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
        } finally {
            await queryRunner.release()
        }
    }


    async getAllPurchase(req: any,page:number) {
        try {
            if (roles.SuperAdmin == req.user.role) {
                throw new HttpException("you cannot create a purchase", HttpStatus.FORBIDDEN)
            }
            const user = await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } })
            if (!user || !user.company) {
                throw new HttpException("user and company not found", HttpStatus.NOT_FOUND)
            }
            if (roles.Admin == req.user.role) {
                const purchase = await this.purchaseDetailRepo.find({skip:page * 10, take:10, where: { company: Equal(user.company.id) }, relations: { purchases: true, payments: true, purchaseBy: true } })
                if (!purchase || purchase.length == 0) {
                    throw new HttpException("no purchases found", HttpStatus.NOT_FOUND)
                }
                return returnObj(HttpStatus.OK, "success", purchase)
            } else {
                const purchase = await this.purchaseDetailRepo.find({skip:page * 10, take:10, where: { company: Equal(user.company.id), purchaseBy: user }, relations: { purchases: true, payments: true, purchaseBy: true } })
                if (!purchase || purchase.length == 0) {
                    throw new HttpException("no purchases found", HttpStatus.NOT_FOUND)
                }
                return returnObj(HttpStatus.OK, "success", purchase)
            }
        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async getPurchaseById(req: any, code: string) {
        try {
            const user = await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } })
            if (!user) {
                throw new HttpException("user not found", HttpStatus.NOT_FOUND)
            }
            if (roles.Admin == req.user.role) {
                const purchase = await this.purchaseDetailRepo.find({ where: { purchaseCode: Equal(code), company: Equal(user.company.id) }, relations: { purchases: true, payments: true } })
                if (!purchase || purchase.length == 0) {
                    throw new HttpException("invalid purchase id", HttpStatus.NOT_FOUND)
                }
                return returnObj(HttpStatus.OK, "success", purchase)
            } else {
                const purchase = await this.purchaseDetailRepo.find({ where: { purchaseCode: Equal(code), purchaseBy: user, company: Equal(user.company.id) }, relations: { purchases: true, payments: true } })
                if (!purchase || purchase.length == 0) {
                    throw new HttpException("invalid purchase id", HttpStatus.NOT_FOUND)
                }
                return returnObj(HttpStatus.OK, "success", purchase)
            }

        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getPurchaseByUser(req: any, user_id: string,page:number) {
        try {
            if (roles.Admin == req.user.role) {
                const admin = await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } })
                if (!admin) {
                    throw new HttpException("no user found", HttpStatus.NOT_FOUND)
                }
                const user = await this.userRepo.findOne({ where: { id: Equal(user_id), company: Equal(admin.company.id) } })
                if (!user) {
                    throw new HttpException("invalid user id", HttpStatus.NOT_FOUND)
                }
                const purchases = await this.purchaseDetailRepo.find({skip:page * 10, take:10, where: { purchaseBy: Equal(user.id) }, relations: { purchases: true, payments: true,purchaseBy:true } })
                if (!purchases || purchases.length == 0) {
                    throw new HttpException("no purchase found", HttpStatus.NOT_FOUND)
                }
                return returnObj(HttpStatus.OK, "success", user.purchaseDetails)
            } else {
                throw new HttpException("you are not allowed to view this", HttpStatus.FORBIDDEN)
            }

        } catch (err) {
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async getPurchaseByVendorId(req: any, vendor_id: string,page:number) {
        try {
            const user = await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } })
            if (!user) {
                throw new HttpException("user not found", HttpStatus.NOT_FOUND)
            }
            const vendor = await this.vendorRepo.findOne({ where: { id: Equal(vendor_id), company: Equal(user.company.id) } })
            if (!vendor) {
                throw new HttpException('invalid vendor id', HttpStatus.NOT_FOUND)
            }
            const purchase = await this.purchaseDetailRepo.find({skip:page * 10,take:10, where: { vendor: { id: Equal(vendor.id) } }, relations: { purchases: true, payments: true } })
            if (!purchase || purchase.length == 0) {
                throw new HttpException("no purchase found", HttpStatus.NOT_FOUND)
            }
            return returnObj(HttpStatus.OK, "success", purchase)
        } catch (err) {
            console.log(err)
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getMyPurchases(req: any,page:number) {
        try {
            const user = await this.userRepo.findOne({ where: { id: Equal(req.user.id) }, relations: { company: true } })
            if (!user) {
                throw new HttpException("user not found", HttpStatus.NOT_FOUND)
            }

            const purchase = await this.purchaseDetailRepo.find({skip:page * 10,take:10, where: { purchaseBy: Equal(req.user.id), company: Equal(user.company.id) }, relations: { purchases: true, payments: true } })
            if (!purchase || purchase.length == 0) {
                throw new HttpException("no purchases found", HttpStatus.NOT_FOUND)
            }
            return returnObj(HttpStatus.OK, "success", purchase)
        } catch (err) {
            console.log(err)
            if (err instanceof HttpException) {
                throw err
            }
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updatePurchases(req: any, code: string, updatePurchaseDto: updatePurchase) {
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

            const purchase = await queryRunner.manager.findOne(PurchaseDetails,{
                where: { purchaseCode: Equal(code), company: Equal(user.company.id) },
                relations: { vendor: true, purchases: true, payments: true },
            });

            if (!purchase) {
                throw new HttpException('Purchase not found', HttpStatus.NOT_FOUND);
            }

            if (updatePurchaseDto.vendorId) {
                const vendor = await queryRunner.manager.findOne(Vendor,{
                    where: { id: Equal(updatePurchaseDto.vendorId), company: Equal(user.company.id) },
                });

                if (!vendor) {
                    throw new HttpException('Invalid vendor ID', HttpStatus.NOT_FOUND);
                }

                purchase.vendor = vendor;
            }

            if (updatePurchaseDto.purchaseItems) {
                for (const updatedItem of updatePurchaseDto.purchaseItems) {
                    const purchaseItem = purchase.purchases.find(
                        (item) => item.id === updatedItem.id
                    );

                    if (!purchaseItem) {
                        throw new HttpException(
                            `Purchase item id not found`,
                            HttpStatus.NOT_FOUND
                        );
                    }

                    const product = await queryRunner.manager.findOne(Product,{
                        where: { id: Equal(updatedItem.productId), company: Equal(user.company.id) },
                    });

                    if (!product) {
                        throw new HttpException('Invalid product ID', HttpStatus.NOT_FOUND);
                    }

                    product.stock -= purchaseItem.received_qnt;
                    product.stock += updatedItem.received_qnt;

                    await queryRunner.manager.save(product);

                    purchaseItem.received_qnt = updatedItem.received_qnt;
                    purchaseItem.unit_rate = updatedItem.unit_rate;
                    purchaseItem.discount_rate = updatedItem.discount_rate || 0;

                    const total = updatedItem.received_qnt * updatedItem.unit_rate;
                    const totalAfterDis = total - (total * updatedItem.discount_rate) / 100;
                    const totalAfterTax = totalAfterDis + (totalAfterDis * product.vat) / 100;

                    purchaseItem.total = total;
                    purchaseItem.totalAfterDis = totalAfterDis;
                    purchaseItem.totalAfterTax = totalAfterTax;

                    await queryRunner.manager.save(purchaseItem);
                }
            }

            if (updatePurchaseDto.payment) {
                for (const updatedPayment of updatePurchaseDto.payment) {
                    const payment = purchase.payments.find(
                        (pay) => pay.id === updatedPayment.id
                    );

                    if (!payment) {
                        throw new HttpException(
                            `Payment ID  not found`,
                            HttpStatus.NOT_FOUND
                        );
                    }

                    payment.amount = updatedPayment.amount;
                    payment.remark = updatedPayment.remark;
                    payment.payment_method = updatedPayment.payment_method;

                    await this.payRepo.save(payment);
                }
            }

            if (updatePurchaseDto.discountInTotalPurchase !== undefined) {
                purchase.discountInTotalPurchase = updatePurchaseDto.discountInTotalPurchase;
            }

            if (updatePurchaseDto.taxInTotalPurchase !== undefined) {
                purchase.taxInTotalPurchase = updatePurchaseDto.taxInTotalPurchase;
            }

            purchase.total_after_dis =
                purchase.total_before_dis -
                (purchase.total_before_dis * purchase.discountInTotalPurchase) / 100;
            purchase.total_after_tax =
                purchase.total_after_dis +
                (purchase.total_after_dis * purchase.taxInTotalPurchase) / 100;

            if (updatePurchaseDto.shipment_status) {
                purchase.shipment_status = updatePurchaseDto.shipment_status;
            }

            if (updatePurchaseDto.remark) {
                purchase.remark = updatePurchaseDto.remark;
            }

            const updatedPurchase = await queryRunner.manager.save(purchase);

            await queryRunner.commitTransaction();

            return returnObj(HttpStatus.OK, 'Purchase updated successfully', updatedPurchase);
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