import { UpdateTask } from "../../../usecases/updateTask";
import { HttpRequest, HttpResponse, Validation } from "../../interfaces";
import {
  noContent,
  serverError,
} from "../../presentations/api/httpResponses/httpResponses";
import { UpdateTaskController } from "./updateTask";

const makeUpdateTask = (): UpdateTask => {
  class UpdateTaskStub implements UpdateTask {
    async update(taskData: any): Promise<void | Error> {
      return Promise.resolve();
    }
  }
  return new UpdateTaskStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error | undefined {
      return;
    }
  }
  return new ValidationStub();
};

interface SutTypes {
  sut: UpdateTaskController;
  updateTaskStub: UpdateTask;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const updateTaskStub = makeUpdateTask();
  const validationStub = makeValidation();
  const sut = new UpdateTaskController(updateTaskStub, validationStub);
  return {
    sut,
    updateTaskStub,
    validationStub,
  };
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    id: "valid_id",
    title: "new_title",
    description: "new_description",
    date: "new_date",
  },
});

describe("UpdateTaskController", () => {
  test("Should return 204 on success", async () => {
    const { sut } = makeSut();

    const httpResponse: HttpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(noContent());
  });

  test("Should return 500 if UpdateTask throws", async () => {
    const { sut, updateTaskStub } = makeSut();
    jest.spyOn(updateTaskStub, "update").mockRejectedValueOnce(new Error());

    const httpResponse: HttpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should return 400 if validation fails", async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, "validate").mockReturnValueOnce(new Error());

    const httpResponse: HttpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new Error());
  });

  test("Should call UpdateTask with correct values when only part of the request is sent", async () => {
    const { sut, updateTaskStub } = makeSut();
    const updateSpy = jest.spyOn(updateTaskStub, "update");
    const httpRequest: HttpRequest = {
      body: {
        id: "valid_id",
        title: "new_title",
      },
    };
    await sut.handle(httpRequest);
    expect(updateSpy).toHaveBeenCalledWith({
      id: "valid_id",
      title: "new_title",
    });
  });

  test("Should call UpdateTask with correct values when full request is sent", async () => {
    const { sut, updateTaskStub } = makeSut();
    const updateSpy = jest.spyOn(updateTaskStub, "update");
    const httpRequest: HttpRequest = {
      body: {
        id: "valid_id",
        title: "new_title",
        description: "new_description",
        date: "new_date",
      },
    };
    await sut.handle(httpRequest);
    expect(updateSpy).toHaveBeenCalledWith({
      id: "valid_id",
      title: "new_title",
      description: "new_description",
      date: "new_date",
    });
  });
});
