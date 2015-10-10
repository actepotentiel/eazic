'use strict';

describe('Soundcloudsearches E2E Tests:', function() {
	describe('Test Soundcloudsearches page', function() {
		it('Should not include new Soundcloudsearches', function() {
			browser.get('http://localhost:3000/#!/soundcloudsearches');
			expect(element.all(by.repeater('soundcloudsearch in soundcloudsearches')).count()).toEqual(0);
		});
	});
});
