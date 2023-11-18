const RequestModel = require('../models/requests.model');
const RequestsRoutes = require('express').Router();
const { validateNewRequestData, validateRequestData, validateObjectId } = require('../utils/validations');
const { authenticateToken, checkAdmin } = require('../utils/authenticateToken');
const { ObjectId } = require('mongodb');


//! ** FULL = whether to return an object with all the relevant documents or only the document itself **//

RequestsRoutes.post('/create', authenticateToken, async (req, res) => {
    try {
        let { sender_id, recipient_id, requestMessage, post_id } = req.body;
        let validationsRes = validateNewRequestData(sender_id, recipient_id, requestMessage, post_id);
        if (!validationsRes.valid) {
            return res.status(400).json({ error: 'INVALID_DETAILS', msg: validationsRes.msg || 'פרטים לא תקינים' });
        }
        let newRequest = await RequestModel.create(sender_id, recipient_id, requestMessage, post_id);
        return res.status(201).json(newRequest);
    } catch (error) {
        console.warn('requestsroute error: post /create')
        return res.status(500).json({ error, msg: error.toString() });
    }
});


RequestsRoutes.put('/edit/:_id', authenticateToken, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        let { updatedData } = req.body;
        let request = await RequestModel.readOne(new ObjectId(_id));
        if (!request) {
            return res.status(404).json({ error: 'NOT_FOUND', msg: 'בקשה לא קיימת במערכת' });
        } else if (request.status === 'בוטל') {
            return res.status(403).json({ error: 'UNAUTHORIZED', msg: 'לא ניתן לערוך בקשה שבוטלה' });
        }
        // *** ***  check if the post related to the request is still available?
        let validationsRes = validateRequestData(updatedData);
        if (!validationsRes.valid) {
            return res.status(400).json({ error: 'INVALID_DETAILS', msg: validationsRes.msg });
        }
        let data = await RequestModel.update(_id, updatedData);
        return res.status(200).json(data);
    } catch (error) {
        console.warn('requestsroute error: post /edit/:_id')
        return res.status(500).json({ error, msg: error.toString() });
    }
});



RequestsRoutes.get('/search', authenticateToken, async (req, res) => {
    try {
        const { _id, sender_id, recipient_id, status, post_id, full } = req.query;

        let filter = {};
        if (_id) filter._id = new ObjectId(_id);
        if (sender_id) filter.sender_id = new ObjectId(sender_id);
        if (recipient_id) filter.recipient_id = new ObjectId(recipient_id);
        if (status) filter.status = status;
        if (post_id) filter.post_id = new ObjectId(post_id);

        let validationsRes = validateRequestData(filter);
        if (!validationsRes.valid) {
            return res.status(400).json({ error: 'INVALID_DETAILS', msg: validationsRes.msg || 'פרטים לא תקינים' })
        }
        let requests;
        if (full === 'true') {
            requests = await RequestModel.readFull(filter);
        } else {
            requests = await RequestModel.read(filter);
        }

        if (!Array.isArray(requests) || requests.length === 0)
            return res.status(404).json({ error: 'NOT_FOUND', msg: 'לא נמצאו בקשות מתאימות' });
        else
            return res.status(200).json(requests);

    } catch (error) {
        console.warn('requests route error: get /')
        return res.status(500).json({ error, msg: error.toString() });
    }
});



RequestsRoutes.delete('/delete/:_id', authenticateToken, checkAdmin, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        await RequestModel.delete(new ObjectId(_id));
        return res.status(200).json({ msg: 'בקשה נמחקה בהצלחה' });
    } catch (error) {
        console.warn('requestsroute error: delete /delete/:_id')
        return res.status(500).json({ error, msg: error.toString() });
    }
});


RequestsRoutes.get('/count', authenticateToken, async (req, res) => {
    try {
        const count = await RequestModel.count();
        return res.status(200).json(count);
    } catch (error) {
        console.warn("requests route error : get /count", error.toString());
        res.status(500).json({ error, msg: error.toString() });
    }
});

module.exports = RequestsRoutes;