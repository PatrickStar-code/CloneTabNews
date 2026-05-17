import "dotenv/config";
import { createRouter } from "next-connect";
import controller from "infra/controller";
import modelUser from "models/user.js";
export const router = createRouter();

router.get(getUser);

export default router.handler(controller.errorHandlers);

async function getUser(req, res) {
  const username = req.query.username;
  const userFound = await modelUser.findOneByUsername(username);
  return res.status(200).json(userFound);
}
