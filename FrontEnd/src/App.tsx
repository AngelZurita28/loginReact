import LoginForm from "./components/LoginForm";
import "./App.css";
import Home from "./components/Home";

type pjwtProps = {
  token: string | null;
};

function parseJwt({ token }: pjwtProps) {
  if (!token) {
    console.error("Token no válido o nulo");
    return null; // Maneja el caso de token nulo.
  }
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}
let token = localStorage.getItem("token");
// let tokenParsed = parseJwt({ token });
// let tokenValidTime = tokenParsed.exp;
const currentTime = Date.now() / 1000;
let tokenExistAndIsValid = false;
try {
  tokenExistAndIsValid = parseJwt({ token }).exp > currentTime;
} catch (e) {}

function App() {
  return (
    <>
      <div className="App">
        {tokenExistAndIsValid ? <Home /> : <LoginForm />}
      </div>
    </>
  );
}

export default App;
