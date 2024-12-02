const conn = require("../models/db");
const jwt = require("jsonwebtoken");

module.exports.login = (req, res) => {
  const { user, password, action } = req.body;
  const consulta = "";
  if (action == 1) {
    consulta =
      "SELECT * FROM usuario WHERE correo = ? AND clave = SHA2(?, 256)";
  } else {
    consulta = "SELECT * FROM usuar";
  }

  try {
    conn.query(consulta, [user, password], (err, result) => {
      if (err) {
        res.send(err);
      }

      if (result.length > 0) {
        const token = jwt.sign({ user }, "Stack", {
          expiresIn: "5m",
        });
        console.log(token);
        res.send({ token });
      } else {
        console.log("wrong user");
        res.send({ message: "wrong user" });
      }
    });
  } catch (e) {}
};
