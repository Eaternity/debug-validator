import {pipe} from 'ramda'
import path from 'path'

import {
  loadAllProducts,
  // loadFaos,
  loadNutrs,
  loadNutrChange,
  loadProductSchema
} from './helpers/helpers'

import {
  orderProduct,
  removeEmptyArrays,
  removeEmptyObjectsFromArrays,
  schemaValidate,
  addParentProduct,
  addMissingFields,
  validateNutritionId,
  validateNutrChangeId,
  classify
} from './validator/validator'

const dataDir = path.resolve(`${__dirname}`, '../eaternity-edb-data')

const products = loadAllProducts(dataDir)
const nutrs = loadNutrs(dataDir)
// const foas = loadFaos(dataDir)
const nutrChange = loadNutrChange(dataDir)
const productSchema = loadProductSchema(dataDir)
const orderedKeys = Object.keys(productSchema.properties)
const enhancedKeys = [...orderedKeys, 'filename', 'validationSummary']

// just use whatever methods from the validator here...
// Put in debugger statements in the relevant functions of the valiedator where
// you need them!
const validateProduct = pipe(
  removeEmptyObjectsFromArrays(enhancedKeys),
  removeEmptyArrays(enhancedKeys),
  orderProduct(enhancedKeys),
  schemaValidate(productSchema),
  addParentProduct(products),
  addMissingFields,
  validateNutritionId(nutrs),
  validateNutrChangeId(nutrChange),
  classify
)

// run for all props
// products.forEach(product => validateProduct(product))

// run for a single product
const product = products[10]
// console.log(product)
validateProduct(product)
