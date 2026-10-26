# VetCare — Análise documental do Documento de Requisitos de Software

**Documento analisado:** `01-documentacao/2_DocumentoRequisitosSoftware_VetCare.pdf`  
**Versão/data original:** 18/06/2026 — 21 páginas  
**Data da análise:** 26/10/2026  
**Natureza:** avaliação de qualidade e consistência da **especificação**; não é homologação, nem revisão exaustiva do código.  
**Estado:** preliminar — achados e propostas dependem de avaliação da equipe/cliente.

## 1. Escopo e método

Avaliar a clareza, completude, consistência interna, verificabilidade e rastreabilidade do Documento de Requisitos de Software (DRS) em relação à Visão original e aos esclarecimentos posteriores da equipe. Os documentos originais permanecem inalterados.

**Fontes distintas:**

- **DRS original:** fonte normativa da especificação acadêmica em análise.
- **Documento de Visão de 10/06/2026:** referência anterior ao DRS (`01-documentacao/1_DocumentoVisao_VetCare.pdf`).
- **Esclarecimentos da integrante da equipe em 26/10/2026:** o Tutor **pode cadastrar** seu animal; a clínica atende **predominantemente cães**; em um fluxo específico de cadastro de cão, o campo de espécie poderia ser implícito. Não afirmar exclusividade de cães.
- **Proposta ainda não homologada:** Tutor poderia **editar um conjunto limitado de dados cadastrais** de seu animal, mas não excluí-lo. Definir os campos e obter decisão da clínica antes de inserir como requisito aprovado.
- **Código de referência:** `Rozeti/ProjetoVetCare` — utilizado em artefatos separados de `03-rastreabilidade/`. Comparações de implementação não são substituídas por este diagnóstico documental.

## 2. Estrutura e cobertura

O documento contém metodologia de elicitação, backlog de **16 histórias de usuário (HU-001 a HU-016)**, **11 regras de negócio (RN-001 a RN-011)**, **8 requisitos não funcionais (RNF-001 a RNF-008)**, matriz de rastreabilidade e declaração de uso de IA (pp. 1–21).

### 2.1 Inventário do backlog (p. 3)

| ID | História de usuário | Prioridade | Dependência no backlog |
| --- | --- | --- | --- |
| HU-001 | Autenticar usuário | Deve ter | — |
| HU-002 | Gerenciar usuários | Deve ter | HU-001 |
| HU-003 | Gerenciar pacientes | Deve ter | HU-002 |
| HU-004 | Gerenciar agenda individual do veterinário | Deve ter | HU-003 |
| HU-005 | Consultar agenda geral da clínica | Deve ter | HU-004 |
| HU-006 | Gerenciar presença em sessão | Deve ter | HU-004 |
| HU-007 | Registrar avaliação clínica | Deve ter | HU-003 |
| HU-008 | Registrar atendimento fisioterapêutico | Deve ter | HU-007 |
| HU-009 | Registrar observações do atendimento | Deve ter | HU-008 |
| HU-010 | Anexar mídias à sessão | Deve ter | HU-008 |
| HU-011 | Consultar prontuário | Deve ter | HU-008 |
| HU-012 | Gerenciar documentos clínicos | Deveria ter | HU-011 |
| HU-013 | Acompanhar tratamento | Deve ter | HU-011 |
| HU-014 | Trocar mensagens entre clínica e tutor | Deveria ter | HU-013 |
| HU-015 | Receber notificações | Deveria ter | HU-006 |
| HU-016 | Consultar indicadores do dia | Deveria ter | HU-008 |

**Leitura:** 12 histórias são classificadas como **Deve ter** e 4 como **Deveria ter**; não há histórias classificadas como *Poderia ter* na tabela, apesar da menção genérica a essa categoria na p. 4. Não se trata necessariamente de inconsistência: pode ser apenas uma categoria sem histórias selecionadas.

### 2.2 Inventário das regras de negócio (pp. 16–17)

| RN | Tema | Principais HUs associadas no DRS |
| --- | --- | --- |
| RN-001 | Associação Tutor–Paciente | HU-003, HU-013 |
| RN-002 | Exclusividade de horário | HU-004 |
| RN-003 | Restrições às observações internas | HU-009, HU-011, HU-013 |
| RN-004 | Integridade e versionamento do prontuário | HU-003, HU-007, HU-008, HU-011 |
| RN-005 | Acesso por perfil | HU-001, HU-014 |
| RN-006 | Bloqueio por tentativas de login | HU-001 |
| RN-007 | Unicidade de credenciais | HU-002 |
| RN-008 | Visibilidade dos indicadores | HU-005, HU-016 |
| RN-009 | Antecedência para cancelamento | HU-006, HU-013 |
| RN-010 | Campos obrigatórios da avaliação | HU-007 |
| RN-011 | Restrições de mídias e documentos | HU-010, HU-012 |

