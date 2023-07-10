const PostsModel = require('../models/posts.model');
const PostsRoutes = require('express').Router();

PostsRoutes.post('/create', async (req, res) => {
    try {
        let { owner_id, itemName, description, photos, itemLocation } = req.body;
        //add validations here
        let newPost = await PostsModel.create(owner_id, itemName, description, photos, itemLocation);
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({
            error: 'יצירת פוסט  חדש נכשלה'
        });
    }
});


PostsRoutes.get('/:_id', async (req, res) => {
    try {
        let { _id } = req.params;
        let post = await PostsModel.read(_id);
        if (!post)
            res.status(404).json({ msg: "פוסט לא נמצא" });
        else
            res.status(200).json(post);
    } catch (error) {
        console.warn('postsroute error: get /post/:_id')
        res.status(500).json({ error, msg: 'שגיאה' });
    }
});

PostsRoutes.get('/allPosts', async (req, res) => {
    try {
        let posts = await PostsModel.read();
        if (!posts)
            res.status(401).json({ msg: "שגיאה בייבוא נתונים" });
        else
            res.status(200).json(posts);
    } catch (error) {
        console.warn('postsroute error: get /posts/allPosts')
        res.status(500).json({ error, msg: 'שגיאה' });
    }
});

PostsRoutes.get('/userPosts/:_id', async (req, res) => {
    try {
        let { _id } = req.params;
        let posts = await PostsModel.readAll(_id);
        if (!posts)
            res.status(401).json({ msg: "שגיאה בייבוא נתונים" });
        else
            res.status(200).json(posts);
    } catch (error) {
        console.warn('postsroute error: get /posts/userPosts/:_id')
        res.status(500).json({ error, msg: 'שגיאה' });
    }
});

PostsRoutes.get('/allPosts/:status', async (req, res) => {
    try {
        let { status } = req.params;
        //validate string
        let posts = await PostsModel.readByStatus(status);
        if (!posts)
            res.status(401).json({ msg: "שגיאה בייבוא נתונים" });
        else
            res.status(200).json(posts);
    } catch (error) {
        console.warn('postsroute error: get /posts/allPosts/:status')
        res.status(500).json({ error, msg: 'שגיאה' });
    }
});

PostsRoutes.get('/allPosts/:keywords', async (req, res) => {
    try {
        let { keywords } = req.params;
        //validate string
        let posts = await PostsModel.readByKeywords(keywords);
        if (!posts)
            res.status(401).json({ msg: "שגיאה בייבוא נתונים" });
        else
            res.status(200).json(posts);
    } catch (error) {
        console.warn('postsroute error: get/posts/allPosts/:keywords')
        res.status(500).json({ error, msg: 'שגיאה' });
    }
});

//can also update status???
PostsRoutes.put('/edit/:_id', async (req, res) => {
    try {
        let { _id } = req.params;
        let { updateData } = req.body;
        let data = await PostsModel.update(_id, updateData);
        res.status(200).json(data);
    } catch (error) {
        console.warn('postsroute error: put /posts/edit/:_id')
        res.status(500).json({ error, msg: 'שגיאה' });
    }
});

PostsRoutes.delete('/delete/:_id', async (req, res) => {
    try {
        let { _id } = req.params;
        await PostsModel.delete(_id);
        res.status(200).json({ msg: 'post deleted successfully' });
        //** check if the post is found or not??? **
    } catch (error) {
        console.warn('postsroute error: delete /delete/:id')
        res.status(500).json({ error, msg: 'שגיאה' });
    }
});

module.exports = PostsRoutes;




