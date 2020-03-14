const puppeteer = require("puppeteer");
const dotenv = require("./node_modules2/dotenv");
dotenv.config();

const auth = require("./api/vueMasteryAuth.js");
const delay = require("./api/delay.js");
const downloadCourse = require("./api/downloadCourse.js");

const dotLoader = require("./api/dotLoader.js");
let loader = new dotLoader();

const courses = require("./courses.json");

async function main() {
  const browser = await puppeteer.launch({
    // executablePath: "./node_modules/puppeteer/.local-chromium/win64-656675/chrome-win/chrome.exe", // for Windows
    headless: true
  });
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto("https://www.vuemastery.com", { waitUntil: "networkidle0" }); // wait until page load

  await auth(page, process.env.EMAIL, process.env.PASSWORD);
  loader.start("User authentication");

  await delay(2000);

  const coursesLen = courses.list.length;
  for (let i = 0; i < coursesLen; i++) {
    const courseNameInit = courses.list[i].replace(
      "https://www.vuemastery.com/courses/",
      ""
    );

    const courseName = courseNameInit.replace(
        "/",
        "--"
    );
    await downloadCourse(
      page,
      courses.list[i],
      courseName,
      process.env.SAVE_DIR + courseName + "/",
      process.env.VIDEO_EXTENSION,
      process.env.VIDEO_QUALITY,
      loader
    );
  }

  await delay(5000);

  console.log("\x1b[36m%s\x1b[0m", "\n\n All download finished.\n");
  browser.close();
}

main();
