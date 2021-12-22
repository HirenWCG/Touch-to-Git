const cron = require("node-cron");
cron.schedule("*/15 * * * * *", async function () {
  fileProcess();
});
