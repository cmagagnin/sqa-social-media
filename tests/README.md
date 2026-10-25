# Testes Playwright — SQA Social Media

Este projeto contém cinco testes de API e três testes E2E da Atividade 3. Os testes de API usam o `request` fixture do Playwright para enviar requisições HTTP reais ao backend Spring Boot. Os testes E2E usam Chromium real, frontend Next.js e backend real. Não há mocks de backend.

## Pré-requisitos

- Node.js e npm instalados;
- MySQL em execução e configurado para o backend;
- backend Spring Boot em `http://127.0.0.1:8080`;
- frontend Next.js em `http://127.0.0.1:3000` para os testes E2E;
- Chromium instalado por `npx playwright install chromium`.

## Instalação

```bash
cd tests
npm install
npx playwright install chromium
```

## Iniciar o sistema

Backend, em um terminal:

```bash
cd ../api
MAVEN_USER_HOME=/tmp/sqa-social-media-m2 sh ./mvnw spring-boot:run
```

Frontend, em outro terminal:

```bash
cd ../client
npm run dev
```

O backend usa `http://127.0.0.1:8080` por padrão nos testes. Para alterar:

```bash
API_BASE_URL=http://localhost:8080 npm run test:api
```

Para alterar a URL do frontend:

```bash
FRONTEND_BASE_URL=http://localhost:3000 npm run test:e2e
```

## Executar os testes de API

```bash
cd tests
npm run test:api
```

Os cinco cenários são:

- API-01: cadastro válido;
- API-02: cadastro com e-mail duplicado;
- API-03: login válido;
- API-04: login com credenciais inválidas;
- API-05: redefinição de senha para usuário inexistente.

Cada teste cria dados próprios quando necessário, usando e-mails únicos. A execução é serializada para evitar conflitos no banco.

## Executar os testes E2E

Com backend e frontend em execução:

```bash
cd tests
npm run test:e2e
```

Os três cenários são:

- E2E-01: cadastro válido pelo navegador e redirecionamento para `/`;
- E2E-02: usuário deslogado tenta curtir e recebe o alert exigido;
- E2E-03: login real, redirecionamento para `/` e curtida autenticada.

Para demonstrar o navegador visível no vídeo:

```bash
HEADED=1 npm run test:e2e
```

## Executar tudo e conferir a descoberta

```bash
npm run test:list
npm run test:all
```

`npm run test:list` deve listar exatamente oito testes: cinco API e três E2E.

## Relatórios

O reporter de console mostra o resultado no terminal. O relatório HTML é gerado em `playwright-report/`.

```bash
npm run test:report
```

Traces e screenshots são gerados somente quando necessário para diagnóstico, em diretórios ignorados pelo Git.

## Tipos de teste

- Testes de API: enviam HTTP diretamente ao Spring Boot e validam status e JSON;
- MockMvc: exercitam controllers dentro do contexto de testes do Spring, sem servidor HTTP real;
- E2E: exercitam a aplicação pelo navegador Chromium, integrando página, componentes, roteamento e backend real;
- os testes de API validam HTTP diretamente, sem abrir navegador;
- MockMvc executa controllers dentro do contexto Spring, sem servidor HTTP real;
- E2E não substitui o backend por mock: usa os serviços reais em execução.

## Pré-condição do banco

O Spring Boot precisa conseguir autenticar no MySQL local e acessar o banco `social_media`. As credenciais ficam somente na configuração local do backend e não devem ser adicionadas ao Git. Se o backend falhar com `Access denied for user`, corrija a credencial/permissão do usuário MySQL no ambiente local antes de executar os testes.

## Preparação → execução → assertivas

- API-01 prepara um e-mail único, envia `POST /auth/signup` e verifica sucesso e dados básicos.
- API-02 cadastra o usuário, repete o cadastro e verifica `409` e a mensagem normativa de e-mail duplicado.
- API-03 cadastra um usuário e envia login válido, verificando sucesso.
- API-04 usa senha forte incorreta e verifica `401` e `Credenciais inválidas`.
- API-05 envia reset para e-mail inexistente e verifica `404` e `Usuário não encontrado`.
- E2E-01 preenche o cadastro pelo navegador e verifica autenticação e URL `/`.
- E2E-02 abre o feed sem autenticação, clica em Curtir e verifica o alert nativo exato.
- E2E-03 cria usuário pela API, faz login pela tela e verifica curtida autenticada.

Falhas de conexão, banco ou porta são falhas de infraestrutura. Respostas HTTP com status/mensagem inesperados são falhas do contrato testado; o teste não deve ser alterado para esconder o comportamento.
