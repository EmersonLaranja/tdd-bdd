import { Task } from "../../entities/task";
import { ListTasksRepository } from "../../usecases/repository/listTasksRepository";
import { DbListTasks } from "./dbListTasks";

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

describe("DbListTasks", () => {
  /*    queremos testar a integração entre os componentes
a integração do meu repositório que lista uma tarefa com quem o utiliza, que é o mongo
*/
  test("Should call ListTasksRepository", async () => {
    class ListTasksRepositoryStub implements ListTasksRepository {
      list(): Promise<Task[]> {
        return Promise.resolve(makeFakeTasks());
      }
    }
    const listTasksRepositoryStub = new ListTasksRepositoryStub();
    const listSpy = jest.spyOn(listTasksRepositoryStub, "list");
    const sut = new DbListTasks(listTasksRepositoryStub);
    await sut.list();
    expect(listSpy).toHaveBeenCalled();
  });
});
