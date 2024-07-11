import { type ClassValue, clsx } from "clsx"
import saveAs from "file-saver"
import { twMerge } from "tailwind-merge"

import { env } from "@/env.mjs"
import type { Submission } from "@prisma/client"
import dayjs from "dayjs"
import Papa from "papaparse"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`
}

export const dateFormatter = (date: Date) => {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "long",
  }).format(date)
}

export const convertSubmissionsToCsv = (submissions: Submission[]): string => {
  const flattenedData = submissions.map((submission) => {
    const jsonData = submission.data ? JSON.parse(submission.data as string) : {}

    // Add submission properties like createdAt if needed
    jsonData.createdAt = dayjs(submission.createdAt).format("MMM D, YYYY H:mm")

    return jsonData
  })

  // Get all unique headers
  const headerSet = new Set<string>()
  flattenedData.forEach((submission) => {
    Object.keys(submission).forEach((field) => headerSet.add(field))
  })

  const headers = Array.from(headerSet)

  // Generate records
  const records = flattenedData.map((submission) => {
    const record: Record<string, any> = {}
    headers.forEach((header) => {
      record[header] = submission[header] || ""
    })
    return record
  })

  // Convert JSON to CSV
  const csv = Papa.unparse(records, { header: true, columns: headers })

  return csv
}

export const downloadFile = async (url: string, filename: string) => {
  const data = await fetch(url)
  const blob = await data.blob()
  saveAs(blob, filename)
}

// To send OTP to email
type OtpStore = {
  [email: string]: string;
};

const otpStore: OtpStore = {};

export function storeOtp(email: string, otp: string): void {
  otpStore[email] = otp;
  setTimeout(() => delete otpStore[email], 300000);
}

export function verifyOtp(email: string, otp: string): boolean {
  return otpStore[email] === otp;
}