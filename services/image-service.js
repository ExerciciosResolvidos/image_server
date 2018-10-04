const AWS = require("aws-sdk")
const envLoader = require("env-o-loader")
const pad = require("pad")
const s3 = new AWS.S3()


const { bucket } = envLoader("../config/s3.yaml")

module.exports = {

  _genkey(id) {
    const partedId = pad(9,id,"0").replace(/(\d\d\d)/g, '/$1')
    return `pictures${partedId}/original`
  },

  getS3UrlById(id) {
    const key = this._genkey(id)

    return s3.getObject({ Bucket: bucket, Key: key })
             .promise()
             .then(obj => obj.Body)
  },

  sendBase64ToS3(id, base64) {
    const key = this._genkey(id)
    return s3.putObject({
      Body: new Buffer(base64, 'base64'),
      Bucket: bucket, 
      Key: key, 
     }).promise()
  }
}
