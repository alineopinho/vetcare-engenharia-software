# VetCare — Proposta de diagrama geral de casos de uso

**Data:** 26/10/2026  
**Tipo:** proposta de representação dos requisitos documentados; **não é um diagrama AS-IS do código**.  
**Referências:** Documento de Visão (10/06/2026), Documento de Requisitos (18/06/2026, HUs 001–016) e Documento de Arquitetura v4.0 (28/06/2026, seção 3).

## 1. Objetivo

Representar atores externos e os principais objetivos de interação com o VetCare. O arquivo `casos-de-uso-geral.puml` contém uma proposta **UML editável em PlantUML**, que pode ser revisada pela equipe e exportada como imagem depois.

## 2. Atores e decisões

| Ator | Fonte documental | Tratamento no diagrama |
| --- | --- | --- |
| Administrador | Visão, Requisitos HU-001/002/003/005/016 | Incluído |
| Veterinário | Visão, HU-001/004/007–011/014/016 | Incluído |
| Tutor | Visão, HU-001/006/013/014/015 | Incluído |
| Apoio administrativo | Visão, seção 4; Arquitetura, seção 1.2 e HU-005 na seção 3 | Incluído somente nos casos sustentados pelos documentos; permissões adicionais a validar |

A autenticação aparece como objetivo comum, **não** como relação `<<include>>` artificial ligada a todas as funcionalidades. A exigência de autenticação é uma pré-condição ou regra transversal RN-005.

## 3. Catálogo — histórias e casos de uso

| HU | Caso de uso geral | Ator(es) principais considerados | Notas |
| --- | --- | --- | --- |
| HU-001 | Autenticar-se e encerrar sessão | Administrador, Veterinário, Tutor | Apoio existe na Arquitetura; cobertura na HU-001 precisa ajuste documental |
| HU-002 | Gerenciar usuários | Administrador | Apoio auxilia cadastros na Visão, mas permissões exatas não são consolidadas |
| HU-003 | Gerenciar pacientes | Administrador | Tutor cadastra próprio pet no **código**, mas não está explícito na HU-003 original |
| HU-004 | Gerenciar agenda individual | Veterinário | Inclui reserva e consulta |
| HU-005 | Consultar agenda geral | Administrador, Apoio | Apoio é citado na Arquitetura/HU-005 |
| HU-006 | Confirmar/cancelar presença | Tutor | Prazo mínimo pela RN-009 |
| HU-007 | Registrar avaliação clínica | Veterinário | Correção versionada prevista na RN-004 |
| HU-008 | Registrar atendimento | Veterinário | Registro de sessão |
| HU-009 | Registrar observações internas | Veterinário | Consulta restrita a Veterinário/Administrador (RN-003) |
| HU-010 | Anexar mídias | Veterinário | Conferir atores completos no requisito específico |
| HU-011 | Consultar prontuário | Veterinário, Administrador, Tutor | Tutor possui visão filtrada (HU-013/RN-003) |
| HU-012 | Gerenciar documentos clínicos | Equipe autorizada (a definir) | Atores exatos a consolidar na especificação |
| HU-013 | Acompanhar tratamento | Tutor | Inclui seus pets, visão filtrada e agenda |
| HU-014 | Trocar mensagens | Tutor, Veterinário | Comunicação bilateral |
| HU-015 | Receber notificações | Tutor, Veterinário | Eventos disparados pelo sistema |
| HU-016 | Consultar indicadores | Administrador, Veterinário | Visibilidade por perfil (RN-008) |

O diagrama geral sintetiza essas ações. As HUs continuam sendo a especificação detalhada dos critérios de aceite. Não atribuir ao desenho o papel de testes.

## 4. Diferenças e propostas fora do diagrama-base

- **Cadastro pelo Tutor:** confirmado pela integrante da equipe e implementado como `POST /api/pets/meus`; precisa aparecer de forma explícita na futura revisão de requisitos. Não confundir com o estado do documento original.
- **Edição limitada pelo Tutor:** melhoria proposta, **não identificada como implementada**. Os campos permitidos carecem de aprovação.
- **Exclusão pelo Tutor:** não permitida no código atual e não recomendada na proposta em discussão.
- **Predominância de cães:** não equivale a proibição de outras espécies; eventual interface de cadastro canino é uma decisão de fluxo, não uma proibição geral.
- **Apoio administrativo:** perfis e capacidades aparecem diferentemente nos documentos, exigindo uma matriz de permissões aprovada.

## 5. Revisão de qualidade do diagrama

Antes de aprovar o diagrama, verificar: atores dentro/fora da fronteira, verbos e objetivos nos casos de uso, inexistência de operações internas de código como casos de uso, distinção entre atores principais e regras transversais, cobertura das HUs e ausências explicitadas. A implementação original deve ser analisada em um artefato **AS-IS** separado, se necessário.

## 6. Arquivos

- `04-diagramas/casos-de-uso/casos-de-uso-geral.puml`: fonte editável PlantUML.
- `04-diagramas/casos-de-uso/proposta-casos-de-uso-geral.md`: justificativa e matriz de cobertura.
- `04-diagramas/inventario-diagramas.md`: levantamento das evidências já existentes.
