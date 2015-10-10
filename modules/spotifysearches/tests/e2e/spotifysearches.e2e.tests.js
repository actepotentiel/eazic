'use strict';

describe('Spotifysearches E2E Tests:', function() {
	describe('Test Spotifysearches page', function() {
		it('Should not include new Spotifysearches', function() {
			browser.get('http://localhost:3000/#!/spotifysearches');
			expect(element.all(by.repeater('spotifysearch in spotifysearches')).count()).toEqual(0);
		});
	});
});