### 2.3 Inventário dos RNFs (pp. 18–19)

| RNF | Tema | Critério registrado |
| --- | --- | --- |
| RNF-001 | Usabilidade | Pelo menos 85% dos usuários concluem tarefas sem auxílio; menção a 3 minutos |
| RNF-002 | Segurança / autorização | Nenhum acesso não autorizado |
| RNF-003 | Privacidade clínica | 100% dos casos sem exposição de observações internas ao Tutor |
| RNF-004 | Desempenho | 95% das requisições de agenda/prontuário abaixo de 2 s |
| RNF-005 | Confiabilidade | Disponibilidade mensal ≥ 99,5%; zero perda de registros confirmados |
| RNF-006 | Compatibilidade e responsividade | Legibilidade e funcionamento em desktop/mobile e navegadores suportados |
| RNF-007 | Escalabilidade | Preservar RNF-004 sob crescimento projetado |
| RNF-008 | Consistência visual | Aderência ao design system em todos os perfis |

## 3. Qualidades identificadas

1. **Organização e identificadores:** HU, CA, RN e RNF possuem nomenclatura que favorece rastreabilidade e planejamento.
2. **Cenários BDD:** há critérios positivos, negativos e de validação expressos predominantemente em Dado/Quando/Então (pp. 5–15).
3. **Dependências explícitas:** o backlog indica relacionamentos entre histórias (p. 3).
4. **Regras clínicas e de privacidade:** RN-001, RN-003 e RN-004 reforçam vínculo, confidencialidade e integridade (p. 16).
5. **RNFs verificáveis em parte:** RNF-001, RNF-003, RNF-004 e RNF-005 apresentam metas numéricas, permitindo planejar testes (pp. 18–19).
6. **Matriz de rastreabilidade:** a seção 6 vincula funcionalidades da Visão, histórias, regras e RNFs (p. 20).

## 4. Achados documentais e decisões pendentes

| ID | Achado documentado | Evidência | Diagnóstico | Encaminhamento |
| --- | --- | --- | --- | --- |
| REQ-DOC-01 | **Cadastro pelo Tutor não está explicitado** nas HUs | HU-003 atribui cadastro ao Administrador; HU-013 descreve acompanhamento e consulta (pp. 6, 13) | Lacuna de explicitação em relação ao esclarecimento posterior da equipe | Formalizar ator, autorização, campos e critérios de aceite em revisão futura |
| REQ-DOC-02 | **Edição limitada pelo Tutor** não está definida | HU-003 trata edição pelo Administrador; HU-013 não prevê edição (pp. 6, 13) | **Proposta**, ainda não requisito aprovado | Definir campos autorizados, proteção de vínculo e histórico, e aprovar com cliente |
| REQ-DOC-03 | **Perfis listados de maneira desigual** | RN-005 e HU-001 listam Admin/Vet/Tutor; HU-005 menciona apoio e a Visão inclui equipe administrativa (pp. 5, 8, 16) | Divergência de enumeração/documentação | Consolidar matriz por operação e perfil, inclusive Apoio |
| REQ-DOC-04 | **Prazo mínimo de cancelamento sem valor no DRS** | HU-006 CA-3 e RN-009 (pp. 8–9, 17) | Parâmetro dependente da clínica; validação fica incompleta sem configuração | Definir valor, unidade e possibilidade de configuração por clínica |
| REQ-DOC-05 | **Limites de upload não quantificados no DRS** | HU-012 CA-3 e RN-011 (pp. 12, 17) | O DRS delega formatos/tamanhos ao sistema, sem fixar valores | Consolidar lista de formatos, limite por arquivo e política de rejeição |
| REQ-DOC-06 | **Carga projetada não quantificada** | RNF-004, RNF-007 (pp. 18–19) | Metas de latência existem, mas volume/cenário de carga precisam ser parametrizados | Definir número de usuários, pets, mídias e concorrência de referência |
| REQ-DOC-07 | **Navegadores suportados não enumerados** | RNF-006 (p. 19) | Critério de compatibilidade necessita matriz de ambientes | Estabelecer navegadores e versões suportados |
| REQ-DOC-08 | **RN-004 não define abrangência de registros protegidos** | RN-004 (p. 16) | Requer interpretação clínica de dados confirmados, alertas, alergias e anexos | Definir escopo de registros, correção, versionamento e exclusão lógica/física |
| REQ-DOC-09 | **Cadastro de cães sem seleção de espécie** | HU-003 CA-1 pede espécie (p. 6); esclarecimento posterior afirma predominância canina | Possível simplificação de UI, **não** proibição geral de outras espécies | Validar fluxos específicos para cães e para outros animais antes de alterar requisito |
| REQ-DOC-10 | **Escopo de app móvel nativo não explicitado** | DRS 1.0 se define como plataforma web; RNF-006 exige web responsiva (pp. 1, 19) | Qualquer aplicativo nativo seria uma evolução de escopo a registrar | Confirmar escopo aprovado com equipe; não confundir web mobile com app nativo |

