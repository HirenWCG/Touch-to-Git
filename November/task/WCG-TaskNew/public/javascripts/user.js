$(document).ready(() => {
  $("#clearRecord").hide();
  $(document)
    .off("click", ".editDetails")
    .on("click", ".editDetails", function () {
      var userId = $(this).attr("id");
      $(".editDetails").attr("disabled", true);
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
  $("#form")[0].reset();
  $("#clearRecord").hide();
  $(".editDetails").attr("disabled", false);
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

$("#form").validate({
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
    if (element.attr("id") == "firstName") {
      error.appendTo($("#firstNameError"));
    } else if (element.attr("id") == "lastName") {
      error.appendTo($("#lastNameError"));
    } else if (element.attr("id") == "address") {
      error.appendTo($("#addressError"));
    } else if (element.attr("name") == "gender") {
      error.appendTo($("#genderError"));
    } else if (element.attr("name") == "hobbies") {
      error.appendTo($("#hobbiesError"));
    } else if (element.attr("id") == "city") {
      error.appendTo($("#cityError"));
    } else if (element.attr("id") == "image") {
      error.appendTo($("#imagesError"));
    }
  },

  submitHandler: function (form) {
    var formData = new FormData();
    formData.append("image", $("#image")[0].files[0]);

    let exsitsUserId = $(".addRecord").attr("id");
    if (exsitsUserId != "submitButton") {
      formData.append("_id", exsitsUserId);
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
                                <td><button id="${result.result._id}" class="btn btn-primary editDetails m-2">Edit Details</button><button class="btn btn-danger m-2">Delete Item</button></td>
                            </tr > `;
            $("#tbody").append(html);
          }
        } else if (result.type == "update") {
          let newUser = `  
                                <tr class = "${result.result._id}">
                                <td><img src="/images/${result.result.images}" style="width: 100px;" /></td>
                                <td>${result.result.firstName}</td>
                                <td>${result.result.address}</td>
                                <td>${result.result.gender}</td>
                                <td><button id="${result.result._id}" class="btn btn-primary editDetails m-2">Edit Details</button><button class="btn btn-danger m-2">Delete Item</button></td>
                            </tr > `;
          $("." + result.result._id).replaceWith(newUser);
          $(".editDetails").attr("disabled", false);
        } else {
          alert(result.message);
        }
      },
    });
  },
});

$(document).on("click", ".orderSorting", function () {
  var sorting = {
    sortingId: $(this).attr("id"),
    order: Number($(this).attr("sortingOrder")),
  };
  if (Number($(this).attr("sortingOrder")) == 1) {
    $(this).attr("sortingOrder", -1);
  } else {
    $(this).attr("sortingOrder", 1);
  }
  $.ajax({
    url: "/sort",
    type: "POST",
    data: sorting,
    success: function (result) {
      if (result.type == "success") {
        if (result.result) {
          let html;
          $("#tbody").empty();
          for (let item of result.result) {
            html = `<tr class = "${item._id}">
                <td><img src="/images/${item.images}" style="width: 100px;" /></td>
                <td>${item.firstName}</td>
                <td>${item.address}</td>
                <td>${item.gender}</td>
                <td><button id="${item._id}" class="btn btn-primary editDetails m-2">Edit Details</button><button class="btn btn-danger m-2">Delete Item</button></td>
            </tr> `;
            $("#tbody").append(html);
          }
        }
      }
    },
  });
});
