import { Controller, HttpRequest, HttpResponse } from "../../interfaces";
import { noContent } from "../../presentations/api/httpResponses/httpResponses";

export class ListTasksController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return await noContent();
  }
}
