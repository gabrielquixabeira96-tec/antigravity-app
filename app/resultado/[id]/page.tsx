/**
 * app/resultado/[id]/page.tsx
 * Página de resultados do rastreamento oncológico para o paciente.
 * Exibe os rastreamentos gerados com prioridade e protocolos recomendados.
 */

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: 'Seu Resultado — Rastreamento Oncológico',
  description: 'Resultado personalizado do seu rastreamento oncológico.',
  robots: 'noindex, nofollow',
}

// Cores e ícones por tipo de câncer
const tipoConfig: Record<string, { cor: string; icone: string }> = {
  PULMONAR:   { cor: '#a1a1aa', icone: '' },
  COLORRETAL: { cor: '#a1a1aa', icone: '' },
  MAMA:       { cor: '#a1a1aa', icone: '' },
  CERVICAL:   { cor: '#a1a1aa', icone: '' },
  PROSTATA:   { cor: '#a1a1aa', icone: '' },
  MELANOMA:   { cor: '#a1a1aa', icone: '' },
}

// Extrai prioridade do critério clínico (formato: [URGENTE] texto...)
function extrairPrioridade(criterio: string): 'URGENTE' | 'ALTA' | 'NORMAL' {
  if (criterio.startsWith('[URGENTE]')) return 'URGENTE'
  if (criterio.startsWith('[ALTA]')) return 'ALTA'
  return 'NORMAL'
}

// Limpa o prefixo de prioridade do texto para exibição
function limparCriterio(criterio: string): string {
  return criterio
    .replace(/^\[(URGENTE|ALTA|NORMAL)\]\s*/, '')
}

// Componente de badge de prioridade
function PrioridadeBadge({ prioridade }: { prioridade: string }) {
  const config = {
    URGENTE: {
      bg: 'rgba(239,68,68,0.07)',
      cor: '#fca5a5',
      borda: 'rgba(239,68,68,0.18)',
      label: 'URGENTE',
    },
    ALTA: {
      bg: 'rgba(249,115,22,0.07)',
      cor: '#fdba74',
      borda: 'rgba(249,115,22,0.18)',
      label: 'ALTA PRIORIDADE',
    },
    NORMAL: {
      bg: 'rgba(34,197,94,0.06)',
      cor: '#86efac',
      borda: 'rgba(34,197,94,0.16)',
      label: 'INDICADO',
    },
  }[prioridade] ?? {
    bg: 'rgba(255,255,255,0.04)',
    cor: '#a1a1aa',
    borda: 'rgba(255,255,255,0.08)',
    label: prioridade,
  }

  return (
    <span
      className="inline-flex items-center px-3 py-1 text-xs font-bold font-mono uppercase tracking-widest"
      style={{ background: config.bg, color: config.cor, border: `1px solid ${config.borda}` }}
    >
      {config.label}
    </span>
  )
}

