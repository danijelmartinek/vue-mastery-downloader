const getElementForSelector = async (page, selector) => {
  return (await page.$(selector)) || undefined;
};

const getInnerText = async (page, selector) => {
  const elementForSelector = await getElementForSelector(page, selector);
  try {
    if (elementForSelector)
      return (
        (await elementForSelector.evaluate(element => {
          return element.innerText;
        })) || ""
      );
  } catch {
    return "";
  }
};

module.exports = getInnerText;
