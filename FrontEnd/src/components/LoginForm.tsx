import { useState } from "react";

type Props = {};

function LoginForm({}: Props) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [action, setAction] = useState(0);
  const [error, setError] = useState(false);
  const handleSubmit = (e: any) => {
    setAction(1);
    e.preventDefault();
    if (user === "" || password === "") {
      setError(true);
      return;
    }

    setError(false);

    const data = {
      user: user,
      password: password,
      action: action,
    };

    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result.token);
        if (result) {
          localStorage.setItem("token", result.token);
          localStorage.setItem("user", user);
          location.reload();
        } else {
          console.log("no hay token");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1 className="text-center my-4">Login</h1>
        <div className="container">
          <div className="mb-4">
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              type="text"
              className="form-control"
              placeholder="Username"
            />
          </div>
          <div className="mb-4">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="form-control"
              placeholder="Password"
            />
          </div>
          <button
            onClick={() => setAction(1)}
            className="btn btn-primary w-100 mt-3"
          >
            Login
          </button>
          <button
            onClick={() => setAction(0)}
            className="btn btn-primary w-100 mt-3"
          >
            Sign In
          </button>
          {error && <p>Por favor llenar todos los campos</p>}
        </div>
      </form>
    </>
  );
}

export default LoginForm;
