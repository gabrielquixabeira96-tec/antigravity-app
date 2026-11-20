import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {

  // Fix para Turbopack detectar múltiplos lockfiles em monorepo
  turbopack: {
    root: path.resolve(__dirname),
  },

  // Configurações de imagem
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Página inicial: serve a carta ao médico (HTML estático em public/).
  // O app antigo continua no repositório; só deixa de ser a página inicial.
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          destination: '/carta-ao-medico.html',
        },
      ],
      afterFiles: [],
      fallback: [],
    }
  },

  // Cabeçalhos de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ]
  },
}

export default nextConfig
