'use strict';

(function() {
	// Spotifysearches Controller Spec
	describe('Spotifysearches Controller Tests', function() {
		// Initialize global variables
		var SpotifysearchesController,
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

			// Initialize the Spotifysearches controller.
			SpotifysearchesController = $controller('SpotifysearchesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Spotifysearch object fetched from XHR', inject(function(Spotifysearches) {
			// Create sample Spotifysearch using the Spotifysearches service
			var sampleSpotifysearch = new Spotifysearches({
				name: 'New Spotifysearch'
			});

			// Create a sample Spotifysearches array that includes the new Spotifysearch
			var sampleSpotifysearches = [sampleSpotifysearch];

			// Set GET response
			$httpBackend.expectGET('api/spotifysearches').respond(sampleSpotifysearches);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.spotifysearches).toEqualData(sampleSpotifysearches);
		}));

		it('$scope.findOne() should create an array with one Spotifysearch object fetched from XHR using a spotifysearchId URL parameter', inject(function(Spotifysearches) {
			// Define a sample Spotifysearch object
			var sampleSpotifysearch = new Spotifysearches({
				name: 'New Spotifysearch'
			});

			// Set the URL parameter
			$stateParams.spotifysearchId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/spotifysearches\/([0-9a-fA-F]{24})$/).respond(sampleSpotifysearch);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.spotifysearch).toEqualData(sampleSpotifysearch);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Spotifysearches) {
			// Create a sample Spotifysearch object
			var sampleSpotifysearchPostData = new Spotifysearches({
				name: 'New Spotifysearch'
			});

			// Create a sample Spotifysearch response
			var sampleSpotifysearchResponse = new Spotifysearches({
				_id: '525cf20451979dea2c000001',
				name: 'New Spotifysearch'
			});

			// Fixture mock form input values
			scope.name = 'New Spotifysearch';

			// Set POST response
			$httpBackend.expectPOST('api/spotifysearches', sampleSpotifysearchPostData).respond(sampleSpotifysearchResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Spotifysearch was created
			expect($location.path()).toBe('/spotifysearches/' + sampleSpotifysearchResponse._id);
		}));

		it('$scope.update() should update a valid Spotifysearch', inject(function(Spotifysearches) {
			// Define a sample Spotifysearch put data
			var sampleSpotifysearchPutData = new Spotifysearches({
				_id: '525cf20451979dea2c000001',
				name: 'New Spotifysearch'
			});

			// Mock Spotifysearch in scope
			scope.spotifysearch = sampleSpotifysearchPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/spotifysearches\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/spotifysearches/' + sampleSpotifysearchPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid spotifysearchId and remove the Spotifysearch from the scope', inject(function(Spotifysearches) {
			// Create new Spotifysearch object
			var sampleSpotifysearch = new Spotifysearches({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Spotifysearches array and include the Spotifysearch
			scope.spotifysearches = [sampleSpotifysearch];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/spotifysearches\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSpotifysearch);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.spotifysearches.length).toBe(0);
		}));
	});
}());