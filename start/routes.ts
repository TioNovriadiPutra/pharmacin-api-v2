/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
// import TransactionsController from '#controllers/transactions_controller'

const AuthController = () => import('#controllers/auth_controller')
const UsersController = () => import('#controllers/users_controller')
const DrugFactoriesController = () => import('#controllers/drug_factories_controller')
const DrugsController = () => import('#controllers/drugs_controller')
const TransactionsController = () => import('#controllers/transactions_controller')

router.get('/', async () => {
  return {
    status: 'OK',
    message: 'Server Running'
  }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('/admin', [AuthController, 'registerAdmin'])
      })
      .prefix('/register')
    router.post('/login', [AuthController, 'login'])
  })
  .prefix('/auth')

router
  .group(() => {
    router.get('/profile', [UsersController, 'getUserProfile'])
  })
  .prefix('/user')
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )

router
  .group(() => {
    router.get('/', [DrugFactoriesController, 'getFactories'])
    router.get('/:id', [DrugFactoriesController, 'getFactoryDetail'])
    router.post('/partnership', [DrugFactoriesController, 'addDrugFactory'])
    router.delete('/partnership/:id', [DrugFactoriesController, 'deleteFactory'])
  })
  .prefix('/drug-factory')
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )

router
  .group(() => {
    router.get('/', [DrugsController, 'getDrugs'])
    router.post('/', [DrugsController, 'addDrug'])
    router
      .group(() => {
        router.get('/', [DrugsController, 'getCategories'])
        router.post('/', [DrugsController, 'addDrugCategory'])
        router.get('/:id', [DrugsController, 'getCategoryDetail'])
        router.put('/:id', [DrugsController, 'updateDrugCategory'])
        router.delete('/:id', [DrugsController, 'deleteDrugCategory'])
      })
      .prefix('/category')
    router.get('/:id', [DrugsController, 'getDrugDetail'])
    router.put('/:id', [DrugsController, 'updateDrug'])
    router.delete('/:id', [DrugsController, 'deleteDrug'])
  })
  .prefix('/drug')
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )

  router
  .group(() => {
    router.get('/', [TransactionsController, 'showPurchaseTransaction'])
    router.get('/:id', [TransactionsController, 'showDetailPurchaseTransaction'])
    router.post('/partnership', [TransactionsController, 'addPurchaseTransaction'])
    // router.delete('/partnership/:id', [TransactionsController, 'deleteFactory'])
  })
  .prefix('/transaction')
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )