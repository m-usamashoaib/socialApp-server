const fs = require('fs')
const json = require("../utils/jsonresponse");

const saveImages = (req, type) => {

    console.log(req.body,"RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
    let date = Date.now();
    let file = req.files.image;
    console.log(file,"file")
    let fileName = `${date}${req.user._id}${file.name.slice(file.name.indexOf("."))}`;
    const newpath = `public/upload/${type}/${fileName}`;
        console.log(newpath,"newpath")
    file.mv(newpath, (err) => {
        if (err) {
            console.log(err)
            return json(res, 500, err.message)
        }
    })
    console.log(`${req.protocol}://${req.get("host")}/upload/${type}/${fileName}`,"return")
    return (`${req.protocol}://${req.get("host")}/upload/${type}/${fileName}`);
}

const saveVideos = (req, type) => {

    let date = Date.now();
    console.log(req.files,"requesfiles")
    let file = req.files.video;
    console.log(file,"file")
    let fileName = `${date}${req.user._id}${file.name.slice(file.name.indexOf("."))}`;
    const newpath = `public/upload/${type}/${fileName}`;
    console.log(newpath,"newpath")

    file.mv(newpath, (err) => {
        if (err) {
            console.log(err)
            return json(res, 500, err.message)
        }
    })
    console.log(`${req.protocol}://${req.get("host")}/upload/${type}/${fileName}`,"retun")
    return (`${req.protocol}://${req.get("host")}/upload/${type}/${fileName}`);
}

const delImages = (fileName, type) => {
    fileName = fileName.slice(fileName.lastIndexOf("/") + 1);
    if (fileName === "default_profile.jpg" || fileName === "default_cover.jpg") return;

    let path = `public/upload/${type}/${fileName}`;
    fs.unlink(path, function (err) {
        if (err) {
            // throw err;
        }
    })
}

module.exports.saveImages = saveImages;
module.exports.saveVideos = saveVideos;
module.exports.delImages = delImages;
