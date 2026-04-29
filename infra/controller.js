import { InternalServerError, MethodNotAllowedError } from "infra/errors.js";

function onMatchHandler(req, res) {
  const error = new MethodNotAllowedError();
  res.status(error.statusCode).json(error);
}

function onErrorHandler(error, req, res) {
  if (error.message?.includes("Another migration is already running")) {
    return res.status(200).json([]);
  }

  const publicErrorObject = new InternalServerError({
    cause: error,
    statusCode: error.statusCode,
  });

  res.status(publicErrorObject.statusCode).json({ error: publicErrorObject });
}

const controller = {
  errorHandlers: {
    onNoMatch: onMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
