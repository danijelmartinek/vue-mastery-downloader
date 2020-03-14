class dotLoader {
    constructor(msg) {
      this.loader = null;
    }

    start(msg) {
        let i = 0;
        this.loader = setInterval(function() {
            process.stdout.clearLine();  // clear current text
            process.stdout.cursorTo(0);  // move cursor to beginning of line
            i = (i + 1) % 4;
            let dots = new Array(i + 1).join(".");
            process.stdout.write(msg + dots);  // write text
        }, 300);
    }

    stop() {
        console.log(' - finished' + '\n');
        clearInterval(this.loader);
    }
}

module.exports = dotLoader;