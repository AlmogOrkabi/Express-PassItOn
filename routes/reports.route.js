// const ReportsModel = require('../models/reports.model');
// const ReportsRoutes = require('express').Router();

// const { uploadImages, editImagesArray, removeImages } = require('../functions');
// const { validateNewReportData, validateReportData, validateObjectId, isValidReportStatus } = require('../utils/validations');
// const { authenticateToken, checkAdmin } = require('../utils/authenticateToken');
// const { ObjectId } = require('mongodb');
// const PostModel = require('../models/posts.model');

// //V --- V
// ReportsRoutes.post('/create', authenticateToken, async (req, res) => {
//     try {
//         let { owner_id, reportType, userReported, postReported, photos, description } = req.body;
//         let photoUrls = await uploadImages(photos);
//         let validationRes = validateNewReportData(owner_id, reportType, userReported, postReported, photoUrls, description);
//         if (!validationRes.valid)
//             return res.status(400).json({ msg: validationRes.msg });
//         let newReport = await ReportsModel.create(owner_id, reportType, userReported, postReported, photoUrls, description);
//         if (postReported) {
//             await PostModel.updateMany({ _id: new ObjectId(postReported) }, {
//                 $push: { reports: newReport.insertedId }
//             })
//         }
//         return res.status(201).json(newReport);
//     } catch (error) {
//         return res.status(500).json({ error: 'יצירת דיווח נכשלה' });
//     }
// });
// //request:
// // {
// //     "owner_id": "",
// //      "reportType": "",
// //      "userReported": "",
// //      "postReported": "",
// //      "photos": [],
// //      "description": ""
// // }

// //V --- V
// ReportsRoutes.get('/search/byId/:_id/:full', authenticateToken, validateObjectId('_id'), async (req, res) => {
//     try {
//         let { _id, full } = req.params;
//         let report;
//         if (full == 'true')
//             report = await ReportsModel.readOneFull(new ObjectId(_id));
//         else
//             report = await ReportsModel.readOne(new ObjectId(_id));
//         if (!report)
//             return res.status(404).json({ error: 'דיווח לא נמצא' });
//         else
//             return res.status(200).json(report);
//     } catch (error) {
//         console.warn('reportsroute error: get /:_id')
//         return res.status(500).json({ error, msg: 'שגיאה' });
//     }
// });


// //V --- V
// ReportsRoutes.get('/allReports/:full', authenticateToken, async (req, res) => {
//     try {
//         let { full } = req.params;
//         let reports;
//         if (full == 'true')
//             reports = await ReportsModel.readFull();
//         else
//             reports = await ReportsModel.read();
//         if (!Array.isArray(reports) || reports.length === 0)
//             return res.status(404).json({ error: 'לא נמצאו דיווחים מתאימים' });
//         else
//             return res.status(200).json(reports);
//     } catch (error) {
//         console.warn('reportsroute error: get /allReports')
//         return res.status(500).json({ error, msg: 'שגיאה' });
//     }
// });


// //V --- V
// ReportsRoutes.get('/search/byOwnerId/:owner_id/:full', authenticateToken, validateObjectId('owner_id'), async (req, res) => {
//     try {
//         let { owner_id, full } = req.params;
//         // if (!isValidObjectId(owner_id) || owner_id == null)
//         //     return res.status(400).json({ msg: 'פרטים לא נכונים' });
//         let reports;
//         if (full == 'true') {
//             reports = await ReportsModel.readFull({ owner_id: new ObjectId(owner_id) });
//         }
//         else {
//             reports = await ReportsModel.read({ owner_id: new ObjectId(owner_id) });
//         }
//         if (!Array.isArray(reports) || reports.length === 0)
//             return res.status(404).json({ error: 'לא נמצאו דיווחים' });
//         else {
//             return res.status(200).json(reports);
//         }
//     } catch (error) {
//         console.warn('reportsroute error: get /:owner_id')
//         res.status(500).json({ error, msg: 'שגיאה' });
//     }
// });


