import PasswordGenerator from "generate-password"

export const generateSecurePassword = () => {
  return PasswordGenerator.generate({
    length: 16,
    strict: true,
    numbers: true,
    symbols: true,
    uppercase: true,
    lowercase: true,
  })
}
