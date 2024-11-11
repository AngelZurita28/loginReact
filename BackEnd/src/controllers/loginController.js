const conn = require("../models/db");
const jwt = require("jsonwebtoken");

module.exports.login = (req, res) => {
  const { user, password } = req.body;
  //   console.log(password);

  const consulta = "SELECT * FROM Usuario WHERE correo = ? AND clave = ?";

  try {
    conn.query(consulta, [user, password], (err, result) => {
      if (err) {
        res.send(err);
      }

      if (result.length > 0) {
        const token = jwt.sign({ user }, "Stack", {
          expiresIn: "5m",
        });
        console.log("bienvenido");
        res.send({ token });
      } else {
        console.log("wrong user");
        res.send({ message: "wrong user" });
      }
    });
  } catch (e) {}
};
