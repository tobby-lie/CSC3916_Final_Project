import express from 'express'
import productCtrl from '../controllers/product.controller'
import authCtrl from '../controllers/auth.controller'
import shopCtrl from '../controllers/shop.controller'
import charityCtrl from '../controllers/charity.controller'
import donationCtrl from '../controllers/donation.controller'
import userCtrl from "../controllers/user.controller";

const router = express.Router()

router.route('/api/donations')
    .get(donationCtrl.list)

router.route('/api/donations/:donationId')
    .get(donationCtrl.one)

router.route('/api/donations/by/:userId')
    .post(authCtrl.requireSignin, donationCtrl.create)
    .get(authCtrl.requireSignin, donationCtrl.listByOwner)

router.route('/api/donations/from/:charityId')
    .get(donationCtrl.listByCharity)

router.route('/api/donations/:donationId')
    .put(authCtrl.requireSignin, donationCtrl.update)
    .delete(authCtrl.requireSignin, donationCtrl.remove)

router.param('donationId', donationCtrl.donationByID)
router.param('userId', userCtrl.userByID)

export default router
