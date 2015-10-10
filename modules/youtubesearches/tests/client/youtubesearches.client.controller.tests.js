'use strict';

(function() {
	// Youtubesearches Controller Spec
	describe('Youtubesearches Controller Tests', function() {
		// Initialize global variables
		var YoutubesearchesController,
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

			// Initialize the Youtubesearches controller.
			YoutubesearchesController = $controller('YoutubesearchesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Youtubesearch object fetched from XHR', inject(function(Youtubesearches) {
			// Create sample Youtubesearch using the Youtubesearches service
			var sampleYoutubesearch = new Youtubesearches({
				name: 'New Youtubesearch'
			});

			// Create a sample Youtubesearches array that includes the new Youtubesearch
			var sampleYoutubesearches = [sampleYoutubesearch];

			// Set GET response
			$httpBackend.expectGET('api/youtubesearches').respond(sampleYoutubesearches);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.youtubesearches).toEqualData(sampleYoutubesearches);
		}));

		it('$scope.findOne() should create an array with one Youtubesearch object fetched from XHR using a youtubesearchId URL parameter', inject(function(Youtubesearches) {
			// Define a sample Youtubesearch object
			var sampleYoutubesearch = new Youtubesearches({
				name: 'New Youtubesearch'
			});

			// Set the URL parameter
			$stateParams.youtubesearchId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/youtubesearches\/([0-9a-fA-F]{24})$/).respond(sampleYoutubesearch);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.youtubesearch).toEqualData(sampleYoutubesearch);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Youtubesearches) {
			// Create a sample Youtubesearch object
			var sampleYoutubesearchPostData = new Youtubesearches({
				name: 'New Youtubesearch'
			});

			// Create a sample Youtubesearch response
			var sampleYoutubesearchResponse = new Youtubesearches({
				_id: '525cf20451979dea2c000001',
				name: 'New Youtubesearch'
			});

			// Fixture mock form input values
			scope.name = 'New Youtubesearch';

			// Set POST response
			$httpBackend.expectPOST('api/youtubesearches', sampleYoutubesearchPostData).respond(sampleYoutubesearchResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Youtubesearch was created
			expect($location.path()).toBe('/youtubesearches/' + sampleYoutubesearchResponse._id);
		}));

		it('$scope.update() should update a valid Youtubesearch', inject(function(Youtubesearches) {
			// Define a sample Youtubesearch put data
			var sampleYoutubesearchPutData = new Youtubesearches({
				_id: '525cf20451979dea2c000001',
				name: 'New Youtubesearch'
			});

			// Mock Youtubesearch in scope
			scope.youtubesearch = sampleYoutubesearchPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/youtubesearches\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/youtubesearches/' + sampleYoutubesearchPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid youtubesearchId and remove the Youtubesearch from the scope', inject(function(Youtubesearches) {
			// Create new Youtubesearch object
			var sampleYoutubesearch = new Youtubesearches({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Youtubesearches array and include the Youtubesearch
			scope.youtubesearches = [sampleYoutubesearch];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/youtubesearches\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleYoutubesearch);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.youtubesearches.length).toBe(0);
		}));
	});
}());