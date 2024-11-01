const waApiBaseUrl = "https://api.thinkroman.com/v1/templates"

const token = process.env.WHATSAPP_API_KEY

export const sendFormSubmissionNotification = async (
  formOwnerName: string,
  formOwnerNumber: string,
  submissionId: string,
  submissionTime: string
) => {
  const url = `${waApiBaseUrl}/whatsapp/trforms/newFormSubmission`
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }

  const body = JSON.stringify({
    to: formOwnerNumber,
    lang: "en_US",
    formOwnerName: formOwnerName,
    link: `${process.env.NEXT_PUBLIC_APP_URL}/f/${submissionId}`,
    submissionTime: submissionTime,
  })

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    })
    console.log("Actuall Response:", response)

    if (response.ok) {
      console.log("Request sent successfully:", await response.json())
    } else {
      console.error("Failed to send request:", response)
    }
  } catch (error) {
    console.error("Error sending request:", error)
  }
}