### 4.1 Exemplo de critérios propostos — não homologados

**Cadastro pelo Tutor (comportamento esclarecido):** dado que o Tutor está autenticado, quando cadastrar um animal com dados válidos, então o sistema vincula o cadastro à identidade do Tutor autenticado, sem permitir escolher arbitrariamente outro responsável.

**Edição cadastral limitada (proposta):** dado que um animal está vinculado ao Tutor autenticado, quando este alterar somente campos aprovados, então o sistema atualiza esses campos sem alterar `TutorId`, dados clínicos ou histórico. Para animal de outro Tutor, a alteração é negada.

**Exclusão pelo Tutor (restrição proposta e coerente com o código atual):** dado que um Tutor autenticado tenta excluir um paciente, quando realizar essa operação, então o sistema nega a solicitação. A decisão final de produto deve ser registrada.

**Nota:** estes exemplos não substituem os critérios originais do PDF nem demonstram conformidade do código existente.

## 5. Consistência entre documentos: pontos de revisão

- **Visão → Requisitos:** problemas de negócio e funcionalidades da Visão têm amplo detalhamento no DRS; verificar futuramente todas as correspondências e lacunas no nível dos fluxos.
- **Perfil Apoio:** aparece entre partes interessadas na Visão e em menções operacionais no DRS, mas a definição de autorização na RN-005 lista três perfis; harmonizar sem excluir automaticamente o Apoio.
- **Web responsiva → aplicativo nativo:** RNF-006 não define, por si só, o escopo de um app distribuído para instalação.
- **Espécie:** o termo do campo cadastral original é válido para animais em geral; a predominância de cães não sustenta uma regra de exclusividade.
- **RN-005/RNF-002:** autorização tem aplicação transversal, mesmo que a coluna de impacto da RN-005 cite diretamente HU-001 e HU-014. Uma matriz transversal de permissões pode tornar isso explícito.

## 6. Relação com os artefatos já existentes

Esta análise **não deve duplicar** inspeções de código ou resultados de testes:

- `02-analise-documental/analise-visao.md`: revisão da definição do produto e dos stakeholders.
- `02-analise-documental/analise-arquitetura.md`: diferença entre arquitetura Java/Spring documentada e solução .NET encontrada.
- `03-rastreabilidade/rastreabilidade-hu-003-rn-001-as-is.md`: evidências concretas na API para paciente/tutor, inclusive propostas em aberto.
- `03-rastreabilidade/rn-004-integridade-prontuario-as-is.md`: inspeção da proteção e versionamento clínico.
- `03-rastreabilidade/rn-005-controle-acesso-as-is.md`: controles identificados por perfil e operação.
- `05-testes/`: planejamento e execução, mantendo separação entre o Lab e o sistema de referência.

## 7. Prioridades de alinhamento

**Alta:** confirmar matriz de permissões (inclusive Tutor/Apoio), formalizar o cadastro pelo Tutor, definir abrangência da RN-004 e parâmetros de cancelamento/arquivos.

**Média:** refinar mensurabilidade de RNF-004/RNF-007 e matriz de navegadores; documentar decisão sobre aplicativo nativo.

**Dependente de decisão do cliente:** campos editáveis pelo Tutor e apresentação da espécie nos formulários.

## 8. Conclusão e limites

O DRS de 18/06/2026 apresenta uma estrutura consistente e rastreável, com critérios de aceitação e metas não funcionais relevantes. As necessidades de evolução mais claras dizem respeito à **explicitação de permissões e fluxos**, à **parametrização de políticas operacionais** e à **mensurabilidade de alguns RNFs**. As divergências e propostas registradas não constituem, por si mesmas, falhas executadas na implementação do Mateus.

Não houve execução de API, banco de dados, teste de carga ou validação formal do cliente nesta análise. Os três PDFs originais permanecem inalterados. A próxima etapa indicada é confrontar a análise documental com a análise de arquitetura e prosseguir na rastreabilidade conforme decisões aprovadas.
