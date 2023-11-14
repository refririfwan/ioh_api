import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Invoice from './Invoice'

export default class InvoiceItem extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public invoiceId: number

  @column()
  public itemName: string

  @column()
  public quantity: number

  @column()
  public price: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Invoice)
  public user: BelongsTo<typeof Invoice>
}
