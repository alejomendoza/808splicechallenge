'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', ['$scope', '$timeout', '$http', function ($scope, $timeout, $http) {

        // create several sound instances so we can fire the same sound while it's playing

        var soundInstances = {
            kick: [],
            snare: [],
            hat: []
        };

        var numberOfInstances = 8;

        // Sounds from deadmau5 xfr expansion (thanks for the free account! I love it ;))

        for (var x = 0; x <= 9; x++) {
            soundInstances.kick.push(new Audio("../app/sounds/XF_KickHuge39.wav"));
            soundInstances.snare.push(new Audio("../app/sounds/XF_SnrLayer82.wav"));
            soundInstances.hat.push(new Audio("../app/sounds/XF_HatVinyl20.wav"));
        }

        // create instruments array so we can expand this later, add claps etc..

        $scope.instruments = [
            {title: 'kick'},
            {title: 'snare'},
            {title: 'hat'}
        ];

        $scope.presets = {};

        var numberOfBars = 16;

        function initPreset() {

            $scope.preset = {
                name: '',
                tempo: 120
            };

            $scope.preset.bars = [];

            for (var i = 0; i < numberOfBars; i++) {
                var bar = {
                    kick: {
                        selected: false
                    },
                    snare: {
                        selected: false
                    },
                    hat: {
                        selected: false
                    },
                    position: i
                };
                $scope.preset.bars.push(bar);
            }

        }

        initPreset();

        // variable tempo, quarter note === 500ms at 120 BPM

        $scope.tempo = $scope.preset.tempo;
        $scope.playing = false;
        $scope.$watch('tempo', function () {
            $scope.tempoRatio = 15000 / $scope.tempo;
        });

        // call runtime when playing

        $scope.playPattern = function () {
            $scope.playing = true;
            callRunTime();
        };

        // stop pattern

        $scope.stopPattern = function () {
            $scope.playing = false;
        };

        // check if audio is playing

        function isPlaying(audio) {
            return !audio.paused;
        }

        // small algorithm to pick different instances of the sound that is playing

        var index = 0;

        function playSound(sound) {
            if (!isPlaying(sound[index])) {
                sound[index].play();
                return;
            } else {
                if (index <= numberOfInstances) {
                    index++;
                    playSound(sound);
                } else {
                    index = 0;
                    playSound(sound);
                }
            }
        }

        // select pads to create a pattern

        $scope.toggleSelection = function (bar, instrument) {
            if (bar.hasOwnProperty(instrument.title)) {
                if (bar[instrument.title].hasOwnProperty('selected')) {
                    bar[instrument.title].selected = !bar[instrument.title].selected;
                } else {
                    bar[instrument.title].selected = true;
                }
            } else {
                bar[instrument.title] = {selected: true};
            }
        };

        $scope.barPosition = 0;

        function callRunTime() {
            $scope.preset.bars[$scope.barPosition].kick.selected ? playSound(soundInstances.kick) : null;
            $scope.preset.bars[$scope.barPosition].snare.selected ? playSound(soundInstances.snare) : null;
            $scope.preset.bars[$scope.barPosition].hat.selected ? playSound(soundInstances.hat) : null;
            if ($scope.barPosition < (numberOfBars - 1)) {
                $scope.barPosition = $scope.barPosition + 1;
            } else {
                $scope.barPosition = 0;
            }
            var promise = $timeout($scope.tempoRatio);
            if ($scope.playing === true) {
                return promise.then(function () {
                    callRunTime();

                });
            }
        }

        var z = 0;
        $scope.savePreset = function () {
            $scope.preset.tempo = $scope.tempo;
            $scope.presets['preset' + z] = angular.copy($scope.preset);
            z++;
            console.log(JSON.stringify($scope.presets));
        };

        $scope.clearPreset = function () {
           initPreset();
        };

        $scope.changePreset = function (preset) {
            $scope.preset = angular.copy(preset);
            $scope.tempo = preset.tempo;
        };

        // load presets, or get them from an external database

        $http.get('presets.json').then(function (res) {
             $scope.presets = res.data;
             z = Object.keys(res.data).length;
        });

    }]);