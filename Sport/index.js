/* for each sport, there is a card where the responsible people (Sport-Referat) type their information in
so we have a list of cards and of course a list of corresponding card codes which can be used to get
the contents via the Trello API
Then, each content will be displayed in a div which will (on production site) be styled by elementor.
But there's always a inner div where the text stands in. And we just need the id of that div.
Each div will get the contents of a card corresponding to one sport.
*/

const refData = [
  {
    name: "Aktuelles",
    divId: "elementor-tab-content-4301",
    cardCode: "QIQciu9Y",
  },
  {
    name: "Hochschulsport",
    divId: "elementor-tab-content-1501",
    cardCode: "L5goybS3",
  },
  {
    name: "Fitness",
    divId: "elementor-tab-content-2481",
    cardCode: "tM5tQewa",
  },
  {
    name: "Zumba",
    divId: "elementor-tab-content-1151",
    cardCode: "NmhFKHz4",
  },
  {
    name: "Yoga",
    divId: "elementor-tab-content-2451",
    cardCode: "keLc9SX1",
  },
  {
    name: "Pilates",
    divId: "elementor-tab-content-7381",
    cardCode: "7ooQ3Xyw",
  },
  {
    name: "Bootsführerschein",
    divId: "elementor-tab-content-6651",
    cardCode: "FjMCfJ74",
  },
  {
    name: "Tennis",
    divId: "elementor-tab-content-3211",
    cardCode: "eq4nXD9N",
  },
];

const baseURI = "https://api.trello.com/1/cards/";

/* iterate over all the cards and just fill their contents with the descriptions */

refData.forEach((section) => {
  fetch(baseURI + section.cardCode)
    .then((res) => {
      res.json().then((data) => {
        var htmlOut = "";
        var textNode = document.getElementById(section.divId);

        var cardContent = data.desc;
        if (cardContent) {
          htmlOut = parseMarkdown(cardContent);
        } else {
          htmlOut = parseMarkdown(`Bitte 
          [kontaktiere das Sport-Referat via Mail](mailto:sport@stuv-heidenheim.de), 
          hier sollten eigentlich Daten stehen.`);
        }

        try {
          textNode.innerHTML = htmlOut;
        } catch (e) {
          console.log(section);
        }
      });
    })
    .catch((err) => "Fetch failure: \n\n" + err);
});

/* to make easy formatting possible, we support MarkDown Syntax. Below implemented is a very limited parser */
const parseMarkdown = (markdownText) => {
  const htmlText = markdownText
    .replace(/^# (.*$)/gim, "<h3>$1</h3>") // the headings, start from h3 since h1 and h2 are already set in static page
    .replace(/^## (.*$)/gim, "<h4>$1</h4>")
    .replace(/^### (.*$)/gim, "<h5>$1</h5>")
    .replace(/^#### (.*$)/gim, "<h6>$1</h6>")
    .replace(/^##### (.*$)/gim, "<strong>$1</strong>")
    .replace(/^###### (.*$)/gim, "<p>$1</p>")
    /* .replace(/^\> (.*$)/gim, "<blockquote>$1</blockquote>")
    .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />") */ // we don't need that yet
    .replace(/\*\*(.*)\*\*/gim, "<b>$1</b>") // bold and italic
    .replace(/\_(.*)\_/gim, "<i>$1</i>")
    .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
    .replace(/\n$/gim, "<br />");

  return htmlText.trim();

  // ref: https://www.bigomega.dev/markdown-parser
};
