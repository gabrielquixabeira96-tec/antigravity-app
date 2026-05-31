/**
 * GET /api/stats
 * Retorna métricas agregadas para o dashboard administrativo.
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Executa queries sequencialmente para não esgotar o pool de conexões do Supabase (limite de 15 no modo session)
    const totalPacientes = await prisma.pacientes.count()
    const totalRastreamentos = await prisma.rastreamentos_gerados.count()
    const pacientesComRastreamento = await prisma.pacientes.count({
      where: { rastreamentos: { some: {} } },
    })
    const rastreamentosPorTipo = await prisma.rastreamentos_gerados.groupBy({
      by: ['tipo_cancer'],
      _count: { tipo_cancer: true },
      orderBy: { _count: { tipo_cancer: 'desc' } },
    })
    const rastreamentosUrgentes = await prisma.rastreamentos_gerados.count({
      where: { criterio_clinico: { contains: '[URGENTE]' } },
    })
    const cadastrosHoje = await prisma.pacientes.count({
      where: {
        data_cadastro: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    })

    const taxaDeteccao =
      totalPacientes > 0
        ? ((pacientesComRastreamento / totalPacientes) * 100).toFixed(1)
        : '0.0'

    return NextResponse.json({
      total_pacientes: totalPacientes,
      total_rastreamentos: totalRastreamentos,
      taxa_deteccao_percent: taxaDeteccao,
      alertas_urgentes: rastreamentosUrgentes,
      cadastros_hoje: cadastrosHoje,
      por_tipo_cancer: rastreamentosPorTipo.map((r) => ({
        tipo: r.tipo_cancer,
        total: r._count.tipo_cancer,
      })),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[GET /api/stats]', error)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
