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
            soundInstances.kick.push(new Audio("data:audio/mp3;base64,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"));
            soundInstances.snare.push(new Audio("data:audio/mp3;base64,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qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7kkTKDyMWP7+pAzRyXgk4BQxi9MAAAAAAAAAhSK7MrBCM+aqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo="));
            soundInstances.hat.push(new Audio("data:audio/mp3;base64,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iclAEGNE3RsFcvklOkvyLEJQLCJ6EpZpUOBgi4nAQozxDVScoQjCCBZUrAFFo4oru3Lx+SQhRpEpLgy4CTiWvPNI0/8yclrPOc5bHsKYr4oKuccx/HS5Vf83UTD/v50tTEFNRTMuOTkuM1VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//uSZOIC9RtYUvHvFPIAAA0gAAABE+kJQIew3ggAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQAYQADXWnmVsC62GUYSkQEk6klLFTSsxYenXnVw4qRHMr45TtUCWZX0JjJaMI3EFEjG6dAcwZpKEMOsWEKoYYzA6gvQxiYF7RijShxFxJUO0bI8AbxASsMphgRzIqlQfwpAsPZ4227hklPFRNHI4HZKiXXrx0mfdteuTk2u7B7rR9ZFYCI/pFugU4CyISF60qIhJUxBTUUzLjk5LjNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7kmSKD/SUPsdBj2VAAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU="));
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