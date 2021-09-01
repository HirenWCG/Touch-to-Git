$(function () {
    $("form[name='registration']").validate({
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
        Age: {
          required: true,
  
          min: 18,
          max: 35,
        },
       
        dob: {
          required: true,
          date: true,
        },
  
        file: {
          required: true,
          accept: "image/*",
        },
  
        password: {
          required: true,
          minlength: 8,
          password: true,
        },
        repassword: {
          equalTo: "#password",
        },
      },
  
      messages: {
        name: {
          required: "Please provide Your  firstname",
          minlength: "Your password must be 5 characters long",
        },
        Mobile: {
          required: "Please provide Your contact Number",
          minlength: "must be 10 digits long",
          maxlength: " must be 10 digits long",
        },
        dob: {
          required: "Please provide your date of birth",
          date: "Your date of birth must in 00/00/0000 format",
        },
        Age: {
          required: "Please provide your age",
          
        },
        file: {
          required: "Please choose your  profile picture",
          accept: "please choose only image file",
        },
        password: {
          required: "Please provide a password",
          minlength: "Your password must be at least 8 characters long",
        },
        repassword: {
          equalTo: "please enter password same as above",
        },
        email: "Please enter a valid email address",
      },
  
      submitHandler: function (form) {
        form.submit();
      },
    });
  });
  
  $(document).ready(function () {
  $("#commentForm").validate();
  $("#example").DataTable();
  $("#myform").validate();
  $("#example").DataTable({
    pagingType: "full_numbers",
  });
});
