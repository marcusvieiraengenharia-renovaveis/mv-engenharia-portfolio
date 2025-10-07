import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  city: z.string().optional(),
  message: z.string().min(5),
  consent: z.boolean().optional()
});

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const parsed = schema.parse(data);

    const to = process.env.CONTACT_TO || "marcusvieira.engenharia@gmail.com";
    const from = process.env.CONTACT_FROM || "no-reply@mv-engenharia.site";
    const key = process.env.RESEND_API_KEY;

    if (key) {
      const resend = new Resend(key);
      await resend.emails.send({
        from,
        to,
        subject: `Novo contato – MV Engenharia (${parsed.name})`,
        reply_to: parsed.email,
        text: `Nome: ${parsed.name}
Email: ${parsed.email}
Telefone: ${parsed.phone || "-"}
Cidade/UF: ${parsed.city || "-"}

Mensagem:
${parsed.message}`
      });
      return NextResponse.json({ ok: true });
    } else {
      console.log("Contato recebido (simulado):", parsed);
      return NextResponse.json({ ok: true, simulated: true });
    }
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || "Erro" }, { status: 400 });
  }
}
