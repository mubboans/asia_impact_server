const customErrorClass = require("../error/customErrorClass");
const CustomErrorObj = require("../error/CustomErrorObj");
const AWS = require("aws-sdk");
let S3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
function FileUpload(file, isMultiple, filePath) {
    return new Promise((resolve, reject) => {
        try {
            let options = {
                Bucket: process.env.BUCKET,
                Key: filePath + file?.name,
                Body: file.data, //fileStream,
                ContentType: file.mimetype,
                ACL: "public-read",
            };
            S3.upload(options, (err, data) => {
                if (err) {
                    // return reject(
                    //     customErrorClass.BadRequest(err?.message)
                    // )
                    console.log(err, 'err occurs');
                    throw new CustomErrorObj(err?.message, 501);
                }
                else {
                    // console.log(data, 'file uploaded');
                    return resolve({
                        fileurl: data.Location,
                        filename: file?.name,
                        filetype: file?.mimetype,
                        filesize: `${file?.size / 1024} KB`,
                        bucketname: process.env.BUCKET
                    })
                }
            })
            console.log(file, 'check data in files');
            console.log(file.size, 'check data in files');
            // resolve({
            //     fileurl: 'https://epaper.mid-day.com/ePaperImg/md_11032024/?src=direct#epaper_Mumbai/3',
            //     filename: file?.name,
            //     filetype: file?.mimetype,
            //     filesize: `${file?.size / 1024} KB`,
            // })

        } catch (error) {
            throw new CustomErrorObj(error?.message, 400)
        }
    })
}
module.exports = FileUpload;
