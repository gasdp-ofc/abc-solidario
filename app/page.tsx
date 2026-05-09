"use client";

import React, { useMemo, useState } from "react";
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

const familias = [
  {
    id: "FAM-001",
    responsavel: "Maria Aparecida",
    bairro: "Eldorado",
    criancas: 3,
    necessidade: "Cesta básica e kit higiene",
    prioridade: "Alta",
    ultimoAtendimento: "12/04/2026",
    status: "Ativa",
  },
  {
    id: "FAM-002",
    responsavel: "Joana Santos",
    bairro: "Centro",
    criancas: 2,
    necessidade: "Roupas infantis",
    prioridade: "Média",
    ultimoAtendimento: "18/04/2026",
    status: "Ativa",
  },
  {
    id: "FAM-003",
    responsavel: "Ana Paula",
    bairro: "Casa Grande",
    criancas: 4,
    necessidade: "Leite, alimentos e fraldas",
    prioridade: "Alta",
    ultimoAtendimento: "22/04/2026",
    status: "Em acompanhamento",
  },
  {
    id: "FAM-004",
    responsavel: "Cláudia Ferreira",
    bairro: "Piraporinha",
    criancas: 1,
    necessidade: "Kit limpeza",
    prioridade: "Baixa",
    ultimoAtendimento: "28/04/2026",
    status: "Ativa",
  },
];

const campanhas = [
  { nome: "Cestas Básicas", arrecadado: 400, meta: 500 },
  { nome: "Kits Higiene", arrecadado: 100, meta: 150 },
  { nome: "Crianças Assistidas", arrecadado: 300, meta: 350 },
  { nome: "Famílias", arrecadado: 150, meta: 200 },
];

const evolucao = [
  { mes: "Jan", atendimentos: 45 },
  { mes: "Fev", atendimentos: 58 },
  { mes: "Mar", atendimentos: 73 },
  { mes: "Abr", atendimentos: 91 },
  { mes: "Mai", atendimentos: 108 },
];

const voluntarios = [
  { nome: "Paloma Duarte", funcao: "Fundadora", acoes: 18 },
  { nome: "Gislaine Martins", funcao: "Líder Voluntária", acoes: 14 },
  { nome: "Miria Oliveira", funcao: "Líder Voluntária", acoes: 11 },
  { nome: "Ronaldo Prado", funcao: "Líder Voluntário", acoes: 9 },
];

function badgeClass(valor: string) {
  if (valor === "Alta" || valor === "Em acompanhamento") return "badge danger";
  if (valor === "Média") return "badge warning";
  return "badge success";
}

export default function SolidaryFlowDashboard() {
  const [aba, setAba] = useState("dashboard");
  const [busca, setBusca] = useState("");
  const [listaFamilias, setListaFamilias] = useState(familias);

  const familiasFiltradas = useMemo(() => {
    return listaFamilias.filter((item) =>
      `${item.id} ${item.responsavel} ${item.bairro} ${item.necessidade} ${item.status}`
        .toLowerCase()
        .includes(busca.toLowerCase())
    );
  }, [busca, listaFamilias]);

  const metricas = useMemo(() => {
    return {
      familias: 150,
      criancas: 300,
      cestas: 400,
      kits: 100,
    };
  }, []);

  function simularAtualizacao() {
    setListaFamilias((lista) =>
      lista.map((item) =>
        item.id === "FAM-002"
          ? { ...item, prioridade: "Alta", status: "Em acompanhamento", necessidade: "Cesta básica urgente" }
          : item
      )
    );
  }

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
        .btn { background: #be123c; color: white; border: 0; border-radius: 14px; padding: 14px 20px; cursor: pointer; font-weight: 700; box-shadow: 0 8px 18px rgba(190,18,60,.22); }
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
        @media (max-width: 900px) { .grid4, .grid2, .hero { grid-template-columns: 1fr; } .header { flex-direction: column; align-items: flex-start; } table { font-size: 12px; } }
      `}</style>

      <section className="container">
        <div className="header">
          <div className="brand">
            <div className="logo"><HeartHandshake size={34} /></div>
            <div>
              <h1>SolidaryFlow</h1>
              <p>Plataforma de gestão social para o Instituto Assistencial Amigas Solidárias Diadema & CIA.</p>
            </div>
          </div>
          <button className="btn" onClick={simularAtualizacao}>Atualizar atendimentos</button>
        </div>

        <div className="hero">
          <div className="highlight">
            <h2><HeartHandshake size={26} /> Nossa missão é a solidariedade</h2>
            <p>
              Sistema criado para centralizar famílias cadastradas, doações, voluntários, campanhas e indicadores de impacto social.
            </p>
          </div>
          <div className="card">
            <h2><CalendarDays size={24} /> Próxima ação</h2>
            <p><b>Campanha:</b> Arrecadação de cestas básicas</p>
            <p><b>Local:</b> Rua Louis Pasteur, 106 - Diadema</p>
            <p><b>Status:</b> Em organização</p>
          </div>
        </div>

        <div className="grid4">
          <div className="card metric"><div className="metric-icon"><Users size={28} /></div><div><span>Famílias assistidas</span><strong>+{metricas.familias}</strong></div></div>
          <div className="card metric"><div className="metric-icon"><Baby size={28} /></div><div><span>Crianças assistidas</span><strong>+{metricas.criancas}</strong></div></div>
          <div className="card metric"><div className="metric-icon"><PackageCheck size={28} /></div><div><span>Cestas entregues</span><strong>+{metricas.cestas}</strong></div></div>
          <div className="card metric"><div className="metric-icon"><Gift size={28} /></div><div><span>Kits higiene</span><strong>+{metricas.kits}</strong></div></div>
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
              <h2><BarChart3 size={24} /> Evolução de atendimentos</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={evolucao}>
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="atendimentos" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <h2><Home size={24} /> Distribuição das necessidades</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={[{ name: "Alimentos", value: 45 }, { name: "Higiene", value: 25 }, { name: "Roupas", value: 20 }, { name: "Outros", value: 10 }]} dataKey="value" nameKey="name" outerRadius={100} label>
                    <Cell /><Cell /><Cell /><Cell />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {aba === "familias" && (
          <div className="card">
            <div className="search"><Search size={20} /><input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por família, bairro, necessidade ou status..." /></div>
            <table>
              <thead><tr><th>ID</th><th>Responsável</th><th>Bairro</th><th>Crianças</th><th>Necessidade</th><th>Prioridade</th><th>Status</th></tr></thead>
              <tbody>{familiasFiltradas.map((item) => <tr key={item.id}><td><b>{item.id}</b></td><td>{item.responsavel}</td><td>{item.bairro}</td><td>{item.criancas}</td><td>{item.necessidade}</td><td><span className={badgeClass(item.prioridade)}>{item.prioridade}</span></td><td><span className={badgeClass(item.status)}>{item.status}</span></td></tr>)}</tbody>
            </table>
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
              <div className="list">
                {voluntarios.map((v) => <div className="vol" key={v.nome}><div><b>{v.nome}</b><p>{v.funcao}</p></div><b>{v.acoes} ações</b></div>)}
              </div>
            </div>
            <div className="card">
              <h2><BarChart3 size={24} /> Participação por ações</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={voluntarios}>
                  <XAxis dataKey="nome" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="acoes" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
