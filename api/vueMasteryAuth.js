const auth = async (page, email, password) => {
    await page.click('button[class="button inverted"]');
    await page.click('button[class="button link"]');

    await page.focus('input[placeholder="Account Email"]');
    await page.keyboard.type(email)
    await page.focus('input[placeholder="Password"]');
    await page.keyboard.type(password)

    await page.click('button[class="button primary -full"]')
    await page.click('button[class="button primary -full"]')
}

module.exports = auth;