import { DateTime } from 'luxon'
import { nanoid } from 'nanoid'
import {
  BaseModel,
  BelongsTo,
  HasMany,
  beforeCreate,
  belongsTo,
  column,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import InvoiceItem from './InvoiceItem'

export default class Invoice extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public invoiceNumber: string

  @column()
  public dueDate: DateTime

  @column()
  public totalAmount: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => InvoiceItem)
  public invoices: HasMany<typeof InvoiceItem>

  @beforeCreate()
  public static async setDueDateAndTotalAmount(model: Invoice) {
    const d2AfterCreatedAt = DateTime.local().plus({ days: 2 })
    model.dueDate = d2AfterCreatedAt

    // Generate a unique invoice number based on the due date
    const invoiceDate = d2AfterCreatedAt.toFormat('yyyyMMdd')
    const invoicePrefix = `INV-${invoiceDate}`
    const uniqueId = nanoid(5)
    model.invoiceNumber = `${invoicePrefix}-${uniqueId}`

    // Calculate the total amount from invoice items
    let totalAmount = 0
    for (const item of model.invoices) {
      totalAmount += item.price * item.quantity
    }
    model.totalAmount = totalAmount
  }
}
