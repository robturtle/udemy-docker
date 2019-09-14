const keys = require("./keys");
const redis = require("redis");

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const sub = redisClient.duplicate();

function fib(index) {
  if (index < 2) {
    return 1;
  }
  let [a, b] = [1, 1]
  for (let i = 2; i <= index; i++) {
    b = a + b;
    a = b - a;
  }
  return b;
}

sub.on("message", (_channel, message) => {
  const val = fib(parseInt(message));
  redisClient.hset("values", message, val);
});
sub.subscribe("insert");
