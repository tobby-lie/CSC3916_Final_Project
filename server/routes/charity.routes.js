import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import charityCtrl from '../controllers/charity.controller'

const router = express.Router()

// get all charities
router.route('/api/charities')
    .get(charityCtrl.list)

router.route('/api/charity/:charityId')
    .get(charityCtrl.read)

router.route('/api/charities/by/:userId')
    .post(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.isSeller, charityCtrl.create)
    .get(authCtrl.requireSignin, authCtrl.hasAuthorization, charityCtrl.listByOwner)

router.route('/api/charities/:charityId')
    .put(authCtrl.requireSignin, charityCtrl.update)
    .delete(authCtrl.requireSignin, charityCtrl.remove)

router.param('charityID', charityCtrl.charityByID)
router.param('userId', userCtrl.userByID)

export default router