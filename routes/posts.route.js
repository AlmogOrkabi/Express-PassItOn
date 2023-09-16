// const PostsModel = require('../models/posts.model');
// const PostsRoutes = require('express').Router();

// const { uploadImages, removeImages, editImagesArray, closeOpenRequests } = require('../functions');
// const { validateNewPostData, validatePostData, isString, validatePostSearchData, validateObjectId, isValidPostStatus, isValidPostCategory } = require('../utils/validations');

// const { authenticateToken, checkAdmin, isAdmin } = require('../utils/authenticateToken');
// const { ObjectId } = require('mongodb');



// //V --- V also format check is working!


// PostsRoutes.post('/create', authenticateToken, async (req, res) => {
//     try {
//         let { owner_id, itemName, description, category, photos, itemLocation_id } = req.body;
//         let photoUrls = await uploadImages(photos); //required
//         let validationRes = validateNewPostData(owner_id, itemName, description, category, photoUrls, itemLocation_id);
//         if (!validationRes.valid)
//             return res.status(400).json({ msg: validationRes.msg })
//         let newPost = await PostsModel.create(owner_id, itemName, description, category, photoUrls, itemLocation_id);
//         return res.status(201).json(newPost);
//     } catch (error) {
//         return res.status(500).json({
//             error, msg: 'יצירת פוסט  חדש נכשלה'
//         });
//     }
// });


// //request pattern:

// // {
// //      "owner_id": "",
// //      "itemName": "",
// //      "description": "",
// //      "category": "",
// //      "photos": [],
// //      "itemLocation_id": ""
// // }





// //V --- V
// PostsRoutes.get('/search/byId/:_id', authenticateToken, validateObjectId('_id'), async (req, res) => {
//     try {
//         let { _id } = req.params;
//         // if (!isValidObjectId(_id) || _id == null)
//         //     res.status(400).json({ msg: 'פרטים לא נכונים' });
//         let post = await PostsModel.readOne(new ObjectId(_id));
//         if (!post)
//             return res.status(404).json({ msg: "פוסט לא נמצא" });
//         else
//             return res.status(200).json(post);
//     } catch (error) {
//         console.warn('postsroute error: get /post/:_id')
//         return res.status(500).json({ error, msg: 'שגיאה' });
//     }
// });

// //V --- V
// PostsRoutes.get('/allPosts', authenticateToken, async (req, res) => {
//     try {
//         let posts = await PostsModel.read();
//         if (!Array.isArray(posts) || posts.length === 0)
//             return res.status(404).json({ msg: "לא נמצאו פוסטים" });
//         else
//             return res.status(200).json(posts);
//     } catch (error) {
//         console.warn('postsroute error: get /posts/allPosts')
//         return res.status(500).json({ error, msg: 'שגיאה' });
//     }
// });

// //V --- V 
// PostsRoutes.get('/search/byUserId/:_id', authenticateToken, validateObjectId('_id'), async (req, res) => {
//     try {
//         let { _id } = req.params;
//         // if (!isValidObjectId(_id) || _id == null)
//         //     res.status(400).json({ msg: 'פרטים לא נכונים' });
//         let posts = await PostsModel.read({ owner_id: _id });
//         if (!Array.isArray(posts) || posts.length === 0)
//             return res.status(404).json({ msg: "לא נמצאו פוסטים" });
//         else
//             res.status(200).json(posts);
//     } catch (error) {
//         console.warn('postsroute error: get /posts/userPosts/:_id')
//         res.status(500).json({ error, msg: error.toString() });
//     }
// });


// //V --- V
// PostsRoutes.get('/allPosts/searchByStatus/:postStatus', authenticateToken, async (req, res) => {
//     try {
//         let { postStatus } = req.params;
//         let validationRes = isValidPostStatus(postStatus);
//         if (!validationRes.valid)
//             return res.status(400).json({ msg: validationRes.msg })
//         let posts = await PostsModel.read({ status: postStatus });
//         if (!Array.isArray(posts) || posts.length === 0)
//             return res.status(404).json({ msg: "לא נמצאו פוסטים" });
//         else
//             return res.status(200).json(posts);
//     } catch (error) {
//         console.warn('postsroute error: get /posts/allPosts/:status')
//         return res.status(500).json({ error, msg: error.toString() });
//     }
// });

// // V --- V
// // - ?maybe make the keywords an array of strings? - better for results?
// PostsRoutes.get('/allPosts/searchByKeywords/:keywords', authenticateToken, async (req, res) => {
//     try {
//         let { keywords } = req.params; //an array of key words maybe?
//         if (!isString(keywords))
//             return res.status(400).json({ msg: 'קלט לא תקין' });
//         let posts = await PostsModel.readByKeywords(keywords);
//         if (!Array.isArray(posts) || posts.length === 0)
//             return res.status(404).json({ msg: "לא נמצאו פוסטים מתאימים" });
//         else
//             res.status(200).json(posts);
//     } catch (error) {
//         console.warn('postsroute error: get/posts/allPosts/:keywords')
//         return res.status(500).json({ error, msg: 'שגיאה' });
//     }
// });

