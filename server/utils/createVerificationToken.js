const crypto = require("crypto");

const createVerificationToken = () => {
  // Dikirim ke user lewat email
  const rawToken = crypto.randomBytes(32).toString("hex");

  // Simpan ke DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  // Expires dalam 7 jam
  // in ms = sekarang + 7 jam * 60 menit * 60 detik * 1000 ms
  const tokenExpires = Date.now() + 7 * 60 * 60 * 1000;

  return {
    rawToken,
    hashedToken,
    tokenExpires,
  };
};

module.exports = createVerificationToken;
