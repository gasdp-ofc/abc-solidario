use client;

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Familia {
  id: number;
  responsavel: string;
  bairro: string;
  criancas: number;
  necessidade: string;
  prioridade: string;
  status: string;
  ultimo_atendimento: string;
}

export default function Page() {
  const [familias, setFamilias] = useState<Familia[]>([]);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(true);

  async function carregarFamilias() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("Familias")
        .select("*");

      if (error) {
        console.error(error);
        setErro(error.message);
        return;
      }

      setFamilias(data || []);
      setErro("");
    } catch (err) {
      console.error(err);
      setErro("Erro ao conectar com Supabase");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarFamilias();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        ABC Solidário
      </h1>

      <button
        onClick={carregarFamilias}
        className="bg-red-700 text-white px-4 py-2 rounded mb-6"
      >
        Atualizar painel
      </button>

      {erro && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {erro}
        </div>
      )}

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Responsável</th>
              <th className="p-2 border">Bairro</th>
              <th className="p-2 border">Crianças</th>
              <th className="p-2 border">Necessidade</th>
              <th className="p-2 border">Prioridade</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">
                Último atendimento
              </th>
            </tr>
          </thead>

          <tbody>
            {familias.map((familia) => (
              <tr key={familia.id}>
                <td className="p-2 border">{familia.id}</td>
                <td className="p-2 border">
                  {familia.responsavel}
                </td>
                <td className="p-2 border">
                  {familia.bairro}
                </td>
                <td className="p-2 border">
                  {familia.criancas}
                </td>
                <td className="p-2 border">
                  {familia.necessidade}
                </td>
                <td className="p-2 border">
                  {familia.prioridade}
                </td>
                <td className="p-2 border">
                  {familia.status}
                </td>
                <td className="p-2 border">
                  {familia.ultimo_atendimento}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}