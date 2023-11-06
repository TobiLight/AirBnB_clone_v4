$(document).ready(() => {
	const amenityList = {}
	const stateList = {}
	const cityList = {}


	// gets api status
	$.ajax({
		url: "http://localhost:5001/api/v1/status",
		type: "GET",
		success: (res) => {
			if (res.status == "OK") {
				if ($("div#api_status").hasClass("available")) {
					$("div#api_status").removeClass("available")
				} else {
					$("div#api_status").addClass("available")
				}
			}
		}
	});

	// when checkbox is clicked
	$('input[type="checkbox"]').change(function (e) {
		const checkbox = $(this);
		switch (e.target.id) {
			case "state_filter":
				const stateId = checkbox.data('id')
				const stateName = checkbox.data("name")

				if (checkbox.is(':checked')) {
					if (Object.keys(cityList).length) {
						console.log(cityList)
					}
					stateList[stateId] = stateName
					if (Object.keys(stateList).length >= 4)
						$(".amenities:hover .popover").css({ "margin-top": "0px" })

					$(".locations h4").text(
						Object.values(Object.assign({}, stateList, cityList)).sort().join(", ")
					);
				} else {
					delete stateList[stateId]
					$(".locations h4").text(
						Object.values(Object.assign({}, stateList, cityList)).sort().join(", ")
					);
					if (Object.keys(stateList).length < 4)
						$(".amenities:hover .popover").css({ "margin-top": "17px" })
				}
				break
			case "city_filter":
				const cityId = checkbox.data('id')
				const cityName = checkbox.data('name')

				if (checkbox.is(":checked")) {
					cityList[cityId] = cityName

					$(".locations h4").text(
						Object.values(Object.assign({}, stateList, cityList)).sort().join(", ")
					);
				} else {
					delete cityList[cityId]
					$(".locations h4").text(
						Object.values(Object.assign({}, stateList, cityList)).sort().join(", ")
					);
				}
				break
			case "amenity_filter":
				const amenityId = checkbox.data('id');
				const amenityName = checkbox.data('name')

				if (checkbox.is(':checked')) {
					amenityList[amenityId] = amenityName
					if (Object.keys(amenityList).length >= 4)
						$(".amenities:hover .popover").css({ "margin-top": "0px" })
					$(".amenities h4").text(
						Object.values(Object.assign({}, amenityList)).sort().join(", ")
					);
				} else {
					delete amenityList[amenityId];
					if (Object.keys(amenityList).length < 4)
						$(".amenities:hover .popover").css({ "margin-top": "17px" })
					$(".amenities h4").text(
						Object.values(Object.assign({}, amenityList)).sort().join(", ")
					);
				}
				break
			default:
				// console.log("I do not understand that")
				break
		}
	});

	// make a request to places_search
	if (!Object.keys(amenityList).length && !Object.keys(stateList).length && !Object.keys(cityList).length)
		$.ajax({
			url: "http://localhost:5001/api/v1/places_search",
			type: "POST",
			contentType: 'application/json',
			data: JSON.stringify({}),
			dataType: "json",
			success: res => {
				if (res.length) {
					res.forEach((place) => {
						$("section.places").append(
							`<article>
								<div class="title_box">
									<h2>${place.name}</h2>
									<div class="price_by_night">$${place.price_by_night}</div>
								</div>
								<div class="information">
									<div class="max_guest">${place.max_guest} Guest${place.max_guest > 1 ? "s" : ''}</div >
									<div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms > 1 ? "s" : ""}</div>
									<div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms > 1 ? "s" : ""}</div>
								</div >
								<div class="description">
									${place.description}
								</div>
								<div class="reviews" data-place="${place.id}">
									<h2></h2>
									<ul></ul>
								</div>
							</article>`
						)
						fetchReviews(place.id)
					})
				}
			}
		})


	// make post request to places_search if button is clicked
	$("section.filters button").click(() => {
		const placesSection = $("section.places")
		$.ajax({
			url: "http://localhost:5001/api/v1/places_search",
			type: "POST",
			headers: { "Content-Type": 'application/json' },
			data: JSON.stringify({
				"amenities": Object.keys(amenityList),
				"states": Object.keys(stateList),
				"cities": Object.keys(cityList)
			}),
			dataType: "json",
			success: res => {
				placesSection.empty()
				res.forEach((place) => {
					$("section.places").append(
						`<article>
							<div class="title_box">
								<h2>${place.name}</h2>
								<div class="price_by_night">$${place.price_by_night}</div>
							</div>
							<div class="information">
								<div class="max_guest">${place.max_guest} Guest${place.max_guest > 1 ? "s" : ''}</div >
								<div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms > 1 ? "s" : ""}</div>
								<div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms > 1 ? "s" : ""}</div>
							</div >
							<div class="description">
								${place.description}
							</div>
							<div class="reviews" data-place="${place.id}">
								<h2></h2>
								<ul></ul>
							</div>
						</article>`
					)
					fetchReviews(place.id)
				})
			}
		})
	})

	// fetch reviews
	function fetchReviews (placeId) {
		$.getJSON(
			`http://localhost:5001/api/v1/places/${placeId}/reviews`,
			(data) => {
				$(`.reviews[data-place="${placeId}"] h2`)
					.text("test")
					.html(`${data.length} Reviews <span id="toggle_review">show</span>`);
				$(`.reviews[data-place="${placeId}"] h2 #toggle_review`).bind(
					"click",
					{ placeId },
					function (e) {
						const show = $(`.reviews[data-place="${e.data.placeId}"] h2 span`)
						const rev = $(`.reviews[data-place="${e.data.placeId}"] ul`);

						if (rev.css("display") === "none") {
							rev.css("display", "block")
						}

						if (rev.css("display") === "block" && show[0].outerText === 'show') {
							show.text("hide")
							data.forEach((review) => {
								$.getJSON(
									`http://localhost:5001/api/v1/users/${review.user_id}`,
									(user) =>
										$(".reviews ul").append(`
											<li>
												<h3>From ${user.first_name + " " + user.last_name} the ${review.created_at
											}</h3>
												<p>${review.text}</p>
											</li>`
										),
									"json"
								);
							});
						} else {
							show.text("show")
							rev.empty()
							rev.css("display", "none")
							$(".reviews ul").empty()
						}
					}
				);
			},
			"json"
		);
	}
});