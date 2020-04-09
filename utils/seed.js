const db = require("./db");
const fs = require("fs").promises;
const path = require("path");

const initDb = async () => {
  try {
    await seed("init");
    await seed("triggers");
  } catch (e) {
    console.log(e);
    return false;
  }

  return true;
};

const seed = async filename => {
  const buffer = await fs.readFile(
    path.resolve(__dirname, "seeds", filename + ".sql")
  );
  const contents = buffer.toString();

  await db.none(contents);
};

module.exports = initDb;
