

const StatusCode = {
    OK: 200,
    CREATED: 201
}
const ReasonStatusCode = {
    OK: 'Success',
    CREATED: 'Created!'
}


class SuccessResponce {
    constructor({ message, statusCode = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK, metadata = {} }) {
        this.message = !message ? reasonStatusCode : message
        this.status = statusCode
        this.metadata = metadata
    }

    send(res, headers = {}) {
        return res.status(this.status).json(this)
    }
}

class OK extends SuccessResponce {
    constructor({ message, statusCode }) {
        super(message, statusCode)
    }
}

class CREATED extends SuccessResponce {
    constructor({ options = {}, message, statusCode = StatusCode.CREATED, reasonStatusCode = StatusCode.CREATED, metadata }) {
        super({ message, statusCode, reasonStatusCode, metadata })
        this.options = options

    }
}

export {
    OK, CREATED, SuccessResponce
}