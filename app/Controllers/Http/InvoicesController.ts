import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Invoice from 'App/Models/Invoice'
import InvoiceItem from 'App/Models/InvoiceItem'
import { DateTime } from 'luxon'
import shortUUID from 'short-uuid'

export default class InvoicesController {
  public async create({ auth, request, response }: HttpContextContract) {
    try {
      const { userId, invoiceItems } = request.all()

      const user = await auth.user

      if (user?.id !== userId) {
        return response.status(401).json({
          status: 401,
          message: 'Unauthorized',
          error: 'The user ID sent is different from the user ID of the auth token used.',
        })
      }

      const invoice = new Invoice()
      invoice.userId = userId

      // Generate a unique invoice number
      const invoiceDate = DateTime.local().toFormat('yyyyMMdd')
      const invoicePrefix = `INV-${invoiceDate}`
      const uniqueId = shortUUID.generate()
      invoice.invoiceNumber = `${invoicePrefix}-${uniqueId}`

      // Set due date
      invoice.dueDate = DateTime.local().plus({ days: 2 })

      // Calculate total amount from invoice items
      let total = 0
      for (const invoiceItem of invoiceItems) {
        total += invoiceItem.price * invoiceItem.quantity
      }
      invoice.totalAmount = total

      await invoice.save()

      // Create invoice items
      for (const invoiceItem of invoiceItems) {
        const item = new InvoiceItem()
        item.invoiceId = invoice.id
        item.itemName = invoiceItem.itemName
        item.quantity = invoiceItem.quantity
        item.price = invoiceItem.price

        await item.save()
      }

      const invoiceDetail = await Invoice.query()
        .if(userId, (query) => query.where('user_id', userId))
        .if(invoice.id, (query) => query.where('id', invoice.id))
        .preload('user')
        .preload('items')

      return response.status(201).json({
        status: 201,
        message: 'Created',
        data: invoiceDetail,
      })
    } catch (error) {
      return response.status(500).json({
        status: 500,
        message: 'Internal Server Error',
        error: error,
      })
    }
  }
}
