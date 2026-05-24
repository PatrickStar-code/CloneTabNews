import bcryptjs from "bcryptjs";

async function hash(password) {
  const rounds = getNumberOfROunds();
  let hash = await bcryptjs.hash(password, rounds);
  return hash;
}

function getNumberOfROunds() {
  let rounds = 1;

  if (process.env.NODE_ENV === "production") {
    rounds = 14;
  }

  return rounds;
}
async function compare(providedPassword, storedPassword) {
  return bcryptjs.compare(providedPassword, storedPassword);
}

const password = {
  hash,
  compare,
};

export default password;
