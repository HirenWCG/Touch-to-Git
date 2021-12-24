//global configurations
global.config = require("./config/config.json");
const fs = require("fs");

if (config.scheduler.isActive) {
  for (let inx in config.scheduler.files) {
    require("./helpers/" + config.scheduler.files[inx].file)(
      config.scheduler.files[inx].time
    );
  }
} else {
  console.log("cron is off...");
}
