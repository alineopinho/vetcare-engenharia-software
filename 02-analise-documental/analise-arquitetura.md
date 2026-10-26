# VetCare — Análise documental da arquitetura e confronto com a implementação (AS-IS)

**Documento de origem:** `01-documentacao/3_DocumentoArquiteturaSoftware_VetCare.pdf` — versão 4.0, 28/06/2026, 18 páginas.  
**Atualização da análise:** 26/10/2026 (revisão do arquivo iniciado em 23/10/2026).  
**Referência de código:** [`Rozeti/ProjetoVetCare`](https://github.com/Rozeti/ProjetoVetCare), versão consultada na revisão.  
**Status:** diagnóstico técnico preliminar, **sem compilação, execução, homologação nem aprovação da equipe**.

## 1. Objetivo e método

Analisar a coerência interna da arquitetura acadêmica, confrontar suas decisões verificáveis com a estrutura de código existente e distinguir **estado documentado (baseline de junho)**, **estado implementado (inspeção estática)** e **decisões futuras propostas**. Os documentos acadêmicos originais não foram modificados.

Fontes documentais complementares: Documento de Visão (10/06/2026), Documento de Requisitos (18/06/2026), `02-analise-documental/analise-visao.md`, `02-analise-documental/analise-requisitos.md` e rastreabilidades da pasta `03-rastreabilidade/`.

**Regra de classificação:** diferença de tecnologia ou ampliação de escopo não é, por si, defeito de execução. Declarações feitas apenas no documento não provam que um mecanismo tenha sido implementado. Evidência estática de código não comprova funcionamento operacional.

## 2. Pontos fortes da arquitetura original

- Organiza a descrição segundo perspectivas inspiradas no **modelo 4+1** e explicita separação entre apresentação, controle, regras de negócio, persistência e dados (pp. 4, 9–13).
- Define limites iniciais de escopo, incluindo exclusões explícitas de faturamento, pagamentos e IA diagnóstica (p. 5).
- Relaciona decisões a atributos de qualidade: segurança, privacidade, confiabilidade, desempenho, portabilidade, disponibilidade e escalabilidade (pp. 7–8).
- Identifica entidades clínicas e seus vínculos, incluindo Tutor, Paciente, Tratamento, Prontuário, Avaliação, Sessão e Atendimento (pp. 9–10, 16–17).
- Apresenta diagramas de classes, camadas, sequência, implantação e modelo de dados. **Os desenhos ainda exigem revisão visual e comparação detalhada, não realizada nesta atualização textual.**

## 3. Matriz de correspondência — arquitetura × código

| Elemento | Previsão no documento original | Evidência na implementação do Mateus | Classificação |
| --- | --- | --- | --- |
| Back-end | Java 21, Spring Boot 3.x, Spring MVC/Security (pp. 11–15) | `VetCare.API/VetCare.API.csproj` usa `Microsoft.NET.Sdk.Web` e `net10.0`; `Program.cs` registra controllers | **Divergência tecnológica confirmada por inspeção** |
| Front-end web | React com TypeScript, interface responsiva (pp. 7, 11–12) | `VetCare.Web/package.json` contém React 19, TypeScript, Vite e Tailwind | **Correspondência geral** |
| API e serviços | Separação entre controllers, serviços e repositórios (pp. 11–13) | Diretórios `Controllers`, `UseCases`, `Data`, `Security` e `Services`; injeção de dependências em `Program.cs` | **Correspondência conceitual, não identidade com MVC Spring** |
| Persistência | PostgreSQL, JPA/Hibernate, JDBC; documento indica PostgreSQL 16 (pp. 11, 15–16) | `Program.cs` usa `UseNpgsql`; `AppDbContext` configura entidades com EF Core | **Banco relacional coerente; ORM e driver diferentes** |
| Segurança | JWT, hash de senhas, controle por perfil via Spring Security (p. 7) | ASP.NET Core JWT Bearer; verificação de contas ativas; atributos de autorização nos controllers examinados | **Mecanismos identificados, eficácia pendente de testes** |
| Perfis | Quatro perfis no documento de arquitetura (p. 5) | `AppDbContext` inclui Apoio; controllers diferenciam permissões | **Correspondência na arquitetura; enumeração inconsistente com RN-005/Visão** |
| Plataforma cliente | Navegador responsivo (pp. 4, 7, 15) | `VetCare.Web` e `VetCare.Mobile` com Expo/React Native | **Canal móvel adicional identificado no código** |
| Integridade | Histórico clínico preservado, controle transacional e soft delete sensível (p. 7) | `VersaoRegistroClinico` e arquivamento de versões para avaliações/atendimentos; exclusão de pacientes condicionada a registros | **Implementação parcial identificada; cobertura e atomicidade não verificadas** |
| Operação e disponibilidade | Health checks, backup diário, monitoramento e 99,5% (pp. 7–8, 18) | `Program.cs` registra health check EF Core | **Health check identificado; backup, monitoramento e SLA não demonstrados** |
| Multi-tenant | Evolução futura com isolamento de clínicas (pp. 5, 7, 16) | Entidades e consultas examinadas incluem `ClinicaId`; verificações por clínica em casos de uso | **Preparação estrutural identificada; isolamento integral não auditado** |

### Nota sobre a expressão MVC

O documento utiliza **MVC** como referência para a separação das responsabilidades, porém a implementação corrente é uma **API ASP.NET Core consumida por front-end React**, não uma interface servida necessariamente por *Razor Views*. A atualização da arquitetura deve representar corretamente **cliente web/mobile → API → casos de uso → repositórios/EF Core → PostgreSQL**, sem pressupor um MVC web clássico. Esse desenho é uma síntese sustentada pelos componentes inspecionados, não um diagrama de implantação validado.

## 4. Registro de achados

### ARQ-001 — Troca de stack não refletida no documento

- **Fonte:** pp. 9, 11–16: Java/Spring, JPA/Hibernate, JDBC.
- **Código:** `VetCare.API.csproj`, `Program.cs`, `AppDbContext.cs` apontam para C#/.NET 10, ASP.NET Core, EF Core e Npgsql.
- **Impacto:** diagramas, arquitetura lógica, implantação, decisões de segurança e orientação para manutenção ficam desatualizados.
- **Encaminhamento:** registrar a decisão de mudança e, **em fase futura de revisão aprovada**, atualizar representações arquiteturais. Não recomendar retorno a Java apenas para coincidir com o PDF.
- **Estado:** divergência tecnológica comprovada por inspeção.

### ARQ-002 — Perfis de acesso não uniformes entre artefatos

- **Fonte:** Arquitetura p. 5 especifica Administrador, Veterinário, Tutor e Apoio; Visão e RN-005 enfatizam três perfis em determinadas seções.
- **Código:** consultas e escrita têm autorização segmentada conforme perfil nos controllers e casos de uso examinados.
- **Impacto:** critérios de autorização por operação e por titularidade do paciente precisam de uma matriz aprovada.
- **Encaminhamento:** conservar Apoio como ator **documentado na Arquitetura**, esclarecer escopo e manter relação com `03-rastreabilidade/rn-005-controle-acesso-as-is.md`.
- **Estado:** inconsistência documental; não é defeito de autorização confirmado.

### ARQ-003 — Diagramas de sequência/camadas/implantação com tecnologia histórica

- **Fonte:** pp. 12, 14 e 15 contêm representações baseadas em Spring e JDBC.
- **Impacto:** representações não descrevem fielmente a implementação inspecionada.
- **Encaminhamento:** posteriormente criar versões **AS-IS** com classes reais e manter as versões acadêmicas como baseline; diagramas **TO-BE** devem ser rotulados como propostas.
- **Estado:** atualização necessária após engenharia reversa detalhada.

### ARQ-004 — Aplicativo móvel e ampliação de escopo

- **Fonte:** escopo e implantação originais enfatizam aplicação web responsiva (pp. 4–5, 15).
- **Código:** `VetCare.Mobile/package.json` identifica Expo/React Native, navegação e notificações; `Program.cs` contempla política CORS para cliente móvel.
- **Impacto:** documentação precisa explicitar canais, fluxos, autenticação, notificações, configuração e testes por plataforma.
- **Encaminhamento:** equipe confirmar quais funcionalidades mobile integram o escopo aprovado. **Não presumir que web responsiva e app nativo são equivalentes.**
- **Estado:** extensão concreta no código; decisão de produto pendente.

### ARQ-005 — Modelo de dados e proteção de registros

- **Fonte:** pp. 10 e 17 (diagramas), p. 16 (relacionamentos); p. 7 (integridade e soft delete).
- **Código:** `AppDbContext.cs` define mapeamentos; `Pet.TutorId` obrigatório; registro de versões clínicas; `PetRepository.PossuiRegistrosClinicos()` protege várias categorias, porém não verifica diretamente alergias/condições.
- **Impacto:** integridade referencial e fronteira do que constitui histórico protegido demandam investigação.
- **Encaminhamento:** cotejar entidades, migrations e restrições efetivas do banco com RN-001/RN-004; classificar alergias/condições com o cliente antes de declarar defeito.
- **Estado:** evidência estrutural parcial; revisão de modelos e testes reais pendentes.

### ARQ-006 — Dimensionamento e metas de operação sem evidência de validação

- **Fonte:** p. 18 prevê média de **1.000 usuários simultâneos**, pico de **3.000**, cerca de **150 requisições/s**, **500 GB** inicialmente e incremento de **20 GB/mês**; p. 18 prevê 99,5% de disponibilidade mensal, backup diário e ausência de perda de registros confirmados.
- **Análise:** a documentação apresenta estimativas, mas não mostra medições, distribuição de carga, quantidade de clínicas, perfil de armazenamento ou justificativa para os números.
- **Impacto:** dimensionar infraestrutura ou afirmar cumprimento do RNF-004/005 a partir desses valores seria prematuro; backup diário sozinho não garante **RPO zero**.
- **Encaminhamento:** solicitar premissas e validar números; definir cenários de carga, RPO/RTO, testes de restauração e monitoramento operacional.
- **Estado:** risco de validação de requisitos não funcionais, **sem falha operacional demonstrada**.

### ARQ-007 — Serviços externos e mecanismos ainda não comprovados

- **Fonte:** p. 11 prevê S3/MinIO, SMTP e WebSocket; p. 7 contempla Auto-Save e p. 8 backup/monitoramento.
- **Código verificado:** `Program.cs` registra componentes de e-mail, push e serviços em segundo plano, mas esta revisão não comprovou a implantação de S3/MinIO, WebSocket, Auto-Save ou rotina de backup.
- **Encaminhamento:** inspecionar serviços e configuração e executar provas específicas antes de atribuir conformidade.
- **Estado:** verificação pendente; ausência de prova **não** significa ausência de funcionalidade.

### ARQ-008 — Manutenibilidade e processo colaborativo

- **Fonte:** requisito de facilidade de manutenção (p. 7); arquitetura por camadas.
- **Análise:** há classes de caso de uso com múltiplas operações, mas não foram calculadas métricas de coesão/acoplamento nem realizados testes de manutenção.
- **Encaminhamento:** avaliar módulos criticamente antes de propor refatoração, com revisão por funcionalidade e testes de regressão.
- **Estado:** hipótese de melhoria; nenhum defeito específico declarado.

## 5. Rastreabilidade arquitetural inicial

| Requisito(s) | Componentes observados | Lacuna de comprovação |
| --- | --- | --- |
| HU-001 / RN-005 / RN-006 / RNF-002 | `Program.cs`, controllers, segurança e casos de uso | Autorização e bloqueio em execução |
| HU-003 / RN-001 | `PetsController`, `GerenciarPacientesUseCase`, `Pet`, `AppDbContext` | Persistência e transferência de tutor em banco |
| HU-007 / HU-008 / RN-004 | Casos de uso de avaliação/atendimento, `VersaoRegistroClinico` | Atomicidade de versões e proteção integral de registros |
| HU-011 / RNF-003 | `ConsultarProntuarioUseCase`, autorização por paciente | Resposta por perfil e ausência de exposição indevida |
| RNF-004 / RNF-007 | Índices EF Core e estratégias descritas | Testes de carga e escala nas premissas definidas |
| RNF-005 | Health check do banco | Disponibilidade, backup, restauração, perda de dados |

## 6. Decisões a validar com a equipe

1. Registrar formalmente o uso atual de .NET/C# e a evolução em relação ao desenho Java/Spring.
2. Consolidar os quatro perfis e autorizações específicas, inclusive edição limitada de cadastro pelo Tutor **como proposta ainda não aprovada**.
3. Delimitar o app móvel, fluxo de identidade e operações suportadas.
4. Definir os registros clínicos protegidos por RN-004 e estratégia de histórico, transações e retenção.
5. Revisar as premissas de 1.000–3.000 usuários simultâneos, 150 req/s e crescimento de armazenamento.
6. Definir requisitos operacionais verificáveis: backups, restauração, RPO/RTO, monitoramento e dependências externas.

## 7. Próxima etapa

Com as análises da **Visão**, dos **Requisitos** e da **Arquitetura** disponíveis em `02-analise-documental/`, fechar uma **revisão cruzada dos três artefatos** antes de expandir a rastreabilidade do código. Os diagramas acadêmicos permanecem preservados; diagramas de implementação exigem engenharia reversa específica.

**Limite final:** conclusões acima resultam de leitura documental e inspeção estática de arquivos. Não foram executados compilação, chamadas HTTP, migrações, banco de dados, testes de carga nem validação de infraestrutura.
