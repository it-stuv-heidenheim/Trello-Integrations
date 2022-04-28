const cardData = [
  {
    htmlNodeId: "trello-sitzung-agenda",
    cardCode: "EbMydTLn",
    noContentHtmlFallback: `<h4>Agenda noch nicht veröffentlicht</h4><p>Die Agenda wird meistens wenige Tage vor der Sitzung 
          von den Studierendensprechern basierend auf Vorschlägen der Studierenden aufgestellt und dann auch hier angezeigt.</p>`,
    contentHiddenHtmlFallback: "",
  },
  {
    htmlNodeId: "trello-sitzung-link",
    cardCode: "kgU2MX33",
    noMarkdownButLinkLabel: "Direkt zur StuV Sitzung",
    noContentHtmlFallback: `<h4>Link noch nicht freigegeben</h4><p>Der Link zur Sitzung ist noch nicht freigegeben. Schaut einfach eine knappe Stunde vor der 
      Sitzung hier rein, dann spätestens schalten wir den eigentlich immer frei</p>`,
    contentHiddenHtmlFallback: "",
  },
];

const baseUrl = "https://api.trello.com/1/cards/";

var showdown = new showdown.Converter();

var agendaCard = cardData[0];

fetch(baseUrl + agendaCard.cardCode)
  .then((res) => {
    res.json().then((cardObj) => {
      var htmlOut = "";

      var text = cardObj.desc.trim();

      var redLabelSet =
          cardObj.labels.find((labelObj) => {
            var cardIsSetHidden = labelObj.color == "red";
            return cardIsSetHidden;

            /* when a card with red label is found, here will be returned true */
          }) != undefined,
        isLabelSupposedToBeHidden = redLabelSet;
      /* so, if the red label is set, the output is supposed to be hidden on the final page */

      if (isLabelSupposedToBeHidden) {
        htmlOut =
          cardToBeFetched.contentHiddenHtmlFallback ||
          cardToBeFetched.noContentHtmlFallback;
          /* if the data is supposed to be hidden, show the contentHiddenHtmlFallback */
          /* if that field is empty, take the noContentHtmlFallback instead */
      } else if (text == "") {
        /* if text is empty, take the fallback for no content */
        htmlOut += cardToBeFetched.noContentHtmlFallback;
      } else {
        htmlOut += showdown.makeHtml(text);
      }

      var domNode = document.getElementById(cardToBeFetched.htmlNodeId);

      domNode.innerHTML = htmlOut;
    });
  })
  .catch((err) => console.warn("Fetch failure at agenda card: \n\n" + err));