// //V --- V 
// ReportsRoutes.get('/search/byUserReported/:userReported/:full', authenticateToken, validateObjectId('userReported'), async (req, res) => {
//     try {
//         let { userReported, full } = req.params;
//         // if (!isValidObjectId(userReported) || userReported == null)
//         //     return res.status(400).json({ msg: 'פרטים לא נכונים' });
//         let reports;
//         if (full == 'true')
//             reports = await ReportsModel.readFull({ userReported_id: new ObjectId(userReported) });
//         else
//             reports = await ReportsModel.read({ userReported_id: new ObjectId(userReported) });
//         if (!Array.isArray(reports) || reports.length === 0)
//             return res.status(404).json({ error: 'לא נמצאו דיווחים מתאימים' });
//         else
//             return res.status(200).json(reports);
//     } catch (error) {
//         console.warn('reportsroute error: get /:userReported')
//         return res.status(500).json({ error, msg: 'שגיאה' });
//     }
// });

// // can be sent to the same dynamic method??? 

// //V --- V
// ReportsRoutes.get('/search/byPost/:postReported/:full', authenticateToken, validateObjectId('postReported'), async (req, res) => {
//     try {
//         let { postReported, full } = req.params;
//         // if (!isValidObjectId(postReported) || postReported == null)
//         //     return res.status(400).json({ msg: 'פרטים לא נכונים' });
//         let reports;
//         if (full == 'true')
//             reports = await ReportsModel.readFull({ postReported_id: new ObjectId(postReported) });
//         else
//             reports = await ReportsModel.read({ postReported_id: new ObjectId(postReported) });
//         if (!Array.isArray(reports) || reports.length === 0)
//             return res.status(404).json({ error: 'פוסט לא נמצא' });
//         else
//             return res.status(200).json(reports);
//     } catch (error) {
//         console.warn('reportsroute error: get /searchByPost/:postReported')
//         return res.status(500).json({ error, msg: 'שגיאה' });
//     }
// });


// //V --- V
// ReportsRoutes.get('/search/byStatus/:status/:full', authenticateToken, async (req, res) => {
//     try {
//         let { status, full } = req.params;
//         let validationRes = isValidReportStatus(status);
//         if (!validationRes.valid)
//             return res.status(400).json({ msg: validationRes.msg });
//         let reports;
//         if (full == 'true')
//             reports = await ReportsModel.readFull({ status: status });
//         else
//             reports = await ReportsModel.read({ status: status });
//         if (!Array.isArray(reports) || reports.length === 0)
//             return res.status(404).json({ error: 'לא נמצאו דיווחים מתאימים' });
//         else
//             return res.status(200).json(reports);
//     } catch (error) {
//         console.warn('reportsroute error: get /searchByStatus/:status')
//         return res.status(500).json({ error, msg: 'שגיאה' });
//     }
// });

// //V -- V
// ReportsRoutes.put('/edit/:_id', authenticateToken, validateObjectId('_id'), async (req, res) => {
//     try {
//         let { _id } = req.params;
//         let { updatedData, toRemove, toAdd } = req.body;
//         let report = await ReportsModel.readOne(new ObjectId(_id));
//         if (!report)
//             return res.status(404).json({ msg: 'דיווח לא קיים במערכת' });
//         if (Array.isArray(toRemove) && Array.isArray(toAdd)) {
//             let newPhotosArray = await editImagesArray(report.photos, toRemove, toAdd);
//             updatedData.photos = newPhotosArray;
//             console.log("updated photos: " + updatedData.photos)
//         }
//         let validationRes = validateReportData(updatedData);
//         if (!validationRes.valid)
//             return res.status(400).json({ msg: validationRes.msg });
//         let data = await ReportsModel.update(_id, updatedData);
//         return res.status(200).json(data);
//     } catch (error) {
//         console.warn('reportsroute error: put /edit/:_id')
//         return res.status(500).json({ error, msg: error.toString() });
//     }
// });


