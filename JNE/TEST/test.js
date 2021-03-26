
const API = require("./back-end/API")


/**/
module.exports = {

    image: {
        files: null,
        path: null,
        imageUpload: function () {
            console.log("path : " + String(this.path), "files : " + String(this.files));
            API.objectDefault(this);

        }
    },


}

/*
let image = {
    files: null,
    path: null,
    imageUpload: function () {
        console.log("path : " + String(image.path), "files : " + String(image.files));

        API.objectDefault(image);

    },

}
*/

// image.files = "taest"
// image.imageUpload()

// image.path = 123
// image.imageUpload()
// image.imageUpload()


// const fs = require('fs');
// fs.rename(newPath="C:\\GAME" ,oldPath="C:\\test");
