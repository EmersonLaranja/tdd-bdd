import { Task } from "../../../entities/task";
import { AddTask, AddTaskModel } from "../../../usecases";
import { HttpRequest, Validation } from "../../interfaces";
import { AddTaskController } from "./addTask";

interface SutTypes {
  sut: AddTaskController;
  addTaskStub: AddTask;
  validationStub: Validation;
}

const makeAddTask = (): AddTask => {
  class AddTaskStub implements AddTask {
    async add(task: AddTaskModel): Promise<Task> {
      return new Promise((resolve) => resolve(makeFakeTask()));
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
});
