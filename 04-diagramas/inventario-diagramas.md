# VetCare — Inventário de diagramas e plano de revisão

**Data da revisão:** 26/10/2026  
**Escopo:** três documentos acadêmicos originais e arquivos atualmente encontrados em `04-diagramas/` no repositório independente `alineopinho/vetcare-engenharia-software`.  
**Natureza:** análise documental e inventário; não comprova a execução do sistema nem substitui a orientação formal do professor.

## 1. Diagramas encontrados

| Artefato | Localização | Situação | Próxima ação |
| --- | --- | --- | --- |
| Diagrama de classes do domínio | Documento de Arquitetura v4.0, figura 2, p. 10 | Existente no PDF acadêmico; elaborado para a arquitetura original Java/JPA | Comparar entidades/relacionamentos com `Models/` e `AppDbContext` da implementação .NET |
| Diagrama de camadas | Documento de Arquitetura, figura 3, p. 12 | Existente; referência ao ecossistema Spring | Revisar para refletir a implementação C#/ASP.NET Core/EF Core, em futuro artefato **AS-IS** |
| Diagrama de sequência de avaliação | Documento de Arquitetura, figura 4, p. 14 | Existente; fluxo descrito com controller, service e JPA | Comparar com `RegistrarAvaliacaoUseCase` e controller correspondentes |
| Diagrama de implantação | Documento de Arquitetura, figura 5, p. 15 | Existente; servidor Java e JDBC | Confrontar com configuração real de implantação/Docker; não supor infraestrutura em produção |
| Modelo entidade-relacionamento (MER) | Documento de Arquitetura, figura 6, p. 17 | Existente, ainda não comparado entidade por entidade | Conferir chaves, cardinalidades, restrições e migrações EF Core |
| Diagrama de componentes **AS-IS** | `04-diagramas/componentes/diagrama-componentes-as-is.md` | Já existe no repositório complementar | Manter e atualizar somente após nova evidência |
| Diagramas de sequência da HU-001 | `04-diagramas/sequencia/hu-001-autenticacao-as-is.md` e `hu-001-login-web-mobile-as-is.md` | Já existem | Preservar; evitar diagrama de sequência redundante |
| Levantamentos de navegação HU-001 | `04-diagramas/navegacao/01-levantamento-navegacao-hu-001-as-is.md` e `01.1-complemento-navegacao-hu-001-as-is.md` | Existem como levantamentos, não necessariamente UML formal | Manter classificação correta |
| **Casos de uso geral** | Não localizado no repositório complementar nem identificado nas figuras do PDF de Arquitetura | **Proposta nova** | Elaborar diagrama de atores e objetivos, com indicação de fontes e decisões pendentes |

> **Importante:** não foi disponibilizada aqui a lista literal de diagramas exigidos pelo professor. Portanto, esta lista inventaria o material localizado, **não certifica o atendimento da avaliação da disciplina**.

## 2. O que evitar

- Não criar um diagrama isolado para cada uma das 16 HUs por obrigação: várias histórias podem compartilhar objetivos e atores.
- Não confundir **história de usuário** (necessidade/valor) com **caso de uso** (interação ator–sistema). A relação entre eles deve ser documentada.
- Não apresentar diagramas UML propostos como evidência de que funções foram testadas.
- Não tratar funcionalidades adicionais do código como requisitos formalmente aprovados sem verificação.

## 3. Priorização sugerida

| Prioridade | Entregável | Justificativa |
| --- | --- | --- |
| 1 | Diagrama geral de casos de uso — **base documental** | Consolidar os atores e as HUs 001–016 e explicitar inconsistências entre Visão, Requisitos e Arquitetura |
| 2 | Revisão dirigida do caso de uso **Pacientes / Tutor** | Cadastro pelo tutor já implementado, edição limitada ainda proposta e controle de acesso merecem definição explícita |
| 3 | Revisão do modelo de dados/MER | RN-001 e RN-004 dependem de associações e integridade |
| 4 | Atualização do diagrama de sequência da avaliação clínica (AS-IS) | Refletir .NET e o mecanismo real de versionamento |
| 5 | Diagrama de implantação AS-IS | Conferir ambientes existentes antes de desenhar algo não implementado |

## 4. Matriz mínima de rastreabilidade

| Fonte | Artefato de diagrama relacionado |
| --- | --- |
| Visão, seção 3 e seção 4 (atores e produto) | Casos de uso geral |
| Requisitos, seção 2.1 (16 HUs), seção 3 (aceites) | Casos de uso geral e por domínio |
| Requisitos, RN-001, RN-004, RN-005 | Casos de uso Pacientes; modelo de dados; autorização |
| Arquitetura v4.0, figuras 2 a 6 | Revisão dos modelos estruturais, comportamentais e de implantação |
| Código de referência `Rozeti/ProjetoVetCare` | Diagramas AS-IS (não substitui as fontes documentais) |

## 5. Próxima decisão da equipe

Confirmar quais diagramas o professor exige e quais funcionalidades adicionais devem constar nos desenhos finais. Até lá, manter duas versões conceituais: **base documental** e **extensões/propostas**, sem misturar aprovação e implementação.
