const { ObjectId } = require('mongodb');
const RequestsModel = require('./models/requests.model')
const ReportsModel = require('./models/reports.model')
const PostsModel = require('./models/posts.model')

const cloudinary = require('cloudinary').v2;


const uploadImages = async (photos) => {

    let photoUrls = await Promise.all(photos.map(async (photo) => {
        //let imgStr = `data:image/jpg;base64,${photo}`; // assuming each photo is sent as base64 string from the client
        let img = await uploadImage(photo);
        return img;
    }));
    return photoUrls;
}

const uploadImage = async (img) => {

    // Use the uploaded file's name as the asset's public ID and 
    // allow overwriting the asset with new versions
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        resource_type: 'image',
        //not valid, make the validation on the client side
        allowed_formats: ['jpg', 'jpeg', 'png'], // limited formats
        //max_size: 5000000 //5mb
        //max_file_size - works with python sdk - check later if works here
    };

    try {
        // Upload the image
        const result = await cloudinary.uploader.upload_large(img, options);
        console.log(result);
        //return result.secure_url;
        return {
            url: result.secure_url,
            public_id: result.public_id,
        };
    } catch (error) {
        console.error(error);
        throw error; // might need to be changed to return null so that if one image upload fails the others will still keep on uploading. in the validations check for nulls in the array (or just null in-case of a user with a single profile photo)
    }
};


//DO NOT DELETE THIS!!!!!!!!!!!!!!

// cloudinary.uploader.destroy(img.public_id, (error, result) => {
//     console.log(result, error);
// });

//WORKS
const removeImage = async (img) => {

    try {
        const result = await cloudinary.uploader.destroy(img.public_id);
        console.log("removeImage Result =>>>>", result);
        return result;

    } catch (error) {
        console.log(error);
        throw error;
    }

}


const removeImages = async (images) => {
    await Promise.all(images.map(async (img) => {
        try {
            await removeImage(img);
        } catch (error) {
            console.error(`Failed to remove image: ${img.public_id}`, error);
        }
    }));
}


//works
const editImagesArray = async (photos, toRemove, toAdd) => {
    for (let imageUrl of toRemove) {
        // Find the photo object in the post's photos array
        let photoToRemove = photos.find(photo => photo.url === imageUrl);
        if (photoToRemove) {
            let removed = await removeImage(photoToRemove);
            if (removed) {
                // Remove the image URL from post's photos
                photos = photos.filter(photo => photo.url !== imageUrl);
            }
        }
    }
    let newPhotos = await uploadImages(toAdd);
    return photos = [...photos, ...newPhotos] // when assigning like this, it is no longer by ref, it creates a new array.
}


const closeOpenRequests = async (_id) => {

    return await RequestsModel.updateMany(
        { post_id: new ObjectId(_id), status: "נשלח" },
        { $set: { status: "נסגר" } });
}

const closeAllUserActivities = async (_id) => {
    try {
        await RequestsModel.updateMany({ sender_id: id }, { $set: { status: 'נסגר' } });
        await PostsModel.updateMany({ owner_id: id, status: { $in: ['לא זמין למסירה', 'בתהליך מסירה', 'זמין'] } }, { $set: { status: 'סגור' } });
        // await ReportsModel.updateMany({owner_id: _id},{}) // all reports need to be reviewed by an admin?
    } catch (error) {

    }
}

module.exports = { uploadImage, uploadImages, removeImage, removeImages, editImagesArray, closeOpenRequests, closeAllUserActivities };