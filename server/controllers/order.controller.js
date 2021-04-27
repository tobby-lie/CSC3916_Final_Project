import { Order, CartItem } from '../models/order.model'
import errorHandler from './../helpers/dbErrorHandler'

const create = async (req, res) => {
  try {
    let order;
    req.body.order.user = req.profile
    if (req.body.order.donation // 👈 null and undefined check
      && Object.keys(req.body.order.donation).length === 0 && req.body.order.donation.constructor === Object) {
      delete req.body.order.donation;
      console.log('body order', req.body.order)
      order = new Order(req.body.order)


    } else {

      console.log('we found donation', req.body.order)
      order = new Order(req.body.order)
    }
    let result = await order.save()

    console.log('body', req.body)

    res.status(200).json(result)

  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const listByShop = async (req, res) => {
  try {
    let orders = await Order.find({ "products.shop": req.shop._id })
      .populate({ path: 'products.product', select: '_id name price' })
      .sort('-created')
      .exec()
    res.json(orders)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const update = async (req, res) => {
  try {
    let order = await Order.update({ 'products._id': req.body.cartItemId }, {
      '$set': {
        'products.$.status': req.body.status
      }
    })
    res.json(order)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const getStatusValues = (req, res) => {
  res.json(CartItem.schema.path('status').enumValues)
}

const orderByID = async (req, res, next, id) => {
  try {
    let order = await Order.findById(id).populate('products.product', 'name price').populate('products.shop', 'name').exec()
    if (!order)
      return res.status('400').json({
        error: "Order not found"
      })
    req.order = order
    next()
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const listByUser = async (req, res) => {
  try {
    let orders = await Order.find({ "user": req.profile._id })
      .sort('-created')
      .exec()
    res.json(orders)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const read = (req, res) => {
  return res.json(req.order)
}

export default {
  create,
  listByShop,
  update,
  getStatusValues,
  orderByID,
  listByUser,
  read
}
