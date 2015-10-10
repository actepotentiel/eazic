'use strict';

(function() {
	// Vimeosearches Controller Spec
	describe('Vimeosearches Controller Tests', function() {
		// Initialize global variables
		var VimeosearchesController,
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

			// Initialize the Vimeosearches controller.
			VimeosearchesController = $controller('VimeosearchesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Vimeosearch object fetched from XHR', inject(function(Vimeosearches) {
			// Create sample Vimeosearch using the Vimeosearches service
			var sampleVimeosearch = new Vimeosearches({
				name: 'New Vimeosearch'
			});

			// Create a sample Vimeosearches array that includes the new Vimeosearch
			var sampleVimeosearches = [sampleVimeosearch];

			// Set GET response
			$httpBackend.expectGET('api/vimeosearches').respond(sampleVimeosearches);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.vimeosearches).toEqualData(sampleVimeosearches);
		}));

		it('$scope.findOne() should create an array with one Vimeosearch object fetched from XHR using a vimeosearchId URL parameter', inject(function(Vimeosearches) {
			// Define a sample Vimeosearch object
			var sampleVimeosearch = new Vimeosearches({
				name: 'New Vimeosearch'
			});

			// Set the URL parameter
			$stateParams.vimeosearchId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/vimeosearches\/([0-9a-fA-F]{24})$/).respond(sampleVimeosearch);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.vimeosearch).toEqualData(sampleVimeosearch);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Vimeosearches) {
			// Create a sample Vimeosearch object
			var sampleVimeosearchPostData = new Vimeosearches({
				name: 'New Vimeosearch'
			});

			// Create a sample Vimeosearch response
			var sampleVimeosearchResponse = new Vimeosearches({
				_id: '525cf20451979dea2c000001',
				name: 'New Vimeosearch'
			});

			// Fixture mock form input values
			scope.name = 'New Vimeosearch';

			// Set POST response
			$httpBackend.expectPOST('api/vimeosearches', sampleVimeosearchPostData).respond(sampleVimeosearchResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Vimeosearch was created
			expect($location.path()).toBe('/vimeosearches/' + sampleVimeosearchResponse._id);
		}));

		it('$scope.update() should update a valid Vimeosearch', inject(function(Vimeosearches) {
			// Define a sample Vimeosearch put data
			var sampleVimeosearchPutData = new Vimeosearches({
				_id: '525cf20451979dea2c000001',
				name: 'New Vimeosearch'
			});

			// Mock Vimeosearch in scope
			scope.vimeosearch = sampleVimeosearchPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/vimeosearches\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/vimeosearches/' + sampleVimeosearchPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid vimeosearchId and remove the Vimeosearch from the scope', inject(function(Vimeosearches) {
			// Create new Vimeosearch object
			var sampleVimeosearch = new Vimeosearches({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Vimeosearches array and include the Vimeosearch
			scope.vimeosearches = [sampleVimeosearch];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/vimeosearches\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleVimeosearch);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.vimeosearches.length).toBe(0);
		}));
	});
}());