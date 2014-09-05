var _ = require('underscore')._;

function RouteError(message) {
    this.name = "RouteError";
    this.message = message || "Undefined RouteError";
}
RouteError.prototype = new Error();
RouteError.prototype.constructor = RouteError;

function QueryValidationError(message) {
    this.name = "QueryValidationError";
    if (message && !(_.isString(message))) {
        message = 'Validation error: ' + _.map(message, function (field) {
            return field.message;
        }).join('; ');
    }
    this.message = message && ((message !== '') ? message : "Invalid request data");
}
QueryValidationError.prototype = new RouteError();
QueryValidationError.prototype.constructor = QueryValidationError;

function StaffNotFoundError(message) {
    this.name = "StaffNotFoundError";
    this.message = message || "Staff not found";
}
StaffNotFoundError.prototype = new RouteError();
StaffNotFoundError.prototype.constructor = StaffNotFoundError;

function UserNotFoundError(message) {
    this.name = "UserNotFoundError";
    this.message = message || "User not found";
}
UserNotFoundError.prototype = new RouteError();
UserNotFoundError.prototype.constructor = UserNotFoundError;

function ExpireError(message) {
    this.name = "ExpireError";
    this.message = message || "Token has expired";
}
ExpireError.prototype = new RouteError();
ExpireError.prototype.constructor = ExpireError;


// internal error
function InternalError(message) {
    this.name = "InternalError";
    this.message = message || "Server failure";
}

InternalError.prototype = new Error();
InternalError.prototype.constructor = InternalError;

module.exports.RouteError = RouteError;
module.exports.QueryValidationError = QueryValidationError;
module.exports.StaffNotFoundError = StaffNotFoundError;
module.exports.UserNotFoundError = UserNotFoundError;
module.exports.ExpireError = ExpireError;
module.exports.InternalError = InternalError;