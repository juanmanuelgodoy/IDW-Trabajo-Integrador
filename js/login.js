        if (sessionStorage.getItem('loginValido')) {
            alert("El usuario ya se encuentra logueado");
            window.location.href = "dashboard.html";
        }

        document.getElementById("loginForm").addEventListener("submit", function (e) {
            e.preventDefault();

            const user = document.getElementById("usuario").value;
            const pass = document.getElementById("clave").value;

            if (user === "admin" && pass === "1234") {
                alert("Logueo correcto");
                sessionStorage.setItem('loginValido', 'true');
                window.location.href = "dashboard.html";
            } else {
                alert("Usuario inválido");
                document.getElementById("usuario").value = "";
                document.getElementById("clave").value = "";
                document.getElementById("usuario").focus();
            }
        });

        sessionStorage.removeItem('loginValido');