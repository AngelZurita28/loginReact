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
      </div>
    </div>
  );
}

export default Home;
