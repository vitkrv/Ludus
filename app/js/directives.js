appDirectives.directive('sortArrow', [
    function () {
        return function (scope, element, attr) {
            scope.$watch(attr.sortArrow, function (value) {
                if (value)
                    element.text(' ▾');
                else
                    element.text(' ▴');
            });
        };
    }]);
appDirectives.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

appDirectives.directive('ukraineMap', ['$compile', '$window',
    function ($compile, $window) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var mapScale = 4.35;
                var mapRatio = .65;
                var width = 855;
                var height = width * mapRatio;

                var projection = d3.geo.albers()
                    .center([0, 48.5])
                    .rotate([-31.5, 0])
                    .parallels([45, 50])
                    .scale(width * mapScale)
                    .translate([width / 2, height / 2]);

                var color = d3.scale.threshold()
                    .domain([10, 20, 30, 50])
                    .range(['#F7CB6D', '#C4AA73', '#899BAD', '#739AC4', '#2E5C8A'])

                var svg = d3.select(element[0]).append('svg')
                    .attr('width', width)
                    .attr('height', height);

                var countriesPath;
                var regionsPath;

                d3.json('/img/ukraine.json', function (error, data) {

                        var regions = topojson.feature(data, data.objects['ukraine-regions']);

                        regionsPath = d3.geo.path()
                            .projection(projection);

                        svg.selectAll('.region')
                            .data(regions.features)
                            .enter().append('path')
                            .attr('ng-click', function (d) {
                                return "regionClick('" + d.id + "')";
                            })
                            .style("cursor", "pointer")
                            .style("stroke-opacity", .5)
                            .on("mouseover", function () {
                                this.style.stroke = "black";
                            })
                            .on("mouseout", function () {
                                this.style.stroke = "none";
                            })
                            .attr('d', regionsPath)
                            .attr('class', function (d) {
                                var className = '';
                                for (var j = 0; j < scope.tabs.length; j++) {
                                    if (d.id == scope.tabs[j].id) {
                                        className = 'pubstomps';
                                        break;
                                    }
                                }
                                return 'region ' + className;
                            });

                        svg.selectAll('.pubstomps')
                            .on("mouseover", function () {
                                d3.select(this).transition()
                                    .style("fill", "#450000")
                                    .duration(500);
                            })
                            .on("mouseout", function () {
                                d3.select(this).transition()
                                    .style("fill", " #880000")
                                    .duration(500);
                            });

                        var ukraineRegionBoundaries = topojson.mesh(data,
                            data.objects['ukraine-regions'], function (a, b) {
                                return a !== b
                            });

                        svg.append('path')
                            .datum(ukraineRegionBoundaries)
                            .attr('d', regionsPath)
                            .attr('class', 'region-boundary')

                        var ukraineBoundaries = topojson.mesh(data,
                            data.objects['ukraine-regions'], function (a, b) {
                                return a === b
                            });

                        svg.append('path')
                            .datum(ukraineBoundaries)
                            .attr('d', regionsPath)
                            .attr('class', 'ukraine-boundary')

                        d3.select($window).on('resize', resize);
                        angular.element($window).trigger('resize');
                        resize();

                        element.removeAttr("ukraine-map");
                        $compile(element[0])(scope);
                    }
                )
                ;

                function resize() {
                    width = parseInt(d3.select(element[0]).style('width'));
                    height = width * mapRatio;

                    svg
                        .style('width', width + 'px')
                        .style('height', height + 'px');

                    svg.selectAll('.country,.country-boundary').attr('d', countriesPath);
                    svg.selectAll('.region,.region-boundary,.ukraine-boundary').attr('d', regionsPath);

                    projection
                        .scale(width * mapScale)
                        .translate([width / 2, height / 2]);
                }
            }
        }
    }])
;