import { noContent } from "../../presentations/api/httpResponses/httpResponses";
import { ListTasksController } from "./listTasks";

describe("ListTasks Controller", () => {
  test("Should return 204 if ListTasks returns empty", async () => {
    const sut = new ListTasksController();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(noContent());
  });
});