export default async function ResultadoPage({ params }: PageProps) {
  const { id } = await params

  const paciente = await prisma.pacientes.findUnique({
    where: { id },
    include: {
      rastreamentos: { orderBy: { data_geracao: 'desc' } },
    },
  })

  if (!paciente) notFound()

  const temRastreamentos = paciente.rastreamentos.length > 0
  const temUrgente = paciente.rastreamentos.some(r => r.criterio_clinico.startsWith('[URGENTE]'))
  const temAlta = paciente.rastreamentos.some(r => r.criterio_clinico.startsWith('[ALTA]'))

  return (
    <main className="min-h-screen bg-zinc-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-10 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-5 h-5 bg-zinc-50 flex items-center justify-center shrink-0">
              <span className="text-zinc-950 font-black text-xs select-none">R</span>
            </div>
            <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">
              Rastreamento Oncológico
            </span>
          </div>

          <div
            className="inline-block text-xs font-bold font-mono uppercase tracking-widest px-3 py-1 mb-5"
            style={
              temUrgente
                ? { background: 'rgba(239,68,68,0.07)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.18)' }
                : { background: '#18181b', color: '#a1a1aa', border: '1px solid #27272a' }
            }
          >
            {temUrgente ? 'Atenção Urgente' : temRastreamentos ? 'Resultados Disponíveis' : 'Avaliação Concluída'}
          </div>

          <h1 className="text-3xl font-black text-zinc-50 mb-3 tracking-tight">
            {temRastreamentos ? 'Rastreamentos Indicados' : 'Nenhum rastreamento indicado'}
          </h1>
          <p className="text-zinc-500 text-sm max-w-md leading-relaxed">
            {temRastreamentos
              ? 'Com base no seu perfil, identificamos os seguintes rastreamentos oncológicos recomendados.'
              : 'Seu perfil atual não indica nenhum rastreamento oncológico específico no momento. Continue com acompanhamento médico regular.'}
          </p>

          {/* Alerta de urgência */}
          {temUrgente && (
            <div
              className="mt-5 p-4 text-sm font-medium"
              style={{
                background: 'rgba(239,68,68,0.07)',
                border: '1px solid rgba(239,68,68,0.18)',
                color: '#fca5a5',
              }}
            >
              <strong>ATENÇÃO:</strong> Você tem rastreamentos marcados como URGENTE. Procure um médico o mais breve possível.
            </div>
          )}
          {!temUrgente && temAlta && (
            <div
              className="mt-5 p-4 text-sm font-medium"
              style={{
                background: 'rgba(249,115,22,0.07)',
                border: '1px solid rgba(249,115,22,0.18)',
                color: '#fdba74',
              }}
            >
              Você tem rastreamentos de alta prioridade. Agende uma consulta médica em breve.
            </div>
          )}
        </div>

        {/* Cards de rastreamento */}
        {temRastreamentos && (
          <div className="space-y-px mb-10 bg-zinc-800">
            {paciente.rastreamentos.map((r, i) => {
              const cfg = tipoConfig[r.tipo_cancer] ?? { cor: '#a1a1aa', icone: '' }
              const prioridade = extrairPrioridade(r.criterio_clinico)
              const [criterio, protocolo] = limparCriterio(r.criterio_clinico).split(' | Protocolo: ')

              return (
                <div
                  key={r.id}
                  className="glass-card p-6 animate-fade-in-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {/* Header do card */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <span
                        className="text-xs font-bold font-mono uppercase tracking-widest text-zinc-400 block mb-0.5"
                      >
                        {r.tipo_cancer}
                      </span>
                      <h2 className="text-base font-bold text-zinc-100">
                        Câncer {r.tipo_cancer.charAt(0) + r.tipo_cancer.slice(1).toLowerCase()}
                      </h2>
                      <p className="text-xs text-zinc-600 font-mono mt-0.5">
                        {new Date(r.data_geracao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <PrioridadeBadge prioridade={prioridade} />
                  </div>

                  {/* Critério clínico */}
                  <div
                    className="p-3 mb-3 text-sm text-zinc-300"
                    style={{ background: '#09090b', border: '1px solid #27272a' }}
                  >
                    <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider block mb-1 font-mono">
                      Critério clínico
                    </span>
                    {criterio}
                  </div>

                  {/* Protocolo recomendado */}
                  {protocolo && (
                    <div
                      className="px-3 py-2 text-sm font-medium inline-flex items-center gap-2 font-mono"
                      style={{
                        background: '#18181b',
                        color: '#a1a1aa',
                        border: '1px solid #3f3f46',
                      }}
                    >
                      {protocolo}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Rodapé com aviso legal e ações */}
        <div className="glass-card p-5 text-center animate-fade-in-up-delay-3">
          <p className="text-xs text-zinc-600 mb-4 leading-relaxed">
            <strong className="text-zinc-500">Aviso Médico:</strong> Este rastreamento é uma ferramenta de apoio à decisão clínica, não um diagnóstico. Os resultados devem ser discutidos com um médico qualificado. Não substitui consulta médica presencial.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              id="link-novo-rastreamento"
              href="/rastrear"
              className="btn-secondary text-sm justify-center"
            >
              Novo rastreamento
            </Link>
            <Link
              id="link-inicio"
              href="/"
              className="btn-primary text-sm justify-center"
            >
              Página inicial
            </Link>
          </div>
        </div>

      </div>
    </main>
  )
}
