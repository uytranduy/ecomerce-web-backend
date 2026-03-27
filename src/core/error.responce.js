import StatusCode from '../utils/statusCode.js'
import ReasonPhrase from '../utils/reasonPhrases.js'

class ErrorResponce extends Error {
    constructor(message, status) {
        super(message)
        this.status = status

    }
}

class ConflictRequestError extends ErrorResponce {
    constructor(message = ReasonPhrase.CONFLICT, statusCode = StatusCode.CONFLICT) {
        super(message, statusCode)
    }
}

class BadRequestError extends ErrorResponce {
    constructor(message = ReasonPhrase.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode)
    }
}
class AuthFailureError extends ErrorResponce {
    constructor(message = ReasonPhrase.UNAUTHORIZED, statusCode = StatusCode.UNAUTHORIZED) {
        super(message, statusCode)
    }
}
class NotFound extends ErrorResponce {
    constructor(message = ReasonPhrase.NOT_FOUND, statusCode = StatusCode.NOT_FOUND) {
        super(message, statusCode)
    }
}
class ForbiddenErorr extends ErrorResponce {
    constructor(message = ReasonPhrase.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode)
    }
}
export {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    NotFound,
    ForbiddenErorr
}