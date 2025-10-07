"use client";
import { useState } from "react";

export default function Page(){
  const [status, setStatus] = useState<"idle"|"loading"|"ok"|"error">("idle");
  const [error, setError] = useState<string>("");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    setStatus("loading"); setError("");
    const form = e.currentTarget as any;
    const payload = { name: form.name.value, email: form.email.value, phone: form.phone.value, city: form.city.value, message: form.message.value, consent: form.consent.checked };
    try{
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify(payload) });
      const json = await res.json();
      if(res.ok && json.ok){ setStatus("ok"); form.reset(); }
      else { setStatus("error"); setError(json.error || "Falha ao enviar."); }
    }catch(err:any){ setStatus("error"); setError(err?.message || "Falha ao enviar."); }
  }
  return (<div className="space-y-4 max-w-2xl">
      <h1 className="text-3xl font-semibold">Contato</h1>
      <p>Vamos dimensionar seu projeto?</p>
      <form onSubmit={onSubmit} className="space-y-3">
        <div><label htmlFor="name">Nome</label><input id="name" name="name" required /></div>
        <div className="grid md:grid-cols-2 gap-3">
          <div><label htmlFor="email">E-mail</label><input id="email" name="email" type="email" required /></div>
          <div><label htmlFor="phone">WhatsApp/Telefone</label><input id="phone" name="phone" /></div>
        </div>
        <div><label htmlFor="city">Cidade/UF</label><input id="city" name="city" /></div>
        <div><label htmlFor="message">Mensagem</label><textarea id="message" name="message" rows={5} required /></div>
        <div className="text-sm"><label className="inline-flex items-center gap-2"><input type="checkbox" id="consent" name="consent" /> Autorizo o tratamento dos meus dados para contato comercial (LGPD).</label></div>
        <button disabled={status==="loading"}>{status==="loading" ? "Enviando..." : "Enviar"}</button>
      </form>
      {status==="ok" && <p className="text-green-600">Mensagem enviada com sucesso!</p>}
      {status==="error" && <p className="text-red-600">Erro: {error}</p>}
      <div className="pt-4">
        <p className="text-sm opacity-70">Canais diretos:</p>
        <ul className="space-y-1 text-sm">
          <li><a className="underline" href="https://wa.me/5519992327688?text=Ol%C3%A1%20Marcus%2C%20gostaria%20de%20um%20or%C3%A7amento" target="_blank">WhatsApp: +55 19 99232-7688</a></li>
          <li><a className="underline" href="mailto:marcusvieira.engenharia@gmail.com">E-mail: marcusvieira.engenharia@gmail.com</a></li>
        </ul>
      </div>
    </div>)
}
