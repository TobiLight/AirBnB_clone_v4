$(document).ready(() => {
	const amenityIds = {}
	function updateAmenities (amenityIds) {
		const amenitiesList = Object.values(amenityIds);
		const h4 = $('.amenities h4');
		if (amenitiesList.length === 0) {
			h4.text('\u00A0');
		} else {
			h4.text(amenitiesList.join(', '));
		}
	}
	$('input[type="checkbox"]').change(function () {
		const checkbox = $(this);
		const amenityId = checkbox.data('id');


		if (checkbox.is(':checked')) {
			amenityIds[amenityId] = checkbox.data('name');
		} else {
			delete amenityIds[amenityId];
		}

		updateAmenities(amenityIds);

	});
	$.ajax({
		url: "http://172.20.171.87:5001/api/v1/status",
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
	$.ajax({
		url: "http://172.20.171.87:5001/api/v1/places_search",
		type: "POST",
		contentType: 'application/json',
		data: JSON.stringify({}),
		dataType: "json",
		success: res => {
			if (res.length) {
				res.forEach((place) =>
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
            </article > `
					)
				)
			}
		}
	})
	// make post request to places_search
	$("section.filters button").click(() => {
		const placesSection = $("section.places")
		if (amenityIds != {}) {
			$.ajax({
				url: "http://172.20.171.87:5001/api/v1/places_search",
				type: "POST",
				contentType: 'application/json',
				data: JSON.stringify({
					"amenities": Object.keys(amenityIds)
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
            </article > `
						)
					}
					)
				}
			})
		}
	})
})