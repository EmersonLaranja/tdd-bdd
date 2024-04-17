import { ListTasks } from "../../../usecases/listTasks";
import { Controller, HttpRequest, HttpResponse } from "../../interfaces";
import {
  noContent,
  ok,
  serverError,
} from "../../presentations/api/httpResponses/httpResponses";

export class ListTasksController implements Controller {
  constructor(private readonly listTasks: ListTasks) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.listTasks.list();
      return result.length > 0 ? ok(result) : noContent();
    } catch (error: any) {
      return serverError(error);
    }
  }
}
