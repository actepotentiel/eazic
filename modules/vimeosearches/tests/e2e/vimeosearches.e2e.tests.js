'use strict';

describe('Vimeosearches E2E Tests:', function() {
	describe('Test Vimeosearches page', function() {
		it('Should not include new Vimeosearches', function() {
			browser.get('http://localhost:3000/#!/vimeosearches');
			expect(element.all(by.repeater('vimeosearch in vimeosearches')).count()).toEqual(0);
		});
	});
});
