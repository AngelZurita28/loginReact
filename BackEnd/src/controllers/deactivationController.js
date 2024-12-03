const conn = require("../models/db");

module.exports.accountDeactivation = (req, res) => {
  const { user } = req.body;
  let consulta = "Update Usuario set status = 0 where correo =?";

  try {
    conn.query(consulta, [user], (err, result) => {
      if (err) {
        res.send(err);
      }
      if (result.affectedRows > 0) {
        console.log(result[0]);
        res.send({ message: "usuario eliminado con exito" });
      } else {
        console.log("ocurrio un problema");
        res.send({ message: "ocurrio un problema" });
      }
    });
  } catch (e) {
    console.log(e);
  }
};
