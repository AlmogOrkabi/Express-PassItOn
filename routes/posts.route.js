const PostsModel = require('../models/posts.model');
const PostsRoutes = require('express').Router();

const { uploadImages, removeImages, editImagesArray, closeOpenRequests } = require('../functions');
const { validateNewPostData, validatePostData, isString, validatePostSearchData, validateObjectId, isValidPostStatus, isValidPostCategory } = require('../utils/validations');

const { authenticateToken, checkAdmin, isAdmin } = require('../utils/authenticateToken');
const { ObjectId } = require('mongodb');
const AddressModel = require('../models/address.model');



//V --- V also format check is working!


PostsRoutes.post('/create', authenticateToken, async (req, res) => {
    try {
        let { owner_id, itemName, description, category, photos, itemLocation_id } = req.body;
        let photoUrls = await uploadImages(photos); //required
        let validationRes = validateNewPostData(owner_id, itemName, description, category, photoUrls, itemLocation_id);
        if (!validationRes.valid)
            return res.status(400).json({ error: 'INVALID_DETAILS', msg: validationRes.msg })
        let newPost = await PostsModel.create(owner_id, itemName, description, category, photoUrls, itemLocation_id);
        return res.status(201).json(newPost);
    } catch (error) {
        return res.status(500).json({
            error, msg: 'יצירת פוסט  חדש נכשלה'
        });
    }
});


//request pattern:

// {
//      "owner_id": "",
//      "itemName": "",
//      "description": "",
//      "category": "",
//      "photos": [],
//      "itemLocation_id": ""
// }


PostsRoutes.get('/search', authenticateToken, async (req, res) => {
    try {
        const posts = await PostsModel.searchPosts(req.query);

        if (!posts || posts.length < 1) {
            return res.status(404).json({ error: 'NOT_FOUND', msg: 'לא נמצאו פוסטים מתאימים' });
        }
        else
            return res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts", error: error.message });
    }
});




//V --- V also modifies the photos array accordingly
PostsRoutes.put('/edit/:_id', authenticateToken, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        let post = await PostsModel.readOne(new ObjectId(_id));
        if (!post)
            return res.status(404).json({ error: 'NOT_FOUND', msg: 'פוסט לא קיים במערכת' });

        if (post.status === 'בבדיקת מנהל' && !isAdmin(req.user)) {
            return res.status(403).json({ error: 'UNAUTHORIZED', msg: 'לא ניתן לערוך פוסט הנמצא בבדיקת מנהל' });
        }
        let { updatedData, toRemove, toAdd } = req.body;
        if (Array.isArray(toRemove) && Array.isArray(toAdd)) {
            let newPhotosArray = await editImagesArray(post.photos, toRemove, toAdd);
            updatedData.photos = newPhotosArray;
        }
        let validationRes = validatePostData(updatedData);
        if (!validationRes.valid)
            return res.status(400).json({ error: 'INVALID_DETAILS', msg: validationRes.msg || 'פרטים לא תקינים' })
        if (updatedData.itemLocation_id)
            await AddressModel.delete(new ObjectId(post.itemLocation_id));
        let data = await PostsModel.update(_id, updatedData);
        if (updatedData.status && (updatedData.status === "נסגר" || updatedData.status === "נמסר" || updatedData.status === "מבוטל")) {
            await closeOpenRequests(_id);
        }
        return res.status(200).json(data);
    } catch (error) {
        console.warn('postsroute error: put /posts/edit/:_id')
        return res.status(500).json({ error, msg: error.toString() });
    }
});
//request format:
// {
//     "toRemove": []

//         ,
//     "toAdd": [],
//     "updatedData": { }
// }





//V --- V also removes the photos from the cloud
PostsRoutes.delete('/delete/:_id', authenticateToken, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        let post = await PostsModel.readOne(new ObjectId(_id));
        console.log(post)
        if (!post)
            return res.status(404).json({ error: 'NOT_FOUND', msg: 'פוסט לא קיים במערכת' });
        if (Array.isArray(post.photos) && post.photos.length > 0)
            await removeImages(post.photos);
        await PostsModel.delete(new ObjectId(_id));
        return res.status(200).json({ msg: 'post deleted successfully' });
        //** check if the post is found or not??? **
    } catch (error) {
        console.warn('postsroute error: delete /delete/:id')
        return res.status(500).json({ error, msg: error.toString() });
    }
});



PostsRoutes.get('/statistics', authenticateToken, async (req, res) => {
    const { type } = req.query;
    try {
        const stats = await PostsModel.getStatistics(type);
        return res.status(200).json(stats);
    } catch (error) {
        console.warn(`posts route error: get /statistics?type=${type}`);
        return res.status(500).json({ error: error.toString(), msg: 'Server error' });
    }
});


PostsRoutes.get('/count', authenticateToken, async (req, res) => {
    try {
        const count = await PostsModel.count();
        return res.status(200).json(count);
    } catch (error) {
        console.warn("postsroute error : get /count", error.toString());
        res.status(500).json({ error, msg: error.toString() });
    }
});

module.exports = PostsRoutes;




