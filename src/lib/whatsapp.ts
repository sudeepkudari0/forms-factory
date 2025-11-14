export const sendFormSubmissionNotification = async (
  formOwnerName: string,
  formOwnerNumber: string,
  formId: string,
  submissionId: string,
  submissionTime: string
) => {
  console.info("[whatsapp-mock] form submission", {
    formOwnerName,
    formOwnerNumber,
    formId,
    submissionId,
    submissionTime,
  })
}
