'use client'

/**
 * app/dashboard/page.tsx
 * Painel administrativo com métricas em tempo real do sistema de rastreamento.
 * Consome o endpoint GET /api/stats e atualiza automaticamente a cada 30s.
 */

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface Stats {
  total_pacientes: number
  total_rastreamentos: number
  taxa_deteccao_percent: string
  alertas_urgentes: number
  cadastros_hoje: number
  por_tipo_cancer: { tipo: string; total: number }[]
  timestamp: string
}

// Configuração visual por tipo de câncer
const tipoConfig: Record<string, { cor: string; icone: string; label: string }> = {
  PULMONAR:   { cor: '#a1a1aa', icone: '', label: 'Pulmonar' },
  COLORRETAL: { cor: '#a1a1aa', icone: '', label: 'Colorretal' },
  MAMA:       { cor: '#a1a1aa', icone: '', label: 'Mama' },
  CERVICAL:   { cor: '#a1a1aa', icone: '', label: 'Cervical' },
  PROSTATA:   { cor: '#a1a1aa', icone: '', label: 'Próstata' },
  MELANOMA:   { cor: '#a1a1aa', icone: '', label: 'Melanoma' },
}

function formatNum(n: number): string {
  return n.toLocaleString('pt-BR')
}

// ============================================================
// Componentes
// ============================================================

function MetricCard({
  id,
  label,
  value,
  sub,
  delay,
}: {
  id: string
  label: string
  value: string | number
  sub?: string
  icon: string
  gradient: string
  delay: number
}) {
  return (
    <div
      id={id}
      className="glass-card p-6 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="text-3xl font-black text-zinc-50 mb-2 font-mono tracking-tight">{value}</p>
      <p className="text-sm font-medium text-zinc-300 mb-0.5 leading-tight">{label}</p>
      {sub && <p className="text-xs text-zinc-600">{sub}</p>}
    </div>
  )
}

