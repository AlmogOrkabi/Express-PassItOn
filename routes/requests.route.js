// const RequestModel = require('../models/requests.model');
// const RequestsRoutes = require('express').Router();
// const { validateNewRequestData, validateRequestData, validateObjectId } = require('../utils/validations');
// const { authenticateToken, checkAdmin } = require('../utils/authenticateToken');
// const { ObjectId } = require('mongodb');


// //! ** FULL = whether to return an object with all the relevant documents or only the document itself **//

// RequestsRoutes.post('/create', authenticateToken, async (req, res) => {
//     try {
//         let { sender_id, recipient_id, requestMessage, post_id } = req.body;
//         let validationsRes = validateNewRequestData(sender_id, recipient_id, requestMessage, post_id);
//         if (!validationsRes.valid) {
//             return res.status(400).json({ msg: validationsRes.msg || 'פרטים לא תקינים' });
//         }
//         let newRequest = await RequestModel.create(sender_id, recipient_id, requestMessage, post_id);
//         return res.status(201).json(newRequest);
//     } catch (error) {
//         console.warn('requestsroute error: post /create')
//         return res.status(500).json({ error, msg: error.toString() });
//     }
// });


// RequestsRoutes.put('/edit/:_id', authenticateToken, validateObjectId('_id'), async (req, res) => {
//     try {
//         let { _id } = req.params;
//         let { updatedData } = req.body;
//         let request = await RequestModel.readOne(new ObjectId(_id));
//         if (!request) {
//             return res.status(404).json({ msg: 'בקשה לא קיימת במערכת' });
//         } else if (request.status === 'בוטל') {
//             return res.status(403).json({ msg: 'לא ניתן לערוך בקשה שבוטלה' });
//         }
//         // *** ***  check if the post related to the request is still available?
//         let validationsRes = validateRequestData(updatedData);
//         if (!validationsRes.valid) {
//             return res.status(400).json({ msg: validationsRes.msg });
//         }
//         let data = await RequestModel.update(_id, updatedData);
//         return res.status(200).json(data);
//     } catch (error) {
//         console.warn('requestsroute error: post /edit/:_id')
//         return res.status(500).json({ error, msg: error.toString() });
//     }
// });




// RequestsRoutes.get('/find/:_id/:full', authenticateToken, validateObjectId('_id'), async (req, res) => {
//     try {
//         let { _id, full } = req.params;
//         let request;
//         if (full == 'true') {
//             request = await RequestModel.readOneFull(new ObjectId(_id));
//         }
//         //no need to validate "full", if it is not true then this is the default behaviour:
//         else {
//             request = await RequestModel.readOne(new ObjectId(_id));
//         }
//         if (!request) return res.status(404).json({ msg: 'לא נמצאה בקשה מתאימה במערכת' });
//         else return res.status(200).json(request);
//     } catch (error) {
//         console.warn('requestsroute error: get /find/:_id')
//         return res.status(500).json({ error, msg: error.toString() });
//     }
// });

// RequestsRoutes.get('/allRequests/:full', authenticateToken, checkAdmin, async (req, res) => {
//     try {
//         let { full } = req.params;
//         let requests;
//         if (full == 'true') {
//             requests = await RequestModel.readFull();
//         }
//         //no need to validate "full", if it is not true then this is the default behaviour:
//         else {
//             requests = await RequestModel.read();
//         }
//         if (!requests) return res.status(404).json({ msg: 'לא נמצאו בקשות מתאימות במערכת' });
//         return res.status(200).json(requests);
//     } catch (error) {
//         console.warn('requestsroute error: get /allRequests')
//         return res.status(500).json({ error, msg: error.toString() });
//     }
// });


// //find all by sender_id

// RequestsRoutes.get('/find/bySenderId/:sender_id/:full', authenticateToken, validateObjectId('sender_id'), async (req, res) => {
//     try {
//         let { sender_id, full } = req.params;
//         let requests;
//         if (full == 'true') {
//             requests = await RequestModel.readFull({ sender_id: new ObjectId(sender_id) });
//         }
//         //no need to validate "full", if it is not true then this is the default behaviour:
//         else {
//             requests = await RequestModel.read({ sender_id: new ObjectId(sender_id) });
//         }
//         if (!requests || requests.length < 1) return res.status(404).json({ msg: 'לא נמצאו בקשות מתאימות במערכת' });
//         return res.status(200).json(requests);
//     } catch (error) {
//         console.warn('requestsroute error: get /find/bySenderId/:_id')
//         return res.status(500).json({ error, msg: error.toString() });
//     }
// });


// //find all by recipient_id

