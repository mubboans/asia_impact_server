const CustomErrorObj = require("../error/CustomErrorObj");

function FileUpload(file, isMultiple) {
    return new Promise((resolve, reject) => {
        try {
            // if (isMultiple) {
            //     let d = {

            //     }
            // }
            console.log(file, 'check data in files');
            console.log(file.size, 'check data in files');
            resolve({
                fileurl: 'https://epaper.mid-day.com/ePaperImg/md_11032024/?src=direct#epaper_Mumbai/3',
                filename: file?.name,
                filetype: file?.mimetype,
                filesize: `${file?.size / 1024} KB`,
            })

        } catch (error) {
            throw new CustomErrorObj(error?.message, 400)
        }
    })
}
module.exports = FileUpload;
