const ReportsModel = require('../models/reports.model');
const ReportsRoutes = require('express').Router();

const { uploadImages, editImagesArray, removeImages } = require('../functions');
const { validateNewReportData, validateReportData, validateObjectId, isValidReportStatus } = require('../utils/validations');
const { authenticateToken, checkAdmin } = require('../utils/authenticateToken');
const { ObjectId } = require('mongodb');
const PostModel = require('../models/posts.model');

//V --- V
ReportsRoutes.post('/create', authenticateToken, async (req, res) => {
    try {
        let { owner_id, reportType, userReported, postReported, photos, description } = req.body;
        let photoUrls = await uploadImages(photos);
        let validationRes = validateNewReportData(owner_id, reportType, userReported, postReported, photoUrls, description);
        if (!validationRes.valid)
            return res.status(400).json({ error: 'INVALID_DETAILS', msg: validationRes.msg });
        let newReport = await ReportsModel.create(owner_id, reportType, userReported, postReported, photoUrls, description);
        if (postReported) {
            await PostModel.updateMany({ _id: new ObjectId(postReported) }, {
                $push: { reports: newReport.insertedId }
            })
        }
        return res.status(201).json(newReport);
    } catch (error) {
        return res.status(500).json({ error: 'יצירת דיווח נכשלה' });
    }
});
//request:
// {
//     "owner_id": "",
//      "reportType": "",
//      "userReported": "",
//      "postReported": "",
//      "photos": [],
//      "description": ""
// }

//V --- V

ReportsRoutes.get('/search', authenticateToken, async (req, res) => {
    try {
        const { _id, owner_id, full, status, userReported_id, postReported_id } = req.query;



        let filter = {};
        if (_id) filter._id = new ObjectId(_id);
        if (owner_id) filter.owner_id = new ObjectId(owner_id);
        if (status) filter.status = status;
        if (userReported_id) filter.userReported_id = new ObjectId(userReported_id);
        if (postReported_id) filter.postReported_id = new ObjectId(postReported_id);

        let validationsRes = validateReportData(filter);
        if (!validationsRes.valid) {
            return res.status(400).json({ error: 'INVALID_DETAILS', msg: validationsRes.msg || 'פרטים לא תקינים' })
        }


        let reports;
        if (full === 'true') {
            reports = await ReportsModel.readFull(filter);
        } else {
            reports = await ReportsModel.read(filter);
        }

        if (!Array.isArray(reports) || reports.length === 0)
            return res.status(404).json({ error: 'NOT_FOUND', msg: 'לא נמצאו דיווחים מתאימים' });
        else
            return res.status(200).json(reports);
    } catch (error) {
        console.warn('reports route error: get /')
        return res.status(500).json({ error, msg: error.toString() });
    }

});





//V -- V
ReportsRoutes.put('/edit/:_id', authenticateToken, checkAdmin, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        let { updatedData, toRemove, toAdd } = req.body;
        let report = await ReportsModel.readOne(new ObjectId(_id));
        if (!report)
            return res.status(404).json({ error: 'NOT_FOUND', msg: 'דיווח לא קיים במערכת' });
        if (Array.isArray(toRemove) && Array.isArray(toAdd)) {
            let newPhotosArray = await editImagesArray(report.photos, toRemove, toAdd);
            updatedData.photos = newPhotosArray;
            console.log("updated photos: " + updatedData.photos)
        }
        let validationRes = validateReportData(updatedData);
        if (!validationRes.valid)
            return res.status(400).json({ error: 'INVALID_DETAILS', msg: validationRes.msg });
        let data = await ReportsModel.update(_id, updatedData);
        return res.status(200).json(data);
    } catch (error) {
        console.warn('reportsroute error: put /edit/:_id')
        return res.status(500).json({ error, msg: error.toString() });
    }
});


//V --- V
ReportsRoutes.put('/edit/status/:_id', authenticateToken, checkAdmin, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        let { updatedStatus } = req.body;
        let validationRes = isValidReportStatus(updatedStatus);
        if (!validationRes.valid)
            return res.status(400).json({ error: 'INVALID_DETAILS', msg: validationRes.msg });
        let data = await ReportsModel.update(new ObjectId(_id), { status: updatedStatus });
        return res.status(200).json(data);
    } catch (error) {
        console.warn('reportsroute error: put /edit/status/:_id')
        return res.status(500).json({ error, msg: 'שגיאה' });
    }
});

//V --- V 
ReportsRoutes.delete('/delete/:_id', authenticateToken, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        let report = await ReportsModel.readOne(new ObjectId(_id));
        console.log(report)
        if (!report)
            return res.status(404).json({ error: 'NOT_FOUND', msg: 'דיווח לא קיים במערכת' });
        if (Array.isArray(report.photos) && report.photos.length > 0)
            await removeImages(report.photos);
        await ReportsModel.delete(new ObjectId(_id));
        res.status(200).json({ msg: 'דיווח נמחק בהצלחה' });
    } catch (error) {
        console.warn('reportsroute error: delete /delete/:_id')
        res.status(500).json({ error, msg: error.toString() });
    }
});

ReportsRoutes.get('/count', authenticateToken, async (req, res) => {
    try {
        const count = await ReportsModel.count();
        return res.status(200).json(count);
    } catch (error) {
        console.warn("reportsroute error : get /count", error.toString());
        res.status(500).json({ error, msg: error.toString() });
    }
});




module.exports = ReportsRoutes;

