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

export const bytesToSize = (bytes: number): string => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  if (bytes === 0) {
    return "0 Byte"
  }
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${Number.parseFloat((bytes / 1024 ** i).toFixed(2))} ${sizes[i]}`
}
