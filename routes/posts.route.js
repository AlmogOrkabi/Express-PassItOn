const PostsModel = require('../models/posts.model');
const PostsRoutes = require('express').Router();

const { uploadImages } = require('../functions');
const { validateNewPostData, validatePostData, isString, validatePostSearchData } = require('../utils/validations');

const { authenticateToken, checkAdmin } = require('../utils/authenticateToken');



//V
PostsRoutes.post('/create', authenticateToken, async (req, res) => {
    try {
        let { owner_id, itemName, description, photos, itemLocation } = req.body;

        let photoUrls = await uploadImages(photos);
        let validationRes = validateNewPostData(owner_id, itemName, description, photoUrls, itemLocation);
        if (!validationRes.valid)
            return res.status(400).json({ msg: validationRes.msg || 'פרטים לא תקינים' })
        let newPost = await PostsModel.create(owner_id, itemName, description, photoUrls, itemLocation);
        return res.status(201).json(newPost);
    } catch (error) {
        return res.status(500).json({
            error, msg: 'יצירת פוסט  חדש נכשלה'
        });
    }
});

//V
PostsRoutes.get('/:_id', authenticateToken, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        // if (!isValidObjectId(_id) || _id == null)
        //     res.status(400).json({ msg: 'פרטים לא נכונים' });
        let post = await PostsModel.read({ _id: _id });
        if (!post)
            return res.status(404).json({ msg: "פוסט לא נמצא" });
        else
            return res.status(200).json(post);
    } catch (error) {
        console.warn('postsroute error: get /post/:_id')
        return res.status(500).json({ error, msg: 'שגיאה' });
    }
});

//V
PostsRoutes.get('/allPosts', authenticateToken, async (req, res) => {
    try {
        let posts = await PostsModel.read();
        if (!Array.isArray(posts) || posts.length === 0)
            return res.status(404).json({ msg: "לא נמצאו פוסטים" });
        else
            return res.status(200).json(posts);
    } catch (error) {
        console.warn('postsroute error: get /posts/allPosts')
        return res.status(500).json({ error, msg: 'שגיאה' });
    }
});

//V
PostsRoutes.get('/userPosts/:_id', authenticateToken, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        // if (!isValidObjectId(_id) || _id == null)
        //     res.status(400).json({ msg: 'פרטים לא נכונים' });
        let posts = await PostsModel.read({ owner_id: _id });
        if (!Array.isArray(posts) || posts.length === 0)
            return res.status(404).json({ msg: "לא נמצאו פוסטים" });
        else
            res.status(200).json(posts);
    } catch (error) {
        console.warn('postsroute error: get /posts/userPosts/:_id')
        res.status(500).json({ error, msg: 'שגיאה' });
    }
});


//V
PostsRoutes.get('/allPosts/searchByStatus/:status', authenticateToken, async (req, res) => {
    try {
        let { postStatus } = req.params;
        let validationRes = isValidPostStatus(postStatus);
        if (!validationRes.valid)
            return res.status(400).json({ msg: validationRes.msg })
        let posts = await PostsModel.read({ status: postStatus });
        if (!Array.isArray(posts) || posts.length === 0)
            return res.status(404).json({ msg: "לא נמצאו פוסטים" });
        else
            return res.status(200).json(posts);
    } catch (error) {
        console.warn('postsroute error: get /posts/allPosts/:status')
        return res.status(500).json({ error, msg: 'שגיאה' });
    }
});

// V - ?maybe make the keywords an array of strings? - better for results?
PostsRoutes.get('/allPosts/searchByKeywords/:keywords', authenticateToken, async (req, res) => {
    try {
        let { keywords } = req.params; //an array of key words maybe?
        if (!isString(keywords))
            return res.status(400).json({ msg: 'קלט לא תקין' });
        let posts = await PostsModel.readByKeywords(keywords);
        if (!Array.isArray(posts) || posts.length === 0)
            return res.status(404).json({ msg: "לא נמצאו פוסטים מתאימים" });
        else
            res.status(200).json(posts);
    } catch (error) {
        console.warn('postsroute error: get/posts/allPosts/:keywords')
        return res.status(500).json({ error, msg: 'שגיאה' });
    }
});

