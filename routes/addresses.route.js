const AddressModel = require('../models/address.model');
const AddressRoutes = require('express').Router();


const { validateNewAddressDetails, validateObjectId } = require('../utils/validations');


const { authenticateToken, checkAdmin } = require('../utils/authenticateToken');


//V
AddressRoutes.post('/create', authenticateToken, async (req, res) => {
    try {
        let { region, city, street, house, apartment, notes, lon, lat } = req.body;
        let validationRes = validateNewAddressDetails(region, city, street, house, apartment, notes, lon, lat);
        if (!validationRes.valid)
            return res.status(400).json({ msg: validationRes.msg });
        let newAddress = await AddressModel.create(region, city, street, house, apartment, notes, lon, lat);
        return res.status(201).json(newAddress);
    } catch (error) {
        return res.status(500).json({ error, msg: 'שגיאה' })
    }
});


//V
AddressRoutes.get('/:_id', authenticateToken, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        // if (!isValidObjectId(_id) || _id == null)
        //     return res.status(400).json({ msg: 'פרטים לא נכונים' });
        let address = await AddressModel.read(_id);
        if (!Array.isArray(address) || address.length === 0)
            return res.status(404).json({ msg: 'כתובת לא נמצאה' })
        return res.status(200).json(address);
    } catch (error) {
        console.warn('addressRoute error: get /:_id')
        return res.status(500).json({ error, msg: 'שגיאה' })
    }
});



//Methods to add:
//search by city
//search by radius
//search by county 
//ADD MORE SEARCH METHODS!!!!!!!


// Necessary? or deleter and create new
// AddressRoutes.put('/editAddress/:_id', async (req, res) => {
//     try {
//         let { _id } = req.params;
//         if (!isValidObjectId(_id) || _id == null)
//             res.status(400).json({ msg: 'פרטים לא נכונים' });
//         let { updatedAddress } = req.body;
//         let data = await AddressModel.update(_id, updatedAddress);
//         res.status(200).json(data);
//     } catch (error) {
//         console.warn('addressRoute error: put /editAddress/:_id')
//         res.status(500).json({ error, msg: 'שגיאה' });
//     }
// });


//V
AddressRoutes.delete('/:_id', authenticateToken, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        // if (!isValidObjectId(_id) || _id == null)
        //     res.status(400).json({ msg: 'פרטים לא נכונים' });
        await AddressModel.delete(_id);
        return res.status(200).json({ msg: 'Success' });
    } catch (error) {
        console.warn('addressRoute error: delete')
        return res.status(500).json({ error, msg: 'שגיאה' });
    }
});

module.exports = AddressRoutes;