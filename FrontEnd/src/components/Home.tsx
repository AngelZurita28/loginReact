// import { useNavigate } from "react-router-dom";
// import { useState } from "react";

type Props = {};

function Home({}: Props) {
  const handleLogout = () => {
    localStorage.clear();
    location.reload();
  };
  const handlePasswordChange = () => {
    localStorage.clear();
    location.reload();
  };

  const data = {
    user: localStorage.getItem("user"),
  };
  const handleAccountDeactivation = () => {
    fetch("http://localhost:3000/account-deactivation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result) {
          console.log(result.message);
          if (typeof result.message !== "undefined") {
            alert(result.message);
          }
          location.reload();
        } else {
          console.log("fallo la elimnacion de la cuenta");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    localStorage.clear();
    location.reload();
  };
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      hola {localStorage.getItem("user")}
      <div>
        <button onClick={handleLogout} className="btn btn-primary w-100 mt-3">
          cerrar sesion
        </button>
      </div>
      <div>
        <button
          onClick={handlePasswordChange}
          className="btn btn-primary w-100 mt-3"
        >
          cambiar contrasena
        </button>
        <button
          onClick={handleAccountDeactivation}
          className="btn btn-primary w-100 mt-3"
        >
          Eliminar Cuenta
        </button>
      </div>
    </div>
  );
}

export default Home;
