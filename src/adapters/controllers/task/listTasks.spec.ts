import { Task } from "../../../entities/task";
import { ListTasks } from "../../../usecases/listTasks";
import { ServerError } from "../../presentations/api/errors";
import {
  noContent,
  ok,
  serverError,
} from "../../presentations/api/httpResponses/httpResponses";
import { ListTasksController } from "./listTasks";

const makeFakeTasks = (): Task[] => {
  return [
    {
      id: "any_id",
      title: "any_title",
      description: "any_description",
      date: "any_date",
    },
    {
      id: "other_id",
      title: "other_title",
      description: "other_description",
      date: "other_date",
    },
  ];
};

const makeListTasks = (): ListTasks => {
  class ListTasksStub implements ListTasks {
    async list(): Promise<Task[]> {
      return Promise.resolve(makeFakeTasks());
    }
  }

  return new ListTasksStub();
};

interface SutTypes {
  sut: ListTasksController;
  listTasksStub: ListTasks;
}

const makeSut = (): SutTypes => {
  const listTasksStub = makeListTasks();
  const sut = new ListTasksController(listTasksStub);

  return {
    sut,
    listTasksStub,
  };
};

describe("ListTasks Controller", () => {
  test("Should return 204 if ListTasks returns empty", async () => {
    const { sut, listTasksStub } = makeSut();
    jest.spyOn(listTasksStub, "list").mockReturnValueOnce(Promise.resolve([]));
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(noContent());
  });

  test("Should return 200 if ListTasks returns tasks", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(ok(makeFakeTasks()));
  });

  test("Should call ListTasks", async () => {
    const { sut, listTasksStub } = makeSut();
    const listSpy = jest.spyOn(listTasksStub, "list");
    await sut.handle({});
    expect(listSpy).toHaveBeenCalled();
  });
  test("Should return 500 if ListTasks throws", async () => {
    const { sut, listTasksStub } = makeSut();
    jest.spyOn(listTasksStub, "list").mockRejectedValueOnce(new Error());

    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(serverError(new ServerError()));
  });
});
