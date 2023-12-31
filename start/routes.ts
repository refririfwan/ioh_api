/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

// auth routes
Route.group(() => {
  Route.post('/register', 'AuthController.register')
  Route.post('/login', 'AuthController.login')
}).prefix('/auth')

// api routes
Route.group(() => {
  Route.post('/invoices', 'InvoicesController.create').middleware('auth')
  Route.put('/invoices/:id', 'InvoicesController.update').middleware('auth')
  Route.delete('/invoices/:id', 'InvoicesController.delete').middleware('auth')
  Route.get('/invoices', 'InvoicesController.index').middleware('auth')
  Route.get('/invoices/:id', 'InvoicesController.show').middleware('auth')
}).prefix('/api')
