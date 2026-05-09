"use client";

import { useEffect, useState } from "react";

const SUPABASE_URL = "https://psitfprlywjoqcqyelmt.supabase.co";
const SUPABASE_KEY = "sb_publishable_FcZGvs3HP5NZQRuKoFN2DA_QjISgGCy";

export default function Home() {
  const [familias, setFamilias] = useState<any[]>([]);
  const [erro, setErro] = useState("");

  async function carregarFamilias() {
    setErro("");

    const res = await fetch(`${SUPABASE_URL}/rest/v1/Familias?select=*`, {
      method: "GET",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    const texto = await res.text();

    if (!res.ok) {
      setErro(texto);
      return;
    }

    setFamilias(JSON.parse(texto));
  }

  useEffect(() => {
    carregarFamilias();
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>ABC Solidário</h1>

      <button onClick={carregarFamilias}>Atualizar painel</button>

      {erro && (
        <pre style={{ background: "#ffe5e5", color: "red", padding: 15 }}>
          {erro}
        </pre>
      )}

      <table border={1} cellPadding={10} style={{ marginTop: 20, width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Responsável</th>
            <th>Bairro</th>
            <th>Crianças</th>
            <th>Necessidade</th>
            <th>Prioridade</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {familias.map((f) => (
            <tr key={f.id}>
              <td>{f.id}</td>
              <td>{f["Responsável"]}</td>
              <td>{f["Bairro"]}</td>
              <td>{f["Crianças"]}</td>
              <td>{f["Necessidade"]}</td>
              <td>{f["Prioridade"]}</td>
              <td>{f["Status"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}