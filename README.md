# Dashboard Airbnb Rio de Janeiro

Aplicação web desenvolvida como projeto acadêmico para a disciplina de Banco de Dados. Visualização interativa de dados de acomodações do Airbnb na cidade do Rio de Janeiro.

## 🎯 Sobre o Projeto

Este projeto demonstra a modelagem e visualização de um banco de dados de acomodações do Airbnb no Rio de Janeiro. A interface foi inspirada no design original do Airbnb.

### Funcionalidades Principais

- 🗺️ **Mapa Interativo**: Visualização geográfica de todas as acomodações
- 🔥 **Mapas de Calor**: Dois modos de heatmap
  - Densidade: Mostra áreas com maior concentração de acomodações
  - Preço: Mostra áreas com acomodações mais caras
- 📊 **Estatísticas**: Análise agregada por bairro
  - Preço médio por bairro
  - Avaliação média por bairro
  - Total de acomodações
- 🏠 **Detalhes Completos**: Informações detalhadas de cada propriedade
  - Dados do anfitrião
  - Comodidades
  - Avaliações
  - Capacidade e quartos
- 🔍 **Interface Responsiva**: Painel redimensionável para melhor visualização

## 📦 Instalação

### Pré-requisitos

- Node.js (versão 18 ou superior)
- pnpm (recomendado) ou npm

### Passos para instalação

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd trabalho-bd-frontend
```

2. Instale as dependências:

```bash
pnpm install
# ou
npm install
```

3. Configure as variáveis de ambiente:

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env e configure a URL da API backend
# VITE_API_BASE_URL=http://localhost:8000/api
```

4. Inicie o servidor de desenvolvimento:

```bash
pnpm dev
# ou
npm run dev
```

5. Acesse a aplicação em `http://localhost:5173`
