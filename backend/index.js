const app = require("./app");
const port = process.env.PORT || 5000;

const cron = require("cron");

const job = new cron.CronJob("0 16 * * *", function () {
  console.info("Tarea cron ejecutada.");
});

job.start();

app.listen(port, () => {
  console.info(
    `Server has been started on port ${port} in ${process.env.NODE_ENV} mode.`
  );
});
