# VetCare — Análise documental do Documento de Visão

**Análise:** 26/10/2026  
**Fonte principal:** `01-documentacao/1_DocumentoVisao_VetCare.pdf` (10/06/2026, 6 páginas)  
**Natureza:** análise de coerência, escopo e pontos de esclarecimento; **não é homologação nem teste da implementação**.  
**Estado:** preliminar, sujeito à revisão com a equipe e a clínica VetSPA.

## 1. Propósito e método

Avaliar a clareza e a consistência interna do Documento de Visão do VetCare, identificando necessidades, atores, limites de escopo e decisões em aberto. Comparações com o Documento de Requisitos e com a implementação `Rozeti/ProjetoVetCare` são **contexto externo identificado separadamente**, e não texto atribuído ao Documento de Visão.

Os três PDFs acadêmicos originais permanecem intactos. As análises detalhadas de código e de testes pertencem, respectivamente, a `03-rastreabilidade/` e `05-testes/`.

## 2. Problema, motivação e objetivos (pp. 1–3)

**Situação inicial descrita:** a clínica VetSPA utiliza cadernos, planilhas e aplicativos de mensagens genéricos para gerenciar registros, agendamentos e comunicação. O documento aponta a ausência de prontuários estruturados, agenda consolidada, comunicação vinculada ao paciente e gestão centralizada de anexos.

**Solução pretendida:** plataforma **web** especializada em fisioterapia veterinária para integrar gestão de pacientes, agenda, avaliações, atendimentos, prontuário multimídia, documentos, comunicação e acompanhamento do Tutor. O domínio clínico inclui sessões recorrentes, técnicas fisioterapêuticas e evolução longitudinal.

**Avaliação:** o problema e os objetivos são coerentes entre si. A Visão comunica o *porquê* e o *para quem* do produto; não define, nesta etapa, contratos de API, tabelas de banco ou regras detalhadas de autorização.

## 3. Partes interessadas e papéis (pp. 3–4)

| Parte interessada descrita | Atividades indicadas no PDF | Observação documental |
| --- | --- | --- |
| Administrador da VetSPA | Gerenciar usuários, pets e agenda; acesso à operação e prontuários | Ator principal da gestão |
| Veterinário fisioterapeuta | Avaliações, atendimentos, anexos, observações internas e comunicação | Ator clínico principal |
| Tutor | Acompanhar animais, agenda, evolução e notificações; confirmar/cancelar sessões; conversar com Veterinário | A descrição **não explicita cadastro/edição** do próprio animal |
| Equipe administrativa de apoio | Auxiliar nos agendamentos e no cadastro de Tutores e pets | É parte interessada explicitamente mencionada |

**VIS-001 — Enumeração de perfis:** a declaração de visão (p. 3) menciona três perfis distintos — Administrador, Veterinário e Tutor —, mas a seção 4 inclui Equipe Administrativa de Apoio. Isso **não prova** que o Apoio deva ou não possuir login independente; a matriz de autorização precisa ser consolidada com a equipe. A Arquitetura acadêmica menciona quatro perfis e a RN-005 original enumera três (conferir `02-analise-documental/analise-arquitetura.md` e `03-rastreabilidade/rn-005-controle-acesso-as-is.md`).

**VIS-002 — Cadastro pelo Tutor:** não há explicitação dessa operação na descrição do Tutor na Visão. **Esclarecimento posterior informado pela integrante da equipe (26/10/2026):** Tutor *pode cadastrar* o próprio animal. A implementação de referência tem `POST /api/pets/meus`. Portanto, trata-se de necessidade a **explicitar em futura revisão de requisitos**, não de erro confirmado no código.

**VIS-003 — Edição pelo Tutor:** foi discutida a **proposta** de edição **limitada** de informações cadastrais dos próprios animais, sem exclusão nem alterações clínicas; os campos e a aprovação do cliente **não estão definidos**. Não registrar como decisão final nem como funcionalidade já existente.

## 4. Funcionalidades e prioridades descritas (pp. 5–6)

A seção 5.1 apresenta funcionalidades que incluem:

| Grupo | Conteúdo da Visão | Prioridade na Visão |
| --- | --- | --- |
| Autenticação e gestão clínica | Login por perfil, gestão de usuários e cadastro de pets vinculados a Tutores | Alta |
| Agenda | Agenda individual e agenda geral | Média / Alta, respectivamente |
| Registros fisioterapêuticos | Avaliação clínica detalhada e atendimento com escala de dor, técnicas e evolução | Média |
| Prontuário | Linha do tempo, multimídia e evolução de peso | Alta |
| Privacidade | Observações internas não exibidas ao Tutor | Alta |
| Documentos | Anexar e baixar contratos, exames e laudos | Média |
| Tutor | Visualização filtrada de pets/prontuário, agenda e confirmações | Alta |
| Comunicação | Chat Tutor–Veterinário | Alta |
| Notificações | Avisos de agendamentos, prontuário e mensagens | Média |
| Gestão e análise | Indicadores diários e produtividade | Média |

