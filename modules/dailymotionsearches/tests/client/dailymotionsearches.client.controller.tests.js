'use strict';

(function() {
	// Dailymotionsearches Controller Spec
	describe('Dailymotionsearches Controller Tests', function() {
		// Initialize global variables
		var DailymotionsearchesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Dailymotionsearches controller.
			DailymotionsearchesController = $controller('DailymotionsearchesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Dailymotionsearch object fetched from XHR', inject(function(Dailymotionsearches) {
			// Create sample Dailymotionsearch using the Dailymotionsearches service
			var sampleDailymotionsearch = new Dailymotionsearches({
				name: 'New Dailymotionsearch'
			});

			// Create a sample Dailymotionsearches array that includes the new Dailymotionsearch
			var sampleDailymotionsearches = [sampleDailymotionsearch];

			// Set GET response
			$httpBackend.expectGET('api/dailymotionsearches').respond(sampleDailymotionsearches);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.dailymotionsearches).toEqualData(sampleDailymotionsearches);
		}));

		it('$scope.findOne() should create an array with one Dailymotionsearch object fetched from XHR using a dailymotionsearchId URL parameter', inject(function(Dailymotionsearches) {
			// Define a sample Dailymotionsearch object
			var sampleDailymotionsearch = new Dailymotionsearches({
				name: 'New Dailymotionsearch'
			});

			// Set the URL parameter
			$stateParams.dailymotionsearchId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/dailymotionsearches\/([0-9a-fA-F]{24})$/).respond(sampleDailymotionsearch);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.dailymotionsearch).toEqualData(sampleDailymotionsearch);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Dailymotionsearches) {
			// Create a sample Dailymotionsearch object
			var sampleDailymotionsearchPostData = new Dailymotionsearches({
				name: 'New Dailymotionsearch'
			});

			// Create a sample Dailymotionsearch response
			var sampleDailymotionsearchResponse = new Dailymotionsearches({
				_id: '525cf20451979dea2c000001',
				name: 'New Dailymotionsearch'
			});

			// Fixture mock form input values
			scope.name = 'New Dailymotionsearch';

			// Set POST response
			$httpBackend.expectPOST('api/dailymotionsearches', sampleDailymotionsearchPostData).respond(sampleDailymotionsearchResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Dailymotionsearch was created
			expect($location.path()).toBe('/dailymotionsearches/' + sampleDailymotionsearchResponse._id);
		}));

		it('$scope.update() should update a valid Dailymotionsearch', inject(function(Dailymotionsearches) {
			// Define a sample Dailymotionsearch put data
			var sampleDailymotionsearchPutData = new Dailymotionsearches({
				_id: '525cf20451979dea2c000001',
				name: 'New Dailymotionsearch'
			});

			// Mock Dailymotionsearch in scope
			scope.dailymotionsearch = sampleDailymotionsearchPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/dailymotionsearches\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/dailymotionsearches/' + sampleDailymotionsearchPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid dailymotionsearchId and remove the Dailymotionsearch from the scope', inject(function(Dailymotionsearches) {
			// Create new Dailymotionsearch object
			var sampleDailymotionsearch = new Dailymotionsearches({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Dailymotionsearches array and include the Dailymotionsearch
			scope.dailymotionsearches = [sampleDailymotionsearch];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/dailymotionsearches\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDailymotionsearch);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.dailymotionsearches.length).toBe(0);
		}));
	});
}());