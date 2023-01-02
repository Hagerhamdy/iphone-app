const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');
const ApiFeatures = require('../utils/ApiFeatures');

exports.deleteOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const document = await Model.findByIdAndDelete(id);
        if (!document) {
            return next(new ApiError(`No document with this ${id}`, 404));
        }
        if (Model === 'Category' || Model === 'Brand' || Model === 'Coupon') {
            res.status(200).json(`Document '${document.name}' is deleted!`);
        }
        //Trigger "remove" event when delete document
        document.remove();
        res.status(200).json(`Document '${document.title}' is deleted!`);
    })

exports.updateOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const document = await Model.findByIdAndUpdate(id, { $set: req.body }, { new: true });
        if (!document) {
            return next(new ApiError(`No document with this ${id}`, 404));
        }
        //Trigger "save" event when update document
        document.save();
        res.status(200).json({ data: document });
    })

exports.createOne = (Model) =>
    asyncHandler(async (req, res) => {
        const newDocument = await Model.create(req.body);
        res.status(200).json({ data: newDocument });
    });

exports.getOne = (Model, populationOps) =>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        //1- build query
        let query = Model.findById(id);
        if (populationOps) {
            query = query.populate(populationOps);
        }
        //2- execute query
        const document = await query;
        if (!document) {
            return next(new ApiError(`No document with this ${id}`, 404));
        }
        res.status(200).json({ data: document });

    })

exports.getAll = (Model, modalName = '') =>
    asyncHandler(async (req, res) => {

        //req.filterObj using in subCategory
        let filter = {};
        if (req.filterObj) { filter = req.filterObj }

        const countDocuments = await Model.countDocuments();
        const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
            .filter().limitFields().paginate(countDocuments).search(modalName).sort();

        const { mongooseQuery, paginationResult } = apiFeatures;

        const documents = await mongooseQuery;
        res.status(200).json({ results: documents.length, paginationResult, data: documents });
    })