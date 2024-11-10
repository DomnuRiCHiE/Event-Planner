document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");
  
    if (!validateEmail(email)) {
      errorMessage.textContent = "Adresa de email nu este valida.";
      return;
    }
  
    if (password.length < 6) {
      errorMessage.textContent = "Parola trebuie sa aiba cel putin 6 caractere.";
      return;
    }
  
    errorMessage.textContent = "";
  
    if (email === "test@gmail.com" && password === "parola123") {
      alert("Autentificare reusita!");
      window.location.href = "dashboard.html";
    } else {
      errorMessage.textContent = "Email sau parola incorecte.";
    }
  });
  
  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  