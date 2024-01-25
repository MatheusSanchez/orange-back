<h1 align="center">ORANGE Portfolio</h1>

## Descrição

<p align="center">Desenvolvimento do Back-end para o projeto Hackaton Orange Juice</p>


## Rodando o Back End (Servidor)

```bash
# Clone este repositório
$ git clone <https://github.com/MatheusSanchez/orange-back.git>

# Acesse a pasta do projeto no terminal/cmd
$ cd orange-back

# Instale as dependências 
$ pnpm install


# Subir o container do Docker com banco de dados 
$ docker compose up -d


# Crie as variáveis de ambiente, um arquivo .env na raiz do projeto.
$ Veja o exemplo no arquivo ./env.example

# Gere o client do Prisma 
$ pnpm prisma generate


# Execute as Migrations
$ pnpx prisma migrate dev


# Execute a aplicação em modo de desenvolvimento
$ pnpm run dev

# O servidor inicicará na porta:3333 - acesse <http://localhost:3333>


## Rodando os testes 

# Voce pode rodar os teste unitários nos seguinte scripts: 

$ pnpm run test
$ pnpm run test:watch
$ pnpm run test:coverage

# A aplicaçao também conta com teste e2e
# É necessário fazer o setup dos testes e2e antes;

$ pnpm run pretest:e2e

# Rodando os teste e2e
$ pnpm run test:e2e

```
