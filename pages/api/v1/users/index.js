import "dotenv/config";
import { createRouter } from "next-connect";
import controller from "infra/controller";
import modelUser from "models/user.js";
export const router = createRouter();

router.post(postMigrations);

export default router.handler(controller.errorHandlers);

async function postMigrations(req, res) {
  const userInputValues = req.body;
  const newUser = await modelUser.createUser(userInputValues);
  return res.status(201).json(newUser);
}
