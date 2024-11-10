document.getElementById("login-form").addEventListener("submit", function(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error-message");

  if (!validate_email(email)) {
    alert("Authentication failed")
    errorMessage.textContent = "Adresa de email nu este valida.";
    return;
  }

  if (password.length < 6) {
    alert("Authentication failed")
    errorMessage.textContent = "Parola trebuie sa aiba cel putin 6 caractere.";
    return;
  }

  errorMessage.textContent = "";

  if (email === "test@gmail.com" && password === "parola123") {
    alert("Autentificare reusita!");
    window.location.href = "dashboard.html";
  } else {
    errorMessage.textContent = "Incorrect email or password.";
  }
});

// document.addEventListener('DOMContentLoaded', function () {
//   const register_form = document.getElementById('register-form');
//   const login_form = document.getElementById('login-form');
//
//   register_form.addEventListener('click', function() {
//     register(auth);
//   });
//   login_form.addEventListener('click', function() {
//     login(auth);
//   });
// });

// function register(auth) {
//   let first_name = document.getElementById("firstNameInp").value;
//   let last_name = document.getElementById("lastNameInp").value
//   let email = document.getElementById("email").value;
//   let password = document.getElementById("password").value;
//
//   if (validate_email(email) === false || validate_password(password) === false) {
//     alert("Invalid email address or password. Please try again.");
//     return;
//   }
//   if(validate_field(first_name) === false || validate_field(last_name) === false || validate_field(email) === false || validate_field(password) === false) {
//     alert("Please fill out all fields.");
//     return;
//   }
//
//   createUserWithEmailAndPassword(auth, email, password)
//     .then(function (){
//       let user = auth.currentUser;
//       let user_data = {
//         first_name: first_name,
//         last_name: last_name,
//         email: email,
//         last_login: Date.now()
//       }
//       set(ref(database, 'users/' + user.uid), user_data)
//
//       alert('User created successfully!');
//     })
//     .catch(function(error) {
//       let errorMessage = error.message;
//       alert(errorMessage);
//     });
//
// }

// function login(auth){
//   let email = document.getElementById("email").value;
//   let password = document.getElementById("password").value;
//
//   if (validate_email(email) === false || validate_password(password) === false) {
//     alert("Invalid email address or password. Please try again.");
//     return;
//   }
//
//   signInWithEmailAndPassword(auth, email, password)
//     .then(function (){
//       let user = auth.currentUser;
//       let user_data = {
//         last_login: Date.now()
//       }
//       update(ref(database, 'users/' + user.uid), user_data)
//
//       alert('User logged in successfully!');
//       // window.location.href = 'https://webapp-7c9a3.web.app';
//       window.location.href = 'dashboard.html';
//
//     })
//     .catch(function(error) {
//       let errorMessage = error.message;
//       alert(errorMessage);
//     });
// }

function validate_email(email) {
  let expression = /^[^@]+@\w+(\.\w+)+\w$/
  return expression.test(email) === true;
}
//
// function validate_password(password) {
//   return password.length >= 6;
// }
//
// function validate_field(field) {
//   return field !== "";
// }
