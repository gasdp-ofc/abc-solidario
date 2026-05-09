"use client";

import { useEffect, useState } from "react";

interface Familia {
  id: number;
  Responsável: string;
  Bairro: string;
  Crianças: number;
  Necessidade: string;
  Prioridade: string;
  Status: string;
}

export default function Home() {
  const [familias, setFamilias] = useState<Familia[]>([]);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function carregarFamilias() {
    try {
      setLoading(true);

      const res = await fetch(
        "https://psitfprlywjoqcqyelmt.supabase.co/rest/v1/Familias?select=*",
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
          },
        }
      );

      if (!res.ok) {
        const texto = await res.text();
        throw new Error(texto);
      }

      const data = await res.json();

      setFamilias(data || []);
      setErro("");
    } catch (err: any) {
      console.error(err);
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarFamilias();
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>ABC Solidário</h1>

      <button onClick={carregarFamilias}>
        {loading ? "Carregando..." : "Atualizar painel"}
      </button>

      {erro && (
        <div
          style={{
            marginTop: 20,
            padding: 15,
            background: "#ffe5e5",
            color: "#b00020",
          }}
        >
          {erro}
        </div>
      )}

      <table
        border={1}
        cellPadding={10}
        style={{ marginTop: 20, width: "100%" }}
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
          {familias.map((familia) => (
            <tr key={familia.id}>
              <td>{familia.id}</td>
              <td>{familia.Responsável}</td>
              <td>{familia.Bairro}</td>
              <td>{familia.Crianças}</td>
              <td>{familia.Necessidade}</td>
              <td>{familia.Prioridade}</td>
              <td>{familia.Status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}