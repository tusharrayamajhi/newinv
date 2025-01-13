import { Entity, ManyToOne } from "typeorm";
import { BaseEntities } from "./BaseEntities.entities";
import { SalesReturnDetails } from "./salesReturnDetails.entities";


@Entity()
export class SalesReturnItem extends BaseEntities{

    @ManyToOne(() => SalesReturnDetails, (salesReturnDetails) => salesReturnDetails.returnItem)
    salesReturnDetails:SalesReturnDetails
}