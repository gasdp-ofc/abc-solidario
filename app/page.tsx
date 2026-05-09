"use client";

import { useEffect, useState } from "react";

const SUPABASE_URL = "https://psitfprlywjoqcqyelmt.supabase.co";
const SUPABASE_KEY = "sb_publishable_FcZGvs3HP5NZQRuKoFN2DA_QjISgGCy";

export default function Home() {
  const [familias, setFamilias] = useState<any[]>([]);
  const [erro, setErro] = useState("");

  async function carregarFamilias() {
    setErro("");

    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/Familias?select=*`,
        {
          method: "GET",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const texto = await res.text();

      if (!res.ok) {
        setErro(texto);
        return;
      }

      const data = JSON.parse(texto);

      console.log(data);

      setFamilias(data);
    } catch (err: any) {
      console.error(err);
      setErro(err.message);
    }
  }

  useEffect(() => {
    carregarFamilias();
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>ABC Solidário</h1>

      <button onClick={carregarFamilias}>
        Atualizar painel
      </button>

      {erro && (
        <div
          style={{
            background: "#ffe5e5",
            color: "red",
            padding: 15,
            marginTop: 20,
          }}
        >
          {erro}
        </div>
      )}

      <table
        border={1}
        cellPadding={10}
        style={{
          marginTop: 20,
          width: "100%",
        }}
      >
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
              <td>{f.Responsável || f.responsavel}</td>
              <td>{f.Bairro || f.bairro}</td>
              <td>{f.Crianças || f.criancas}</td>
              <td>{f.Necessidade || f.necessidade}</td>
              <td>{f.Prioridade || f.prioridade}</td>
              <td>{f.Status || f.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <pre
        style={{
          marginTop: 30,
          background: "#f5f5f5",
          padding: 15,
          overflow: "auto",
        }}
      >
        {JSON.stringify(familias, null, 2)}
      </pre>
    </main>
  );
}