// ============================================================
// Página
// ============================================================

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats', { cache: 'no-store' })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || `HTTP ${res.status}`)
      }
      const data: Stats = await res.json()
      setStats(data)
      setLastUpdate(new Date())
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar métricas.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    // Atualiza a cada 30 segundos
    const interval = setInterval(fetchStats, 30_000)
    return () => clearInterval(interval)
  }, [fetchStats])

  // Calcula max para barra de progresso
  const maxTipoCancer = stats?.por_tipo_cancer.reduce((m, t) => Math.max(m, t.total), 0) ?? 1

  return (
    <main className="min-h-screen bg-zinc-950">

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <header className="flex items-center justify-between mb-10 animate-fade-in-up">
          <div>
            <h1 className="text-2xl font-black text-zinc-50 mb-1 tracking-tight">Dashboard</h1>
            <p className="text-sm text-zinc-600">
              {lastUpdate
                ? `Atualizado às ${lastUpdate.toLocaleTimeString('pt-BR')} · atualiza a cada 30s`
                : 'Carregando métricas...'}
            </p>
          </div>
          <nav className="flex items-center gap-2">
            <button
              id="btn-refresh"
              onClick={fetchStats}
              className="btn-secondary text-sm"
              type="button"
              aria-label="Atualizar métricas"
            >
              Atualizar
            </button>
            <Link id="link-rastrear" href="/rastrear" className="btn-primary text-sm">
              + Novo Rastreamento
            </Link>
          </nav>
        </header>

        {/* Estado de erro */}
        {error && (
          <div
            className="glass-card p-5 mb-8 text-sm animate-fade-in-up"
            style={{
              borderColor: 'rgba(239,68,68,0.2)',
              color: '#fca5a5',
              background: 'rgba(239,68,68,0.07)',
            }}
          >
            <strong>Erro ao carregar métricas:</strong> {error}
            <br />
            <span className="text-zinc-600 text-xs mt-1 block">
              Verifique se o banco de dados está configurado em .env.local
            </span>
          </div>
        )}

        {/* Skeleton / Loading */}
        {loading && !error && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800 mb-10">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="glass-card p-6 animate-pulse"
                style={{ height: 128, animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>
        )}

        {/* Métricas principais */}
        {stats && !loading && (
          <>
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800 mb-10" aria-label="Métricas principais">
              <MetricCard
                id="metric-pacientes"
                label="Total de Pacientes"
                value={formatNum(stats.total_pacientes)}
                sub="cadastrados na base"
                icon=""
                gradient=""
                delay={0}
              />
              <MetricCard
                id="metric-rastreamentos"
                label="Rastreamentos Gerados"
                value={formatNum(stats.total_rastreamentos)}
                sub="protocolos emitidos"
                icon=""
                gradient=""
                delay={60}
              />
              <MetricCard
                id="metric-taxa"
                label="Taxa de Detecção"
                value={`${stats.taxa_deteccao_percent}%`}
                sub="pacientes com rastreamento"
                icon=""
                gradient=""
                delay={120}
              />
              <MetricCard
                id="metric-urgentes"
                label="Alertas Urgentes"
                value={formatNum(stats.alertas_urgentes)}
                sub="requerem atenção imediata"
                icon=""
                gradient=""
                delay={180}
              />
            </section>

            {/* Sub-métrica: hoje */}
            <div
              className="glass-card p-4 mb-10 flex items-center gap-4 animate-fade-in-up-delay-2"
            >
              <div className="w-1 h-8 bg-zinc-600 shrink-0" />
              <div>
                <span className="text-sm font-bold text-zinc-100 font-mono">{stats.cadastros_hoje}</span>
                <span className="text-sm text-zinc-500"> novos cadastros hoje</span>
              </div>
              <div className="ml-auto">
                <span className="text-xs font-semibold font-mono text-zinc-600 border border-zinc-800 px-2 py-0.5">
                  HOJE
                </span>
              </div>
            </div>

            {/* Distribuição por tipo de câncer */}
            {stats.por_tipo_cancer.length > 0 && (
              <section className="mb-10" aria-label="Distribuição por tipo de câncer">
                <h2 className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-5 animate-fade-in-up-delay-2">
                  Distribuição por Tipo de Câncer
                </h2>
                <div className="glass-card p-6 space-y-5 animate-fade-in-up-delay-3">
                  {stats.por_tipo_cancer.map((item, i) => {
                    const cfg = tipoConfig[item.tipo] ?? { cor: '#a1a1aa', icone: '', label: item.tipo }
                    const pct = maxTipoCancer > 0 ? (item.total / maxTipoCancer) * 100 : 0

                    return (
                      <div key={item.tipo} id={`bar-${item.tipo.toLowerCase()}`} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-mono text-zinc-400 uppercase tracking-wide">{cfg.label}</span>
                          <span className="text-sm font-mono font-bold text-zinc-300">
                            {formatNum(item.total)}
                          </span>
                        </div>
                        <div className="w-full h-px bg-zinc-800">
                          <div
                            className="h-full transition-all duration-700"
                            style={{
                              width: `${pct}%`,
                              background: '#3f3f46',
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Mensagem quando banco está vazio */}
            {stats.total_pacientes === 0 && (
              <div className="glass-card p-10 text-center animate-fade-in-up-delay-3">
                <div className="w-2 h-2 bg-zinc-700 mx-auto mb-6" />
                <h3 className="text-base font-bold text-zinc-300 mb-2">Base de dados vazia</h3>
                <p className="text-sm text-zinc-600 mb-6">
                  Nenhum paciente cadastrado ainda. Inicie um rastreamento para ver os dados aqui.
                </p>
                <Link id="link-iniciar-rastreamento" href="/rastrear" className="btn-primary">
                  Iniciar primeiro rastreamento
                </Link>
              </div>
            )}
          </>
        )}

        {/* Links para outras rotas */}
        <nav className="glass-card p-5 animate-fade-in-up-delay-4" aria-label="Navegação rápida">
          <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-4">
            Acesso Rápido
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-zinc-800">
            {[
              { id: 'link-home',          href: '/',             label: 'Início',        sub: 'Página principal' },
              { id: 'link-rastrear-nav',  href: '/rastrear',     label: 'Rastrear',      sub: 'Novo questionário' },
              { id: 'link-api-health',    href: '/api/health',   label: 'API Health',    sub: 'Status do sistema' },
              { id: 'link-api-stats',     href: '/api/stats',    label: 'API Stats',     sub: 'JSON das métricas' },
              { id: 'link-api-pacientes', href: '/api/pacientes', label: 'API Pacientes', sub: 'POST para cadastrar' },
            ].map((link) => (
              <Link
                key={link.id}
                id={link.id}
                href={link.href}
                className="glass-card p-4 text-left transition-all block"
                target={link.href.startsWith('/api') ? '_blank' : undefined}
              >
                <p className="text-sm font-mono font-semibold text-zinc-300">{link.label}</p>
                <p className="text-xs text-zinc-600">{link.sub}</p>
              </Link>
            ))}
          </div>
        </nav>

        <footer className="text-center mt-8 animate-fade-in-up-delay-4">
          <p className="text-xs text-zinc-800">
            Rastreamento Oncológico em Massa · Next.js + Prisma + PostgreSQL
          </p>
        </footer>

      </div>
    </main>
  )
}
