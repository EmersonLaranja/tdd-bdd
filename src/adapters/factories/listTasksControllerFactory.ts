import {
  LogErrorMongoRepository,
  TaskMongoRepository,
} from "../../dataSources";
import { DbListTasks } from "../../dataSources/db/dbListTasks";
import { ListTasksController } from "../controllers/task/listTasks";
import { LogErrorControllerDecorator } from "../decorators/logErrorControllerDecorator";

export const listTasksControllerFactory = () => {
  const taskMongoRepository = new TaskMongoRepository();
  const dbListTask = new DbListTasks(taskMongoRepository);

  const taskController = new ListTasksController(dbListTask);

  const logErrorMongoRepository = new LogErrorMongoRepository();
  return new LogErrorControllerDecorator(
    taskController,
    logErrorMongoRepository
  );
};
