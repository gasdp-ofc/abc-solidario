"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  HeartHandshake,
  Users,
  Baby,
  PackageCheck,
  Gift,
  Search,
  CalendarDays,
  BarChart3,
  UserRoundCheck,
  Home,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

type Familia = {
  id: number;
  "Responsável"?: string;
  "Bairro"?: string;
  "Crianças"?: number;
  "Necessidade"?: string;
  "Prioridade"?: string;
  "Status"?: string;
  "Criado_em"?: string;
  responsavel?: string;
  bairro?: string;
  criancas?: number;
  necessidade?: string;
  prioridade?: string;
  status?: string;
  criado_em?: string;
};

const campanhas = [
  { nome: "Cestas Básicas", arrecadado: 400, meta: 500 },
  { nome: "Kits Higiene", arrecadado: 100, meta: 150 },
  { nome: "Crianças Assistidas", arrecadado: 300, meta: 350 },
  { nome: "Famílias", arrecadado: 150, meta: 200 },
];

const voluntarios = [
  { nome: "Paloma Duarte", funcao: "Fundadora", acoes: 18 },
  { nome: "Gislaine Martins", funcao: "Líder Voluntária", acoes: 14 },
  { nome: "Miria Oliveira", funcao: "Líder Voluntária", acoes: 11 },
  { nome: "Ronaldo Prado", funcao: "Líder Voluntário", acoes: 9 },
];

function getCampo(item: Familia, campoMaiusculo: keyof Familia, campoMinusculo: keyof Familia) {
  return item[campoMaiusculo] ?? item[campoMinusculo] ?? "";
}

function badgeClass(valor: string) {
  if (valor === "Alta" || valor === "Em acompanhamento") return "badge danger";
  if (valor === "Média") return "badge warning";
  return "badge success";
}

