const cloudinary = require('cloudinary').v2;


const uploadImages = async (photos) => {

    let photoUrls = await Promise.all(photos.map(async (photo) => {
        let imgStr = `data:image/jpg;base64,${photo}`; // assuming each photo is sent as base64 string from the client
        let img = await uploadImage(imgStr);
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
        const result = await cloudinary.uploader.upload(img, options);
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

//might not work, NEEDS TESTING
const removeImage = async (img) => {

    try {
        const result = await cloudinary.uploader.destroy(img.public_id);
        console.log(result);
        return result;

    } catch (error) {
        console.log(error);
        throw error;
    }

}

module.exports = { uploadImage, uploadImages, removeImage };