//**************************************************************// 

//V
PostsRoutes.post('/search/byDistance/:maxDistance', authenticateToken, async (req, res) => {
    try {
        let { maxDistance } = req.params;
        let { userCoordinates } = req.body;
        let validationRes = validatePostSearchData(maxDistance, userCoordinates);
        if (!validationRes.valid)
            return res.status(400).json({ msg: validationRes.msg });
        let posts = await PostsModel.readByDistance(maxDistance, userCoordinates);
        if (!Array.isArray(posts) || posts.length === 0)
            return res.status(404).json({ msg: "לא נמצאו פריטים מתאימים לחיפוש" });
        else
            return res.status(200).json(posts);
    } catch (error) {
        console.warn('postsroute error: post/:distance');
        return res.status(500).json({ error, msg: 'שגיאה' });
    }

});

//V
PostsRoutes.post('/search/:maxDistance/itemName', authenticateToken, async (req, res) => {
    try {
        let { maxDistance, itemName } = req.params;
        let { userCoordinates } = req.body;
        let validationRes = validatePostSearchData(maxDistance, userCoordinates, itemName);
        if (!validationRes.valid)
            return res.status(400).json({ msg: validationRes.msg });
        let posts = await PostsModel.readByDistance(maxDistance, userCoordinates, itemName);
        if (!Array.isArray(posts) || posts.length === 0)
            return res.status(404).json({ msg: "לא נמצאו פריטים מתאימים לחיפוש" });
        else
            return res.status(200).json(posts);
    } catch (error) {
        console.warn('postsroute error: post/search/:maxDistance/itemName');
        return res.status(500).json({ error, msg: 'שגיאה' });
    }

});

//V
PostsRoutes.get('/search/byLocation/:city', authenticateToken, async (req, res) => {
    try {
        let { city } = req.params;
        if (!isString(city) || city.length < 1)
            return res.status(400).json({ msg: 'קלט לא תקין' })
        let posts = await PostsModel.readByCity(city);
        if (!Array.isArray(posts) || posts.length === 0)
            return res.status(404).json({ msg: "לא נמצאו פריטים מתאימים לחיפוש" });
        else
            return res.status(200).json(posts);
    } catch (error) {
        console.warn('postsroute error: get/search/:city');
        return res.status(500).json({ error, msg: 'שגיאה' });
    }
});
//**************************************************************//










//V --handle deleting or adding picures to the array!!!
PostsRoutes.put('/edit/:_id', authenticateToken, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        // if (!isValidObjectId(_id) || _id == null)
        //     return res.status(400).json({ msg: 'פרטים לא נכונים' });
        let { updateData } = req.body;
        let validationRes = validatePostData(updateData);
        if (!validationRes.valid)
            return res.status(400).json({ msg: validationRes.msg || 'פרטים לא תקינים' })
        let data = await PostsModel.update(_id, updateData);
        return res.status(200).json(data);
    } catch (error) {
        console.warn('postsroute error: put /posts/edit/:_id')
        return res.status(500).json({ error, msg: 'שגיאה' });
    }
});

//V
PostsRoutes.delete('/delete/:_id', authenticateToken, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        // if (!isValidObjectId(_id) || _id == null)
        //     return res.status(400).json({ msg: 'פרטים לא נכונים' });
        await PostsModel.delete(_id);
        return res.status(200).json({ msg: 'post deleted successfully' });
        //** check if the post is found or not??? **
    } catch (error) {
        console.warn('postsroute error: delete /delete/:id')
        return res.status(500).json({ error, msg: 'שגיאה' });
    }
});

module.exports = PostsRoutes;




