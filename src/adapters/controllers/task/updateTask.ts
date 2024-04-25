import { DeleteTask } from "../../../usecases/deleteTask";
import { UpdateTask } from "../../../usecases/updateTask";
import {
  Controller,
  Validation,
  HttpRequest,
  HttpResponse,
} from "../../interfaces";

import {
  badRequest,
  noContent,
  serverError,
} from "../../presentations/api/httpResponses/httpResponses";

export class UpdateTaskController implements Controller {
  constructor(
    private readonly updateTask: UpdateTask,
    private readonly validation: Validation
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id, title, description, date } = httpRequest.body;

      const isValid = this.validation.validate({
        id,
        title,
        description,
        date,
      });
      if (isValid) {
        return badRequest(isValid);
      }

      const error = await this.updateTask.update({
        id,
        title,
        description,
        date,
      });
      if (error) {
        return badRequest(error);
      }

      return noContent();
    } catch (error: any) {
      return serverError(error);
    }
  }
}
