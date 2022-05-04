const cardCode = "uF9rAlsJ"; // this is the code for the data src card

var url = "https://api.trello.com/1/boards/" + cardCode + "/cards";

const containerNode = document.getElementById("trello-calendar-anchor");

fetch(url)
  .then((res) => {
    res.json().then((data) => {
      var cardsWithoudRedLabel = data.filter(
        (c) =>
          c.labels.find((labelObj) => {
            var cardIsSetHidden = labelObj.color == "red";
            return cardIsSetHidden;

            /* when a card with red label is found, here will be returned true and therefore the result of
            find() an index and not undefined */
          }) == undefined
      );

      var cardsOnlyNeededData = cardsWithoudRedLabel.map((cardData) => {
        var cardDate = null;
        var dateTaken = cardData.due || cardData.start;
        var dateMs = Date.parse(dateTaken);
        if (isNaN(dateMs)) {
          console.warn("Could not parse date " + dateTaken);
          cardDate = null;
        } else cardDate = new Date(Date.parse(dateTaken));

        return {
          name: cardData.name,
          date: cardDate,
          desc: cardData.desc,
        };
      });

      cardsOnlyNeededData.sort((a, b) => a.date - b.date); // sorts the list ascending by the dates

      var htmlOut = "<div>";

      cardsOnlyNeededData.forEach((cardObj) => {
        var formattedDate = formatDate(cardObj.date);

        htmlOut += getFormattedSectionFromData(
          cardObj.name,
          cardObj.desc || "",
          formattedDate.line1,
          formattedDate.line2
        );
      });

      htmlOut += "</div>";

      containerNode.innerHTML = htmlOut;
    });
  })
  .catch((err) => "Fetch failure: \n\n" + err);

const getFormattedSectionFromData = (title, desc, line1, line2) => {
  return (
    `<section class="elementor-section elementor-top-section elementor-element elementor-element-33b8e74 elementor-section-full_width elementor-section-height-default elementor-section-height-default" data-id="33b8e74" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
						<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-33 elementor-top-column elementor-element elementor-element-30b1a3e" data-id="30b1a3e" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-529bcd4 elementor-widget elementor-widget-text-editor" data-id="529bcd4" data-element_type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
								<div class="elementor-text-editor elementor-clearfix">
					<h3>` +
    title +
    `</h3><p>` +
    desc +
    `</p>					</div>
						</div>
				</div>
						</div>
					</div>
		</div>
				<div class="elementor-column elementor-col-66 elementor-top-column elementor-element elementor-element-db8859b" data-id="db8859b" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-5e3e603 elementor-widget elementor-widget-text-editor" data-id="5e3e603" data-element_type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
								<div class="elementor-text-editor elementor-clearfix">
					<h4>` +
    line1 +
    `,</h4><h5>` +
    line2 +
    `</h5>					</div>
						</div>
				</div>
						</div>
					</div>
		</div>
								</div>
					</div>
		</section>`
  );
};

const daysOfWeek = [
  "Sonntag",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
];

const formatDate = (dateObj) => {
  if (dateObj == null)
    return {
      line1: "- Invalid -",
      line2: "- date -",
    };

  var line2 = dateObj
    .toLocaleString("de-DE", {
      day: "numeric",
      month: "short",
    })
    .slice(0, -1); // so that the dot will be cut off

  var line1 = daysOfWeek[dateObj.getDay()];

  return {
    line1: line1,
    line2: line2,
  };
};
