import React, { useState } from "react";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(""); // Para guardar el OTP
  const [step, setStep] = useState(1); // Para manejar el flujo de pasos (1: Solicitar OTP, 2: Ingresar OTP y Contraseña)
  const [error, setError] = useState("");

  // Paso 1: Solicitar OTP al correo
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Por favor, ingresa tu correo electrónico.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (response.ok) {
        setStep(2); // Avanzar al siguiente paso (ingresar OTP)
        alert("Te hemos enviado un código OTP a tu correo.");
      } else {
        setError(result.message || "Hubo un problema al enviar el OTP.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Hubo un error al procesar la solicitud.");
    }
  };

  // Paso 2: Validar OTP y restablecer la contraseña
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || !password) {
      setError("Por favor, ingresa el código OTP y la nueva contraseña.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);

        // Llamar al login automáticamente con la nueva contraseña
        const loginData = { user: email, password, action: 1 };
        const loginResponse = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
        });

        const loginResult = await loginResponse.json();
        if (loginResponse.ok) {
          localStorage.setItem("token", loginResult.token);
          localStorage.setItem("user", email);
          location.reload(); // Recarga la página para reflejar el estado de inicio de sesión
        } else {
          alert(loginResult.message || "Error al iniciar sesión.");
        }
      } else {
        setError(
          result.message || "Hubo un problema al restablecer la contraseña."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Hubo un error al procesar la solicitud.");
    }
  };

  return (
    <div>
      <h2>Restablecer Contraseña</h2>
      {step === 1 && (
        <form onSubmit={handleRequestOtp}>
          <div>
            <label htmlFor="email">Correo electrónico:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu correo"
              required
            />
          </div>
          <button type="submit">Enviar Código OTP</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleResetPassword}>
          <div>
            <label htmlFor="otp">Código OTP:</label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Ingresa el código OTP"
              required
            />
          </div>

          <div>
            <label htmlFor="password">Nueva Contraseña:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu nueva contraseña"
              required
            />
          </div>

          <button type="submit">Restablecer Contraseña y Iniciar sesión</button>
        </form>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ResetPassword;
