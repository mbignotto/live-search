import { describe, it, expect, vi, beforeEach } from 'vitest'
import { searchMovies } from '../../lib/tmdb'

const mockGet = vi.hoisted(() => vi.fn())

// Mock do axios
vi.mock('axios', () => ({
  default: {
    create: () => ({
      get: mockGet
    })
  }
}))

describe('tmdb', () => {
  beforeEach(() => {
    mockGet.mockReset()
    mockGet.mockResolvedValue({
      data: {
        page: 1,
        results: [{ id: 1, title: 'Test Movie' }],
        total_pages: 1,
        total_results: 1
      }
    })
  })

  it('deve retornar os resultados da busca', async () => {
    const result = await searchMovies('test', 1)
    
    expect(result).toEqual({
      page: 1,
      results: [{ id: 1, title: 'Test Movie' }],
      total_pages: 1,
      total_results: 1
    })
  })

  it('deve lançar erro quando a API falha', async () => {
    mockGet.mockRejectedValueOnce(new Error('API Error'))
    await expect(searchMovies('test', 1)).rejects.toThrow('API Error')
  })
})
