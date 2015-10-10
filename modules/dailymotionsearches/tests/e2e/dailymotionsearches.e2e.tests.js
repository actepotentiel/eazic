'use strict';

describe('Dailymotionsearches E2E Tests:', function() {
	describe('Test Dailymotionsearches page', function() {
		it('Should not include new Dailymotionsearches', function() {
			browser.get('http://localhost:3000/#!/dailymotionsearches');
			expect(element.all(by.repeater('dailymotionsearch in dailymotionsearches')).count()).toEqual(0);
		});
	});
});
