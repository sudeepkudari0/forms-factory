"use server"

import { db } from "@/lib/db"
import { sendOtpEmail } from "@/lib/mail"
import { storeOtp, verifyOtp } from "@/lib/utils"
import bcrypt from "bcrypt"

export async function forgotPassword(email: string) {
  try {
    const user = db.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return {
        success: false,
        error: "User not found",
      }
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString()

    await sendOtpEmail(generatedOtp, email as string)
    storeOtp(email as string, generatedOtp)

    return {
      success: true,
      message: "OTP sent successfully",
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      error: "Error",
    }
  }
}

export async function VerifyOtp(email?: string, otp?: string) {
  if (!email || !otp) {
    throw new Error("Email is required")
  }
  // Verify OTP

  if (verifyOtp(email, otp)) {
    return {
      success: true,
      error: "OTP verified successfully",
    }
  }

  return {
    success: false,
    error: "Invalid OTP",
  }
}

export async function resetPassword(email: string, password: string) {
  try {
    const user = db.user.findUnique({
      where: {
        email,
      },
    })
    if (!user) {
      return {
        success: false,
        error: "User not found",
      }
    }
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    await db.user.update({
      where: {
        email,
      },
      data: {
        hashedPassword,
      },
    })
    return {
      success: true,
      message: "Password reset successfully",
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      error: "Error",
    }
  }
}