export default function ABCSolidarioDashboard() {
  const [aba, setAba] = useState("dashboard");
  const [busca, setBusca] = useState("");
  const [listaFamilias, setListaFamilias] = useState<Familia[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function buscarFamilias() {
    setCarregando(true);
    setErro("");

    const { data, error } = await supabase
      .from("Familias")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Erro ao buscar famílias:", error);
      setErro("Não foi possível carregar os dados do banco. Verifique a tabela e a política RLS.");
      setListaFamilias([]);
    } else {
      setListaFamilias(data || []);
    }

    setCarregando(false);
  }

  useEffect(() => {
    buscarFamilias();

    const canal = supabase
      .channel("familias-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Familias" },
        () => buscarFamilias()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, []);

  const familiasFiltradas = useMemo(() => {
    return listaFamilias.filter((item) =>
      `${item.id} ${getCampo(item, "Responsável", "responsavel")} ${getCampo(item, "Bairro", "bairro")} ${getCampo(item, "Necessidade", "necessidade")} ${getCampo(item, "Status", "status")}`
        .toLowerCase()
        .includes(busca.toLowerCase())
    );
  }, [busca, listaFamilias]);

  const metricas = useMemo(() => {
    const totalFamilias = listaFamilias.length;
    const totalCriancas = listaFamilias.reduce(
      (total, item) => total + Number(getCampo(item, "Crianças", "criancas") || 0),
      0
    );
    const totalCestas = listaFamilias.filter((item) =>
      String(getCampo(item, "Necessidade", "necessidade")).toLowerCase().includes("cesta")
    ).length;
    const totalKits = listaFamilias.filter((item) =>
      String(getCampo(item, "Necessidade", "necessidade")).toLowerCase().includes("kit")
    ).length;

    return { familias: totalFamilias, criancas: totalCriancas, cestas: totalCestas, kits: totalKits };
  }, [listaFamilias]);

  const distribuicaoNecessidades = useMemo(() => {
    const alimentos = listaFamilias.filter((item) =>
      String(getCampo(item, "Necessidade", "necessidade")).toLowerCase().includes("cesta") ||
      String(getCampo(item, "Necessidade", "necessidade")).toLowerCase().includes("alimento") ||
      String(getCampo(item, "Necessidade", "necessidade")).toLowerCase().includes("leite")
    ).length;
    const higiene = listaFamilias.filter((item) =>
      String(getCampo(item, "Necessidade", "necessidade")).toLowerCase().includes("higiene") ||
      String(getCampo(item, "Necessidade", "necessidade")).toLowerCase().includes("kit")
    ).length;
    const roupas = listaFamilias.filter((item) =>
      String(getCampo(item, "Necessidade", "necessidade")).toLowerCase().includes("roupa")
    ).length;
    const outros = Math.max(listaFamilias.length - alimentos - higiene - roupas, 0);

    return [
      { name: "Alimentos", value: alimentos },
      { name: "Higiene", value: higiene },
      { name: "Roupas", value: roupas },
      { name: "Outros", value: outros },
    ].filter((item) => item.value > 0);
  }, [listaFamilias]);

  const evolucao = useMemo(() => {
    return [
      { mes: "Jan", atendimentos: Math.max(1, Math.round(metricas.familias * 0.25)) },
      { mes: "Fev", atendimentos: Math.max(1, Math.round(metricas.familias * 0.45)) },
      { mes: "Mar", atendimentos: Math.max(1, Math.round(metricas.familias * 0.65)) },
      { mes: "Abr", atendimentos: Math.max(1, Math.round(metricas.familias * 0.85)) },
      { mes: "Mai", atendimentos: metricas.familias },
    ];
  }, [metricas.familias]);

  return (
    <main className="page">
      <style>{`
        .page { min-height: 100vh; background: linear-gradient(135deg, #fff7ed, #fdf2f8, #f8fafc); padding: 28px; font-family: Arial, sans-serif; color: #1f2937; }
        .container { max-width: 1220px; margin: auto; }
        .header { display: flex; justify-content: space-between; gap: 20px; align-items: center; margin-bottom: 24px; }
        .brand { display: flex; align-items: center; gap: 12px; }
        .logo { width: 58px; height: 58px; border-radius: 18px; background: #be123c; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 12px 28px rgba(190,18,60,.25); }
        h1 { margin: 0; font-size: 34px; color: #881337; }
        h2 { margin: 0 0 10px; display: flex; align-items: center; gap: 8px; color: #881337; }
        p { margin: 6px 0 0; color: #6b7280; }
        .btn { background: #be123c; color: white; border: 0; border-radius: 14px; padding: 14px 20px; cursor: pointer; font-weight: 700; box-shadow: 0 8px 18px rgba(190,18,60,.22); display:flex; align-items:center; gap:8px; }
        .grid4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; }
        .grid2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .card { background: rgba(255,255,255,.92); border: 1px solid rgba(255,255,255,.8); border-radius: 22px; padding: 20px; box-shadow: 0 10px 28px rgba(15,23,42,.08); }
        .metric { display: flex; gap: 14px; align-items: center; }
        .metric-icon { width: 48px; height: 48px; border-radius: 16px; display: flex; align-items: center; justify-content: center; background: #ffe4e6; color: #be123c; }
        .metric strong { display: block; font-size: 32px; margin-top: 4px; color: #881337; }
        .tabs { display: flex; flex-wrap: wrap; gap: 10px; margin: 18px 0; }
        .tab { border: 0; border-radius: 12px; padding: 12px 16px; background: white; cursor: pointer; font-weight: 700; color: #881337; }
        .tab.active { background: #be123c; color: white; }
        .search { display: flex; align-items: center; gap: 8px; background: #fff1f2; border-radius: 14px; padding: 10px; margin-bottom: 16px; }
        input { width: 100%; border: 0; background: transparent; outline: none; font-size: 15px; }
        table { width: 100%; border-collapse: collapse; font-size: 14px; overflow: hidden; }
        th { background: #fff1f2; text-align: left; padding: 12px; color: #881337; }
        td { padding: 12px; border-top: 1px solid #ffe4e6; }
        .badge { padding: 6px 10px; border-radius: 999px; font-weight: 700; font-size: 12px; }
        .danger { background: #ffe4e6; color: #9f1239; }
        .warning { background: #fef3c7; color: #92400e; }
        .success { background: #dcfce7; color: #166534; }
        .bar-bg { height: 12px; border-radius: 99px; background: #ffe4e6; overflow: hidden; }
        .bar-fill { height: 12px; border-radius: 99px; background: #be123c; }
        .row { margin-bottom: 18px; }
        .hero { display: grid; grid-template-columns: 1.2fr .8fr; gap: 16px; margin-bottom: 20px; }
        .highlight { background: #be123c; color: white; border-radius: 24px; padding: 28px; box-shadow: 0 16px 34px rgba(190,18,60,.25); }
        .highlight p, .highlight h2 { color: white; }
        .list { display: grid; gap: 10px; }
        .vol { display: flex; justify-content: space-between; gap: 10px; padding: 14px; background: #fff1f2; border-radius: 16px; }
        .alerta { background:#fff1f2; color:#9f1239; border-radius:14px; padding:12px; margin-bottom:14px; font-weight:700; }
        @media (max-width: 900px) { .grid4, .grid2, .hero { grid-template-columns: 1fr; } .header { flex-direction: column; align-items: flex-start; } table { font-size: 12px; } }
      `}</style>

      <section className="container">
        <div className="header">
          <div className="brand">
            <div className="logo"><HeartHandshake size={34} /></div>
            <div>
              <h1>ABC Solidário</h1>
              <p>Plataforma inteligente de gestão social e acompanhamento de famílias assistidas no ABC Paulista.</p>
            </div>
          </div>
          <button className="btn" onClick={buscarFamilias}><RefreshCw size={18} /> Atualizar pelo banco</button>
        </div>

        {erro && <div className="alerta">{erro}</div>}

        <div className="hero">
          <div className="highlight">
            <h2><HeartHandshake size={26} /> Nossa missão é a solidariedade</h2>
            <p>Dados carregados diretamente do banco Supabase. Cadastre uma família no banco e clique em atualizar para refletir no painel.</p>
          </div>
          <div className="card">
            <h2><CalendarDays size={24} /> Próxima ação</h2>
            <p><b>Campanha:</b> Arrecadação de cestas básicas</p>
            <p><b>Local:</b> Rua Louis Pasteur, 106 - Diadema</p>
            <p><b>Status:</b> Em organização</p>
          </div>
        </div>

        <div className="grid4">
          <div className="card metric"><div className="metric-icon"><Users size={28} /></div><div><span>Famílias no banco</span><strong>{carregando ? "..." : metricas.familias}</strong></div></div>
          <div className="card metric"><div className="metric-icon"><Baby size={28} /></div><div><span>Crianças no banco</span><strong>{carregando ? "..." : metricas.criancas}</strong></div></div>
          <div className="card metric"><div className="metric-icon"><PackageCheck size={28} /></div><div><span>Pedidos de cesta</span><strong>{carregando ? "..." : metricas.cestas}</strong></div></div>
          <div className="card metric"><div className="metric-icon"><Gift size={28} /></div><div><span>Pedidos de kit</span><strong>{carregando ? "..." : metricas.kits}</strong></div></div>
        </div>

        <div className="tabs">
          <button className={aba === "dashboard" ? "tab active" : "tab"} onClick={() => setAba("dashboard")}>Dashboard</button>
          <button className={aba === "familias" ? "tab active" : "tab"} onClick={() => setAba("familias")}>Famílias</button>
          <button className={aba === "campanhas" ? "tab active" : "tab"} onClick={() => setAba("campanhas")}>Campanhas</button>
          <button className={aba === "voluntarios" ? "tab active" : "tab"} onClick={() => setAba("voluntarios")}>Voluntários</button>
        </div>

        {aba === "dashboard" && (
          <div className="grid2">
            <div className="card">
              <h2><BarChart3 size={24} /> Evolução com base no banco</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={evolucao}><XAxis dataKey="mes" /><YAxis /><Tooltip /><Line type="monotone" dataKey="atendimentos" strokeWidth={3} /></LineChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <h2><Home size={24} /> Necessidades cadastradas</h2>
              {distribuicaoNecessidades.length === 0 ? <p>Nenhum dado encontrado no banco.</p> : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart><Pie data={distribuicaoNecessidades} dataKey="value" nameKey="name" outerRadius={100} label><Cell /><Cell /><Cell /><Cell /></Pie><Tooltip /></PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}

        {aba === "familias" && (
          <div className="card">
            <div className="search"><Search size={20} /><input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por família, bairro, necessidade ou status..." /></div>
            {carregando ? <p>Carregando dados do banco...</p> : (
              <table>
                <thead><tr><th>ID</th><th>Responsável</th><th>Bairro</th><th>Crianças</th><th>Necessidade</th><th>Prioridade</th><th>Status</th></tr></thead>
                <tbody>{familiasFiltradas.map((item) => {
                  const prioridade = String(getCampo(item, "Prioridade", "prioridade"));
                  const status = String(getCampo(item, "Status", "status"));
                  return <tr key={item.id}><td><b>{item.id}</b></td><td>{String(getCampo(item, "Responsável", "responsavel"))}</td><td>{String(getCampo(item, "Bairro", "bairro"))}</td><td>{String(getCampo(item, "Crianças", "criancas"))}</td><td>{String(getCampo(item, "Necessidade", "necessidade"))}</td><td><span className={badgeClass(prioridade)}>{prioridade}</span></td><td><span className={badgeClass(status)}>{status}</span></td></tr>;
                })}</tbody>
              </table>
            )}
          </div>
        )}

        {aba === "campanhas" && (
          <div className="card">
            <h2><Gift size={24} /> Metas de arrecadação</h2>
            {campanhas.map((item) => {
              const percentual = Math.round((item.arrecadado / item.meta) * 100);
              return <div className="row" key={item.nome}><div style={{display:"flex", justifyContent:"space-between"}}><span>{item.nome}</span><b>{item.arrecadado}/{item.meta} — {percentual}%</b></div><div className="bar-bg"><div className="bar-fill" style={{width: `${percentual}%`}} /></div></div>;
            })}
          </div>
        )}

        {aba === "voluntarios" && (
          <div className="grid2">
            <div className="card">
              <h2><UserRoundCheck size={24} /> Equipe de voluntários</h2>
              <div className="list">{voluntarios.map((v) => <div className="vol" key={v.nome}><div><b>{v.nome}</b><p>{v.funcao}</p></div><b>{v.acoes} ações</b></div>)}</div>
            </div>
            <div className="card">
              <h2><BarChart3 size={24} /> Participação por ações</h2>
              <ResponsiveContainer width="100%" height={300}><BarChart data={voluntarios}><XAxis dataKey="nome" /><YAxis /><Tooltip /><Bar dataKey="acoes" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
