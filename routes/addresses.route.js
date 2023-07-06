const AddressModel = require('../models/address.model');
const AddressRoutes = require('express').Router();


AddressRoutes.post('/create', async (req, res) => {
    try {
        let { region, city, street, house, apartment, notes, location } = req.body;
        //add input validation
        let newAddress = await AddressModel.create(region, city, street, house, apartment, notes, ...location);
        res.status(200).json(newAddress);
    } catch (error) {
        res.status(500).json({ error, msg: 'כתובת לא תקינה' })
    }
});

AddressRoutes.get('/:_id', async (req, res) => {
    try {
        let { _id } = req.params;
        let address = await AddressModel.read(_id);
        if (!address)
            res.status(404).json({ msg: 'כתובת לא נמצאה' })
        res.status(200).json(address);
    } catch (error) {
        console.warn('addressRoute error: get /:_id')
        res.status(500).json({ error, msg: 'שגיאה' })
    }
});

AddressRoutes.put('/editAddress/:_id', async (req, res) => {
    try {
        let { _id } = req.params;
        let { updatedAddress } = req.body;
        let data = await AddressModel.update(_id, updatedAddress);
        res.status(200).json(data);
    } catch (error) {
        console.warn('addressRoute error: put /editAddress/:_id')
        res.status(500).json({ error, msg: 'שגיאה' });
    }
});

AddressRoutes.delete('/:_id', async (req, res) => {
    try {
        let { _id } = req.params;
        await AddressModel.delete(_id);
        res.status(200).json({ msg: 'Success' });
    } catch (error) {
        console.warn('addressRoute error: delete')
        res.status(500).json({ error, msg: 'שגיאה' });
    }
});