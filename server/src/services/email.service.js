/**
 * Stub Email Service (Nodemailer substitute)
 * Used to satisfy the email notification requirements.
 */

export const sendEmail = async ({ to, subject, body }) => {
  // Mock sending email
  console.log(`[Email Service] Sending email to ${to}...`);
  console.log(`[Email Service] Subject: ${subject}`);
  
  await new Promise(r => setTimeout(r, 800)); // Simulate network latency

  console.log(`[Email Service] Email sent successfully.`);
  return { success: true, messageId: `msg_${Date.now()}` };
};

export const sendWeeklyReport = async (user, data) => {
  const content = `
    Hi ${user.name},
    Here is your weekly wellness report...
    Total Steps: ${data.steps}
    Average Sleep: ${data.sleep} hrs
  `;
  return sendEmail({
    to: user.email,
    subject: 'Your Weekly Wellness Report 📈',
    body: content
  });
};
