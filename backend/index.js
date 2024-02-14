const cronEmail = require("./cron");
const app = require("./app");
const port = process.env.PORT || 5000;

const cron = require("cron");

const job = new cron.CronJob("0 16 * * *", function () {
  cronEmail.EmailService
    .then(response => console.info(response))
    .catch(errors => console.error(errors))
});

job.start();

app.listen(port, () => {
  console.info(
    `Server has been started on port ${port} in ${process.env.NODE_ENV} mode.`
  );
});
