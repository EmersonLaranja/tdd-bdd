import { ObjectId } from "mongodb";
import { UpdateTaskModel } from "../../../usecases/updateTask";
import { MongoManager } from "../../config/mongoManager";
import { TaskMongoRepository } from "./taskMongoRepository";
import {
  InvalidParamError,
  NotFoundError,
} from "../../../adapters/presentations/api/errors";

describe("Task MongoDB Repository", () => {
  const client = MongoManager.getInstance();
  beforeAll(async () => {
    await client.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await client.disconnect();
  });

  beforeEach(async () => {
    await client.getCollection("tasks").deleteMany({});
  });

  const makeSut = (): TaskMongoRepository => {
    return new TaskMongoRepository();
  };

  test("Should return a task on success", async () => {
    const sut = makeSut();
    const task = await sut.add({
      title: "any_title",
      description: "any_description",
      date: "any_date",
    });
    expect(task).toBeTruthy();
    expect(task.id).toBeTruthy();
    expect(task.title).toBe("any_title");
    expect(task.description).toBe("any_description");
    expect(task.date).toBe("any_date");
  });
  test("Should list tasks on success", async () => {
    const sut = makeSut();
    await sut.add({
      title: "any_title",
      description: "any_description",
      date: "any_date",
    });
    const tasks = await sut.list();
    expect(tasks).toBeTruthy();
    expect(tasks.length).toBe(1); //quantidade correta
    expect(tasks[0].title).toBe("any_title"); //dado correto
  });

  test("Should list empty", async () => {
    const sut = makeSut();

    const tasks = await sut.list();
    expect(tasks).toBeTruthy();
    expect(tasks.length).toBe(0);
  });

  // ----------------------
  test("Should update task on success", async () => {
    const sut = makeSut();
    const task = await sut.add({
      title: "old_title",
      description: "old_description",
      date: "old_date",
    });

    const updateData: UpdateTaskModel = {
      id: task.id,
      title: "new_title",
      description: "new_description",
      date: "new_date",
    };

    await sut.update(updateData);

    const updatedTask = await client
      .getCollection("tasks")
      .findOne({ _id: new ObjectId(task.id) });

    expect(updatedTask).toBeTruthy();
    expect(updatedTask?.title).toBe("new_title");
    expect(updatedTask?.description).toBe("new_description");
    expect(updatedTask?.date).toBe("new_date");
  });

  test("Should return InvalidParamError if task id is invalid", async () => {
    const sut = makeSut();
    const updateData: UpdateTaskModel = {
      id: "invalid_id",
      title: "new_title",
      description: "new_description",
      date: "new_date",
    };

    const error = await sut.update(updateData);

    expect(error).toEqual(new InvalidParamError("invalid_id"));
  });

  test("Should return NotFoundError if no task is found for update", async () => {
    const sut = makeSut();
    const updateData: UpdateTaskModel = {
      id: new ObjectId().toHexString(),
      title: "new_title",
      description: "new_description",
      date: "new_date",
    };

    const error = await sut.update(updateData);

    expect(error).toEqual(new NotFoundError("task"));
  });
});
