const keys = require("./keys");

// Express
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres
const { Pool } = require("pg");
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});
pgClient.on("error", console.error);

pgClient
  .query("CREATE TABLE IF NOT EXISTS indexes (number INT)")
  .catch(console.error);

// Redis
const redis = require("redis");
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();

// Express routes
app.get("/", (req, res) => {
  res.send("Hi");
});

app.get("/values", async (req, res) => {
  redisClient.hgetall("values", (err, values) => {
    res.send(values);
  });
});

app.get("/indexes", async (req, res) => {
  const indexes = await pgClient.query("SELECT * FROM indexes");
  res.send(indexes.rows);
});

app.post("/indexes", async (req, res) => {
  const index = +req.body.index;
  if (index > 40) {
    return res.status(422).send("Index too high");
  }

  redisPublisher.publish("insert", index);
  pgClient.query("INSERT INTO indexes(number) VALUES($1)", [index]);

  res.sendStatus(202);
});

app.listen(5000, err => {
  if (err) {
    console.error(err);
  } else {
    console.log("Listening to 5000");
  }
});
