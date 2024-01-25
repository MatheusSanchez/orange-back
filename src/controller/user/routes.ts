import { FastifyInstance } from "fastify";
import { getUserById } from "./getUserById";
import { getUserByEmail } from "./getUserByEmail";
import { registerUser } from "./registerUser";

export async function userRoutes(app: FastifyInstance) {
  app.post("/users", registerUser);
  app.get("/user/:id", getUserById);
  app.get("/user", getUserByEmail);
}
