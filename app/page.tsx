import Link from 'next/link'

// ============================================================
// Dados para os cards de estatísticas e tipos de câncer
// ============================================================

const stats = [
  {
    id: 'stat-pacientes',
    label: 'Pacientes Cadastrados',
    value: '—',
    icon: 'PAC',
    gradient: '',
    description: 'Total na base de dados',
  },
  {
    id: 'stat-rastreamentos',
    label: 'Rastreamentos Gerados',
    value: '—',
    icon: 'RAD',
    gradient: '',
    description: 'Protocolos emitidos',
  },
  {
    id: 'stat-taxa',
    label: 'Taxa de Detecção',
    value: '—',
    icon: 'DET',
    gradient: '',
    description: 'Pacientes em risco identificados',
  },
  {
    id: 'stat-alertas',
    label: 'Alertas Prioritários',
    value: '—',
    icon: 'ALT',
    gradient: '',
    description: 'Requerem atenção imediata',
  },
]

const cancerTypes = [
  {
    id: 'cancer-pulmonar',
    tipo: 'PULMONAR',
    icon: 'PUL',
    criterio: 'Tabagismo ≥ 20 maços-ano, idade 50–80 anos',
    protocolo: 'TC de baixa dose anual',
    color: '',
  },
  {
    id: 'cancer-colorretal',
    tipo: 'COLORRETAL',
    icon: 'COL',
    criterio: 'Idade ≥ 45 anos, histórico familiar ou pólipos',
    protocolo: 'Colonoscopia a cada 10 anos',
    color: '',
  },
  {
    id: 'cancer-mama',
    tipo: 'MAMA',
    icon: 'MAM',
    criterio: 'Sexo feminino, idade 50–74 anos',
    protocolo: 'Mamografia bienal',
    color: '',
  },
  {
    id: 'cancer-cervical',
    tipo: 'CERVICAL',
    icon: 'CER',
    criterio: 'Sexo feminino, 21–65 anos, sexualmente ativa',
    protocolo: 'Papanicolaou a cada 3 anos',
    color: '',
  },
  {
    id: 'cancer-prostata',
    tipo: 'PRÓSTATA',
    icon: 'PRO',
    criterio: 'Sexo masculino, idade ≥ 50 anos, raça negra ou familiar',
    protocolo: 'PSA + toque retal anual',
    color: '',
  },
  {
    id: 'cancer-pele',
    tipo: 'PELE / MELANOMA',
    icon: 'MEL',
    criterio: 'Exposição solar crônica, nevos atípicos, pele clara',
    protocolo: 'Dermatoscopia anual',
    color: '',
  },
]

// ============================================================
// Componentes internos da página
// ============================================================

function StatCard({
  id,
  label,
  value,
  description,
  delay,
}: (typeof stats)[0] & { delay: number }) {
  return (
    <div
      id={id}
      className="glass-card p-6 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="text-3xl font-bold text-zinc-50 mb-2 font-mono tracking-tight">{value}</p>
      <p className="text-sm font-medium text-zinc-300 mb-1 leading-tight">{label}</p>
      <p className="text-xs text-zinc-600">{description}</p>
    </div>
  )
}

function CancerCard({
  id,
  tipo,
  criterio,
  protocolo,
  delay,
}: (typeof cancerTypes)[0] & { delay: number }) {
  return (
    <div
      id={id}
      className="glass-card p-5 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, borderLeft: '2px solid #3f3f46' }}
    >
      <span className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-widest block mb-3">
        {tipo}
      </span>
      <p className="text-sm text-zinc-400 mb-3 leading-relaxed">
        <span className="text-zinc-600 text-xs block mb-0.5">Critério</span>
        {criterio}
      </p>
      <div className="text-xs font-medium text-zinc-500 border border-zinc-800 px-3 py-1.5 inline-block">
        {protocolo}
      </div>
    </div>
  )
}

