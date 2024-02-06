![Imagem do logotipo Orange Portfólio, um MacBook e um iPhone com a tela inicial da aplicação aberta](https://github.com/MatheusSanchez/orange-front/assets/43791636/cfdd65cf-4e69-40f9-bfae-676b63badc00)

# Orange Portfólio - Squad 40


**Bem-vindo ao Orange Portfólio!** Esta aplicação foi desenvolvida para incentivar desenvolvedores a compartilharem seus projetos pessoais e a estabelecerem conexões valiosas dentro da comunidade Orange Juice. 🍊

Com recursos robustos de personalização, os usuários podem destacar seus projetos exclusivos, incluindo detalhes como nome, link, imagens e tags descritivas. A capacidade de interagir com os portfólios de outros usuários cria uma comunidade dinâmica, promovendo a descoberta de novos talentos e oportunidades de networking.

**Destaque-se na multidão com o Orange Portfolio!** Nossa aplicação oferece uma abordagem centrada no usuário, permitindo que você construa um portfólio online que realmente reflete suas habilidades e conquistas. A busca avançada e os filtros facilitam a descoberta de projetos específicos de outros usuários.

---

## Tecnologias e bibliotecas
![typescript](https://img.shields.io/badge/typescript-292b36?style=for-the-badge&logo=typescript)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Fastify](https://img.shields.io/badge/fastify-%23000000.svg?style=for-the-badge&logo=fastify&logoColor=white)
![PNPM](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220)

---

## Live Preview

Acesse o _live preview_ [clicando aqui](orange-front-end.onrender.com), crie uma nova conta e se divirta!

_Obs.: A aplicação está hospedada no serviço [Render](https://render.com) em plano gratuito. Por isso, podem ocorrer algumas diferenças de desempenho em determinados momentos._

---

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

### Pitch

Você pode conferir o vídeo de pitch do projeto [clicando aqui.](https://www.youtube.com/watch?v=P3vXBqt58Sk)

---

### Explorando a API

Utilize o Insomnia para interagir com a API:

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=orange-juice&uri=https%3A%2F%2Fgithub.com%2FMatheusSanchez%2Forange-back%2Fblob%2Fmaster%2FInsomnia_2024-02-05.json)

---
### Autores

| [<img src="https://github.com/LucSosa.png" width=115><br><sub>@LucSosa</sub>](https://github.com/LucSosa) | [<img src="https://github.com/MatheusSanchez.png" width=115><br><sub>@MatheusSanchez</sub>](https://github.com/MatheusSanchez) | [<img src="https://github.com/maxyuri13.png" width=115><br><sub>@maxyuri13</sub>](https://github.com/maxyuri13) | [<img src="https://github.com/pedrodecf.png" width=115><br><sub>@pedrodecf</sub>](https://github.com/pedrodecf) |
| :---: | :---: | :---: | :---: |

