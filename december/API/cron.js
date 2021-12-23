const cron = require("node-cron");

if (config.scheduler.isActive) {
  cron.schedule(config.scheduler.files.fileProcess.time, async function () {
    console.log("cron");
    fileProcess();
  });

  cron.schedule(config.scheduler.files.sendAllMail.time, async function () {
    console.log("mail send");
  });
} else {
  console.log("cron is off...");
}
