# VetCare — Matriz de requisitos funcionais derivados das histórias de usuário

**Data:** 26/10/2026  
**Status:** proposta técnica preliminar, não homologada  
**Documento de origem:** [`2_DocumentoRequisitosSoftware_VetCare.pdf`](https://github.com/alineopinho/vetcare-engenharia-software/blob/main/01-documentacao/2_DocumentoRequisitosSoftware_VetCare.pdf)  
**Fonte auxiliar de leitura:** [`02-analise-documental/analise-requisitos.md`](https://github.com/alineopinho/vetcare-engenharia-software/blob/main/02-analise-documental/analise-requisitos.md)  
**Implementação de referência:** [`Rozeti/ProjetoVetCare`](https://github.com/Rozeti/ProjetoVetCare)

> **Importante:** os códigos RF-001 a RF-039 são identificadores **propostos nesta matriz**, não códigos transcritos do DRS. O documento original organiza os comportamentos em **HU-001 a HU-016** e respectivos critérios de aceitação. O PDF não foi extraído diretamente nesta revisão: a matriz usa o inventário e os apontamentos previamente registrados em `analise-requisitos.md`, complementados pela leitura do README e dos controllers `UsuariosController`, `PetsController` e `SessoesController` no repositório de referência. Assim, **nenhuma formulação abaixo deve ser tratada como transcrição literal ou requisito homologado sem conferir o critério de aceitação original**.

## 1. Propósito e convenções

Esta matriz explicita comportamentos verificáveis derivados dos **temas e escopo conhecido** das 16 histórias do DRS. Serve como **rascunho de decomposição** para posterior refinamento baseado nos critérios de aceitação (CA), rastreabilidade com o código, testes e aprovação da equipe.

**Grau de sustentação:**
- **DRS/resumo:** o tema ou comportamento consta no inventário e no diagnóstico documental; conferir CA e página do PDF antes de aprovar.
- **Código inspecionado:** foi observada rota correspondente em controller, **sem demonstrar** a regra completa ou a interface.
- **README:** função declarada no repositório de referência, mas sem inspeção completa ou teste de sua implementação.
- **Proposta de detalhamento:** desdobramento sugerido para tornar verificável o comportamento; **não afirmar como requisito original**.

## 2. Matriz de RFs candidatos

| RF proposto | HU de origem | Comportamento a especificar/verificar | Sustentação atual | Evidência técnica / verificação pendente |
|---|---|---|---|---|
| RF-001 | HU-001 | Autenticar usuário mediante credenciais. | DRS/resumo + código inspecionado | `UsuariosController.Login`; conferir campos e respostas no CA. |
| RF-002 | HU-001 | Aplicar permissões conforme perfil do usuário autenticado. | DRS/resumo + código inspecionado | `Authorize(Roles=...)` em controllers; validar matriz de permissões. |
| RF-003 | HU-002 | Cadastrar usuário da clínica com perfil atribuído. | DRS/resumo + código inspecionado | `UsuariosController.Cadastrar`; validar campos obrigatórios. |
| RF-004 | HU-002 | Listar e consultar usuários. | Código inspecionado; detalhamento a validar no DRS | `UsuariosController.Listar`/`ObterPorId`. |
| RF-005 | HU-002 | Atualizar dados cadastrais de usuário. | DRS/resumo + código inspecionado | `UsuariosController.Atualizar`; delimitar campos permitidos. |
| RF-006 | HU-002 | Ativar ou desativar a conta de usuário sem excluir seu histórico. | Código inspecionado + README | `UsuariosController.AlterarStatus`; verificar CA original. |
| RF-007 | HU-003 | Cadastrar paciente animal associado a um tutor. | DRS/resumo + código inspecionado | `PetsController.Cadastrar`; RN-001. |
| RF-008 | HU-003 | Consultar e listar pacientes conforme autorização do ator. | DRS/resumo + código inspecionado | `PetsController.Listar`/`ObterPorId`; conferir recortes por perfil. |
| RF-009 | HU-003 | Atualizar dados cadastrais de paciente por ator autorizado. | DRS/resumo + código inspecionado | `PetsController.Atualizar`; CA do DRS atribui gestão ao administrador. |
| RF-010 | HU-003 | Excluir paciente apenas quando a política de histórico permitir; caso contrário, tratar inativação. | DRS/resumo + código inspecionado | `PetsController.Excluir`/`AlterarStatus`; validar HU-003 CA-4. |
| RF-011 | HU-004 | Consultar agenda individual do veterinário. | DRS/resumo + código inspecionado | `SessoesController.ConsultarMinhaAgenda`. |
| RF-012 | HU-004 | Alternar a visualização da agenda individual entre dia, semana e mês. | Código inspecionado + README | Parâmetro `visao`; confirmar critérios de interface. |
| RF-013 | HU-004 | Registrar agendamento de sessão por usuário autorizado. | Código inspecionado; verificar CA | `SessoesController.Agendar`; RN-002. |
| RF-014 | HU-005 | Consultar agenda geral consolidada da clínica. | DRS/resumo + código inspecionado | `SessoesController.ConsultarAgendaGeral`. |
| RF-015 | HU-005 | Filtrar agenda geral por veterinário e período/visão. | Código inspecionado; detalhamento a validar no DRS | Parâmetros `veterinarios`, `data` e `visao`. |
| RF-016 | HU-006 | Registrar confirmação de presença em sessão. | DRS/resumo + código inspecionado | `SessoesController.AtualizarStatus`; validar transições. |
| RF-017 | HU-006 | Solicitar cancelamento de sessão conforme política de antecedência. | DRS/resumo + código inspecionado | RN-009; testar limites temporais e perfis. |
| RF-018 | HU-007 | Registrar avaliação clínica de paciente. | DRS/resumo + README | Conferir controller/use case e CA original. |
| RF-019 | HU-007 | Validar os campos obrigatórios da avaliação. | DRS/resumo + README | RN-010; obter os cinco campos diretamente do DRS. |
| RF-020 | HU-008 | Registrar atendimento fisioterapêutico vinculado ao paciente/tratamento. | DRS/resumo + README | Localizar endpoints e conferir CA. |
| RF-021 | HU-008 | Registrar informações clínicas da sessão, conforme formulário aprovado. | README; proposta de detalhamento | README cita técnicas, sinais vitais e dor; conferir se são exigidos na HU original. |
| RF-022 | HU-009 | Registrar observações do atendimento. | DRS/resumo + README | Identificar campos, associação e validações. |
| RF-023 | HU-009 | Restringir consulta de observações internas aos perfis autorizados. | DRS/resumo + README | RN-003; teste negativo com tutor. |
| RF-024 | HU-010 | Anexar mídia à sessão/registro clínico. | DRS/resumo + README | Validar associação ao atendimento. |
| RF-025 | HU-010 | Rejeitar mídia que viole formatos ou tamanhos permitidos. | RN-011 + README | Definir limites aprovados e testar rejeição. |
| RF-026 | HU-011 | Consultar prontuário do paciente conforme perfil autorizado. | DRS/resumo + README | RN-003/RN-004; testar isolamento entre tutores. |
| RF-027 | HU-011 | Consultar histórico clínico e registros associados ao prontuário. | DRS/resumo + README | Conferir abrangência do histórico no CA. |
| RF-028 | HU-012 | Anexar e consultar documentos clínicos vinculados ao paciente. | DRS/resumo + README | Validar formatos, arquivos e perfis. |
| RF-029 | HU-012 | Gerenciar documentos de acordo com permissões e política de integridade. | DRS/resumo + README; detalhamento a validar | RN-004/RN-011; conferir edição/exclusão no DRS. |
| RF-030 | HU-013 | Permitir ao tutor acompanhar informações de tratamento dos próprios animais. | DRS/resumo + README | `PetsController.ListarMeusPets`, `SessoesController.ListarMinhasSessoes` (evidência parcial). |
| RF-031 | HU-013 | Exibir ao tutor sessões relacionadas ao tratamento autorizado. | Código inspecionado + README | `SessoesController.ListarPorTratamento`; testar isolamento. |
| RF-032 | HU-014 | Enviar mensagem entre tutor e clínica conforme regras de acesso. | DRS/resumo + README | Confirmar escopo, destinatários e autorização. |
| RF-033 | HU-014 | Consultar histórico de mensagens da conversa. | README; detalhamento a validar no DRS | Verificar CA e isolamento das conversas. |
| RF-034 | HU-015 | Disponibilizar notificações ao usuário destinatário. | DRS/resumo + README | Validar gatilhos, conteúdo e destinatários. |
| RF-035 | HU-015 | Consultar as notificações destinadas ao usuário. | README; detalhamento a validar no DRS | Conferir se previsto no CA original. |
| RF-036 | HU-016 | Consultar indicadores operacionais do dia. | DRS/resumo + README | Conferir indicadores exigidos, atualização e cálculos. |
| RF-037 | HU-016 | Aplicar visibilidade de indicadores conforme o perfil autorizado. | DRS/resumo + README | RN-008; testar acessos por perfil. |

**Numeração reservada:** RF-038 e seguintes para RFs que resultem da leitura integral dos CA originais. **Não preencher lacunas com comportamentos presumidos.**

## 3. Evoluções e propostas fora da linha de base original

| Item | Situação | Tratamento recomendado |
|---|---|---|
| Cadastro do próprio animal pelo Tutor | Implementado como rota `POST /api/pets/meus`; não explicitado na HU-003 original segundo análise documental | Registrar como mudança/esclarecimento a ser formalizado, sem reescrever o PDF. |
| Edição limitada do cadastro do animal pelo Tutor | Proposta ainda não homologada; `PUT /api/pets/{id}` no controller inspecionado é restrito à equipe clínica | **Não** criar RF aprovado sem decisão de quais campos podem ser alterados. |
| Aplicativo nativo para tutor | README declara aplicativo Expo/React Native; DRS original descreve plataforma web | Registrar evolução de plataforma e critérios adicionais. |
| HU-017 — relatórios de produtividade | Presente no README da implementação, **ausente da linha de base HU-001–HU-016** | Registrar como alteração posterior, não como HU do DRS original. |
| Vacinação detalhada, transferências, e-mail/push e tempo real | Aparecem no README | Avaliar se extrapolam CAs originais e abrir solicitações de mudança, quando necessário. |

## 4. Regras de negócio e requisitos não funcionais

**Não confundir categorias:**
- **RF:** comportamento/serviço que o sistema oferece, expresso nesta matriz em verbos verificáveis.
- **RN-001 a RN-011:** políticas e restrições transversais, que se relacionam aos RFs sem serem automaticamente reclassificadas como RFs.
- **RNF-001 a RNF-008:** metas de qualidade, segurança, desempenho, usabilidade, confiabilidade, compatibilidade, escalabilidade e consistência visual; exigem critérios de medida e testes próprios.

Relações prioritárias: HU-001 ↔ RN-005/RN-006; HU-002 ↔ RN-007; HU-003/HU-013 ↔ RN-001; HU-004 ↔ RN-002; HU-006/HU-013 ↔ RN-009; HU-007 ↔ RN-010; HU-009/HU-011 ↔ RN-003; HU-010/HU-012 ↔ RN-011; HU-011 ↔ RN-004; HU-005/HU-016 ↔ RN-008.

## 5. Como completar a rastreabilidade

Para **cada RF**, registrar após conferência do PDF: (1) página e CA exato do DRS; (2) ator e pré-condições; (3) comportamento e exceções; (4) RN e RNF relacionados; (5) arquivo e método da implementação; (6) ID do teste e evidência; (7) resultado: conforme, parcialmente conforme, não conforme ou não avaliado.

Exemplo de registro **a validar**, sem inventar número do critério de aceitação:

| RF | HU/CA original | RN | Implementação | Teste | Estado |
|---|---|---|---|---|---|
| RF-001 | HU-001 / **CA a confirmar no PDF** | RN-005, RN-006 | `VetCare.API/Controllers/UsuariosController.cs` → `Login` | CT a criar | Não avaliado |
| RF-007 | HU-003 / **CA a confirmar no PDF** | RN-001 | `VetCare.API/Controllers/PetsController.cs` → `Cadastrar` | CT a criar | Não avaliado |
| RF-016 | HU-006 / **CA a confirmar no PDF** | RN-009 | `VetCare.API/Controllers/SessoesController.cs` → `AtualizarStatus` | CT a criar | Não avaliado |

## 6. Conclusão

O DRS **possui requisitos funcionais** em forma de histórias de usuário e critérios de aceitação, mas não uma enumeração autônoma `RF-###` no inventário consultado. Esta matriz oferece uma **decomposição candidata**, útil para Engenharia de Requisitos, porém ainda exige validação frente ao texto integral dos CA antes de se tornar linha de base oficial. A **HU-017 não integra o DRS original**. Nenhum teste funcional foi executado para esta matriz.