// //**************************************************************// 

// //we used post to keep the user's address a little more secure
// //V --- V 
// PostsRoutes.post('/search/byDistance/:maxDistance', authenticateToken, async (req, res) => {
//     try {
//         let { maxDistance } = req.params;
//         let { userCoordinates } = req.body;
//         let validationRes = validatePostSearchData(maxDistance, userCoordinates);
//         if (!validationRes.valid)
//             return res.status(400).json({ msg: validationRes.msg });
//         let posts = await PostsModel.readByDistance(maxDistance, userCoordinates);
//         if (!Array.isArray(posts) || posts.length === 0)
//             return res.status(404).json({ msg: "לא נמצאו פריטים מתאימים לחיפוש" });
//         else
//             return res.status(200).json(posts);
//     } catch (error) {
//         console.warn('postsroute error: post/:distance');
//         return res.status(500).json({ error, msg: 'שגיאה' });
//     }

// });

// //V --- V
// PostsRoutes.post('/search/byDistance/:maxDistance/:itemName', authenticateToken, async (req, res) => {
//     try {
//         let { maxDistance, itemName } = req.params;
//         let { userCoordinates } = req.body;
//         let validationRes = validatePostSearchData(maxDistance, userCoordinates, itemName);
//         if (!validationRes.valid)
//             return res.status(400).json({ msg: validationRes.msg });
//         let posts = await PostsModel.readByDistance(maxDistance, userCoordinates, itemName);
//         if (!Array.isArray(posts) || posts.length === 0)
//             return res.status(404).json({ msg: "לא נמצאו פריטים מתאימים לחיפוש" });
//         else
//             return res.status(200).json(posts);
//     } catch (error) {
//         console.warn('postsroute error: post/search/:maxDistance/itemName');
//         return res.status(500).json({ error, msg: 'שגיאה' });
//     }

// });

// //V --- V
// PostsRoutes.get('/search/byLocation/:city', authenticateToken, async (req, res) => {
//     try {
//         let { city } = req.params;
//         if (!isString(city) || city.length < 1)
//             return res.status(400).json({ msg: 'קלט לא תקין' })
//         let posts = await PostsModel.readByCity(city);
//         if (!Array.isArray(posts) || posts.length === 0)
//             return res.status(404).json({ msg: "לא נמצאו פריטים מתאימים לחיפוש" });
//         else
//             return res.status(200).json(posts);
//     } catch (error) {
//         console.warn('postsroute error: get/search/:city');
//         return res.status(500).json({ error, msg: 'שגיאה' });
//     }
// });



// //ADDED ITEMNAME - NEED TO ADD VALIDATIONS!!
// PostsRoutes.get('/search/byLocation/:city/:itemName', authenticateToken, async (req, res) => {
//     try {
//         let { city, itemName } = req.params;
//         if (!isString(city) || city.length < 1)
//             return res.status(400).json({ msg: 'קלט לא תקין' })
//         let posts = await PostsModel.readByCity(city, itemName);
//         if (!Array.isArray(posts) || posts.length === 0)
//             return res.status(404).json({ msg: "לא נמצאו פריטים מתאימים לחיפוש" });
//         else
//             return res.status(200).json(posts);
//     } catch (error) {
//         console.warn('postsroute error: get/search/:city/:itemName');
//         return res.status(500).json({ error, msg: 'שגיאה' });
//     }
// });



// //V --- V 
// PostsRoutes.get('/search/byCategory/:category', authenticateToken, async (req, res) => {
//     try {
//         let { category } = req.params;
//         if (!isValidPostCategory(category))
//             return res.status(400).json({ msg: 'קלט לא תקין' })
//         let posts = await PostsModel.read({ category: category })
//         if (!Array.isArray(posts) || posts.length === 0)
//             return res.status(404).json({ msg: "לא נמצאו פריטים מתאימים לחיפוש" });
//         else
//             return res.status(200).json(posts);
//     } catch (error) {
//         console.warn('postsroute error: get /search/byCategory/:category');
//         return res.status(500).json({ error, msg: 'שגיאה' });
//     }
// });


// //$text = { $search: itemName }

// //ADDED ITEMNAME - NEED ADD VALIDATIONS!!!
// PostsRoutes.get('/search/byCategory/:category/:itemName', authenticateToken, async (req, res) => {
//     try {
//         let { category, itemName } = req.params;
//         if (!isValidPostCategory(category))
//             return res.status(400).json({ msg: 'קלט לא תקין' })
//         let posts = await PostsModel.readByCategoryAndKeywords(category, itemName);
//         if (!Array.isArray(posts) || posts.length === 0)
//             return res.status(404).json({ msg: "לא נמצאו פריטים מתאימים לחיפוש" });
//         else
//             return res.status(200).json(posts);
//     } catch (error) {
//         console.warn('postsroute error: get /search/byCategory/:category');
//         return res.status(500).json({ error, msg: 'שגיאה' });
//     }
// });

