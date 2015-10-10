'use strict';

(function() {
	// Soundcloudsearches Controller Spec
	describe('Soundcloudsearches Controller Tests', function() {
		// Initialize global variables
		var SoundcloudsearchesController,
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

			// Initialize the Soundcloudsearches controller.
			SoundcloudsearchesController = $controller('SoundcloudsearchesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Soundcloudsearch object fetched from XHR', inject(function(Soundcloudsearches) {
			// Create sample Soundcloudsearch using the Soundcloudsearches service
			var sampleSoundcloudsearch = new Soundcloudsearches({
				name: 'New Soundcloudsearch'
			});

			// Create a sample Soundcloudsearches array that includes the new Soundcloudsearch
			var sampleSoundcloudsearches = [sampleSoundcloudsearch];

			// Set GET response
			$httpBackend.expectGET('api/soundcloudsearches').respond(sampleSoundcloudsearches);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.soundcloudsearches).toEqualData(sampleSoundcloudsearches);
		}));

		it('$scope.findOne() should create an array with one Soundcloudsearch object fetched from XHR using a soundcloudsearchId URL parameter', inject(function(Soundcloudsearches) {
			// Define a sample Soundcloudsearch object
			var sampleSoundcloudsearch = new Soundcloudsearches({
				name: 'New Soundcloudsearch'
			});

			// Set the URL parameter
			$stateParams.soundcloudsearchId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/soundcloudsearches\/([0-9a-fA-F]{24})$/).respond(sampleSoundcloudsearch);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.soundcloudsearch).toEqualData(sampleSoundcloudsearch);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Soundcloudsearches) {
			// Create a sample Soundcloudsearch object
			var sampleSoundcloudsearchPostData = new Soundcloudsearches({
				name: 'New Soundcloudsearch'
			});

			// Create a sample Soundcloudsearch response
			var sampleSoundcloudsearchResponse = new Soundcloudsearches({
				_id: '525cf20451979dea2c000001',
				name: 'New Soundcloudsearch'
			});

			// Fixture mock form input values
			scope.name = 'New Soundcloudsearch';

			// Set POST response
			$httpBackend.expectPOST('api/soundcloudsearches', sampleSoundcloudsearchPostData).respond(sampleSoundcloudsearchResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Soundcloudsearch was created
			expect($location.path()).toBe('/soundcloudsearches/' + sampleSoundcloudsearchResponse._id);
		}));

		it('$scope.update() should update a valid Soundcloudsearch', inject(function(Soundcloudsearches) {
			// Define a sample Soundcloudsearch put data
			var sampleSoundcloudsearchPutData = new Soundcloudsearches({
				_id: '525cf20451979dea2c000001',
				name: 'New Soundcloudsearch'
			});

			// Mock Soundcloudsearch in scope
			scope.soundcloudsearch = sampleSoundcloudsearchPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/soundcloudsearches\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/soundcloudsearches/' + sampleSoundcloudsearchPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid soundcloudsearchId and remove the Soundcloudsearch from the scope', inject(function(Soundcloudsearches) {
			// Create new Soundcloudsearch object
			var sampleSoundcloudsearch = new Soundcloudsearches({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Soundcloudsearches array and include the Soundcloudsearch
			scope.soundcloudsearches = [sampleSoundcloudsearch];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/soundcloudsearches\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSoundcloudsearch);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.soundcloudsearches.length).toBe(0);
		}));
	});
}());