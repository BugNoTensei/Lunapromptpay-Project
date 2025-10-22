import PromptPayQR from "promptpay-qr";
import QRCode from "qrcode";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const mobile = searchParams.get("mobile");
    const amount = parseFloat(searchParams.get("amount")) || 0;

    if (!mobile) {
      return new Response(JSON.stringify({ error: "Missing mobile" }), {
        status: 400,
      });
    }

    const payload = PromptPayQR(mobile, { amount });
    const qr = await QRCode.toDataURL(payload);
    const img = Buffer.from(qr.split(",")[1], "base64");

    return new Response(img, {
      headers: { "Content-Type": "image/png" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
