const conn = require("../models/db");
const jwt = require("jsonwebtoken");

module.exports.login = (req, res) => {
  const { user, password, action } = req.body;
  let consulta =
    "SELECT * FROM Usuario WHERE correo = ? AND clave = SHA2(?, 256)";
  if (action == 0) {
    try {
      conn.query(
        "SELECT * FROM Usuario WHERE correo = ?",
        [user],
        (err, result) => {
          if (err) {
            res.send(err);
            return; // Evita continuar si hubo un error
          }

          if (result.length > 0) {
            const userData = result[0]; // Obtener el primer registro

            if (userData.status === 0) {
              // Si el status es 0, actualizamos la contraseña y el status
              conn.query(
                "UPDATE Usuario SET clave = SHA2(?, 256), status = 1 WHERE correo = ?",
                [password, user],
                (updateErr, updateResult) => {
                  if (updateErr) {
                    res.send(updateErr);
                    return; // Evita continuar si hubo un error en la actualización
                  }
                  // Generar el token incluso si el status es 0, ya que el usuario debe iniciar sesión
                  const token = jwt.sign({ user }, "Stack", {
                    expiresIn: "5m",
                  });
                  console.log(token);
                  return res.send({ token, message: "Registro Exitoso" }); // Asegura que solo se envíe una respuesta
                }
              );
            } else {
              // Si el status es 1, verificamos la contraseña directamente en la base de datos
              conn.query(
                "SELECT * FROM Usuario WHERE correo = ? AND clave = SHA2(?, 256)",
                [user, password],
                (verifyErr, verifyResult) => {
                  if (verifyErr) {
                    res.send(verifyErr);
                    return; // Evita continuar si hubo un error en la verificación
                  }

                  if (verifyResult.length > 0) {
                    const token = jwt.sign({ user }, "Stack", {
                      expiresIn: "5m",
                    });
                    console.log(token);
                    return res.send({ token }); // Asegura que solo se envíe una respuesta
                  } else {
                    console.log("wrong user");
                    return res.send({ message: "wrong user" }); // Asegura que solo se envíe una respuesta
                  }
                }
              );
            }
          } else {
            // Si el correo no existe, lo agregamos a la base de datos
            conn.query(
              "INSERT INTO Usuario (correo, clave) VALUES (?, SHA2(?, 256))",
              [user, password],
              (insertErr, insertResult) => {
                if (insertErr) {
                  res.send(insertErr);
                  return; // Evita continuar si hubo un error en la inserción
                }

                console.log("Nuevo usuario agregado.");
                // Generar el token para el nuevo usuario
                const token = jwt.sign({ user }, "Stack", { expiresIn: "5m" });
                console.log(token);
                return res.send({ token, message: "Registro Exitoso" }); // Asegura que solo se envíe una respuesta
              }
            );
          }
        }
      );
    } catch (e) {
      console.log(e);
      return res.send({ message: "Error interno" }); // Responde con un error genérico en caso de excepciones
    }
  } else {
    try {
      conn.query(consulta, [user, password], (err, result) => {
        if (err) {
          res.send(err);
        }

        if (result.length > 0) {
          console.log(result[0].status);
          if (result[0].status == 0) {
            console.log("usuario eliminado, vuelva a registrarse");
            res.send({ message: "wrong user" });
            return;
          }
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
    } catch (e) {
      console.log(e);
    }
  }
};
