import { oc } from 'ts-optchain'

class UniversalError extends Error {
    state: Object = {}
    amount = 0
    universal = true
    status = 400
    message = 'request/invalid'

    constructor(errors?: { key: string, message: string, }[], message = 'request/invalid', status = 400) {
        super(message)
        this.status = status
        this.message = message

        if (oc(errors).length > 0) {
            errors.forEach(error => {
                this.addError(error.key, error.message)
            });
        }
    }

    addError(key: string, message: string) {
        this.state[key] = message
        this.amount++
    }
}

export default UniversalError
