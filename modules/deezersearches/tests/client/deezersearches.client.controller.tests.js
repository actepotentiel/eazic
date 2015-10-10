'use strict';

(function() {
	// Deezersearches Controller Spec
	describe('Deezersearches Controller Tests', function() {
		// Initialize global variables
		var DeezersearchesController,
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

			// Initialize the Deezersearches controller.
			DeezersearchesController = $controller('DeezersearchesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Deezersearch object fetched from XHR', inject(function(Deezersearches) {
			// Create sample Deezersearch using the Deezersearches service
			var sampleDeezersearch = new Deezersearches({
				name: 'New Deezersearch'
			});

			// Create a sample Deezersearches array that includes the new Deezersearch
			var sampleDeezersearches = [sampleDeezersearch];

			// Set GET response
			$httpBackend.expectGET('api/deezersearches').respond(sampleDeezersearches);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.deezersearches).toEqualData(sampleDeezersearches);
		}));

		it('$scope.findOne() should create an array with one Deezersearch object fetched from XHR using a deezersearchId URL parameter', inject(function(Deezersearches) {
			// Define a sample Deezersearch object
			var sampleDeezersearch = new Deezersearches({
				name: 'New Deezersearch'
			});

			// Set the URL parameter
			$stateParams.deezersearchId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/deezersearches\/([0-9a-fA-F]{24})$/).respond(sampleDeezersearch);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.deezersearch).toEqualData(sampleDeezersearch);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Deezersearches) {
			// Create a sample Deezersearch object
			var sampleDeezersearchPostData = new Deezersearches({
				name: 'New Deezersearch'
			});

			// Create a sample Deezersearch response
			var sampleDeezersearchResponse = new Deezersearches({
				_id: '525cf20451979dea2c000001',
				name: 'New Deezersearch'
			});

			// Fixture mock form input values
			scope.name = 'New Deezersearch';

			// Set POST response
			$httpBackend.expectPOST('api/deezersearches', sampleDeezersearchPostData).respond(sampleDeezersearchResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Deezersearch was created
			expect($location.path()).toBe('/deezersearches/' + sampleDeezersearchResponse._id);
		}));

		it('$scope.update() should update a valid Deezersearch', inject(function(Deezersearches) {
			// Define a sample Deezersearch put data
			var sampleDeezersearchPutData = new Deezersearches({
				_id: '525cf20451979dea2c000001',
				name: 'New Deezersearch'
			});

			// Mock Deezersearch in scope
			scope.deezersearch = sampleDeezersearchPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/deezersearches\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/deezersearches/' + sampleDeezersearchPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid deezersearchId and remove the Deezersearch from the scope', inject(function(Deezersearches) {
			// Create new Deezersearch object
			var sampleDeezersearch = new Deezersearches({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Deezersearches array and include the Deezersearch
			scope.deezersearches = [sampleDeezersearch];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/deezersearches\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDeezersearch);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.deezersearches.length).toBe(0);
		}));
	});
}());