// ============================================================
// Página Principal
// ============================================================

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950">

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* ========== Header / Navbar ========== */}
        <header className="flex items-center justify-between mb-16 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-50 flex items-center justify-center flex-shrink-0">
              <span className="text-zinc-950 font-black text-xs select-none">R</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-zinc-100 leading-tight">
                Rastreamento Oncológico
              </h1>
              <p className="text-xs text-zinc-600">em Massa · v1.0.0</p>
            </div>
          </div>

          <nav className="flex items-center gap-2" aria-label="Navegação principal">
            <Link
              id="nav-dashboard"
              href="/dashboard"
              className="btn-secondary text-sm"
            >
              Dashboard
            </Link>
            <Link
              id="nav-novo-paciente"
              href="/rastrear"
              className="btn-primary text-sm"
              aria-label="Iniciar rastreamento"
            >
              Iniciar Rastreamento
            </Link>
          </nav>
        </header>

        {/* ========== Hero Section ========== */}
        <section className="mb-16 animate-fade-in-up-delay-1" aria-labelledby="hero-title">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-zinc-800">
            <span className="w-1.5 h-1.5 bg-zinc-400 block flex-shrink-0" />
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              Sistema Operacional
            </span>
          </div>

          <h2 id="hero-title" className="text-5xl font-black mb-5 leading-tight tracking-tight text-zinc-50">
            Detecção Precoce
            <br />
            <span className="text-zinc-400 text-4xl font-bold">de Câncer via WhatsApp</span>
          </h2>

          <p className="text-base text-zinc-500 max-w-2xl leading-relaxed mb-8">
            Plataforma de rastreamento oncológico em escala populacional.
            Identifica pacientes em risco com base em critérios clínicos validados e
            gera protocolos de rastreamento personalizados automaticamente.
          </p>

          <div className="flex items-center gap-3">
            <Link
              id="cta-iniciar-rastreamento"
              href="/rastrear"
              className="btn-primary"
              aria-label="Iniciar rastreamento oncológico"
            >
              Iniciar Rastreamento
            </Link>
            <Link
              id="cta-ver-relatorios"
              href="/dashboard"
              className="btn-secondary"
              aria-label="Ver painel administrativo"
            >
              Ver Dashboard
            </Link>
          </div>
        </section>

        {/* ========== Cards de Estatísticas ========== */}
        <section className="mb-16" aria-label="Estatísticas do sistema">
          <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-5 animate-fade-in-up-delay-2">
            Métricas em Tempo Real
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800">
            {stats.map((stat, i) => (
              <StatCard key={stat.id} {...stat} delay={200 + i * 60} />
            ))}
          </div>
        </section>

        {/* ========== Protocolos de Rastreamento ========== */}
        <section className="mb-16" aria-label="Tipos de câncer monitorados">
          <div className="flex items-center justify-between mb-5 animate-fade-in-up-delay-3">
            <div>
              <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-widest">
                Protocolos Clínicos Ativos
              </h3>
              <p className="text-xs text-zinc-700 mt-1">
                Baseados nas diretrizes INCA 2024 e USPSTF
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-600 border border-zinc-800 px-2 py-0.5">
              {cancerTypes.length} protocolos
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-800">
            {cancerTypes.map((cancer, i) => (
              <CancerCard key={cancer.id} {...cancer} delay={300 + i * 60} />
            ))}
          </div>
        </section>

        {/* ========== Schema do Banco de Dados ========== */}
        <section className="mb-16 animate-fade-in-up-delay-4" aria-label="Estrutura do banco de dados">
          <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-5">
            Estrutura do Banco de Dados
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800">
            {/* Tabela pacientes */}
            <div id="db-pacientes" className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-zinc-300 font-mono text-sm font-bold">pacientes</span>
                <span className="text-xs text-zinc-600 font-mono">(tabela)</span>
              </div>
              <ul className="space-y-2">
                {[
                  { col: 'id', type: 'UUID', pk: true },
                  { col: 'whatsapp_hash', type: 'String', pk: false },
                  { col: 'idade', type: 'Int', pk: false },
                  { col: 'sexo_biologico', type: 'Enum', pk: false },
                  { col: 'data_cadastro', type: 'DateTime', pk: false },
                ].map(({ col, type, pk }) => (
                  <li key={col} className="flex items-center gap-2 text-xs font-mono">
                    <span className="w-5 text-zinc-600 font-bold shrink-0">{pk ? 'PK' : ''}</span>
                    <span className="text-zinc-300">{col}</span>
                    <span className="text-zinc-600 ml-auto">{type}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tabela respostas_questionario */}
            <div id="db-respostas" className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-zinc-300 font-mono text-sm font-bold">respostas_questionario</span>
                <span className="text-xs text-zinc-600 font-mono">(tabela)</span>
              </div>
              <ul className="space-y-2">
                {[
                  { col: 'id', type: 'UUID', pk: true, fk: false },
                  { col: 'paciente_id', type: 'UUID', pk: false, fk: true },
                  { col: 'chave_pergunta', type: 'String', pk: false, fk: false },
                  { col: 'valor_resposta', type: 'String', pk: false, fk: false },
                ].map(({ col, type, pk, fk }) => (
                  <li key={col} className="flex items-center gap-2 text-xs font-mono">
                    <span className="w-5 text-zinc-600 font-bold shrink-0">{pk ? 'PK' : fk ? 'FK' : ''}</span>
                    <span className="text-zinc-300">{col}</span>
                    <span className="text-zinc-600 ml-auto">{type}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tabela rastreamentos_gerados */}
            <div id="db-rastreamentos" className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-zinc-300 font-mono text-sm font-bold">rastreamentos_gerados</span>
                <span className="text-xs text-zinc-600 font-mono">(tabela)</span>
              </div>
              <ul className="space-y-2">
                {[
                  { col: 'id', type: 'UUID', pk: true, fk: false },
                  { col: 'paciente_id', type: 'UUID', pk: false, fk: true },
                  { col: 'tipo_cancer', type: 'String', pk: false, fk: false },
                  { col: 'criterio_clinico', type: 'String', pk: false, fk: false },
                  { col: 'data_geracao', type: 'DateTime', pk: false, fk: false },
                ].map(({ col, type, pk, fk }) => (
                  <li key={col} className="flex items-center gap-2 text-xs font-mono">
                    <span className="w-5 text-zinc-600 font-bold shrink-0">{pk ? 'PK' : fk ? 'FK' : ''}</span>
                    <span className="text-zinc-300">{col}</span>
                    <span className="text-zinc-600 ml-auto">{type}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ========== Footer ========== */}
        <footer className="text-center border-t border-zinc-900 pt-8 animate-fade-in-up-delay-4">
          <p className="text-xs text-zinc-700">
            Rastreamento Oncológico em Massa · Next.js + Prisma ORM + PostgreSQL · Netlify
          </p>
          <p className="text-xs text-zinc-800 mt-2">
            Uso restrito a profissionais de saúde autorizados. Dados protegidos por LGPD.
          </p>
        </footer>

      </div>
    </main>
  )
}
