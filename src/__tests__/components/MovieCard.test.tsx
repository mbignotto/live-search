import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MovieCard } from '../../components/MovieCard'

// Mock do useSearchStore
vi.mock('../../store/searchStore', () => ({
  useSearchStore: () => ({
    toggleFavorite: vi.fn(),
    isFavorite: () => false
  })
}))

describe('MovieCard', () => {
  const mockMovie = {
    id: 1,
    title: 'Test Movie',
    overview: 'Test Description',
    poster_path: '/test.jpg',
    release_date: '2023-01-01',
    vote_average: 7.5,
    genres: [
      { id: 1, name: 'Action' },
      { id: 2, name: 'Drama' }
    ],
    imdb_id: 'tt1234567'
  }

  it('deve renderizar o título do filme', () => {
    render(<MovieCard movie={mockMovie} />)
    expect(screen.getByText('Test Movie')).toBeInTheDocument()
  })

  it('deve renderizar os gêneros do filme', () => {
    render(<MovieCard movie={mockMovie} />)
    expect(screen.getByText('Action')).toBeInTheDocument()
    expect(screen.getByText('Drama')).toBeInTheDocument()
  })

  it('deve aplicar classe de selecionado quando isSelected for true', () => {
    render(<MovieCard movie={mockMovie} isSelected={true} />)
    const card = screen.getByRole('img').parentElement
    expect(card).toHaveClass('bg-blue-50')
  })

  it('deve renderizar imagem do poster com URL correta', () => {
    render(<MovieCard movie={mockMovie} />)
    const img = screen.getByAltText('Test Movie') as HTMLImageElement
    expect(img.src).toContain('/test.jpg')
  })
})
