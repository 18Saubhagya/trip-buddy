import formData from "form-data";
import Mailgun from "mailgun.js";
import "dotenv/config";

const mailgun = new Mailgun(formData);

const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY,
    url: process.env.MAILGUN_BASE_URL || "https://api.mailgun.net",
});

export async function sendMail({
    to,
    status,
    itineraryName,
    tripId,
}) {
    const fromEmail = process.env.MAILGUN_FROM_EMAIL;
    const domain = process.env.MAILGUN_DOMAIN;

    const subject =
    status === "completed"
      ? `🎉 Your itinerary for ${itineraryName} is ready!`
      : `⚠️ Itinerary generation for ${itineraryName} failed`;

    const html = status === "completed" ? `
        <div style="font-family:Arial, sans-serif; color:#333;">
        <h2>Your Trip Itinerary is Ready 🚀</h2>
        <p>Hey there! Your AI-generated itinerary for <b>${itineraryName}</b> has been successfully created.</p>
        <p>Click below to view your detailed plan:</p>
        <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/trip/${tripId}" 
            style="background:#2563eb;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;">
            View Itinerary
            </a>
        </p>
        <br/>
        <p>Happy travels,<br/>The TripBuddy Team 🌍</p>
        </div>
    ` : `
        <h2>Itinerary Generation Failed ❌</h2>
        <p>We couldn't generate your itinerary for <b>${itineraryName}</b>.</p>
        <p>You can retry it anytime from your trip page. </p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/trip/${tripId}"
        style="background:#2563eb;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;">
        View Trip
        <br/>
        <p>Happy travels,<br/>The TripBuddy Team 🌍</p>
        </a>
    `;

    await mg.messages.create(domain, {
        from: fromEmail,
        to,
        subject: subject,
        html,
    });
}
