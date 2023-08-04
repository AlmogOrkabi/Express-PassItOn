const AddressModel = require('../models/address.model');
const AddressRoutes = require('express').Router();


const { validateNewAddressDetails, validateAddressData, validateObjectId } = require('../utils/validations');


const { authenticateToken, checkAdmin } = require('../utils/authenticateToken');
const { ObjectId } = require('mongodb');


//V --- V
AddressRoutes.post('/create', async (req, res) => {
    try {
        let { region, city, street, house, apartment, notes, simplifiedAddress, lon, lat } = req.body;
        let validationRes = validateNewAddressDetails(region, city, street, house, apartment, notes, simplifiedAddress, lon, lat);
        if (!validationRes.valid)
            return res.status(400).json({ msg: validationRes.msg });
        let newAddress = await AddressModel.create(region, city, street, house, apartment, notes, simplifiedAddress, lon, lat);
        return res.status(201).json(newAddress);
    } catch (error) {
        return res.status(500).json({ error, msg: 'שגיאה' })
    }
});


//V --- V
AddressRoutes.get('/search/byId/:_id', authenticateToken, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        let address = await AddressModel.readOne(new ObjectId(_id));
        // if (!Array.isArray(address) || address.length === 0)
        //     return res.status(404).json({ msg: 'כתובת לא נמצאה' })
        if (!address)
            return res.status(404).json({ msg: 'כתובת לא נמצאה' })
        return res.status(200).json(address);
    } catch (error) {
        console.warn('addressRoute error: get /:_id')
        return res.status(500).json({ error, msg: 'שגיאה' })
    }
});

AddressRoutes.get('/allAddresses', authenticateToken, async (req, res) => {
    try {
        let addresses = await AddressModel.read();
        if (!Array.isArray(addresses) || addresses.length === 0)
            return res.status(404).json({ msg: 'לא נמצאו כתובות מתאימות' });
        else
            return res.status(200).json(addresses);
    } catch (error) {
        console.warn('addressRoute error: get /allAddresses')
        return res.status(500).json({ error, msg: 'שגיאה' })
    }
});

//Methods to add:
//search by city
//search by radius
//search by county 
//ADD MORE SEARCH METHODS!!!!!!!


//V --- V
// only for house / apartment / notes update. everything else can cause mistakes (create a new address instead)
AddressRoutes.put('/editAddress/:_id', authenticateToken, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        let { updatedData } = req.body;
        let validationRes = validateAddressData(updatedData)
        if (!updatedData || !validationRes.valid)
            return res.status(400).json({ msg: validationRes.msg || 'לא התקבלו פרטים לעדכון' });
        let data = await AddressModel.update(_id, updatedData);
        console.log("DATA ===>>>   ", data);
        res.status(200).json(data);
    } catch (error) {
        console.warn('addressRoute error: put /editAddress/:_id')
        res.status(500).json({ error, msg: error.toString() });
    }
});


//V --- V
AddressRoutes.delete('/delete/:_id', authenticateToken, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        await AddressModel.delete(new ObjectId(_id));
        return res.status(200).json({ msg: 'Success' });
    } catch (error) {
        console.warn('addressRoute error: delete')
        return res.status(500).json({ error, msg: 'שגיאה' });
    }
});

module.exports = AddressRoutes;