'use strict';

describe('Rooms E2E Tests:', function() {
	describe('Test Rooms page', function() {
		it('Should not include new Rooms', function() {
			browser.get('http://localhost:3000/#!/rooms');
			expect(element.all(by.repeater('room in rooms')).count()).toEqual(0);
		});
	});
});
