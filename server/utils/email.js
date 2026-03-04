const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: `"College CMS" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
};

const emailTemplates = {
  eventSubmitted: (studentName, eventDetails) => `
    <h2>Event Application Submitted</h2>
    <p>Dear ${studentName},</p>
    <p>Your event application has been submitted successfully.</p>
    <h3>Event Details:</h3>
    <ul>
      <li><strong>Venue:</strong> ${eventDetails.venue}</li>
      <li><strong>Date:</strong> ${eventDetails.date}</li>
      <li><strong>Time:</strong> ${eventDetails.time}</li>
      <li><strong>Reason:</strong> ${eventDetails.reason}</li>
    </ul>
    <p>Your application is now pending faculty approval.</p>
  `,
  
  eventApproved: (userName, role, eventDetails) => `
    <h2>Event Application Approved</h2>
    <p>Dear ${userName},</p>
    <p>Your event application has been approved by ${role}.</p>
    <h3>Event Details:</h3>
    <ul>
      <li><strong>Venue:</strong> ${eventDetails.venue}</li>
      <li><strong>Date:</strong> ${eventDetails.date}</li>
      <li><strong>Time:</strong> ${eventDetails.time}</li>
    </ul>
    <p>Status: ${eventDetails.status}</p>
  `,
  
  eventRejected: (userName, role, reason, eventDetails) => `
    <h2>Event Application Rejected</h2>
    <p>Dear ${userName},</p>
    <p>Your event application has been rejected by ${role}.</p>
    <h3>Rejection Reason:</h3>
    <p>${reason}</p>
    <h3>Event Details:</h3>
    <ul>
      <li><strong>Venue:</strong> ${eventDetails.venue}</li>
      <li><strong>Date:</strong> ${eventDetails.date}</li>
      <li><strong>Time:</strong> ${eventDetails.time}</li>
    </ul>
  `,
  
  eventModified: (studentName, modifications, eventDetails) => `
    <h2>Event Application Modified</h2>
    <p>Dear ${studentName},</p>
    <p>The ABC has modified your event application. Please review and accept the changes.</p>
    <h3>Modified Details:</h3>
    <ul>
      ${modifications.date ? `<li><strong>New Date:</strong> ${modifications.date}</li>` : ''}
      ${modifications.time ? `<li><strong>New Time:</strong> ${modifications.time}</li>` : ''}
      ${modifications.venue ? `<li><strong>New Venue:</strong> ${modifications.venue}</li>` : ''}
    </ul>
    <p>Please log in to accept or reject these modifications.</p>
  `,
  
  pendingApproval: (userName, role, studentName, eventDetails) => `
    <h2>New Event Approval Required</h2>
    <p>Dear ${userName},</p>
    <p>A new event application from ${studentName} requires your approval.</p>
    <h3>Event Details:</h3>
    <ul>
      <li><strong>Venue:</strong> ${eventDetails.venue}</li>
      <li><strong>Date:</strong> ${eventDetails.date}</li>
      <li><strong>Time:</strong> ${eventDetails.time}</li>
      <li><strong>Reason:</strong> ${eventDetails.reason}</li>
    </ul>
    <p>Please log in to review and approve/reject this application.</p>
  `
};

module.exports = { sendEmail, emailTemplates };
