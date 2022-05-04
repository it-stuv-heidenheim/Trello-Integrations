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

        if (data.cover.idAttachment) {
          var image = data.cover.scaled[5].url;
        }

        textNode.innerHTML = htmlOut;
      });
    })
    .catch((err) => "Fetch failure: \n\n" + err);
});

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
