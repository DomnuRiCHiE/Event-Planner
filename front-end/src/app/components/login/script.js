// import { initializeApp } from "firebase/auth";
// import { getDatabase, ref, set, update } from "firebase/database";
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
//
// const firebaseConfig = {
//   apiKey: "AIzaSyC5ftHFsiiB5VC71rre52EDHMVpvi_5aAY",
//   authDomain: "mybigday-53567.firebaseapp.com",
//   databaseURL: "https://mybigday-53567-default-rtdb.europe-west1.firebasedatabase.app",
//   projectId: "mybigday-53567",
//   storageBucket: "mybigday-53567.firebasestorage.app",
//   messagingSenderId: "493056483296",
//   appId: "1:493056483296:web:c57ddd659f13e91a821585"
// };
//
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const database = getDatabase(app);

document.getElementById("login-form").addEventListener("submit", function(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error-message");

  if (!validate_email(email)) {
    errorMessage.textContent = "Adresa de email nu este valida.";
    return;
  }

  if (password.length < 6) {
    errorMessage.textContent = "Parola trebuie sa aiba cel putin 6 caractere.";
    return;
  }

  errorMessage.textContent = "";

  if (email === "test@gmail.com" && password === "parola123") {
    alert("Authentication successful!");
    window.location.href = "./app/components/event-form/event-form.html";
  } else {
    errorMessage.textContent = "Incorrect email or password.";
  }
});

// document.addEventListener('DOMContentLoaded', function () {
//  // const register_form = document.getElementById('register-form');
//   const login_form = document.getElementById('login-form');
//
//   //register_form.addEventListener('click', function() {
//    //register(auth);
//   //});
//   login_form.addEventListener('click', function() {
//     login(auth);
//   });
// });
//
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
//
// function validate_email(email) {
//   let expression = /^[^@]+@\w+(\.\w+)+\w$/
//   return expression.test(email) === true;
// }
//
// function validate_password(password) {
//   return password.length >= 6;
// }
//
// function validate_field(field) {
//   return field !== "";
// }
