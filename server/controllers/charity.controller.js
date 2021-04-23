import Charity from '../models/charity.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable'
import fs from 'fs'
import defaultImage from './../../client/assets/images/default.png'
import User from "../models/user.model";
import Shop from "../models/shop.model";
import mongoose from "mongoose";

const create = async (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        if(err){
            res.status(400).json({
                message: "Image could not be uploaded"
            })
        }
        const charity = new Charity(fields)
        charity.owner= req.profile
        console.log("CHARITY OWNER", charity.owner)
        if(files.image){
            charity.image.data = fs.readFileSync(files.image.path)
            charity.image.contentType = files.image.type
        }
        try {
            await charity.save()
            return res.status(200).json({
                message: "Successfully created charity!"
            })
        } catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
    })
}

const one = async (req, res) => {
   
   Charity.find({"_id": req.params.charityId}).select("name description updated owner").exec(function (err, charity) {
        
        if (err) {
            return res.status(403).json({success: false, message: "Unable to retrieve charity passed in."});
        }
        if (charity && charity.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Successfully retrieved charity.",
                charity: charity
            });
            
        } else {
            return res.status(404).json({
                success: false,
                message: "Unable to retrieve a match for charity passed in."
            });
        }
       
    })
}

const charityByID = async (req, res, next, id) => {
    try {
        let charity = await Charity.findById(id).populate('owner', '_id name').exec()
        if (!charity)
            return res.status('400').json({
                error: "Charity not found"
            })
        req.charity = charity
        next()
    } catch (err) {
        return res.status('400').json({
            error: "Could not retrieve charity"
        })
    }
}

const photo = (req, res, next) => {
    if(req.charity.image.data){
        res.set("Content-Type", req.charity.image.contentType)
        return res.send(req.charity.image.data)
    }
    next()
}
const defaultPhoto = (req, res) => {
    return res.sendFile(process.cwd()+defaultImage)
}

const read = (req, res) => {
    //req.shop.image = undefined
    console.log("READS RESPONSE", req.charity)
    return res.json(req.charity)
}

// const update = (req, res) => {
//     console.log(req)
//     let form = new formidable.IncomingForm()
//     form.keepExtensions = true
//     form.parse(req, async (err, fields, files) => {
//         if (err) {
//             res.status(400).json({
//                 message: "Photo could not be uploaded"
//             })
//         }
//         let shop = req.shop
//         shop = extend(shop, fields)
//         shop.updated = Date.now()
//         if(files.image){
//             shop.image.data = fs.readFileSync(files.image.path)
//             shop.image.contentType = files.image.type
//         }
//         try {
//             let result = await shop.save()
//             res.json(result)
//         }catch (err){
//             return res.status(400).json({
//                 error: errorHandler.getErrorMessage(err)
//             })
//         }
//     })
// }

const update = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(400).json({
          message: "Photo could not be uploaded"
        })
      }
      let charity = req.charity
      console.log("CHARITY CONTROLLER BEFORE EXTEND", charity)
      charity = extend(charity, fields)
      console.log("CHARITY AFTER EXTEND", charity)
      charity.updated = Date.now()
      if(files.image){
        shop.image.data = fs.readFileSync(files.image.path)
        shop.image.contentType = files.image.type
      }
      try {
        let result = await charity.save()
        res.json(result)
      }catch (err){
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
    })
  }

// const update = (req, res) => {
//     console.log('i am running')
//     if(!req.body.updated_charity) {
//         return res.json( { success: false, message: "Must pass in updated charity info"})
//     } else {
//         Charity.findByIdAndUpdate({"_id": req.params.charityId}, req.body.updated_charity, function(err, charity) {
//             if (err) {
//                 return res.status(403).json( { success: false, message: "unable to update charity"})
//             } else if (!charity) {
//                 return res.status(403).json({success: false, message: "unable to find charity to update"})
//             } else {
//                 return res.status(200).json({success: true, message: "successfully updated charity"})
//             }
//         })
//     }
// }

const remove = (req, res) => {
    Charity.findOneAndDelete({"_id": req.params.charityId}, function(err, charity) {
        if (err) {
            return res.status(403).json({success: false, message: "Error deleting charity"})
        } else if (!charity) {
            return res.status(403).json({success: false, message: "No charity found to delete."})
        } else {
            return res.status(200).json({success: true, message: "Successfully deleted charity."})
        }
    })
}

const list = async (req, res) => {
    try {
        let charities = await Charity.find()
        res.json(charities)
    } catch (err){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const listByOwner = async (req, res) => {
    try {
        let charities = await Charity.find({owner: req.profile._id}).populate('owner', '_id name')
        res.json(charities)
    } catch (err){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const isOwner = (req, res, next) => {
    const isOwner = req.charity && req.auth && req.charity.owner._id == req.auth._id
    if(!isOwner){
        return res.status('403').json({
            error: "User is not authorized"
        })
    }
    next()
}

export default {
    one,
    create,
    charityByID,
    photo,
    defaultPhoto,
    list,
    listByOwner,
    read,
    update,
    isOwner,
    remove
}
