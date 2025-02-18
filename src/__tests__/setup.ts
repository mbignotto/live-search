import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock das variáveis de ambiente
const env = {
  VITE_TMDB_API_KEY: 'test-api-key'
}

if (typeof window !== 'undefined') {
  window.env = env
}

vi.mock('@env', () => env)

// Mock do import.meta.env
vi.stubGlobal('import', { meta: { env } })

// Mock do ResizeObserver que não está disponível no jsdom
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock do IntersectionObserver que não está disponível no jsdom
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock do matchMedia que não está disponível no jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
