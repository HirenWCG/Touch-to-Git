const userEventHandler = function () {
  this.init = function () {
    this.userForm();
    this.userLogin();
    this.exportCSV();
    this.userLogout();
    this.uploadCSV();
    this.getMapData();
    this.addNewField();
  };

  // user registration AJAX call
  this.userForm = function () {
    // validation for add user
    $("#formid").validate({
      rules: {
        name: "required",
        email: "required",
        mobile: "required",
        password: {
          required: true,
          minlength: 6,
        },
      },
      messages: {
        name: "Name is required",
        email: "Email is required",
        mobile: "Mobile is required",
        password: {
          password: "Password is required",
          minlength: "Password must be at least 6 characters long",
        },
      },

      // errorPlacement Section
      errorPlacement: function (error, element) {
        if (element.attr("id") == "nameid") {
          error.insertAfter(".name");
        } else if (element.attr("id") == "emailid") {
          error.insertAfter(".email");
        } else if (element.attr("id") == "mobileid") {
          error.insertAfter(".mobile");
        } else if (element.attr("id") == "passwordid") {
          error.insertAfter(".password");
        } else {
          error.insertAfter(element);
        }
      },

      // submitHandler Section
      submitHandler: function (form, event) {
        event.preventDefault();
        const formData = {
          name: $("#name").val(),
          email: $("#email").val(),
          mobile: $("#mobile").val(),
          password: $("#password").val(),
        };

        // ajax call
        $.ajax({
          type: "POST",
          url: "/api/addUser",
          data: formData,
        }).done(function (data) {
          console.log("data is : ", data);
        });
      },
    });
  };

  // userLogin AJAX call
  this.userLogin = function () {
    //validation for login form
    $("#loginForm").validate({
      rules: {
        name: "required",
        password: "required",
      },
      messages: {
        name: "Name/Email/Mobile is required",
        password: "Password is required",
      },

      // errorPlacement Section
      errorPlacement: function (error, element) {
        if (element.attr("id") == "nameid") {
          error.insertAfter(".name");
        } else if (element.attr("id") == "passwordid") {
          error.insertAfter(".password");
        } else {
          error.insertAfter(element);
        }
      },

      // submitHandler Section
      submitHandler: function (form, event) {
        event.preventDefault();
        const formData = {
          name: $("#name").val(),
          password: $("#password").val(),
        };
        console.log("formData...", formData);

        // AJAX call
        $.ajax({
          type: "POST",
          url: "/api/login",
          data: formData,
        }).done(function (data) {
          // Received response from Server
          if (data.status == 200) {
            $(location).attr("href", "/userList");
          } else {
            $("#errorMessage").html(data.message);
          }
        });
      },
    });
  };

  // userLogout AJAX call
  this.userLogout = function () {
    $("#logout").click(function () {
      $.ajax({
        type: "GET",
        url: "/api/logout",
      }).done(function (data) {
        // Received response from Server
        if (data.status == "success") {
          $(location).attr("href", "/loginUser");
        } else {
          $("#errorMessage").html(data.message);
        }
      });
    });
  };

  // exportCSV AJAX call
  this.exportCSV = function () {
    // csv export
    $(document)
      .off("click", ".csv")
      .on("click", ".csv", function () {
        var exportData = {
          exportId: $(this).attr("id"),
        };

        // AJAX call
        $.ajax({
          url: "/api/userList",
          method: "GET",
          data: exportData,
        }).done(function (data) {
          // Received response from Server
          var link = $("<a />");
          link.attr("download", data.file);
          let url = "http://127.0.0.1:4000/exports/" + data.file;
          link.attr("href", url);
          $("body").append(link);
          link[0].click();
          $("body").remove(link);
        });
      });
  };

  // uploadCSV AJAX call
  this.uploadCSV = function () {
    $("#formcsv").validate({
      submitHandler: function (form, event) {
        event.preventDefault();
        let formData = new FormData();
        formData.append("importFile", $("#importFile")[0].files[0]);
        let headerOrNot = $('input[name="headerOrNot"]:checked').val();
        if (headerOrNot) {
          formData["header"] = true;
        }

        // AJAX call
        $.ajax({
          type: "POST",
          url: "/api/import",
          data: formData,
          contentType: false,
          processData: false,
        }).done(function (data) {
          // Received response from Server
          if (data.type == "success") {
            $(".fileId").attr("fileId", data.fileId);
            // Read firstRow from data which one received from server side
            for (let index = 0; index < data.firstRow.length; index++) {
              // apped data on tbody
              $("#tbody").append(
                "<tr class='table-info'> <td><input type='checkbox' name='upload' value=" +
                  data.firstRow[index] +
                  " class='form-check-input' ></td> <td>" +
                  data.firstRow[index] +
                  "</td> <td>" +
                  data.secondRow[index] +
                  "</td> <td>  <select class='form-select'id=" +
                  data.firstRow[index] +
                  "-dropdown > <option value='' disabled >Select Value</option> <option value='name'>Name</option> <option value='email'>Email</option> <option value='mobile'>Mobile</option> </select></td></tr>"
              );
            }
          }
        });
      },
    });
  };

  // getMapData AJAX call, using this AJAX call, set all data in UI.
  this.getMapData = function () {
    $("#upload").click(function () {
      let fileId = $(".fileId").attr("fileid");
      let fieldMap = {};
      $("input:checked").each(function () {
        let checkboxval = $(this).val();
        let dbField = $(`#${checkboxval}-dropdown option:selected`).val();
        fieldMap[dbField] = checkboxval;
      });

      // AJAX call
      $.ajax({
        url: "/api/mapping/" + fileId,
        method: "put",
        data: fieldMap,
        success: function (data) {
          // Received response from server
          for (let users of data.newAddedData) {
            let html = ` 
            <tr>
            <td>${users.name}</td>
            <td>${users.email}</td>
            <td>${users.mobile}</td>
            </tr>`;

            // Data append on HTML page
            $("#secondBody").append(html);
          }
          let allCounter = `
          <p>totalRecords is : ${data.allCounter.totalRecords}</p>
          <p>duplicates is : ${data.allCounter.duplicates}</p>
          <p>discarded is :${data.allCounter.discarded}</p>
          <p>totalUploaded is : ${data.allCounter.totalUploaded}</p>
          `;
          // Data append on HTML page
          $("#allCounter").append(allCounter);
        },
      });
    });
  };

  this.addNewField = function () {
    $("#addNewField").click(function () {
      $.ajax({
        url: "/api/addNewField/" + $("#newField").val(),
        method: "GET",
        success: function (data) {
          // Received response from server
          if (data.type == "success") {
            // Read firstRow from data which one received from server side
            $("#tbody").empty();
            for (let field of data.allFields) {
              // apped data on tbody
              $("#tbody").append(
                "<tr class='table-info'> <td><input type='checkbox' name='upload' value=" +
                  data.firstRow[index] +
                  " class='form-check-input' ></td> <td>" +
                  data.firstRow[index] +
                  "</td> <td>" +
                  data.secondRow[index] +
                  "</td> <td>  <select class='form-select'id=" +
                  data.firstRow[index] +
                  "-dropdown > <option value='' disabled >Select Value</option> <option value='name'>Name</option> <option value='email'>Email</option> <option value='mobile'>Mobile</option> </select></td></tr>"
              );
            }
          }
        },
      });
    });
  };

  this.init();
  let _this = this;
};
