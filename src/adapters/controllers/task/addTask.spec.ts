import { Task } from "../../../entities/task";
import { AddTaskModel, AddTask } from "../../../usecases";
import { HttpRequest, Validation } from "../../interfaces";
import { MissingParamError, ServerError } from "../../presentations/api/errors";
import {
  badRequest,
  created,
  serverError,
} from "../../presentations/api/httpResponses/httpResponses";
import { AddTaskController } from "./addTask";

interface SutTypes {
  sut: AddTaskController;
  addTaskStub: AddTask;
  validationStub: Validation;
}

const makeAddTask = (): AddTask => {
  class AddTaskStub implements AddTask {
    async add(task: AddTaskModel): Promise<Task> {
      return Promise.resolve(makeFakeTask());
    }
  }
  return new AddTaskStub();
};
const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null as any;
    }
  }
  return new ValidationStub();
};

const makeFakeTask = (): Task => ({
  id: "valid_id",
  title: "valid_title",
  description: "valid_description",
  date: "valid_date",
});

const makeFakeRequest = (): HttpRequest => ({
  body: {
    title: "any_title",
    description: "any_description",
    date: "any_date",
  },
});

const makeSut = (): SutTypes => {
  const addTaskStub = makeAddTask();
  const validationStub = makeValidation();
  const sut = new AddTaskController(addTaskStub, validationStub);
  return { sut, addTaskStub, validationStub };
};

describe("AddTask Controller", () => {
  test("Should call AddTask with correct values", async () => {
    const { sut, addTaskStub } = makeSut();
    const addSpy = jest.spyOn(addTaskStub, "add");
    await sut.handle(makeFakeRequest());
    expect(addSpy).toHaveBeenCalledWith({
      title: "any_title",
      description: "any_description",
      date: "any_date",
    });
  });

  test("Should return 500 if AddTask throws", async () => {
    const { sut, addTaskStub } = makeSut();
    jest.spyOn(addTaskStub, "add").mockRejectedValueOnce(new Error());

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError()));
  });

  test("Should return 200 if an valid data is provided", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(created(makeFakeTask()));
  });

  test("Should call Validation with correct value", async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, "validate");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});
