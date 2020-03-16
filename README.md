# Vue Mastery Downloader 

## CAUTION: This script was made just for fun as a weekend project without intent to falsify videos or doing any illegal activities related to Vue Mastery videos. Use of downloaded videos is strictly prohibited. If you want to watch them, go to Vue Mastery official site!  

## HOW TO USE:
1. clone this repository
2. npm install
3. change variables in example.env and remove 'exemple' part
4. add URL of courses you want to download to courses.json list array (without /'first-course-video' part)
5. node index.js

If you get error *(node:20857) UnhandledPromiseRejectionWarning: Error: Browser is not downloaded. Run "npm install" or "yarn install"*  
-> for Linux run "sudo npm install puppeteer --unsafe-perm=true --allow-root"  
-> for Windows uncomment "executablePath" in main() function in index.js (not tested)

##### MADE WITH THESE LIBRARIES:
- puppeteer
- axios
- fs-extra

##### Licence: MIT
