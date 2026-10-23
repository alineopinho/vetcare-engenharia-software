# VetCare — Análise preliminar de arquitetura

**Status:** diagnóstico documental e inspeção estática inicial; não aprovado pela equipe  
**Data:** 23/10/2026  
**Objetivo:** comparar a arquitetura acadêmica registrada em junho/2026 com a implementação de referência no repositório `Rozeti/ProjetoVetCare`, sem alterar os documentos originais nem presumir que todo o código esteja correto.

## 1. Fontes e critérios

| ID | Fonte | Referência |
| --- | --- | --- |
| VIS | Documento de Visão (10/06/2026) | `01-documentacao/1_DocumentoVisao_VetCare.pdf`, especialmente pp. 3, 5–6 |
| REQ | Documento de Requisitos de Software (18/06/2026) | `01-documentacao/2_DocumentoRequisitosSoftware_VetCare.pdf`, pp. 3, 5–6, 16–20 |
| ARQ | Documento de Arquitetura de Software v4.0 (28/06/2026) | `01-documentacao/3_DocumentoArquiteturaSoftware_VetCare.pdf`, pp. 5, 7, 10–17 |
| COD | Implementação original de referência | `Rozeti/ProjetoVetCare`, arquivos inspecionados: `VetCare.API/VetCare.API.csproj`, `VetCare.API/Program.cs`, `VetCare.API/Data/AppDbContext.cs`, `VetCare.Web/package.json` |

**Limites:** nesta etapa não houve compilação, execução da API, teste de migração, inspeção completa das entidades, nem comparação linha a linha do projeto. Alterações de código posteriores à consulta podem mudar as conclusões. A divergência entre artefatos **não é automaticamente um bug**.

## 2. Arquitetura documentada × implementação inspecionada

| Aspecto | Arquitetura documentada | Evidência do código existente | Resultado |
| --- | --- | --- | --- |
| Back-end | Java 21, Spring Boot 3.x, Spring MVC e Spring Security (ARQ pp. 7, 11, 15) | `VetCare.API.csproj` usa `Microsoft.NET.Sdk.Web`, `net10.0`; `Program.cs` registra controllers e autenticação JWT | **Divergência confirmada**; documentar decisão de migração tecnológica |
| Interface web | React + TypeScript (ARQ pp. 7, 11–12) | `VetCare.Web/package.json` usa React, TypeScript, Vite e Tailwind | **Correspondência parcial**; detalhar versões e ferramentas atuais |
| Persistência | PostgreSQL com JPA/Hibernate, conexão JDBC (ARQ pp. 11–12, 15–16) | `Program.cs`: `UseNpgsql(...)`; `AppDbContext.cs`: EF Core com entidades `DbSet` | **Divergência do ORM**; PostgreSQL preservado |
| Segurança | JWT, controle de acesso por perfil; documento referencia Spring Security (ARQ p. 7) | `Program.cs` usa autenticação JWT do ASP.NET Core | **Implementação diferente**; eficácia das regras pendente de testes |
| Papéis de acesso | VIS descreve três na declaração da visão (p. 3), mas inclui equipe de apoio como parte interessada (p. 4); REQ RN-005 enumera três (p. 16); ARQ lista quatro (p. 5) | `AppDbContext` possui `ApoiosAdministrativos` | **Definição inconsistente**; matriz de permissões depende de validação |
| Modelo de dados | MER acadêmico (ARQ p. 17) | `AppDbContext` mantém entidades e mapeamentos EF Core | **Comparação detalhada ainda pendente** |
| App móvel | VIS e REQ tratam principalmente de web responsiva (VIS p. 6; REQ RNF-006 p. 19) | O plano de integração apresenta módulo móvel Expo; não revisado neste diagnóstico | **Mudança potencial de escopo**; confirmar entrega móvel atual e requisitos próprios |

## 3. Registro de divergências e oportunidades

### ARQ-001 — Stack tecnológico desatualizado

- **Evidência:** ARQ pp. 7, 9, 11–16 menciona Java, Spring, JPA e JDBC; código inspecionado utiliza .NET 10, C#, ASP.NET Core e EF Core/Npgsql.
- **Impacto:** diagramas de camadas, implantação e sequência podem induzir a interpretação incorreta da implementação.
- **Proposta:** produzir uma arquitetura **proposta/atualizada**, com registro da mudança de stack e componentes reais; preservar o PDF original.
- **Status:** divergência confirmada; proposta não aprovada.

### ARQ-002 — Quatro perfis e autorização

- **Evidência:** VIS p. 3 e REQ RN-005 (p. 16) tratam de Administrador, Veterinário e Tutor; ARQ p. 5 inclui Apoio Administrativo. A VIS p. 4 já cita a equipe de apoio, o que exige interpretação cuidadosa.
- **Impacto:** autorização, menus, acesso a dados e casos de teste.
- **Proposta:** tabela de permissões por perfil e operação (visualizar, cadastrar, editar, cancelar, anexar etc.), vinculada às HU e RN.
- **Status:** esclarecimento necessário, não defeito comprovado.

