const ReportsModel = require('../models/reports.model');
const ReportsRoutes = require('express').Router();

ReportsRoutes.post('/create', async (req, res) => {
    try {
        let { owner_id, reportType, userReported, postReported, photos } = req.body;
        //add types validation here
        let newReport = await ReportsModel.create(owner_id, reportType, userReported, postReported, photos);
        res.status(201).json(newReport);
    } catch (error) {
        res.status(500).json({ error: 'יצירת דיווח נכשלה' });
    }
});

ReportsRoutes.get('/:_id', async (req, res) => {
    try {
        let { _id } = req.params;
        let report = await ReportsModel.read(_id)
        if (!report)
            res.status(404).json({ error: 'דיווח לא נמצא' });
        else
            res.status(200).json(report);
    } catch (error) {
        console.warn('reportsroute error: get /:_id')
        res.status(500).json({ error, msg: 'שגיאה' });
    }
});

ReportsRoutes.get('/allReports', async (req, res) => {
    try {
        let reports = await ReportsModel.read();
        if (!reports)
            res.status(401).json({ error: 'שגיאה בייבוא הנתונים' });
        else
            res.status(200).json(reports);
    } catch (error) {
        console.warn('reportsroute error: get /allReports')
        res.status(500).json({ error, msg: 'שגיאה' });
    }
});

ReportsRoutes.get('/:owner_id', async (req, res) => {
    try {
        let { owner_id } = req.params;
        let reports = await ReportsModel.readByOwner(owner_id);
        if (!reports)
            res.status(401).json({ error: 'שגיאה בייבוא הנתונים' });
        else
            res.status(200).json(reports);
    } catch (error) {
        console.warn('reportsroute error: get /:owner_id')
        res.status(500).json({ error, msg: 'שגיאה' });
    }
});

ReportsRoutes.get('/:userReported', async (req, res) => {
    try {
        let { userReported } = req.params;
        let reports = await ReportsModel.readByUserReported(userReported);
        if (!reports)
            res.status(401).json({ error: 'שגיאה בייבוא הנתונים' });
        else
            res.status(200).json(reports);
    } catch (error) {
        console.warn('reportsroute error: get /:userReported')
        res.status(500).json({ error, msg: 'שגיאה' });
    }
});

ReportsRoutes.get('/:postReported', async (req, res) => {
    try {
        let { postReported } = req.params;
        let reports = await ReportsModel.readByPostReported(postReported);
        if (!reports)
            res.status(401).json({ error: 'שגיאה בייבוא הנתונים' });
        else
            res.status(200).json(reports);
    } catch (error) {
        console.warn('reportsroute error: get /:postReported')
        res.status(500).json({ error, msg: 'שגיאה' });
    }
});

ReportsRoutes.get('/:status', async (req, res) => {
    try {
        let { status } = req.params;
        let reports = await ReportsModel.readByStatus(status);
        if (!reports)
            res.status(401).json({ error: 'שגיאה בייבוא הנתונים' });
        else
            res.status(200).json(reports);
    } catch (error) {
        console.warn('reportsroute error: get /:status')
        res.status(500).json({ error, msg: 'שגיאה' });
    }
});

//can also update status???
ReportsRoutes.put('/edit/:_id', async (req, res) => {
    try {
        let { _id } = req.params;
        let { updateData } = req.body;
        let data = await ReportsModel.update(_id, updateData);
        res.status(200).json(data);
    } catch (error) {
        console.warn('reportsroute error: put /edit/:_id')
        res.status(500).json({ error, msg: 'שגיאה' });
    }
});

ReportsRoutes.delete('/delete/:_id', async (req, res) => {
    try {
        let { _id } = req.params;
        await ReportsModel.delete(_id);
        res.status(200).json({ msg: 'report deleted successfully' });
    } catch (error) {
        console.warn('reportsroute error: delete /delete/:_id')
        res.status(500).json({ error, msg: 'שגיאה' });
    }
});

module.exports = ReportsRoutes;

