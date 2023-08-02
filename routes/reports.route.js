const ReportsModel = require('../models/reports.model');
const ReportsRoutes = require('express').Router();

const { uploadImages } = require('../functions');
const { validateNewReportData, validateReportData, validateObjectId, isValidReportStatus } = require('../utils/validations');
const { authenticateToken, checkAdmin } = require('../utils/authenticateToken');

//V
ReportsRoutes.post('/create', authenticateToken, async (req, res) => {
    try {
        let { owner_id, reportType, userReported, postReported, photos, description } = req.body;
        let photoUrls = await uploadImages(photos);
        let validationRes = validateNewReportData(owner_id, reportType, userReported, postReported, photoUrls, description);
        if (!validationRes.valid)
            return res.status(400).json({ msg: validationRes.msg });
        let newReport = await ReportsModel.create(owner_id, reportType, userReported, postReported, photoUrls, description);
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

//V
ReportsRoutes.get('/searchById/:_id', authenticateToken, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        // if (!isValidObjectId(_id) || _id == null)
        //     return res.status(400).json({ msg: 'פרטים לא נכונים' });
        let report = await ReportsModel.read({ _id: _id })
        if (!report)
            return res.status(404).json({ error: 'דיווח לא נמצא' });
        else
            return res.status(200).json(report);
    } catch (error) {
        console.warn('reportsroute error: get /:_id')
        return res.status(500).json({ error, msg: 'שגיאה' });
    }
});


//V
ReportsRoutes.get('/allReports', authenticateToken, async (req, res) => {
    try {
        let reports = await ReportsModel.read();
        if (!Array.isArray(reports) || reports.length === 0)
            return res.status(404).json({ error: 'לא נמצאו דיווחים מתאימים' });
        else
            return res.status(200).json(reports);
    } catch (error) {
        console.warn('reportsroute error: get /allReports')
        return res.status(500).json({ error, msg: 'שגיאה' });
    }
});



ReportsRoutes.get('/searchByOwnerId/:owner_id', authenticateToken, validateObjectId('owner_id'), async (req, res) => {
    try {
        let { owner_id } = req.params;
        // if (!isValidObjectId(owner_id) || owner_id == null)
        //     return res.status(400).json({ msg: 'פרטים לא נכונים' });
        let reports = await ReportsModel.read({ owner_id: owner_id });
        if (!Array.isArray(reports) || reports.length === 0)
            return res.status(404).json({ error: 'לא נמצאו דיווחים' });
        else
            return res.status(200).json(reports);
    } catch (error) {
        console.warn('reportsroute error: get /:owner_id')
        res.status(500).json({ error, msg: 'שגיאה' });
    }
});


//V
ReportsRoutes.get('/searchByUserReported/:userReported', authenticateToken, validateObjectId('userReported'), async (req, res) => {
    try {
        let { userReported } = req.params;
        // if (!isValidObjectId(userReported) || userReported == null)
        //     return res.status(400).json({ msg: 'פרטים לא נכונים' });
        let reports = await ReportsModel.read({ userReported_id: userReported });
        if (!Array.isArray(reports) || reports.length === 0)
            return res.status(404).json({ error: 'משתמש לא קיים' });
        else
            return res.status(200).json(reports);
    } catch (error) {
        console.warn('reportsroute error: get /:userReported')
        return res.status(500).json({ error, msg: 'שגיאה' });
    }
});

// can be sent to the same dynamic method??? 

//V
ReportsRoutes.get('/searchByPost/:postReported', authenticateToken, validateObjectId('postReported'), async (req, res) => {
    try {
        let { postReported } = req.params;
        // if (!isValidObjectId(postReported) || postReported == null)
        //     return res.status(400).json({ msg: 'פרטים לא נכונים' });
        let reports = await ReportsModel.read({ postReported_id: postReported });
        if (!Array.isArray(reports) || reports.length === 0)
            return res.status(404).json({ error: 'פוסט לא נמצא' });
        else
            return res.status(200).json(reports);
    } catch (error) {
        console.warn('reportsroute error: get /searchByPost/:postReported')
        return res.status(500).json({ error, msg: 'שגיאה' });
    }
});


//V
ReportsRoutes.get('/searchByStatus/:status', authenticateToken, async (req, res) => {
    try {
        let { status } = req.params;
        let validationRes = validateReportData({ status: status });
        if (!validationRes.valid)
            return res.status(400).json({ msg: validationRes.msg });
        let reports = await ReportsModel.read({ status: status });
        if (!Array.isArray(reports) || reports.length === 0)
            return res.status(404).json({ error: 'לא נמצאו דיווחים מתאימים' });
        else
            return res.status(200).json(reports);
    } catch (error) {
        console.warn('reportsroute error: get /searchByStatus/:status')
        return res.status(500).json({ error, msg: 'שגיאה' });
    }
});

//V
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
        }
        let validationRes = validateReportData(updatedData);
        if (!validationRes.valid)
            return res.status(400).json({ msg: validationRes.msg });
        let data = await ReportsModel.update(_id, updatedData);
        return res.status(200).json(data);
    } catch (error) {
        console.warn('reportsroute error: put /edit/:_id')
        return res.status(500).json({ error, msg: 'שגיאה' });
    }
});

ReportsRoutes.put('/edit/status/:_id', authenticateToken, checkAdmin, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        let { updatedStatus } = req.body;
        let validationRes = isValidReportStatus(updatedStatus);
        if (!validationRes.valid)
            return res.status(400).json({ msg: validationRes.msg });
        let data = await ReportsModel.update(_id, { status: updatedStatus });
        return res.status(200).json(data);
    } catch (error) {
        console.warn('reportsroute error: put /edit/status/:_id')
        return res.status(500).json({ error, msg: 'שגיאה' });
    }
});

//V
ReportsRoutes.delete('/delete/:_id', authenticateToken, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        // if (!isValidObjectId(_id) || _id == null)
        //     return res.status(400).json({ msg: 'שגיאה' }); // change this
        await ReportsModel.delete(_id);
        res.status(200).json({ msg: 'דיווח נמחק בהצלחה' });
    } catch (error) {
        console.warn('reportsroute error: delete /delete/:_id')
        res.status(500).json({ error, msg: 'שגיאה' });
    }
});

module.exports = ReportsRoutes;

