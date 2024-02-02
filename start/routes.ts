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

const AuthController = () => import('#controllers/auth_controller')
const UsersController = () => import('#controllers/users_controller')
const DrugFactoriesController = () => import('#controllers/drug_factories_controller')

router.get('/', async () => {
  return {
    hello: 'world',
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
    router.post('/partnership', [DrugFactoriesController, 'addDrugFactory'])
    router.delete('/partnership/:id', [DrugFactoriesController, 'deleteFactory'])
  })
  .prefix('/drug-factory')
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )
