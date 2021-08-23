$(document).ready(function () {
  $("#commentForm").validate();
  $("#example").DataTable();
  $("#myform").validate();
  $("#example").DataTable({
    pagingType: "full_numbers",
  });
});
