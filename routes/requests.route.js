const RequestModel = require('../models/requests.model');
const RequestsRoutes = require('express').Router();
const { validateNewRequestData, validateRequestData, validateObjectId } = require('../utils/validations');
const { authenticateToken, checkAdmin } = require('../utils/authenticateToken');
const { ObjectId } = require('mongodb');


RequestsRoutes.post('/create', authenticateToken, async (req, res) => {
    try {
        let { sender_id, recipient_id, requestMessage, post_id } = req.body;
        console.log("sender_id: " + sender_id + " recipient_id: " + recipient_id + " requestMessage: " + requestMessage + " post_id: " + post_id);
        let validationsRes = validateNewRequestData(sender_id, recipient_id, requestMessage, post_id);
        if (!validationsRes.valid) {
            return res.status(400).json({ msg: validationsRes.msg || 'פרטים לא תקינים' });
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
            return res.status(404).json({ msg: 'בקשה לא קיימת במערכת' });
        } else if (request.status === 'בוטל') {
            return res.status(403).json({ msg: 'לא ניתן לערוך בקשה שבוטלה' });
        }
        // *** ***  check if the post related to the request is still available?
        let validationsRes = validateRequestData(updatedData);
        if (!validationsRes.valid) {
            return res.status(400).json({ msg: validationsRes.msg });
        }
        let data = await RequestModel.update(_id, updatedData);
        return res.status(200).json(data);
    } catch (error) {
        console.warn('requestsroute error: post /edit/:_id')
        return res.status(500).json({ error, msg: error.toString() });
    }
});




RequestsRoutes.get('/find/:_id', authenticateToken, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        let request = await RequestModel.readOne(new ObjectId(_id));
        if (!request) return res.status(404).json({ msg: 'לא נמצאה בקשה מתאימה במערכת' });
        else return res.status(200).json(request);
    } catch (error) {
        console.warn('requestsroute error: get /find/:_id')
        return res.status(500).json({ error, msg: error.toString() });
    }
});

RequestsRoutes.get('/allRequests', authenticateToken, checkAdmin, async (req, res) => {
    try {
        let requests = await RequestModel.read();
        if (!requests) return res.status(404).json({ msg: 'לא נמצאו בקשות מתאימות במערכת' });
        return res.status(200).json(requests);
    } catch (error) {
        console.warn('requestsroute error: get /allRequests')
        return res.status(500).json({ error, msg: error.toString() });
    }
});


//find all by sender_id

RequestsRoutes.get('/find/bySenderId/:sender_id', authenticateToken, validateObjectId('sender_id'), async (req, res) => {
    try {
        let { sender_id } = req.params;
        let requests = await RequestModel.read({ sender_id })
        if (!requests) return res.status(404).json({ msg: 'לא נמצאו בקשות מתאימות במערכת' });
        return res.status(200).json(requests);
    } catch (error) {
        console.warn('requestsroute error: get /find/bySenderId/:_id')
        return res.status(500).json({ error, msg: error.toString() });
    }
});


//find all by recipient_id

RequestsRoutes.get('/find/byRecipientId/:recipient_id', authenticateToken, validateObjectId('recipient_id'), async (req, res) => {
    try {
        let { recipient_id } = req.params;
        let requests = await RequestModel.read({ recipient_id })
        if (!requests) return res.status(404).json({ msg: 'לא נמצאו בקשות מתאימות במערכת' });
        return res.status(200).json(requests);
    } catch (error) {
        console.warn('requestsroute error: get /find/byRecipientId/:recipient_id')
        return res.status(500).json({ error, msg: error.toString() });
    }
});


//find all by sender_id and recipient_id

RequestsRoutes.get('/find/bySenderAndRecipient/:sender_id/:recipient_id', authenticateToken, validateObjectId(['sender_id', 'recipient_id']), async (req, res) => {
    try {
        let { sender_id, recipient_id } = req.params;
        let requests = await RequestModel.read({ sender_id, recipient_id })
        if (!requests) return res.status(404).json({ msg: 'לא נמצאו בקשות מתאימות במערכת' });
        return res.status(200).json(requests);
    } catch (error) {
        console.warn('requestsroute error: get /find/bySenderAndRecipient/:sender_id/:recipient_id')
        return res.status(500).json({ error, msg: error.toString() });
    }
});


//find all by status

RequestsRoutes.get('/find/byStatus/:status', authenticateToken, checkAdmin, async (req, res) => {
    try {
        let { status } = req.params;
        let validationsRes = validateRequestData({ status });
        if (!validationsRes.valid)
            return res.status(400).json({ msg: validationsRes.msg });
        let requests = await RequestModel.read({ status });
        if (!requests)
            return res.status(404).json({ msg: 'לא נמצאו בקשות מתאימות במערכת' });
        return res.status(200).json(requests);
    } catch (error) {
        console.warn('requestsroute error: get /find/byStatus/:status')
        return res.status(500).json({ error, msg: error.toString() });
    }
});

//find all by Post

RequestsRoutes.get('/find/byPost/:post_id', authenticateToken, validateObjectId('post_id'), async (req, res) => {
    try {
        let { post_id } = req.params;
        let requests = await RequestModel.read({ post_id });
        if (!requests)
            return res.status(404).json({ msg: 'לא נמצאו בקשות מתאימות במערכת' });
        return res.status(200).json(requests);
    } catch (error) {
        console.warn('requestsroute error: get /find/byPost/:post_id')
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


module.exports = RequestsRoutes;