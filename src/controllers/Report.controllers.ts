import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { Permission } from "src/decorator/Permission.decorator";
import { AllUserCanAccess } from "src/guards/alluserCanAccess";
import { canAccess } from "src/guards/canAccess.guards";
import { havePermissionGuards } from "src/guards/havePermission.guards";
import { permissions } from "src/object/permission.object";
import { roles } from "src/object/roles.object";
import { ReportService } from "src/services/Report.services";
import { swaggerUser } from "src/swagger/swagger.user";
import { swaggerController } from "src/swagger/swaggercontroller";

//swagger
@ApiBearerAuth("jwt")
@ApiTags(swaggerUser.admin+swaggerController.report,swaggerUser.other+swaggerController.report)
//code
@Controller('Report')
export class ReportController{

  constructor(private readonly reportService: ReportService) {}

  @Get('brands/top-selling')
  @UseGuards(AllUserCanAccess)
  @Permission(permissions.get_top_selling_brand)
  async getTopSellingBrands(
    @Req() req: Request,
    @Query('limit') limit: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.reportService.getTopSellingBrands(req, limit, startDate, endDate);
  }

  @Get('category/top-selling')
  @UseGuards(havePermissionGuards)
  @Permission(permissions.get_top_selling_category)
  async getTopSellingCategories(
    @Req() req: Request,
    @Query('limit') limit: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.reportService.getTopSellingCategories(req, limit, startDate, endDate);
  }

  @Get('customers/buyers')
  @UseGuards(havePermissionGuards)
  @Permission(permissions.get_top_selling_customer)
  async getTopSellingCustomers(
    @Req() req: Request,
    @Query('limit') limit: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.reportService.getTopSellingCustomers(req, limit, startDate, endDate);
  }

  @Get('products/top-selling')
  @UseGuards(havePermissionGuards)
  @Permission(permissions.get_top_selling_product)
  async getTopSellingProducts(
    @Req() req: Request,
    @Query('limit') limit: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.reportService.getTopSellingProducts(req, limit, startDate, endDate);
  }
  @Get('vendors/top-purchasers')
  @UseGuards(havePermissionGuards)
  @Permission(permissions.get_top_selling_vendor)
  async getTopVendors(
    @Req() req: Request,
    @Query('limit') limit: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.reportService.getTopVendors(req, limit, startDate, endDate);
  }

  @Get('users/top-sellers')
  @UseGuards(havePermissionGuards)
  @Permission(permissions.get_top_sellers)
  async getTopSellerUsers(
    @Req() req: Request,
    @Query('limit') limit: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.reportService.getTopSellerUsers(req, limit, startDate, endDate);
  }

  @Get('profit-loss')
  @UseGuards(havePermissionGuards)
  @Permission(permissions.get_profit_loss)
  async getProfitAndLoss(
    @Req() req: Request,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.reportService.getProfitAndLoss(req, startDate, endDate);
  }

  @Get('sales')
  @UseGuards(havePermissionGuards)
  @Permission(permissions.get_sales)
  async getSales(
    @Req() req: Request,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.reportService.getSales(req, startDate, endDate);
  }

  @Get('sales/:sellerId')
  @UseGuards(canAccess)
  @Permission(roles.Admin)
  async getSalesBySeller(
    @Req() req: Request,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('sellerId') sellerId: string
  ) {
    return this.reportService.getSalesBySeller(req, startDate, endDate, sellerId);
  }
}
