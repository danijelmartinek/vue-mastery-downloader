const Fs = require('fs');
const Path = require('path');
const ProgressBar = require('progress')

const Axios = require('axios')

const downloadVideo = async (url, savePath, dotLoader) => {  

    const { data, headers } = await Axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })
    const totalLength = headers['content-length']

    const progressBar = new ProgressBar('-> downloading [:bar] :percent :etas', {
        width: 40,
        complete: '=',
        incomplete: ' ',
        renderThrottle: 1,
        total: parseInt(totalLength)
        })

    const writer = Fs.createWriteStream(
        Path.resolve(__dirname, savePath)
    )

    data.on('data', (chunk) => progressBar.tick(chunk.length))
    data.pipe(writer)

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
    })
  }


module.exports = downloadVideo;