### ARQ-003 — Diagramas de fluxo desatualizados

- **Evidência:** diagrama de sequência de avaliação clínica (ARQ p. 14) utiliza `AvaliacaoController`, `AvaliacaoService`, repositórios Spring Data JPA e PostgreSQL; diagrama de camadas na p. 12 e implantação na p. 15 mantêm Spring.
- **Impacto:** rastreabilidade entre projeto arquitetural, implementação e testes.
- **Proposta:** redesenhar apenas após inspecionar controllers, casos de uso, repositórios e resposta HTTP reais; distinguir fluxo atual e fluxo recomendado.
- **Status:** pendente de engenharia reversa detalhada.

### ARQ-004 — Escopo do portal e do aplicativo

- **Evidência:** VIS/REQ descrevem aplicação web responsiva; código/plano de commits incluem aplicativo móvel.
- **Impacto:** esforço, arquitetura de autenticação, navegação, distribuição e critérios de aceite.
- **Proposta:** registrar decisão de ampliação de escopo, funcionalidades compartilhadas e requisitos específicos do aplicativo.
- **Status:** decisão de produto a confirmar com a equipe.

### ARQ-005 — Modelagem e migrações de dados

- **Evidência:** MER no ARQ p. 17; no código há `AppDbContext` usando Entity Framework Core.
- **Impacto:** esquema físico, cardinalidades, chaves, restrições e scripts de evolução.
- **Proposta:** recuperar o modelo efetivo de entidades, `OnModelCreating` e migrations; confrontar com RN-001, RN-004, RN-007 e RNF-003; produzir **modelo atual**, **modelo proposto** e **plano de migração** (sem executar alterações no banco oficial).
- **Status:** análise ainda não executada.

### ARQ-006 — Manutenibilidade e processo colaborativo

- **Evidência:** discussões da equipe indicam classes de caso de uso com múltiplas operações e distribuição de commits por arquivos; risco de mudanças concorrentes.
- **Impacto:** revisão, integração e testes de regressão.
- **Proposta:** investigar coesão/acoplamento e dependências antes de separar classes; adotar PR por funcionalidade, responsabilidade clara e commits lógicos, sem prometer eliminação de conflitos apenas pela divisão de arquivos.
- **Status:** hipótese de melhoria; não foi demonstrado um conflito concreto neste registro.

## 4. Rastreabilidade inicial — foco em autenticação e usuários

| Requisito | Expectativa documentada | Artefatos a verificar | Evidência/estado |
| --- | --- | --- | --- |
| HU-001, RN-005, RN-006 | Autenticação, autorização e bloqueio após cinco tentativas | DTOs, casos de uso, controller, configurações JWT, testes de login e bloqueio | Revisão de QA anterior; testes funcionais pendentes |
| HU-002, RN-007 | Cadastro, edição, inativação, redefinição e unicidade do e-mail | `GerenciarUsuariosUseCase`, repositórios, `AppDbContext`, migrations, controllers e testes | Análise estática preliminar; sem validação end-to-end |
| RNF-002, RNF-003 | Controle de acesso e separação de dados clínicos | Authorization policies, acesso por clínica e paciente, respostas da API e testes | Pendente de inspeção e execução |

## 5. Entregáveis propostos (não aprovados)

1. **Diagrama de componentes do estado atual**: Web/React, aplicativo móvel, API ASP.NET Core, camadas de casos de uso e repositórios, PostgreSQL e integrações externas efetivamente verificadas.
2. **Diagrama de sequência da autenticação**: rastrear HTTP → controller → caso de uso → repositório/segurança → resposta, incluindo falhas e bloqueios.
3. **Matriz de permissões por perfil**, validada com Camila e equipe.
4. **Modelo físico de dados recuperado** de EF Core + migrations, acompanhado de riscos e propostas separadas.
5. **Protótipo HTML/CSS/JS** apenas para consulta e exploração da análise; conexão com banco sempre mediada por API autorizada, em fase posterior.

## 6. Decisões a obter da equipe

- Confirmar formalmente C#/.NET 10 como stack de referência para documentação e entrega.
- Confirmar se o aplicativo móvel faz parte do escopo aprovado e em quais HU.
- Aprovar lista de perfis, especialmente permissões de Apoio Administrativo.
- Definir responsáveis/revisores pelas funcionalidades e pelas migrations compartilhadas.
- Validar os diagramas do **estado atual** antes de propor refatoração.

## 7. Próximo passo

Inspecionar `Program.cs`, controllers, casos de uso e `AppDbContext` com maior profundidade para produzir o primeiro diagrama de componentes **AS-IS** (estado atual). Só depois elaborar diagramas **TO-BE** (proposta) e desenho do mini site. Não alterar os PDFs originais ou o repositório de entrega da equipe durante essa investigação.
