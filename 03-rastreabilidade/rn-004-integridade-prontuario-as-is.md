# VetCare — RN-004 | Integridade do prontuário (AS-IS)

**Análise:** 26/10/2026  
**Escopo:** confronto entre o Documento de Requisitos original e inspeção estática do código de referência `Rozeti/ProjetoVetCare`.  
**Estado:** parcial; não houve execução da API, do PostgreSQL nem homologação.

## 1. Exigência documental

A **RN-004 — Integridade do prontuário** determina que registros clínicos confirmados não podem ser excluídos e que alterações posteriores preservem a rastreabilidade da versão anterior. O documento original associa a regra às HU-003, HU-007, HU-008 e HU-011.

**Referência:** `01-documentacao/2_DocumentoRequisitosSoftware_VetCare.pdf`, seção «Lista de regras de negócio», RN-004. O PDF original não foi modificado.

## 2. Evidências do código

| Comportamento investigado | Evidência localizada | Classificação |
| --- | --- | --- |
| Versionamento de avaliações | `RegistrarAvaliacaoUseCase.Atualizar()` chama `_versoes.Arquivar(...)` antes de editar a avaliação. `ObterHistorico()` consulta versões. | Mecanismo identificado por inspeção |
| Versionamento de atendimentos | `RegistrarAtendimentoUseCase.Atualizar()` também chama `_versoes.Arquivar(...)` antes da edição, e oferece `ObterHistorico()`. | Mecanismo identificado por inspeção |
| Estrutura das versões | `Models/VersaoRegistroClinico.cs`: tipo de registro, ID, snapshot JSON anterior, autor e data de alteração. `Data/AppDbContext.cs` mapeia a entidade e índice. | Estrutura identificada |
| Proteção contra exclusão de paciente com histórico | `GerenciarPacientesUseCase.Excluir()` chama `PetRepository.PossuiRegistrosClinicos()` e recusa exclusão quando verdadeiro. | Implementação identificada, abrangência pendente |
| Alergias e condições clínicas | `PossuiRegistrosClinicos()` não consulta diretamente `AlergiasCondicoes`; `PetRepository.Remover()` remove alertas ligados ao paciente, se a exclusão for permitida. | Risco de interpretação/abrangência a validar |
| Política de exclusão de registros clínicos individuais | Ainda não foram examinados todos os controllers, serviços e repositories correspondentes. | Não concluído |

## 3. Análise técnica

### 3.1 Versionamento

Os fluxos de **edição de avaliação** e **edição de atendimento** fazem uma cópia do estado anterior antes da alteração. O mecanismo é compatível, em princípio, com a parte de rastreabilidade da RN-004.

**Limites:** a presença de chamadas no código não demonstra que a gravação da versão e a atualização do registro ocorrem atomicamente na mesma transação. É necessário examinar `IVersaoRegistroRepository`, sua implementação e os limites transacionais, além de testar falhas intermediárias.

### 3.2 Exclusão do paciente

A verificação de histórico inclui avaliações, atendimentos, prescrições, documentos clínicos, observações internas, tratamentos e vacinas. Não inclui diretamente alergias/condições clínicas, que podem ser excluídas junto ao cadastro do paciente quando a rotina entende que não há histórico.

**Questão em aberto:** a política clínica considera alergias e condições clínicas como registros clínicos confirmados e protegidos? Se sim, a abrangência atual merece correção. Não classificar como defeito confirmado antes dessa definição.

### 3.3 Restrições relacionais

`AppDbContext` substitui, de maneira geral, exclusões em cascata por `Restrict` nos relacionamentos mapeados. Isso ajuda a prevenir apagamentos não intencionais, mas não substitui os testes de integridade nem resolve sozinho a política de exclusão de cada tipo de registro.

## 4. Matriz de pendências e validações

| ID | Pergunta de validação | Método indicado |
| --- | --- | --- |
| RN004-01 | Uma edição de avaliação preserva exatamente a versão anterior? | Teste de integração com API e PostgreSQL |
| RN004-02 | Uma edição de atendimento preserva exatamente a versão anterior? | Teste de integração com API e PostgreSQL |
| RN004-03 | Se a gravação falhar entre arquivar versão e atualizar registro, o banco fica consistente? | Inspeção de transações e teste de falha |
| RN004-04 | Registros confirmados podem ser excluídos por algum endpoint? | Revisão de controllers/use cases e testes negativos |
| RN004-05 | Alergias e condições clínicas devem impedir exclusão do paciente? | Confirmação da regra com cliente/equipe |
| RN004-06 | A troca de tutor preserva prontuário e versões anteriores? | Teste da HU-003 com banco real |

## 5. Parecer provisório

**Há implementação concreta de versionamento** para avaliações e atendimentos e proteção da exclusão do paciente para diversos registros. **Não é possível afirmar conformidade integral da RN-004**, porque faltam comprovação transacional, abrangência completa da política de exclusão e testes na implementação original.

Este documento registra apenas evidências do código de referência. O VetCare Lab não foi utilizado para comprovar a RN-004.
