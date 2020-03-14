const delay = require('./delay.js');
const downloadVideo = require('./downloadVideo.js');

const fs = require('fs-extra');

const downloadCourseVideos = async (page, saveDir, videoFormat, quality, playlistLen, dotLoader) => {

    await fs.ensureDir(saveDir)
    .catch(err => {
        console.error(err);
    })

    for(let x = 1; x <= playlistLen; x++) {

        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
        await delay(5000);

        const title = await page.evaluate(  
            () => Array.from(document.body.querySelectorAll('h1.title'), txt => txt.textContent)[0]
        );

        dotLoader.stop();
        dotLoader.start('Getting video - ' + title);

        const iframeSrc = await page.evaluate(
            () => Array.from(document.body.querySelectorAll('iframe[src]'), ({ src }) => src)[0]
        );

        await page.goto('view-source:' + iframeSrc, { waitUntil: 'networkidle0' });
        await page.goto('view-source:' + iframeSrc, { waitUntil: 'networkidle0' });
        
        const content = await page.evaluate(
            () => Array.from(document.body.querySelectorAll('td.line-content'), txt => txt.textContent)[0]
        );

        let newString = content.split(`progressive":[`)[1];
        let finString = newString.split(']},"lang":"en","sentry":')[0];
        
        let videos = await eval(`[${finString}]`)
        let selectedVideo = await videos.find(vid => vid.quality === quality);

        dotLoader.stop();
        await downloadVideo(selectedVideo.url, "./../" + saveDir + x + '. ' + title + videoFormat, dotLoader);
        console.log('Download finished.')

        await page.goBack();
        await delay(5000);
        await page.click('button[class="next"]')
    }
}

module.exports = downloadCourseVideos;