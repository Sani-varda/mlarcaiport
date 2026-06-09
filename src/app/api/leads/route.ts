import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, message } = body;

    // Validate parameters
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message parameters are required." },
        { status: 400 }
      );
    }

    const leadData = {
      timestamp: new Date().toISOString(),
      name,
      email,
      phone: phone || "N/A",
      company: company || "N/A",
      message,
    };

    // 1. Save locally to leads.json in the workspace root directory so no leads are ever lost
    const leadsFilePath = path.join(process.cwd(), "leads.json");
    let existingLeads = [];
    
    try {
      if (fs.existsSync(leadsFilePath)) {
        const fileContent = fs.readFileSync(leadsFilePath, "utf8");
        existingLeads = JSON.parse(fileContent);
      }
    } catch (readErr) {
      console.error("Error reading existing leads.json:", readErr);
    }

    existingLeads.push(leadData);

    try {
      fs.writeFileSync(leadsFilePath, JSON.stringify(existingLeads, null, 2), "utf8");
    } catch (writeErr) {
      console.error("Error saving lead locally to leads.json:", writeErr);
    }

    // 2. Log to server console
    console.log("\n=================== NEW LEAD INGESTED ===================");
    console.log(`Timestamp: ${leadData.timestamp}`);
    console.log(`Name     : ${leadData.name}`);
    console.log(`Email    : ${leadData.email}`);
    console.log(`Phone    : ${leadData.phone}`);
    console.log(`Company  : ${leadData.company}`);
    console.log(`Message  : ${leadData.message}`);
    console.log("=========================================================\n");

    // 3. If RESEND_API_KEY env variable is available, send email
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            from: "Leads <onboarding@resend.dev>",
            to: "founder@mlarcai.com",
            subject: `[ML Arc Portfolio Lead] - ${name} (${company || "Individual"})`,
            html: `
              <h2>New Lead Ingested via Portfolio Form</h2>
              <p><strong>Timestamp:</strong> ${leadData.timestamp}</p>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || "N/A"}</p>
              <p><strong>Company/Entity:</strong> ${company || "N/A"}</p>
              <br />
              <p><strong>Message / Scope:</strong></p>
              <blockquote style="border-left: 3px solid #2563eb; padding-left: 15px; font-style: italic;">
                ${message.replace(/\n/g, "<br />")}
              </blockquote>
            `,
          }),
        });

        if (!emailResponse.ok) {
          const errBody = await emailResponse.text();
          console.error("Resend API responded with error:", errBody);
          return NextResponse.json({
            success: true,
            message: "Lead recorded locally, but email delivery service failed.",
            warning: "Email transmission error.",
          });
        }
      } catch (emailErr) {
        console.error("Error sending email via Resend:", emailErr);
        return NextResponse.json({
          success: true,
          message: "Lead recorded locally, but email transmission failed.",
          warning: "Email routing error.",
        });
      }
    } else {
      console.warn("RESEND_API_KEY is not defined in environment variables. Skipped email transmission.");
    }

    return NextResponse.json({ 
      success: true, 
      message: "Lead credentials processed and logged successfully." 
    });
  } catch (error) {
    console.error("Lead submission endpoint failure:", error);
    return NextResponse.json(
      { error: "Internal server error processing lead transmission." },
      { status: 500 }
    );
  }
}
