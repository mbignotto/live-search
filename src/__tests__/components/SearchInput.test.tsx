import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SearchInput } from '../../components/SearchInput'
import type { SearchResults } from '../../lib/tmdb'

const mockSearchMovies = vi.hoisted(() => vi.fn())
vi.mock('../../lib/tmdb', () => ({
  searchMovies: mockSearchMovies
}))

const mockSetQuery = vi.hoisted(() => vi.fn())
const mockSetSelectedIndex = vi.hoisted(() => vi.fn())
const mockToggleFavorite = vi.hoisted(() => vi.fn())

vi.mock('../../store/searchStore', () => ({
  useSearchStore: () => ({
    query: '',
    setQuery: mockSetQuery,
    selectedIndex: -1,
    setSelectedIndex: mockSetSelectedIndex,
    toggleFavorite: mockToggleFavorite
  })
}))

describe('SearchInput', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve renderizar o input corretamente', () => {
    render(<SearchInput />, { wrapper })
    expect(screen.getByPlaceholderText('Pesquise um filme')).toBeInTheDocument()
  })

  it('deve mostrar texto de ajuda com as teclas', () => {
    render(<SearchInput />, { wrapper })
    expect(screen.getByText(/Utilize as teclas ↑ ↓/)).toBeInTheDocument()
  })

  it('deve chamar a API quando o usuário digita', async () => {
    const mockResults: SearchResults = {
      page: 1,
      results: [
        { 
          id: 1, 
          title: 'Test Movie', 
          overview: 'Test Description',
          poster_path: '/test.jpg',
          release_date: '2023-01-01',
          vote_average: 7.5,
          genres: [{ id: 1, name: 'Action' }],
          imdb_id: 'tt1234567'
        }
      ],
      total_pages: 1,
      total_results: 1
    }

    mockSearchMovies.mockResolvedValue(mockResults)

    render(<SearchInput />, { wrapper })
    const input = screen.getByPlaceholderText('Pesquise um filme')

    fireEvent.change(input, { target: { value: 'test' } })

    await waitFor(() => {
      expect(mockSetQuery).toHaveBeenCalledWith('test')
    })
  })
})
