import { FastifyInstance } from "fastify";

import { createOrganizationController } from "./controllers/organizations/create";
import { listOrganizationsController } from "./controllers/organizations/list";
import { updateOrganizationController } from "./controllers/organizations/update";
import { listUsersController } from "./controllers/users/list";

export const registerRoutes = (app: FastifyInstance) => {
  app.get("/users", listUsersController);

  // orgs
  app.get("/organizations", listOrganizationsController);
  app.post("/organizations", createOrganizationController);
  app.put("/organizations/:id", updateOrganizationController);

  // stream-presets
  // app.get("/stream-presets", listStreamPresetController);
  // app.post("/stream-presets", createStreamPresetController);
  // app.delete("/stream-presets/:id", deleteStreamPresetController);
  // app.put("/stream-presets/:id", updateStreamPresetController);
};
