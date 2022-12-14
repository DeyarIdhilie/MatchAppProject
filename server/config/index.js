
const Cloud = require('@google-cloud/storage')
const path = require('path')

const serviceKey = path.join(__dirname, './matchapp-371523-9eb80fd86eb6.json')

const { Storage } = Cloud

const storage = new Storage({
  keyFilename: serviceKey,
  projectId: 'matchapp-371523',
})

module.exports = storage