$(document).ready(() => {
  $("#clearRecord").hide();
  $(document)
    .off("click", ".btn1")
    .on("click", ".btn1", function () {
      var userId = $(this).attr("id");
      $(".btn1").attr("disabled", true);
      $.ajax({
        url: "/" + userId,
        type: "GET",
        contentType: false,
        processData: false,
        success: function (data) {
          if (data.type == "success") {
            $(".addRecord").attr("id", userId).html("Edit Records");
            $("#clearRecord").show();
            $("#firstName").val(data.result.firstName);
            $("#lastName").val(data.result.lastName);
            $("#address").val(data.result.address);
            $("#" + data.result.gender).prop("checked", true);
            $("input[type='checkbox']").attr("checked", false);
            for (let item of data.result.hobbies) {
              $("#" + item).attr("checked", "checked");
            }
            $("#city").val(data.result.city);
            $(
              '<img id="userimages" class="image" src="/images/' +
                data.result.images +
                '" style="width: 100px;"/>'
            ).insertAfter("#image");
          }
        },
      });
    });
});

$("#clearRecord").on("click", () => {
  $("#userimages").remove();
  $("input[type='checkbox']").attr("checked", false);
  $("#myform")[0].reset();
  $("#clearRecord").hide();
  $(".btn1").attr("disabled", false);
  $(".addRecord").html("Add Records");
});

$(document)
  .off("click", ".deleteButton")
  .on("click", ".deleteButton", function () {
    var userId = $(this).attr("id");
    $.ajax({
      url: "/delete/" + userId,
      type: "GET",
      contentType: false,
      processData: false,
      success: function (data) {
        if (data.type == "success") {
          $("." + data.result).remove();
        }
      },
    });
  });

$("#myform").validate({
  rules: {
    firstName: {
      required: true,
    },
    lastName: {
      required: true,
    },
    gender: {
      required: true,
    },
    hobbies: {
      required: true,
    },
    address: {
      required: true,
    },
    image: {
      required: true,
    },
    city: {
      required: true,
    },
  },

  messages: {
    firstName: {
      required: "Please Enter First Name.",
    },
    lastName: {
      required: "Please Enter Last Name.",
    },
    gender: {
      required: "Choose Your Gender.",
    },
    hobbies: {
      required: "Choose Your Hobbies.",
    },
    address: {
      required: "Address is required!",
    },
    image: {
      required: "Please Choose Image.",
    },
    city: {
      required: "Please Select Your city.",
    },
  },

  highlight: function (element) {
    $(element).addClass("errClass");
  },

  unhighlight: function (element) {
    $(element).removeClass("errClass");
  },

  errorPlacement: function (error, element) {
    error.appendTo($("#" + element.attr("id") + "Error"));
  },

  submitHandler: function (form) {
    var formData = new FormData();
    formData.append("image", $("#image")[0].files[0]);

    let b = $(".addRecord").attr("id");
    if (b != "submitButton") {
      formData.append("_id", b);
    }

    var hobbies = [];
    $("input[type=checkbox]:checked").each(function (index, element) {
      hobbies.push($(this).val());
    });

    let dataObject = {
      firstName: $("#firstName").val(),
      lastName: $("#lastName").val(),
      address: $("#address").val(),
      gender: $('input[name="gender"]:checked').val(),
      hobbies: hobbies,
      city: $("#city").val(),
      images: $("#image")[0].files[0].name,
    };

    for (let key in dataObject) {
      formData.append(key, dataObject[key]);
    }
    $.ajax({
      url: "/",
      type: "POST",
      data: formData,
      contentType: false,
      processData: false,
      success: function (result) {
        if (result.type == "success") {
          if (result.result) {
            let html = `  
                                <tr class = "${result.result._id}">
                                <td><img src="/images/${result.result.images}" style="width: 100px;" /></td>
                                <td>${result.result.firstName}</td>
                                <td>${result.result.address}</td>
                                <td>${result.result.gender}</td>
                                <td><button id="${result.result._id}" class="btn btn-primary btn1 m-2">Edit Details</button><button class="btn btn-danger m-2">Delete Item</button></td>
                            </tr > `;

            console.log(html);

            //console.log($("#table").html());
            $("#tbody").append(html);
          }
        } else if (result.type == "update") {
          let newUser = `  
                                <tr class = "${result.result._id}">
                                <td><img src="/images/${result.result.images}" style="width: 100px;" /></td>
                                <td>${result.result.firstName}</td>
                                <td>${result.result.address}</td>
                                <td>${result.result.gender}</td>
                                <td><button id="${result.result._id}" class="btn btn-primary btn1 m-2">Edit Details</button><button class="btn btn-danger m-2">Delete Item</button></td>
                            </tr > `;
          $("." + result.result._id).replaceWith(newUser);
        } else {
          alert(result.message);
        }
      },
    });
  },
});
