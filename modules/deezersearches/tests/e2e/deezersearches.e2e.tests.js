'use strict';

describe('Deezersearches E2E Tests:', function() {
	describe('Test Deezersearches page', function() {
		it('Should not include new Deezersearches', function() {
			browser.get('http://localhost:3000/#!/deezersearches');
			expect(element.all(by.repeater('deezersearch in deezersearches')).count()).toEqual(0);
		});
	});
});
