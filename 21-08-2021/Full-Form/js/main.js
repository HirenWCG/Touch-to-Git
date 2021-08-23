$(document).ready(function () {
  jQuery.validator.setDefaults({
    debug: true,
    success: "valid",
  });
  $("#commentForm").validate({
    rules: {
      field: {
        required: true,
        accept: "image/*",
      },
    },
  });
});
