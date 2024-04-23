import request from "supertest";
import app from "../config/app";
import { MongoManager } from "../../../../dataSources";

describe("Task Routes", () => {
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

  test("Should return 204 if list is empty", async () => {
    await request(app).get("/api/tasks").expect(204);
  });
});
