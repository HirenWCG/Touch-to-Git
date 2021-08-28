$(document).ready(function () {
  // Time Picker JS
  $("#datetimepicker").datetimepicker({
    datepicker: false,
    format: "H:i",
  });

  // Datepicker JS
  $("#datepicker").datepicker({
    changeMonth: true,
    changeYear: true,
    yearRange: "1950:2021",
  });

  // DataTable JS
  $("#example").DataTable({
    dom: "Bfrtip",
    buttons: ["copyHtml5", "excelHtml5", "csvHtml5", "pdfHtml5"],
  });

  // CK Editor JS
  ClassicEditor.create(document.querySelector("#editor"));

  // CK Editor Standard
  var ed = CKEDITOR.replace("editor1");
  ed.on("required", function (evt) {
    $(".introerr").text("This field is required.");
    evt.cancel();
  });

  // Chosen JS
  $("select").chosen({ width: "200px" });

  // TextArea *Required JS
  $.validator.setDefaults({ ignore: ":hidden:not(select)" });
  $(registration).validate({
    // About Me Required JS
    ignore: "input:hidden:not(input:hidden.required)",
    rules: {
      firstname: {
        required: true,
        minlength: 5,
      },
      Mobile: {
        required: true,
        digits: true,
        minlength: 10,
        maxlength: 10,
      },
      email: {
        required: true,
      },
      dob: {
        required: true,
      },
      tp: {
        required: true,
      },
      city2: {
        required: true,
      },
    },
  });
});

function countChar(val) {
  var len = val.value.length;
  $("#charNum").text("You have left to enter Words of : " + (10 - len));
  if (len >= 10) {
    $("textarea").prop("disabled", true);
  }

  //   $("textarea").prop("disabled", false);
}

lightbox.option({
  resizeDuration: 200,
  wrapAround: true,
  fadeDuration: 2000,
  positionFromTop: 130,
});

function myFunction(x) {
  x.style =
    "border-color: #FF6B6B; border-width: thick; box-shadow:4px 4px 10px #B61919;";
}
function myFun(x) {
  x.style = "border-color:#FF6B6B;";
}