/* and most of the above logic again for the link card */
/* could have been solved in a loop as well, but this is better code since more readable */
var linkCard = cardData[1]
fetch(baseUrl + linkCard.cardCode)
  .then((res) => {
    res.json().then((cardObj) => {
      var htmlOut = "";

      var text = cardObj.desc.trim();

      var redLabelSet =
          cardObj.labels.find((labelObj) => {
            var cardIsSetHidden = labelObj.color == "red";
            return cardIsSetHidden;

            /* when a card with red label is found, here will be returned true */
          }) != undefined,
        isLabelSupposedToBeHidden = redLabelSet;
      /* so, if the red label is set, the output is supposed to be hidden on the final page */

      if (isLabelSupposedToBeHidden) {
        htmlOut =
          cardToBeFetched.contentHiddenHtmlFallback ||
          cardToBeFetched.noContentHtmlFallback;
        // if no fallback for hidden content specified, just take the fallback for no content specified
      } else if (text == "") {
        htmlOut += cardToBeFetched.noContentHtmlFallback;
      } else {
          var linkLabel = cardToBeFetched.noMarkdownButLinkLabel;

          htmlOut += getFormattedButtonFromData(text, linkLabel);
      }

      var domNode = document.getElementById(cardToBeFetched.htmlNodeId);

      domNode.innerHTML = htmlOut;
    });
  })
  .catch((err) => console.warn("Fetch failure at link card: \n\n" + err));

  var linkCard = cardData[1]
  if (cardData.noMarkdownButLinkLabel) {
          /* if that property is set, this card is the link to the session and not the agenda, 
            therefore has to be treated differently */
          htmlOut += getFormattedButtonFromData(
            linkToTeams,
            "Direkt zur StuV-Sitzung"
          );
        } else {

const parseMarkdown = (markdownText) => {
  /* an old method which was used earlier, but since the data got more complex
  I decided to switch to showdown, a real markdown converter */
  const htmlText = markdownText
    .replace(/^# (.*$)/gim, "<h3>$1</h3>") // the headings
    .replace(/^## (.*$)/gim, "<h4>$1</h4>")
    .replace(/^### (.*$)/gim, "<h5>$1</h3>")
    .replace(/^#### (.*$)/gim, "<h6>$1</h4>")
    /* .replace(/^\> (.*$)/gim, "<blockquote>$1</blockquote>")
    .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />") */ // we don't need that yet
    .replace(/\*\*(.*)\*\*/gim, "<b>$1</b>") // bold and italic
    .replace(/\_(.*)\_/gim, "<i>$1</i>")
    .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
    .replace(/\n$/gim, "<br />");

  return htmlText.trim();

  // ref: https://www.bigomega.dev/markdown-parser
};

function parsePseudoMarkdown(pseudoMarkdown) {
  const headingLevel = 3;
  var lines = pseudoMarkdown.split("\n");

  var headingCounter = 1;
  var lastLineWasAHeading = true;
  /* just to do so, because if false algo would first assume that a open list has to be closed,
  which would result in improperly styling. Browser could even tolerate it, but er...no, we don't want that. */
  const headingRegex = /^# \w/g;

  var htmlOut = "";

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();

    line = line.trim();
    if (line == "") continue;
    if (line.startsWith("https://")) {
      if (!lastLineWasAHeading) htmlOut += "</ol>";
      htmlOut += "<br/>";
      htmlOut += '<a href="' + line + '">Link zum letzten Protokoll</a>';

      break;

      /* break because this will be the last line with content */
    }

    var isLineHeading = line.match(headingRegex) != null;

    console.log(isLineHeading + ": " + line);

    if (lastLineWasAHeading) {
      if (isLineHeading) {
        /* just add the line as new heading */
        htmlOut +=
          "<br/><h" +
          headingLevel +
          "><small>" +
          headingCounter +
          ". </small>" +
          line.substr(2) +
          "</h" +
          headingLevel +
          ">";
        headingCounter++;
      } else {
        /* begin list with line as first item */
        htmlOut += "<ol>";
        htmlOut += "<li>" + line + "</li>";
      }
    } else {
      /* last item was a list item */
      if (isLineHeading) {
        /* close list, then add heading */
        htmlOut += "</ol>";

        htmlOut +=
          "<br/><h" +
          headingLevel +
          "><small>" +
          headingCounter +
          ". </small>" +
          line.substr(2) +
          "</h" +
          headingLevel +
          ">";
        headingCounter++;
      } else {
        /* continue list with line as next item */
        htmlOut += "<li>" + line + "</li>";
      }
    }

    /* and storing heading state for next round */
    lastLineWasAHeading = isLineHeading;
  }

  if (!lastLineWasAHeading) {
    /* if there is an unclosed list, close it */
    htmlOut += "</ol>";
  }

  return htmlOut;
}

document.querySelector("#test-md").innerHTML = parsePseudoMarkdown(`
# first heading
line
second line
third line
# heading
second list

https://mi.com
`);

const getFormattedButtonFromData = (url, label) => {
  return `<div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-02f3eb0" data-id="02f3eb0" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-53a508b elementor-widget elementor-widget-button" data-id="53a508b" data-element_type="widget" data-widget_type="button.default">
				<div class="elementor-widget-container">
					<div class="elementor-button-wrapper">
			<a href="${url}" class="elementor-button-link elementor-button elementor-size-sm" role="button">
						<span class="elementor-button-content-wrapper">
						<span class="elementor-button-text">${label}</span>
		</span>
					</a>
		</div>
				</div>
				</div>
						</div>
					</div>
		</div>`;
};
