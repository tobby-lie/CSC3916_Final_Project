import Donation from '../models/donation.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable'
import fs from 'fs'
import defaultImage from './../../client/assets/images/default.png'
import Charity from "../models/charity.model";
import { Mongoose } from 'mongoose'
var jwt = require('jsonwebtoken')
var mongoose = require('mongoose')

const create = (req, res) => {
    if (req.body.order.donation) {
        req.body.amount = req.body.order.donation.amount;
        req.body.charityId = req.body.order.donation.charityId;

    }
    if (!req.body.amount || !req.body.charityId) {
        return res.json({ success: false, message: "missing amount or charityId" })
    } else {
        const donation = new Donation(req.body)
        donation.owner = req.params.userId

        Charity.findById({ "_id": req.body.charityId }, function (err, charity) {
            if (err) {
                return res.status(403).json({ success: false, message: "Unable to post donation for charity passed in." })
            } else if (!charity) {
                return res.status(403).json({ success: false, message: "Unable to find charity passed in." })
            } else {
                donation.charity = charity._id;

                donation.save(function (err) {
                    if (err) {
                        return res.status(403).json({ success: false, message: "unable to post donation for charity passed in" })
                    } else {
                        req.body.order.donation = donation._id;
                        return res.status(200).json({ success: true, message: "successfully saved donation for charity passed in", donation: donation })
                    }
                })
            }
        })
    }
}


const create2 = (req, res, next) => {
    if (req.body.order.donation) {
        req.body.amount = req.body.order.donation.amount;
        req.body.charityId = req.body.order.donation.charityId;

    } else {
        req.body.order.donation = ''
    }
    if (!req.body.amount || !req.body.charityId) {
        // return res.json({ success: false, message: "missing amount or charityId" })
        next()
    } else {
        const donation = new Donation(req.body)
        donation.owner = req.params.userId

        Charity.findById({ "_id": req.body.charityId }, function (err, charity) {
            if (err) {
                return res.status(403).json({ success: false, message: "Unable to post donation for charity passed in." })
            } else if (!charity) {
                return res.status(403).json({ success: false, message: "Unable to find charity passed in." })
            } else {
                donation.charity = charity._id;

                donation.save(function (err) {
                    if (err) {
                        return res.status(403).json({ success: false, message: "unable to post donation for charity passed in" })
                    } else {
                        req.body.order.donation = donation._id;
                        // return res.status(200).json({ success: true, message: "successfully saved donation for charity passed in", donation: donation })
                        next()
                    }
                })
            }
        })
    }
}

const one = async (req, res) => {
    Donation.find({ "_id": req.params.donationId }).select("amount owner charity").exec(function (err, donation) {
        if (err) {
            return res.status(403).json({ success: false, message: "Unable to retrieve charity passed in." });
        }
        if (donation && donation.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Successfully retrieved donation.",
                donation: donation
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Unable to retrieve a match for donation passed in."
            });
        }
    })
}

const donationByID = async (req, res, next, id) => {
    try {
        let donation = await Donation.findById(id).populate('owner', '_id name').exec()
        if (!donation)
            return res.status('400').json({
                error: "Donation not found"
            })
        req.donation = donation
        next()
    } catch (err) {
        return res.status('400').json({
            error: "Could not retrieve Donation"
        })
    }
}

const defaultPhoto = (req, res) => {
    return res.sendFile(process.cwd() + defaultImage)
}

const read = (req, res) => {
    req.shop.image = undefined
    return res.json(req.shop)
}

const update = (req, res) => {
    console.log('i am running')
    if (!req.body.updated_donation) {
        return res.json({ success: false, message: "Must pass in updated donation info" })
    } else {
        Donation.findByIdAndUpdate({ "_id": req.params.donationId }, req.body.updated_donation, function (err, donation) {
            if (err) {
                return res.status(403).json({ success: false, message: "unable to update charity" })
            } else if (!donation) {
                return res.status(403).json({ success: false, message: "unable to find charity to update" })
            } else {
                return res.status(200).json({ success: true, message: "successfully updated charity" })
            }
        })
    }
}

const remove = (req, res) => {
    Donation.findOneAndDelete({ "_id": req.params.donationId }, function (err, donation) {
        if (err) {
            return res.status(403).json({ success: false, message: "Error deleting charity" })
        } else if (!donation) {
            return res.status(403).json({ success: false, message: "No charity found to delete." })
        } else {
            return res.status(200).json({ success: true, message: "Successfully deleted charity." })
        }
    })
}

const list = async (req, res) => {
    try {
        let donations = await Donation.find()
        res.json(donations)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const listByOwner = async (req, res) => {
    try {
        let donations = await Donation.find({ owner: req.profile._id }).populate('owner', '_id name')
        res.json(donations)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const listByCharity = async (req, res) => {
    console.log("LISTBYCHARITY", req.params.charityId)
    Donation.aggregate([
        {
            $match:{
                charity: mongoose.Types.ObjectId(req.params.charityId)
        }},
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "results"
                }
            }
        
    ]).exec(function (err, donations) {
            if (err) {
                console.log("ERROR", err)
                return res.status(403).json({ success: false, message: "Unable to retrieve donations from charity passed in." });
            }
            if (donations && donations.length > 0) {
                return res.status(200).json({
                    success: true,
                    message: "Successfully retrieved donations from charity.",
                    donation: donations
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Unable to retrieve a match for donations from charity passed in."
                });
            }
        })
    // Donation.find({ "charity": req.params.charityId }).select("amount owner charity").exec(function (err, donations) {
    //     if (err) {
    //         return res.status(403).json({ success: false, message: "Unable to retrieve donations from charity passed in." });
    //     }
    //     if (donations && donations.length > 0) {
    //         return res.status(200).json({
    //             success: true,
    //             message: "Successfully retrieved donations from charity.",
    //             donation: donations
    //         });
    //     } else {
    //         return res.status(404).json({
    //             success: false,
    //             message: "Unable to retrieve a match for donations from charity passed in."
    //         });
    //     }
    // })
}

export default {
    one,
    create,
    create2,
    donationByID,
    defaultPhoto,
    list,
    listByOwner,
    listByCharity,
    read,
    update,
    remove
}
