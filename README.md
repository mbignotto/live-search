# 🎬 Live Movie Search

Uma interface de busca de filmes com autocompletar inteligente, navegação por teclado e favoritos.

## 🚀 Começando

### Pré-requisitos
- Node.js (v18+)
- Uma chave de API do TMDb (The Movie Database)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/mbignotto/live-search.git
cd live-search
```

2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto:
```env
VITE_TMDB_API_KEY=sua_chave_api_aqui
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 🎯 Funcionalidades

- **🔍 Busca em tempo real**: As sugestões aparecem enquanto você digita
- **⌨️ Navegação por teclado**:
  - `↑` `↓`: Navegar entre os resultados
  - `→`: Completar com a sugestão
  - `←`: Voltar para a busca anterior
  - `Espaço`: Favoritar/desfavoritar o filme selecionado
- **⭐ Favoritos**: Marque seus filmes preferidos e acesse-os facilmente
- **🎨 Interface responsiva**: Design limpo e adaptável

## 🛠️ Tecnologias

- React + TypeScript
- Vite
- TailwindCSS
- React Query
- Zustand
- TMDb API

## 📝 Decisões Técnicas

Confira o arquivo [HISTORY.md](./HISTORY.md) para um registro detalhado das decisões técnicas, arquitetura e reflexões sobre o desenvolvimento.


## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
