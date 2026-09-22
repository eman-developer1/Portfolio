import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Simple in-memory rate limiting map (IP -> timestamps[])
const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ip: string, limit = 5, windowMs = 60 * 1000): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((time) => now - time < windowMs);

  if (validTimestamps.length >= limit) {
    return true;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return false;
}

export async function POST(req: NextRequest) {
  try {
    // Rate Limiting Check
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'anonymous';
    if (isRateLimited(ip, 5, 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute before trying again.' },
        { status: 429 }
      );
    }

    // Parse JSON Payload
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON payload.' },
        { status: 400 }
      );
    }

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body.' },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      projectType = 'General Inquiry',
      message,
      honeypot
    } = body as {
      name?: string;
      email?: string;
      projectType?: string;
      message?: string;
      honeypot?: string;
    };

    // Honeypot spam check - if bots fill hidden honeypot field, silently return success
    if (honeypot && honeypot.trim().length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Your message has been sent successfully.'
      });
    }

    // Input Validation
    const cleanName = typeof name === 'string' ? name.trim() : '';
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const cleanProjectType = typeof projectType === 'string' ? projectType.trim() : 'Business Website';
    const cleanMessage = typeof message === 'string' ? message.trim() : '';

    if (!cleanName || cleanName.length < 2 || cleanName.length > 100) {
      return NextResponse.json(
        { error: 'Please enter a valid name (2-100 characters).' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail) || cleanEmail.length > 100) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!cleanMessage || cleanMessage.length < 10 || cleanMessage.length > 3000) {
      return NextResponse.json(
        { error: 'Message must be between 10 and 3,000 characters.' },
        { status: 400 }
      );
    }

    const safeProjectType = cleanProjectType.slice(0, 100);

    // Retrieve and Validate Server-side Environment Variables
    const apiKey = process.env.RESEND_API_KEY;
    const recipientEmail = process.env.CONTACT_EMAIL || 'emanaslam182@gmail.com';
    const senderEmail = process.env.FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>';

    if (!apiKey) {
      console.error('[API /api/contact] Error: RESEND_API_KEY environment variable is missing.');
      return NextResponse.json(
        { error: 'Email service is currently unconfigured. Please contact directly via email or WhatsApp.' },
        { status: 500 }
      );
    }

    if (!apiKey.startsWith('re_')) {
      console.error(
        '[API /api/contact] Warning: RESEND_API_KEY does not start with "re_". Please ensure you are using a valid Resend API key from https://resend.com/api-keys (NOT Mailboxlayer or another service).'
      );
    }

    // Format Timestamp
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'full',
      timeStyle: 'medium',
      timeZone: 'UTC'
    }).format(new Date());

    // Initialize Resend Client
    const resend = new Resend(apiKey);

    // Prepare Email HTML & Text Templates
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0f172a;
      color: #f1f5f9;
      margin: 0;
      padding: 24px;
    }
    .card {
      max-width: 600px;
      margin: 0 auto;
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    }
    .header {
      border-bottom: 1px solid #334155;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .badge {
      display: inline-block;
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
    }
    h2 {
      margin: 0;
      color: #ffffff;
      font-size: 22px;
    }
    .row {
      margin-bottom: 18px;
    }
    .label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #94a3b8;
      margin-bottom: 4px;
    }
    .value {
      font-size: 16px;
      color: #f8fafc;
      font-weight: 500;
    }
    .message-box {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 16px;
      margin-top: 6px;
      white-space: pre-wrap;
      line-height: 1.6;
      color: #e2e8f0;
      font-size: 15px;
    }
    .footer {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #334155;
      font-size: 12px;
      color: #64748b;
      text-align: center;
    }
    .reply-btn {
      display: inline-block;
      margin-top: 16px;
      background: #38bdf8;
      color: #0f172a;
      font-weight: 700;
      padding: 10px 20px;
      border-radius: 6px;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="badge">New Portfolio Inquiry</div>
      <h2>Message from ${cleanName}</h2>
    </div>

    <div class="row">
      <div class="label">Client Name</div>
      <div class="value">${cleanName}</div>
    </div>

    <div class="row">
      <div class="label">Client Email</div>
      <div class="value"><a href="mailto:${cleanEmail}" style="color: #38bdf8;">${cleanEmail}</a></div>
    </div>

    <div class="row">
      <div class="label">Project Type / Inquiry</div>
      <div class="value">${safeProjectType}</div>
    </div>

    <div class="row">
      <div class="label">Client Message</div>
      <div class="message-box">${cleanMessage}</div>
    </div>

    <div class="row" style="margin-top: 24px;">
      <a href="mailto:${cleanEmail}?subject=Re:%20Portfolio%20Inquiry%20-%20${encodeURIComponent(safeProjectType)}" class="reply-btn">Reply to ${cleanName}</a>
    </div>

    <div class="footer">
      Received on ${formattedDate} UTC via Eman Khan Portfolio Contact Form
    </div>
  </div>
</body>
</html>
`;

    const textContent = `
New Portfolio Contact Request
--------------------------------
Client Name:  ${cleanName}
Client Email: ${cleanEmail}
Project Type: ${safeProjectType}

Message:
${cleanMessage}

--------------------------------
Received: ${formattedDate} UTC
Reply-To: ${cleanEmail}
`;

    // Send Email via Resend
    const sendResult = await resend.emails.send({
      from: senderEmail,
      to: [recipientEmail],
      replyTo: cleanEmail,
      subject: `New Portfolio Inquiry from ${cleanName} (${safeProjectType})`,
      html: htmlContent,
      text: textContent
    });

    if (sendResult.error) {
      console.error('[Resend Error Details]:', {
        name: sendResult.error.name,
        message: sendResult.error.message
      });
      return NextResponse.json(
        { error: 'Failed to deliver message via email service. Please try again or reach out directly.' },
        { status: 502 }
      );
    }

    console.log(`[API /api/contact] Email delivered successfully. Resend ID: ${sendResult.data?.id}`);

    return NextResponse.json({
      success: true,
      id: sendResult.data?.id,
      message: 'Thanks! Your message has been sent successfully. I will get back to you soon.'
    });
  } catch (error: unknown) {
    const errorDetails = error instanceof Error ? error.message : 'Unknown server error';
    console.error('[API /api/contact Exception]:', errorDetails);
    return NextResponse.json(
      { error: 'Something went wrong while sending your message. Please try again or contact me directly.' },
      { status: 500 }
    );
  }
}

