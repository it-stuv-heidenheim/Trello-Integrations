/* We have two cards with information: one contains the agenda and the other one the link to the meeting
They will be displayed separately, the agenda will be interpreted as MarkDown (by Showdown parser, 
  for more info please see https://showdownjs.com/#!/blog. The link will be printed out 
  like elementor would generate a button as well.)

  Special on this page is that you can hide the contents of both cards. If you give them a red label,
  their content in Trello will be hidden and instead the text stored in the objects some line below be displayed.
*/

const cardData = [
  {
    htmlNodeId: "trello-sitzung-agenda",
    cardCode: "EbMydTLn",
    noContentHtmlFallback: `<h4>Agenda noch nicht veröffentlicht</h4><p>Die Agenda wird meistens wenige Tage vor der Sitzung 
          von den Studierendensprechern basierend auf Vorschlägen der Studierenden aufgestellt und dann auch hier angezeigt.</p>`,
    contentHiddenHtmlFallback:
      "" /* if empty, noContentHtmlFallback will be taken instead */,
  },
  {
    htmlNodeId: "trello-sitzung-link",
    cardCode: "kwS43FhD",
    noMarkdownButLinkLabel: "Direkt zur StuV Sitzung",
    noContentHtmlFallback: `<h4>Link noch nicht freigegeben</h4><p>Der Link zur Sitzung ist noch nicht freigegeben. Schaut einfach eine knappe Stunde vor der 
      Sitzung hier rein, dann spätestens schalten wir den eigentlich immer frei</p>`,
    contentHiddenHtmlFallback:
      "" /* here same way, if empty noContentHtmlFallback will be taken instead */,
  },
];

const baseUrl = "https://api.trello.com/1/cards/";

var showdown = new showdown.Converter();

/* the first object, which will handle the agenda card in Trello */
var agendaCard = cardData[0];
fetch(baseUrl + agendaCard.cardCode)
  .then((res) => {
    res.json().then((cardObj) => {
      var htmlOut = "";

      var text = cardObj.desc.trim();

      console.log(cardObj);

      /* this var indicates whether that card has any red label */
      var redLabelIsSet =
          cardObj.labels.find((labelObj) => {
            var cardIsSetHidden = labelObj.color == "red";
            return cardIsSetHidden;

            /* when a card with red label is found, here will be returned true
            and therefore find() will return something different than undefined */
          }) != undefined,
        isLabelSupposedToBeHidden = redLabelIsSet;
      /* so, if the red label is set, the output is supposed to be hidden on the final page */

      if (isLabelSupposedToBeHidden) {
        htmlOut =
          agendaCard.contentHiddenHtmlFallback ||
          agendaCard.noContentHtmlFallback;
        /* if the data is supposed to be hidden, show the contentHiddenHtmlFallback */
        /* if that field is empty, take the noContentHtmlFallback instead */
      } else if (text == "") {
        /* if text is empty, take the fallback for no content */
        htmlOut += agendaCard.noContentHtmlFallback;
      } else {
        htmlOut += showdown.makeHtml(text);
      }

      var agendaDiv = document.getElementById(agendaCard.htmlNodeId);

      agendaDiv.innerHTML = htmlOut;
    });
  })
  .catch((err) => {
    console.warn("Fetch failure at agenda card:");
    console.warn(err);
  });

/* and most of the above logic again for the link card */
/* could have been solved in a loop as well, but this is better code since more readable */
var linkCard = cardData[1];
fetch(baseUrl + linkCard.cardCode)
  .then((res) => {
    res.json().then((cardObj) => {
      var htmlOut = "";

      var urlFromCard = cardObj.desc.trim();

      if (!urlFromCard.startsWith("https://")) {
        urlFromCard = "https://" + urlFromCard;
      }

      var redLabelSet =
          cardObj.labels.find((labelObj) => {
            var cardIsSetHidden = labelObj.name.startsWith("versteckt");
            return cardIsSetHidden;

            /* when a card with red label is found, here will be returned true */
          }) != undefined,
        isLabelSupposedToBeHidden = redLabelSet;
      /* so, if the red label is set, the output is supposed to be hidden on the final page */

      if (isLabelSupposedToBeHidden) {
        htmlOut =
          linkCard.contentHiddenHtmlFallback || linkCard.noContentHtmlFallback;
        // if no fallback for hidden content specified, just take the fallback for no content specified
      } else if (urlFromCard == "") {
        htmlOut += linkCard.noContentHtmlFallback;
      } else {
        var linkLabel = linkCard.noMarkdownButLinkLabel;

        htmlOut += getFormattedButtonFromData(urlFromCard, linkLabel);
      }

      var domNode = document.getElementById(linkCard.htmlNodeId);

      domNode.innerHTML = htmlOut;
    });
  })
  .catch((err) => {
    console.warn("Fetch failure at link card:");
    console.warn(err);
  });

function getFormattedButtonFromData(url, label) {
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
}
