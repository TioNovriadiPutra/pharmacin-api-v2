import { ValidationException } from "@ioc:Adonis/Core/Validator";

class CustomValidationException extends ValidationException {
  constructor(flashToSession: boolean, messages?: any) {
    super(flashToSession, messages);
  }

  handle(error, { response }) {
    response.badRequest({
      error: {
        message: error.messages.errors,
        code: 400,
      },
    });
  }
}

export default CustomValidationException;
