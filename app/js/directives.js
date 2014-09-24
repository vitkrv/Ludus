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
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});