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
})