
export const permissions = {
  create_user: "create_user",
  view_user: "view_user",
  update_user: "update_user",
  delete_user: "delete_user",

  create_role: "create_role",
  view_role: "view_role",
  update_role: "update_role",
  delete_role: "delete_role",

  create_category: "create_category",
  view_category: "view_category",
  update_category: "update_category",
  delete_category: "delete_category",

  create_company: "create_company",
  view_company: "view_company",
  update_company: "update_company",
  delete_company: "delete_company",

  create_unit: "create_unit",
  view_unit: "view_unit",
  update_unit: "update_unit",
  delete_unit: "delete_unit",

  create_brand: "create_brand",
  view_brand: "view_brand",
  update_brand: "update_brand",
  delete_brand: "delete_brand",

  create_product: "create_product",
  view_product: "view_product",
  view_selling_product: "view_selling_product",
  update_product: "update_product",
  delete_product: "delete_product",

  create_customer: "create_customer",
  view_customer: "view_customer",
  update_customer: "update_customer",
  delete_customer: "delete_customer",

  create_vendor: "create_vendor",
  view_vendor: "view_vendor",
  update_vendor: "update_vendor",
  delete_vendor: "delete_vendor",

  create_quotation: "create_quotation",
  view_quotation: "view_quotation",
  update_quotation: "update_quotation",
  delete_quotation: "delete_quotation",

  create_purchase: "create_purchase",
  update_purchase: "update_purchase",
  view_purchase: "view_purchase",
  view_All_purchase:"view_All_purchase",
  
  create_sales: "create_sales",
  update_sales: "update_sales",
  view_sales: "view_sales",
  view_All_sales:"view_All_sales",

  get_top_selling_brand:"get_top_selling_brand",
  
  get_top_selling_category:"get_top_selling_category",

  get_top_selling_customer:"get_top_selling_customer",

  get_top_selling_product:"get_top_selling_product",

  get_top_selling_vendor:"get_top_selling_vendor",

  get_top_sellers:"get_top_sellers",

  get_profit_loss:"get_profit_loss",

  get_sales:"get_sales",

  get_seller_sales:"get_seller_sales",

  get_low_stock_notification:"get_low_stock_notification",




  // changeUserPassword: "changeUserPassword",
}

export const groupPermission = {
  create_purchase:[permissions.view_product,permissions.view_vendor,permissions.create_purchase],
  edit_purchase:[permissions.view_product,permissions.view_vendor,permissions.update_purchase],
  create_sales:[permissions.view_selling_product,permissions.view_customer,permissions.create_sales],
  edit_sales:[permissions.view_selling_product,permissions.view_customer,permissions.update_sales],
}