const delay = require('./delay.js');
const downloadVideo = require('./downloadVideo.js');

const fs = require('fs-extra');

const downloadCourseVideos = async (page, saveDir, videoFormat, quality, playlistLen, dotLoader) => {

    let prevVideoTitle = '';

    await fs.ensureDir(saveDir)
    .catch(err => {
        console.error(err);
    })

    const startTitle = await page.evaluate(  
        () => Array.from(document.body.querySelectorAll('h1.title'), txt => txt.textContent)[0]
    );
    const allTitles = await page.evaluate(  
        () => Array.from(document.body.querySelectorAll('h4.list-item-title'), txt => txt.textContent)
    );
    const allTitlesWithoutNumbers = await allTitles.map(t => {
        return t.split(". ")[1];
    });
    const startIndex = await allTitlesWithoutNumbers.indexOf(startTitle);

    for(let x = startIndex; x < playlistLen; x++) {

        const ind = x + 1;

        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
        await delay(5000);

        let title = await page.evaluate(  
            () => Array.from(document.body.querySelectorAll('h1.title'), txt => txt.textContent)[0]
        );
        title = await title.replace(
            "/",
            "-",
            "?"
        );

        if(title === prevVideoTitle) {
            console.log("\x1b[31m%s\x1b[0m", 'More videos not available - This course download aborted. \n Reason: Either you have no access to the following videos or videos have not yet been published. \n');
            break;
        }

        const iframeSrc = await page.evaluate(
            () => Array.from(document.body.querySelectorAll('iframe[src]'), ({ src }) => src)[0]
        );

        if(!iframeSrc && !prevVideoTitle) {
            console.log("\x1b[31m%s\x1b[0m", 'Videos not available - This course download aborted. \n Reason: Either you have no access to the following videos or videos have not yet been published. \n');
            break;
        }

        dotLoader.start('Getting video - ' + title);

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
        await downloadVideo(selectedVideo.url, "./../" + saveDir + ind + '. ' + title + videoFormat, dotLoader);
        console.log('Download finished.\n\n')

        prevVideoTitle = title;

        await page.goBack();
        await delay(5000);
        await page.click('button[class="next"]')
    }
}

module.exports = downloadCourseVideos;