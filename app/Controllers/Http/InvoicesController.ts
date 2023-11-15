import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Invoice from 'App/Models/Invoice'
import InvoiceItem from 'App/Models/InvoiceItem'
import SortThreadValidator from 'App/Validators/SortThreadValidator'
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

      // Retrieve the created invoice details
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

  public async update({ auth, request, response, params }: HttpContextContract) {
    try {
      const { userId, invoiceItems } = request.all()

      // Check if an invoice with the provided ID exists
      const invoice = await Invoice.query().where('id', params.id).first()

      if (!invoice) {
        // If no invoice exists
        return response.status(404).json({
          status: 404,
          message: 'Not Found',
          error: 'Invoice data not found',
        })
      }

      // Verify authorization based on the invoice owner
      const user = await auth.user
      if (user?.id !== invoice.userId) {
        return response.status(401).json({
          status: 401,
          message: 'Unauthorized',
          error: 'The user ID sent is different from the user ID of the auth token used.',
        })
      }

      // Update invoice details
      invoice.userId = userId

      // Generate a unique invoice number (if not already present)
      if (!invoice.invoiceNumber) {
        const invoiceDate = DateTime.local().toFormat('yyyyMMdd')
        const invoicePrefix = `INV-${invoiceDate}`
        const uniqueId = shortUUID.generate()
        invoice.invoiceNumber = `${invoicePrefix}-${uniqueId}`
      }

      // Update due date (if not already present)
      if (!invoice.dueDate) {
        invoice.dueDate = DateTime.local().plus({ days: 2 })
      }

      // Update total amount based on invoice items
      let total = 0
      for (const invoiceItem of invoiceItems) {
        total += invoiceItem.price * invoiceItem.quantity
      }
      invoice.totalAmount = total

      // Save the updated invoice
      await invoice.save()

      // Delete existing invoice items and create new ones
      await InvoiceItem.query().where('invoice_id', invoice.id).delete()

      for (const invoiceItem of invoiceItems) {
        const item = new InvoiceItem()
        item.invoiceId = invoice.id
        item.itemName = invoiceItem.itemName
        item.quantity = invoiceItem.quantity
        item.price = invoiceItem.price

        await item.save()
      }

      // Retrieve the updated invoice details
      const invoiceDetail = await Invoice.query()
        .if(userId, (query) => query.where('user_id', userId))
        .if(invoice.id, (query) => query.where('id', invoice.id))
        .preload('user')
        .preload('items')

      return response.status(200).json({
        status: 200,
        message: 'Updated',
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

  public async delete({ auth, response, params }: HttpContextContract) {
    try {
      // Check if an invoice with the provided ID exists
      const invoice = await Invoice.query().where('id', params.id).first()

      if (!invoice) {
        return response.status(404).json({
          status: 404,
          message: 'Not Found',
          error: 'No invoice found with the provided ID.',
        })
      }

      // Verify authorization based on the invoice owner
      const user = await auth.user
      if (user?.id !== invoice.userId) {
        return response.status(401).json({
          status: 401,
          message: 'Unauthorized',
          error: 'The user ID sent is different from the user ID of the auth token used.',
        })
      }

      // Delete the invoice include items
      await invoice.delete()

      return response.status(200).json({
        status: 200,
        message: 'Deleted',
        data: {
          invoiceId: params.id,
        },
      })
    } catch (error) {
      return response.status(500).json({
        status: 500,
        message: 'Internal Server Error',
        error: error,
      })
    }
  }

  public async index({ response, request, auth }: HttpContextContract) {
    try {
      const page = request.input('page', 1)
      const perPage = request.input('per_page', 5)
      const userId = request.input('user_id')

      // Verify authorization based on the invoice owner
      const user = await auth.user
      if (user?.id !== +userId) {
        return response.status(401).json({
          status: 401,
          message: 'Unauthorized',
          error: 'The user ID sent is different from the user ID of the auth token used.',
        })
      }

      const sortValidated = await request.validate(SortThreadValidator)
      const sortBy = sortValidated.sort_by || 'id'
      const order = sortValidated.order || 'asc'

      const invoices = await Invoice.query()
        .if(userId, (query) => query.where('user_id', userId))
        .orderBy(sortBy, order)
        .preload('items')
        .paginate(page, perPage)

      return response.status(200).json({
        status: 200,
        message: 'OK',
        data: invoices,
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
