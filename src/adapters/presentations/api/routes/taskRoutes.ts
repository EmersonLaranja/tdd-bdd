import { Router } from "express";
import { expressRouteAdapter } from "../../../expressRouteAdapter";
import {
  addTaskControllerFactory,
  deleteTaskControllerFactory,
} from "../../../factories";
import { listTasksControllerFactory } from "../../../factories/listTasksControllerFactory";

export default (router: Router): void => {
  router.post("/tasks", expressRouteAdapter(addTaskControllerFactory()));
  router.delete("/tasks", expressRouteAdapter(deleteTaskControllerFactory()));
  router.get("/tasks", expressRouteAdapter(listTasksControllerFactory()));
};
