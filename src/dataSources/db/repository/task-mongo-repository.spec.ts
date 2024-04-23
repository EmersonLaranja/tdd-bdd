import { MongoManager } from "../../config/mongoManager";
import { TaskMongoRepository } from "./taskMongoRepository";

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
});