// //**************************************************************//










// //V --- V also modifies the photos array accordingly
// PostsRoutes.put('/edit/:_id', authenticateToken, validateObjectId('_id'), async (req, res) => {
//     try {
//         let { _id } = req.params;
//         let post = await PostsModel.readOne(new ObjectId(_id));
//         if (!post)
//             return res.status(404).json({ msg: 'פוסט לא קיים במערכת' });

//         if (post.status === 'בבדיקת מנהל' && isAdmin(req.user)) {
//             return res.status(403).json({ msg: 'לא ניתן לערוך פוסט הנמצא בבדיקת מנהל' });
//         }
//         let { updatedData, toRemove, toAdd } = req.body;
//         if (Array.isArray(toRemove) && Array.isArray(toAdd)) {
//             let newPhotosArray = await editImagesArray(post.photos, toRemove, toAdd);
//             updatedData.photos = newPhotosArray;
//         }
//         let validationRes = validatePostData(updatedData);
//         if (!validationRes.valid)
//             return res.status(400).json({ msg: validationRes.msg || 'פרטים לא תקינים' })
//         let data = await PostsModel.update(_id, updatedData);
//         if (updatedData.status && (updatedData.status === "נסגר" || updatedData.status === "נמסר" || updatedData.status === "מבוטל")) {
//             await closeOpenRequests(_id);
//         }
//         return res.status(200).json(data);
//     } catch (error) {
//         console.warn('postsroute error: put /posts/edit/:_id')
//         return res.status(500).json({ error, msg: error.toString() });
//     }
// });
// //request format:
// // {
// //     "toRemove": []

// //         ,
// //         "toAdd": [],
// //             "updatedData": { }
// // }





// //V --- V also removes the photos from the cloud
// PostsRoutes.delete('/delete/:_id', authenticateToken, validateObjectId('_id'), async (req, res) => {
//     try {
//         let { _id } = req.params;
//         let post = await PostsModel.readOne(new ObjectId(_id));
//         console.log(post)
//         if (!post)
//             return res.status(404).json({ msg: 'פוסט לא קיים במערכת' });
//         if (Array.isArray(post.photos) && post.photos.length > 0)
//             await removeImages(post.photos);
//         await PostsModel.delete(new ObjectId(_id));
//         return res.status(200).json({ msg: 'post deleted successfully' });
//         //** check if the post is found or not??? **
//     } catch (error) {
//         console.warn('postsroute error: delete /delete/:id')
//         return res.status(500).json({ error, msg: error.toString() });
//     }
// });

// module.exports = PostsRoutes;






const PostsModel = require('../models/posts.model');
const PostsRoutes = require('express').Router();

const { uploadImages, removeImages, editImagesArray, closeOpenRequests } = require('../functions');
const { validateNewPostData, validatePostData, isString, validatePostSearchData, validateObjectId, isValidPostStatus, isValidPostCategory } = require('../utils/validations');

const { authenticateToken, checkAdmin, isAdmin } = require('../utils/authenticateToken');
const { ObjectId } = require('mongodb');



//V --- V also format check is working!


PostsRoutes.post('/create', authenticateToken, async (req, res) => {
    try {
        let { owner_id, itemName, description, category, photos, itemLocation_id } = req.body;
        let photoUrls = await uploadImages(photos); //required
        let validationRes = validateNewPostData(owner_id, itemName, description, category, photoUrls, itemLocation_id);
        if (!validationRes.valid)
            return res.status(400).json({ msg: validationRes.msg })
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
            return res.status(404).json({ msg: 'לא נמצאו פוסטים מתאימים' });
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
            return res.status(404).json({ msg: 'פוסט לא קיים במערכת' });

        if (post.status === 'בבדיקת מנהל' && !isAdmin(req.user)) {
            return res.status(403).json({ msg: 'לא ניתן לערוך פוסט הנמצא בבדיקת מנהל' });
        }
        let { updatedData, toRemove, toAdd } = req.body;
        if (Array.isArray(toRemove) && Array.isArray(toAdd)) {
            let newPhotosArray = await editImagesArray(post.photos, toRemove, toAdd);
            updatedData.photos = newPhotosArray;
        }
        let validationRes = validatePostData(updatedData);
        if (!validationRes.valid)
            return res.status(400).json({ msg: validationRes.msg || 'פרטים לא תקינים' })
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
//         "toAdd": [],
//             "updatedData": { }
// }





//V --- V also removes the photos from the cloud
PostsRoutes.delete('/delete/:_id', authenticateToken, validateObjectId('_id'), async (req, res) => {
    try {
        let { _id } = req.params;
        let post = await PostsModel.readOne(new ObjectId(_id));
        console.log(post)
        if (!post)
            return res.status(404).json({ msg: 'פוסט לא קיים במערכת' });
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

module.exports = PostsRoutes;




