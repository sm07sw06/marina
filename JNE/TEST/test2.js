// // import {image} from "./test"
// var IMG=require("./test")

// IMG.image.files = "taest"
// IMG.image.imageUpload()

// IMG.image.path = 123
// IMG.image.imageUpload()
// // image.imageUpload()

sendData = {detail_cd,detail_nm}

console.log(sendData)

sendData.detail_cd = "test1"

console.log(sendData)
test=Object.values(sendData)
test.push("test2")
console.log(test)

sendData.detail_cd=test
console.log(sendData)
