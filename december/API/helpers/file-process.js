const cron = require("node-cron");
const csvtojson = require("csvtojson");
const userAuthModel = require("../models/userModel");
const filesModel = require("../models/filesModel");

module.exports = function (time) {
  cron.schedule(time, async function () {
    var entryControl = true;
    if (entryControl) {
      entryControl = false;
      let allFiles = await filesModel
        .find({ status: "pending" })
        .limit(50)
        .lean();
      for (let file of allFiles) {
        console.log(
          "fffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        );
        if (file) {
          await filesModel.updateOne(
            { _id: file._id },
            { $set: { status: "inprogress" } }
          );
          socket.emit("inprogress", "status inprogress");
          const csvFilePath = "./public/importFile/" + file.name;
          let headerObj = {};
          if (file.noHeader == "true") {
            headerObj = { noheader: true };
          }
          // csv to JSON data
          const jsonArray = await csvtojson(headerObj).fromFile(csvFilePath);
          if (jsonArray) {
            let totalRecords = 0;
            let duplicates = 0;
            let discarded = 0;
            let totalUploaded = 0;
            let mappedArray = [];
            let csvDublicates = {};
            let valuesOfObject = Object.values(file.fieldMappingObject);
            let keysOfObject = Object.keys(file.fieldMappingObject);
            // for loop for array of json data
            for (let data = 0; data < jsonArray.length; data++) {
              totalRecords++;
              // for loop used for find value of mapped Object
              for (let key = 0; key < valuesOfObject.length; key++) {
                let jsonObj = jsonArray[data];
                let mapObj = valuesOfObject[key];
                let keyOfMapObject = keysOfObject[key];
                file.fieldMappingObject[keyOfMapObject] = jsonObj[mapObj];
              }
              // find duplicate recoed in csv file
              if (
                csvDublicates[file.fieldMappingObject.email] ||
                csvDublicates[file.fieldMappingObject.mobile]
              ) {
                duplicates++;
              } else {
                let mobile = file.fieldMappingObject.email;
                let email = file.fieldMappingObject.mobile;
                csvDublicates[mobile] = 1;
                csvDublicates[email] = 1;
                let duplicateUser = await userAuthModel.findOne({
                  $or: [
                    { email: file.fieldMappingObject.email },
                    { mobile: file.fieldMappingObject.mobile },
                  ],
                });
                // email validation Reg-Ex
                var emailRegExp = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

                if (duplicateUser) {
                  duplicates++;
                } else {
                  // Final Object
                  let valuesOfObj = Object.values(file.fieldMappingObject);
                  let finalObj = {};
                  for (let map = 0; map < keysOfObject.length; map++) {
                    finalObj[keysOfObject[map]] = valuesOfObj[map];
                  }
                  mappedArray.push(finalObj);
                  totalUploaded++;
                }
              }
            }

            // update file records like totalUploads, duplicates and other
            setTimeout(async function () {
              await filesModel.updateOne(
                { _id: file._id },
                {
                  $set: {
                    totalRecords: totalRecords,
                    duplicates: duplicates,
                    discarded: discarded,
                    totalUploaded: totalUploaded,
                    status: "success",
                  },
                }
              );
              // insert all clean data into database
              await userAuthModel.insertMany(mappedArray);
              socket.emit("success", {
                msg: "file executed successfully...",
                file: file.name,
              });

              // send success respose
              console.log({
                status: "success",
                code: 200,
                allCounter: {
                  totalRecords,
                  duplicates,
                  discarded,
                  totalUploaded,
                },
                newAddedData: mappedArray,
              });
            }, 12000);
          } else {
            // Send Error response
            console.log({
              status: "error",
              code: 404,
              message: "File not convert CSV to JSON",
            });
          }
        } else {
          // Send Error response
          console.log({
            status: "error",
            code: 404,
            message: "File not in Database",
          });
        }
      }
      entryControl = true;
    } else {
      console.log({
        status: "error",
        code: 404,
        message: "already other file in processing mode...",
      });
    }
  });
};
