if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    // Open the pop-up modal on page load
    openModal();

    function openModal() {
      document.getElementById("loginModal").style.display = "block";
    }

    function closeModal() {
      document.getElementById("loginModal").style.display = "none";
    }

    document.querySelector(".close").addEventListener("click", function () {
      closeModal();
    });

    document.getElementById("loginForm").addEventListener("submit", async function (e) {
      e.preventDefault();
      var username = document.getElementById("username").value;
      var password = document.getElementById("password").value;
  
      try {
          const response = await fetch('/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ username, password }),
              credentials: 'include' // This ensures cookies are sent with the request
          });
  
          const data = await response.json();
  
          if (data.success) {
              window.location.href = data.redirect;
          } else {
              alert("Authentication failed: " + (data.message || "Unknown error"));
          }
      } catch (error) {
          console.error('Error:', error);
          alert("An error occurred during authentication: " + error.message);
      }
  });

    document.getElementById("loginBtn").addEventListener("click", function (e) {
      e.preventDefault();
      var username = document.getElementById("username").value;
      var password = document.getElementById("password").value;

      fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          alert("Authentication successful!");
          window.location.href = "/dashboard";
        } else {
          alert("Authentication failed: " + (data.message || "Unknown error"));
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert("An error occurred during authentication: " + error.message);
      });
    });


    // Add event listener for the Google OAuth button
    document.getElementById("googleLoginBtn").addEventListener("click", function () {
      // Redirect to the Google OAuth authentication endpoint
      window.location.href = "/auth/google";
    });
  });
}

// if (typeof document !== "undefined") {
//   document.addEventListener("DOMContentLoaded", function () {
//     const correctUsername = username;
//     const correctPassword = password;

//     // Open the pop-up modal on page load
//     openModal();

//     function openModal() {
//       document.getElementById("loginModal").style.display = "block";
//     }

//     function closeModal() {
//       document.getElementById("loginModal").style.display = "none";
//     }

//     document.querySelector(".close").addEventListener("click", function () {
//       closeModal();
//     });

//     document.getElementById("loginBtn").addEventListener("click", function () {
//       var username = document.getElementById("username").value;
//       var password = document.getElementById("password").value;
//       console.log("username:", username);
//       console.log("password:", password);

//       // Perform authentication logic here
//       if (username === correctUsername && password === correctPassword) {
//         alert("Authentication successful!");
//         closeModal();
//         window.location.href = "/"; // Redirect to the home page
//       } else {
//         alert("Authentication failed!");
//       }
//     });

//     // Add event listener for the Google OAuth button
//     document.getElementById("googleLoginBtn").addEventListener("click", function () {
//       // Redirect to the Google OAuth authentication endpoint
//       window.location.href = "/auth/google";
//     });
//   });
// }