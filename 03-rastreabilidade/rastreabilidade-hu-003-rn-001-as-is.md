# VetCare — HU-003 e RN-001 | Investigação e rastreabilidade AS-IS

**Data:** 23/10/2026  
**Natureza:** investigação documental e inspeção estática da implementação de referência.  
**Estado:** preliminar; não corresponde à execução de testes nem à homologação do sistema original.

## 1. Objetivo e referências

Verificar a correspondência entre a **HU-003 — Gerenciar pacientes**, a **RN-001 — Associação Tutor–Paciente** e a implementação do projeto `Rozeti/ProjetoVetCare`.

Documentação de referência: `01-documentacao/2_DocumentoRequisitosSoftware_VetCare.pdf`, HU-003 (pp. 6–7), RN-001 (p. 16), e RN-004 (integridade do prontuário). Os PDFs originais permanecem inalterados.

Arquivos da implementação inspecionados:

- `VetCare.API/Controllers/PetsController.cs`
- `VetCare.API/UseCases/GerenciarPacientesUseCase.cs`
- `VetCare.API/Security/AcessoAoPaciente.cs`
- `VetCare.API/UseCases/ConsultarProntuarioUseCase.cs` (verificação de acesso ao prontuário)

## 2. Critérios de aceite da HU-003

| Critério original | Evidência no código | Classificação | O que ainda verificar |
| --- | --- | --- | --- |
| **CA-1 — Cadastro vinculado a tutor:** Administrador cadastra pet e associa a um único tutor | `GerenciarPacientesUseCase.Cadastrar()` exige `dto.TutorId`, consulta o tutor e atribui `Pet.TutorId` | Correspondência identificada por inspeção | Persistência real; vínculo único no modelo de dados e no banco |
| **CA-2 — Tutor obrigatório:** impedir cadastro sem tutor | `Cadastrar()` rejeita `Guid.Empty`; também rejeita tutor inexistente ou de outra clínica | Correspondência identificada por inspeção | Resposta HTTP e mensagem na interface, inclusive campos omitidos ou inválidos |
| **CA-3 — Edição preservando histórico:** editar dados sem perder o histórico clínico | `Atualizar()` modifica os campos do mesmo `Pet`, incluindo `TutorId`, sem criar novo paciente nem excluir o prontuário nesse fluxo | Correspondência estrutural aparente | Testar alterações de tutor e confirmar histórico intacto no banco e nas consultas |
| **CA-4 — Exclusão com histórico:** impedir remoção de paciente com registros, permitindo inativação | `Excluir()` chama `_pets.PossuiRegistrosClinicos(id)` e retorna conflito quando há registros; `AlterarStatus()` altera `Ativo` | Correspondência identificada por inspeção | Definição exata de “registros clínicos” no repositório e comportamento com diferentes tipos de histórico |

**Observação:** o fluxo implementado permite a exclusão efetiva quando `PossuiRegistrosClinicos` é falso. Isso não contradiz, por si só, o CA-4, que se refere aos pacientes **com** registros clínicos.

## 3. RN-001 — Associação Tutor–Paciente

**Regra original, resumida:** cada paciente deve ter **um único tutor responsável**, e uma eventual reatribuição não pode apagar seu histórico clínico.

- **Cadastro:** o `TutorId` é exigido e associado ao registro do paciente.
- **Reatribuição:** `Atualizar()` permite alterar `TutorId`, após conferir o tutor e o vínculo com a clínica; mantém o identificador do paciente.
- **Segurança:** `AcessoAoPaciente.Permitido()` limita leitura a tutor responsável, veterinário responsável ou perfis de administração/apoio, conforme o papel.
- **Pendência:** verificar o mapeamento EF Core, restrições efetivas do banco, histórico clínico antes/depois da reatribuição e consequências de uma troca de tutor nas funcionalidades relacionadas à HU-013.

## 4. Funcionalidades adicionais encontradas

| Evidência | Diferença em relação à HU-003 original | Estado |
| --- | --- | --- |
| `POST /api/pets/meus` e `CadastrarComoTutor()` | Tutor pode cadastrar um pet próprio; o tutor é obtido da sessão, não de um identificador enviado pelo formulário | Ampliação observada; validar escopo documental |
| `POST /api/pets` com `Perfis.EquipeClinica` | Cadastro também está acessível a papéis da equipe clínica, conforme definição da constante de perfis | Comparar papéis autorizados com HU-003 e RN-005 |
| `Atualizar()` trata data de óbito | Registro de óbito pode inativar o paciente e interromper tratamentos em aberto | Fluxo adicional; analisar em requisito pertinente, sem classificá-lo como erro |
| `Excluir()` remove cadastro sem histórico | A exclusão física é permitida em uma condição específica | Conferir implementação de `PossuiRegistrosClinicos` e RN-004 |

## 5. Achados e limites

1. **Correspondência identificada:** há implementação coerente com os quatro critérios de aceite da HU-003.
2. **Correspondência estrutural aparente:** a alteração de tutor modifica o vínculo no mesmo paciente, o que sugere preservação do histórico; isso precisa ser demonstrado em execução e persistência.
3. **Extensão de implementação:** o cadastro pelo Tutor não está expresso na descrição original da HU-003. Não constitui defeito confirmado.
4. **Autorização:** há controles no controller e nos casos de uso, mas ainda não foram feitos testes de acesso entre diferentes usuários e clínicas.
5. **Sem execução do sistema original:** não houve teste de API, banco de dados ou interface do projeto do Mateus nesta investigação. O VetCare Lab também não comprova esses comportamentos.

## 6. Verificações seguintes

- Inspecionar `PetRepository.PossuiRegistrosClinicos` e as entidades/mapeamentos de `Pet` e prontuário.
- Verificar se o banco garante vínculo obrigatório e consistente entre paciente e tutor.
- Rastrear o histórico clínico em uma reatribuição de tutor.
- Confrontar o cadastro pelo Tutor com Documento de Visão e HU-013.
- Se houver ambiente de teste isolado, executar cenários com contas fictícias e preservar evidências sem dados pessoais reais.

## 7. Como explicar à equipe

> “A HU-003 apresenta correspondências no código para cadastro vinculado ao tutor, validação de tutor obrigatório, edição e bloqueio da exclusão quando existe histórico. A RN-001 também aparece representada pela associação entre paciente e tutor. Encontramos fluxos adicionais, como cadastro pelo próprio tutor. Ainda precisamos confirmar a persistência, a preservação efetiva do histórico e as restrições de autorização antes de concluir a conformidade.”

**Próxima etapa:** aprofundar a RN-001 na camada de persistência e manter o presente registro como artefato complementar — sem alterar os documentos acadêmicos nem a implementação original.