// //V --- V
// ReportsRoutes.put('/edit/status/:_id', authenticateToken, checkAdmin, validateObjectId('_id'), async (req, res) => {
//     try {
//         let { _id } = req.params;
//         let { updatedStatus } = req.body;
//         let validationRes = isValidReportStatus(updatedStatus);
//         if (!validationRes.valid)
//             return res.status(400).json({ msg: validationRes.msg });
//         let data = await ReportsModel.update(new ObjectId(_id), { status: updatedStatus });
//         return res.status(200).json(data);
//     } catch (error) {
//         console.warn('reportsroute error: put /edit/status/:_id')
//         return res.status(500).json({ error, msg: 'שגיאה' });
//     }
// });

// //V --- V 
// ReportsRoutes.delete('/delete/:_id', authenticateToken, validateObjectId('_id'), async (req, res) => {
//     try {
//         let { _id } = req.params;
//         let report = await ReportsModel.readOne(new ObjectId(_id));
//         console.log(report)
//         if (!report)
//             return res.status(404).json({ msg: 'דיווח לא קיים במערכת' });
//         if (Array.isArray(report.photos) && report.photos.length > 0)
//             await removeImages(report.photos);
//         await ReportsModel.delete(new ObjectId(_id));
//         res.status(200).json({ msg: 'דיווח נמחק בהצלחה' });
//     } catch (error) {
//         console.warn('reportsroute error: delete /delete/:_id')
//         res.status(500).json({ error, msg: error.toString() });
//     }
// });

// module.exports = ReportsRoutes;

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
            return res.status(400).json({ msg: validationRes.msg });
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
        const { ownerId, full, status, userReported, postReported } = req.query;

        let filter = {};
        if (ownerId) filter.owner_id = new ObjectId(ownerId);
        if (status) filter.status = status;
        if (userReported) filter.userReported_id = new ObjectId(userReported);
        if (postReported) filter.postReported_id = new ObjectId(postReported);

        let reports;
        if (full === 'true') {
            reports = await ReportsModel.readFull(filter);
        } else {
            reports = await ReportsModel.read(filter);
        }

        if (!Array.isArray(reports) || reports.length === 0)
            return res.status(404).json({ error: 'לא נמצאו דיווחים מתאימים' });
        else
            return res.status(200).json(reports);
    } catch (error) {
        console.warn('reports route error: get /')
        return res.status(500).json({ error, msg: error.toString() });
    }

});





//V -- V
ReportsRoutes.put('/edit/:_id', authenticateToken, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        let { updatedData, toRemove, toAdd } = req.body;
        let report = await ReportsModel.readOne(new ObjectId(_id));
        if (!report)
            return res.status(404).json({ msg: 'דיווח לא קיים במערכת' });
        if (Array.isArray(toRemove) && Array.isArray(toAdd)) {
            let newPhotosArray = await editImagesArray(report.photos, toRemove, toAdd);
            updatedData.photos = newPhotosArray;
            console.log("updated photos: " + updatedData.photos)
        }
        let validationRes = validateReportData(updatedData);
        if (!validationRes.valid)
            return res.status(400).json({ msg: validationRes.msg });
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
            return res.status(400).json({ msg: validationRes.msg });
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
            return res.status(404).json({ msg: 'דיווח לא קיים במערכת' });
        if (Array.isArray(report.photos) && report.photos.length > 0)
            await removeImages(report.photos);
        await ReportsModel.delete(new ObjectId(_id));
        res.status(200).json({ msg: 'דיווח נמחק בהצלחה' });
    } catch (error) {
        console.warn('reportsroute error: delete /delete/:_id')
        res.status(500).json({ error, msg: error.toString() });
    }
});

module.exports = ReportsRoutes;