// RequestsRoutes.get('/find/byRecipientId/:recipient_id/:full', authenticateToken, validateObjectId('recipient_id'), async (req, res) => {
//     try {
//         let { recipient_id, full } = req.params;
//         let requests;
//         if (full == 'true') {
//             requests = await RequestModel.readFull({ recipient_id: new ObjectId(recipient_id) });
//         }
//         //no need to validate "full", if it is not true then this is the default behaviour:
//         else {
//             requests = await RequestModel.read({ recipient_id: new ObjectId(recipient_id) });
//         }
//         if (!requests || requests.length < 1) return res.status(404).json({ msg: 'לא נמצאו בקשות מתאימות במערכת' });
//         return res.status(200).json(requests);
//     } catch (error) {
//         console.warn('requestsroute error: get /find/byRecipientId/:recipient_id')
//         return res.status(500).json({ error, msg: error.toString() });
//     }
// });


// //find all by sender_id and recipient_id

// RequestsRoutes.get('/find/bySenderAndRecipient/:sender_id/:recipient_id/:full', authenticateToken, validateObjectId(['sender_id', 'recipient_id']), async (req, res) => {
//     try {
//         let { sender_id, recipient_id, full } = req.params;
//         let requests;
//         if (full == 'true') {
//             requests = await RequestModel.readFull({ sender_id: new ObjectId(sender_id), recipient_id: new ObjectId(recipient_id) });
//         }
//         //no need to validate "full", if it is not true then this is the default behaviour:
//         else {
//             requests = await RequestModel.read({ sender_id: new ObjectId(sender_id), recipient_id: new ObjectId(recipient_id) });
//         }
//         if (!requests || requests.length < 1) return res.status(404).json({ msg: 'לא נמצאו בקשות מתאימות במערכת' });
//         return res.status(200).json(requests);
//     } catch (error) {
//         console.warn('requestsroute error: get /find/bySenderAndRecipient/:sender_id/:recipient_id')
//         return res.status(500).json({ error, msg: error.toString() });
//     }
// });


// //find all by status

// RequestsRoutes.get('/find/byStatus/:status/:full', authenticateToken, checkAdmin, async (req, res) => {
//     try {
//         let { status, full } = req.params;
//         let validationsRes = validateRequestData({ status });
//         if (!validationsRes.valid)
//             return res.status(400).json({ msg: validationsRes.msg });
//         let requests;
//         if (full == 'true') {
//             requests = await RequestModel.readFull({ status });
//         }
//         //no need to validate "full", if it is not true then this is the default behaviour:
//         else {
//             requests = await RequestModel.read({ status });
//         }
//         if (!requests || requests.length < 1)
//             return res.status(404).json({ msg: 'לא נמצאו בקשות מתאימות במערכת' });
//         return res.status(200).json(requests);
//     } catch (error) {
//         console.warn('requestsroute error: get /find/byStatus/:status')
//         return res.status(500).json({ error, msg: error.toString() });
//     }
// });

// //find all by Post

// RequestsRoutes.get('/find/byPost/:post_id/:full', authenticateToken, validateObjectId('post_id'), async (req, res) => {
//     try {
//         let { post_id, full } = req.params;
//         let requests;
//         if (full == 'true') {
//             requests = await RequestModel.readFull({ post_id: new ObjectId(post_id) });
//         }
//         //no need to validate "full", if it is not true then this is the default behaviour:
//         else {
//             requests = await RequestModel.read({ post_id: new ObjectId(post_id) });
//         }
//         if (!requests || requests.length < 1)
//             return res.status(404).json({ msg: 'לא נמצאו בקשות מתאימות במערכת' });
//         return res.status(200).json(requests);
//     } catch (error) {
//         console.warn('requestsroute error: get /find/byPost/:post_id')
//         return res.status(500).json({ error, msg: error.toString() });
//     }
// });

// RequestsRoutes.get('/find/byPostAndSender/:post_id/:sender_id/:full', authenticateToken, validateObjectId(['post_id', 'sender_id']), async (req, res) => {
//     try {
//         let { post_id, sender_id, full } = req.params;
//         let request;
//         if (full == 'true') {
//             request = await RequestModel.readOneFull({ post_id: new ObjectId(post_id), sender_id: new ObjectId(sender_id) });
//         }
//         //no need to validate "full", if it is not true then this is the default behaviour:
//         else {
//             request = await RequestModel.readOne({ post_id: new ObjectId(post_id), sender_id: new ObjectId(sender_id) });
//         }
//         if (!request || request.length < 1)
//             return res.status(404).json({ msg: 'לא נמצאו בקשות מתאימות במערכת' });
//         return res.status(200).json(request);
//     } catch (error) {
//         console.warn('requestsroute error: get /find/byPost/:post_id')
//         return res.status(500).json({ error, msg: error.toString() });
//     }
// });


// RequestsRoutes.delete('/delete/:_id', authenticateToken, checkAdmin, validateObjectId('_id'), async (req, res) => {
//     try {
//         let { _id } = req.params;
//         await RequestModel.delete(new ObjectId(_id));
//         return res.status(200).json({ msg: 'בקשה נמחקה בהצלחה' });
//     } catch (error) {
//         console.warn('requestsroute error: delete /delete/:_id')
//         return res.status(500).json({ error, msg: error.toString() });
//     }
// });


// module.exports = RequestsRoutes;




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


module.exports = RequestsRoutes;