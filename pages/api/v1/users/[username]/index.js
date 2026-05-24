import "dotenv/config";
import { createRouter } from "next-connect";
import controller from "infra/controller";
import modelUser from "models/user.js";
export const router = createRouter();

router.get(getUser);
router.patch(updateUser);

export default router.handler(controller.errorHandlers);

async function getUser(req, res) {
  const username = req.query.username;
  const userFound = await modelUser.findOneByUsername(username);
  return res.status(200).json(userFound);
}

async function updateUser(req, res) {
  const username = req.query.username;
  const userInputValues = req.body;

  const updatedUser = await modelUser.update(username, userInputValues);

  return res.status(200).json(updatedUser);
}