**Avaliação:** a separação entre prioridades Alta/Média ajuda o planejamento, mas a Visão não informa, sozinha, um corte fechado de MVP por entrega. Essa definição deve ser confrontada com o backlog e as dependências do Documento de Requisitos, sem presumir implementação obrigatória simultânea.

## 5. Requisitos não funcionais preliminares (p. 6)

O PDF explicita plataforma **web responsiva**, usabilidade, segurança/privacidade, desempenho, escalabilidade, confiabilidade dos registros, documentação embutida e consistência visual.

| Aspecto | Formulação na Visão | O que falta quantificar ou verificar depois |
| --- | --- | --- |
| Plataforma | Web responsiva para desktop e mobile | Escopo de aplicativo nativo separado |
| Usabilidade | Interface intuitiva com sidebar e fluxos clínicos rápidos | Critérios objetivos de usabilidade |
| Segurança | Separar observações internas dos dados compartilhados | Matriz de permissões e testes de acesso |
| Performance | Telas rápidas com muitos registros/mídias | Metas mensuráveis e condições de carga |
| Escalabilidade | Crescimento de usuários e pacientes | Volumes e arquitetura-alvo validados |
| Confiabilidade | Histórico clínico completo e disponível | Retenção, backup, versionamento, recuperação e testes |

**VIS-004 — Escopo de plataforma:** a Visão estabelece **web responsiva**, não especifica aplicativo móvel nativo como obrigação. A presença de `VetCare.Mobile` no código original de referência indica uma evolução a ser registrada e aprovada, não uma inconsistência interna da Visão.

## 6. Esclarecimentos posteriores e diferenças externas (não atribuídos ao PDF)

| ID | Informação externa | Tratamento recomendado |
| --- | --- | --- |
| VIS-005 | Integrante da equipe informou que a VetSPA atende **predominantemente cães** | Não transformar em exclusividade. Para fluxo especificamente canino, estudar espécie implícita sem apagar suporte geral a outras espécies sem aprovação |
| VIS-006 | Cadastro pelo Tutor está no código Mateus e foi confirmado como desejado | Complementar especificação funcional e critérios de autorização |
| VIS-007 | Edição cadastral limitada pelo Tutor, sem exclusão, foi proposta | Registrar campos editáveis, validações, ownership e aprovação do cliente antes de tratar como requisito fechado |
| VIS-008 | Implementação de referência utiliza C#/.NET e EF Core, enquanto Arquitetura acadêmica menciona Java/Spring | Mudança arquitetural já examinada em `analise-arquitetura.md`; **não** imputar tecnologias à Visão se não explicitadas nela |

## 7. Questões que exigem decisão da equipe/cliente

1. Apoio Administrativo deve ser perfil autenticado com permissões próprias? Quais operações específicas são autorizadas?
2. Quais dados de um pet o Tutor poderá editar? O Tutor poderá editar após o início do acompanhamento clínico?
3. A experiência de cadastro de **cão** será um fluxo específico? Qual experiência deverá existir para espécies menos frequentes?
4. O aplicativo móvel nativo é parte do escopo aprovado ou extensão posterior à Visão?
5. Quais metas objetivas serão usadas para desempenho, confiabilidade e recuperação de dados?
6. Qual é o limite formal do MVP e quais funcionalidades podem ficar para iterações posteriores?

## 8. Síntese e encaminhamento

**Conclusões fundamentadas:** a Visão define de forma coerente um produto web de fisioterapia veterinária e suas necessidades centrais. O Apoio é mencionado entre as partes interessadas, embora a declaração de visão destaque três perfis. O PDF não especifica cadastro ou edição pelo Tutor nem restringe o atendimento a cães.

**Não concluído:** aprovação das mudanças de escopo, matriz de acesso definitiva, funcionamento real das funcionalidades e qualidade técnica do código Mateus.

**Próximo documento:** `02-analise-documental/analise-requisitos.md` — inspecionar as 16 HUs, RN-001 a RN-011, RNFs e dependências; depois confrontar divergências com a Visão. Não editar os PDFs originais antes da consolidação.
