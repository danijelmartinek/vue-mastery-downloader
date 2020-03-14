const delay = require('./delay.js');
const downloadCourseVideos = require('./downloadCourseVideos.js');

const downloadCourse = async (page, url, course, saveDir, extension, quality, dotLoader) => {
    await page.goto(url, { waitUntil: 'networkidle0' })
    dotLoader.stop();

    await delay(2000);
    const playlistLen = await page.evaluate(
        () => Array.from(document.body.querySelectorAll('div.list-item'), txt => 'list').length
    );

    dotLoader.start('Starting course download - ' + course);
    await downloadCourseVideos(page, saveDir, extension, quality, playlistLen, dotLoader);

}

module.exports = downloadCourse;