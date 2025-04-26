import { FastifyInstance } from "fastify";

import { createStreamPresetController } from "./controllers/stream-presets/create";
import { deleteStreamPresetController } from "./controllers/stream-presets/delete";
import { listStreamPresetController } from "./controllers/stream-presets/list";
import { updateStreamPresetController } from "./controllers/stream-presets/update";
import { listUsersController } from "./controllers/users/list";

export const registerRoutes = (app: FastifyInstance) => {
  app.get("/users", listUsersController);

  app.get("/stream-presets", listStreamPresetController);
  app.post("/stream-presets", createStreamPresetController);
  app.delete("/stream-presets/:id", deleteStreamPresetController);
  app.put("/stream-presets/:id", updateStreamPresetController);
};
