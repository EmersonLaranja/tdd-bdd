import { Task } from "../../../entities/task";
import { AddTask, AddTaskModel } from "../../../usecases";
import { Validation } from "../../interfaces";
import { AddTaskController } from "./addTask";

const makeAddTask = (): AddTask => {
  class AddTaskStub implements AddTask {
    async add(task: AddTaskModel): Promise<Task> {
      return new Promise((resolve) =>
        resolve({
          id: "any_id",
          title: "any_title",
          description: "any_description",
          date: "30/06/2024",
        })
      );
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

describe("AddTask Controller", () => {
  test("Deve chamar AddTask com valores corretos", async () => {
    const httpRequest = {
      body: {
        title: "any_title",
        description: "any_description",
        date: "30/06/2024",
      },
    };
    const addTaskStub = makeAddTask();
    const validationStub = makeValidation();
    const addTaskControllerStub = new AddTaskController(
      addTaskStub,
      validationStub
    );

    const httpResponse = await addTaskControllerStub.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(201);
    expect(httpResponse.body.title).toBe("any_title");
    expect(httpResponse.body.description).toBe("any_description");
    expect(httpResponse.body.date).toBe("30/06/2024");
    expect(httpResponse).toHaveBeenCalledWith({
      title: "any_title",
      description: "any_description",
      date: "30/06/2024",
    });
  });
});
