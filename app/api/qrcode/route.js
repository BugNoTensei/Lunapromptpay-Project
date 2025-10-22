import PromptPayQR from "promptpay-qr";
import QRCode from "qrcode";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const mobile = searchParams.get("mobile");
  const amount = parseFloat(searchParams.get("amount")) || 0;

  if (!mobile) {
    return new Response(JSON.stringify({ error: "Missing mobile" }), {
      status: 400,
    });
  }

  const payload = PromptPayQR(mobile, { amount });
const qr = await QRCode.toDataURL(payload, {
  width: 500, 
  margin: 2, 
  color: {
    dark: "#000000", 
    light: "#FFFFFF", 
  },
});  const img = Buffer.from(qr.split(",")[1], "base64");

  return new Response(img, {
    headers: { "Content-Type": "image/png" },
  });
}
