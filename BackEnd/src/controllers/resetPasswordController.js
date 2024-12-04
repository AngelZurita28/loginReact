const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// Simulamos una base de datos
const otpStore = {}; // { email: { otp, expiresAt } }
const userStore = {}; // { email: { password } }

// Configurar el transporte de correo
const transporter = nodemailer.createTransport({
  service: "Gmail", // Cambiar según el proveedor
  auth: {
    user: "tu-email@gmail.com",
    pass: "tu-contraseña", // Usa una contraseña de aplicación
  },
});

// Enviar OTP
exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Correo requerido" });

  // Generar OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos

  // Guardar OTP en memoria
  otpStore[email] = { otp, expiresAt };

  // Enviar correo con OTP
  try {
    await transporter.sendMail({
      from: "tu-email@gmail.com",
      to: email,
      subject: "Tu código OTP",
      text: `Tu código OTP para restablecer la contraseña es: ${otp}. Este código expira en 5 minutos.`,
    });

    res.json({ message: "OTP enviado al correo" });
  } catch (error) {
    console.error("Error enviando correo:", error);
    res.status(500).json({ message: "Error enviando correo" });
  }
};

// Verificar OTP
exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  if (!otpStore[email])
    return res.status(400).json({ message: "OTP inválido" });

  const { otp: storedOtp, expiresAt } = otpStore[email];
  if (otp !== storedOtp || new Date() > expiresAt) {
    return res.status(400).json({ message: "OTP inválido o expirado" });
  }

  // OTP válido, eliminarlo para mayor seguridad
  delete otpStore[email];
  res.json({ message: "OTP verificado" });
};

// Restablecer contraseña
exports.resetPassword = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Datos incompletos" });

  // Hashear nueva contraseña
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    userStore[email] = { password: hashedPassword }; // Actualiza la "base de datos"

    res.json({ message: "Contraseña restablecida con éxito" });
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    res.status(500).json({ message: "Error al restablecer la contraseña" });
  }
};
