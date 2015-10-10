'use strict';

describe('Youtubesearches E2E Tests:', function() {
	describe('Test Youtubesearches page', function() {
		it('Should not include new Youtubesearches', function() {
			browser.get('http://localhost:3000/#!/youtubesearches');
			expect(element.all(by.repeater('youtubesearch in youtubesearches')).count()).toEqual(0);
		});
	});
});
