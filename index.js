const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
dotenv.config();

const auth = require("./api/vueMasteryAuth.js");
const delay = require("./api/delay.js");
const downloadCourse = require("./api/downloadCourse.js");
const getInnerText = require('./api/getInnerText.js');

const dotLoader = require("./api/dotLoader.js");
let loader = new dotLoader();

const courses = require("./courses.json");




async function main() {
  const browser = await puppeteer.launch(
    {
      headless: true 
    }
  );
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto("https://www.vuemastery.com", { waitUntil: "networkidle0" }); // wait until page load

  await auth(page, process.env.EMAIL, process.env.PASSWORD);
  loader.start("User login");

  await delay(2000);

  const coursesLen = courses.list.length;
  for (let i = 0; i < coursesLen; i++) {
    let courseName = courses.list[i].replace(
      "https://www.vuemastery.com/courses/",
      ""
    );

    if(courseName.includes('/')){
      courseName = courseName.split("/")[0];
    }

    if(i === 0) {
      loader.stop();
      loader.start("Checking authentication");

      await delay(2000);
      await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
      await delay(3000);
      
      if (await getInnerText(page, 'a[href="/account/dashboard"]') === 'Dashboard') {
        loader.stop();
        console.log("\x1b[36m%s\x1b[0m", 'User successfully logged in. \n');
      } else {
        loader.stop();
        console.log('\x1b[31m%s\x1b[0m', 'Cannot login. Check your user credentials. \n WARNING: Just free videos will be downloaded. \n');
      }
    }

    await downloadCourse(
      page,
      courses.list[i],
      courseName,
      process.env.SAVE_DIR,
      process.env.VIDEO_EXTENSION,
      process.env.VIDEO_QUALITY,
      loader
    );
  }

  await delay(5000);

  console.log("\x1b[36m%s\x1b[0m", "\n\n All downloads finished.\n");
  browser.close();
}

main();
