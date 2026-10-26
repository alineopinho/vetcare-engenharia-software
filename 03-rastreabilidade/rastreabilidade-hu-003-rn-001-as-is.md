# VetCare — HU-003, HU-013, RN-001 e RN-004 | Rastreabilidade AS-IS e decisões propostas

**Análise inicial:** 23/10/2026  
**Atualização:** 26/10/2026  
**Escopo:** documento acadêmico original, esclarecimentos da equipe e inspeção estática de `Rozeti/ProjetoVetCare`.  
**Estado:** análise parcial; **não é homologação nem evidência de execução da API original**.

## 1. Referências e distinção das fontes

- **Documento original:** `01-documentacao/2_DocumentoRequisitosSoftware_VetCare.pdf`, HU-003 (pp. 6–7), HU-013, RN-001 e RN-004 (p. 16).
- **Implementação inspecionada:** `VetCare.API/Controllers/PetsController.cs`, `VetCare.API/UseCases/GerenciarPacientesUseCase.cs`, `VetCare.API/Data/PetRepository.cs`, `VetCare.API/Models/Pet.cs`, `VetCare.API/Data/AppDbContext.cs` e `VetCare.Web/src/pages/MeusPets.tsx`.
- **Esclarecimentos compartilhados pela integrante da equipe (26/10/2026):** Tutor pode cadastrar seus animais; clínica atende predominantemente cães; deseja-se que o cadastro específico de cão não exija seleção de espécie.
- **Proposta em análise (26/10/2026):** Tutor pode editar **somente dados cadastrais autorizados** de seus animais, mas **não pode excluir**. Escopo dos campos ainda precisa de confirmação pelo cliente.

**Importante:** a predominância de cães **não significa exclusividade**. Não instituir proibição global de outras espécies sem decisão explícita. Os documentos acadêmicos em PDF permanecem inalterados.

## 2. HU-003 — critérios de aceitação do documento original

| Critério | Evidência na implementação de referência | Classificação | Verificação pendente |
| --- | --- | --- | --- |
| CA-1 — cadastro associado a um tutor | `Cadastrar()` valida `TutorId`; `Pet.TutorId` e relacionamento EF Core estão presentes | Correspondência estrutural | Persistência real e retorno da API |
| CA-2 — impedir cadastro sem tutor | `Cadastrar()` rejeita identificador vazio, tutor inexistente ou de outra clínica | Correspondência por inspeção | Teste de API, mensagem e status HTTP |
| CA-3 — edição preserva histórico | `Atualizar()` mantém o identificador do `Pet` e altera inclusive `TutorId`, sem apagar prontuário no fluxo | Correspondência estrutural, não comprovada em execução | Alterar tutor com registros reais e comparar antes/depois |
| CA-4 — impedir exclusão com registros e permitir inativação | `Excluir()` consulta `PossuiRegistrosClinicos()`; `AlterarStatus()` modifica `Ativo` | Correspondência parcial sob investigação | Cobertura dos tipos clínicos e testes de banco |

O CA-4 não proíbe necessariamente a exclusão de cadastros **sem** registros clínicos.

## 3. RN-001 — um responsável por paciente

- Cada paciente tem um campo obrigatório `TutorId`, mapeado para `Tutor` no EF Core.
- A edição altera o `TutorId` mantendo o mesmo `Pet`, de modo coerente com a preservação estrutural do histórico.
- A troca de tutor exige autorização e validação do tutor informado.
- **Pendente:** teste real de persistência, consulta posterior e restrição de acesso do tutor anterior.

## 4. Cadastro pelo Tutor — esclarecimento de escopo

O documento HU-003 descreve o **Administrador** como ator do cadastro, sem detalhar o cadastro pelo próprio Tutor.

Na implementação existente:
- `POST /api/pets/meus` tem autorização exclusiva para Tutor e chama `CadastrarComoTutor()`.
- O Tutor responsável é obtido da identidade autenticada, não escolhido livremente pelo usuário.
- `VetCare.Web/src/pages/MeusPets.tsx` oferece cadastro ao Tutor.

**Avaliação atual:** funcionalidade presente e coerente com o esclarecimento da equipe. Existe uma **lacuna de explicitação documental**, e não um defeito demonstrado do código. Formalizar o fluxo em atualização futura da HU-013 ou em requisito complementar aprovado.

## 5. Edição limitada e exclusão pelo Tutor — PROPOSTA, ainda não implementada

**Decisão em estudo:** Tutor poderá corrigir dados cadastrais permitidos de seus próprios cães; não poderá trocar o tutor responsável, modificar registros clínicos nem excluir pacientes.

| Operação | Código atual | Comportamento proposto |
| --- | --- | --- |
| Consultar os próprios animais | `GET /api/pets/meus` | Manter |
| Cadastrar o próprio animal | `POST /api/pets/meus` | Manter |
| Editar seu próprio animal | `PUT /api/pets/{id}` é limitado à equipe clínica; não foi identificado endpoint específico do Tutor | Implementar edição parcial, após aprovação dos campos |
| Excluir animal | `DELETE /api/pets/{id}` é exclusivo do Administrador | Manter vedado ao Tutor |

**Viabilidade técnica preliminar:** é possível oferecer um endpoint dedicado com DTO limitado, vínculo ao Tutor autenticado e validação de propriedade do registro; não se identificou necessidade **óbvia** de reestruturação do relacionamento `Pet`–`Tutor`. A viabilidade precisa ser confirmada pela equipe e em testes.

**Critérios de aceite propostos, sujeitos a aprovação:**
1. Tutor autenticado pode alterar **apenas campos cadastrais autorizados** de paciente que esteja vinculado a sua conta.
2. A tentativa de alterar paciente de outro Tutor é negada.
3. A operação não recebe nem modifica `TutorId`, dados clínicos, histórico ou status por solicitação do Tutor.
4. Tutor não recebe permissão de excluir paciente, inclusive sem histórico.
5. A edição mantém os identificadores e registros clínicos existentes.

**Em aberto:** quais campos exatamente (nome, raça, nascimento, pelagem, microchip etc.) podem ser alterados? Informações clínicas como peso dependem de orientação específica.

## 6. Espécie e raça

**Esclarecimento:** a clínica atende **predominantemente cães**, e um fluxo denominado «Cadastro de cão» não precisa pedir ao usuário que selecione a espécie.

- O documento original da HU-003 inclui espécie entre os dados do cadastro.
- O código atual armazena `Pet.Especie` e a interface de Tutor oferece diferentes espécies.
- **Proposta de interface:** em um cadastro específico de cão, registrar a espécie de forma implícita e preservar o campo no modelo/API.
- **Não concluir:** que a clínica só atende cães ou que o sistema deva bloquear globalmente outras espécies.
- **Pendente:** esclarecer se existem fluxos próprios para outros animais e como os formulários devem se relacionar.

## 7. RN-004 — integridade do prontuário

O documento original determina que **registros clínicos confirmados não podem ser excluídos** e que alterações posteriores mantenham rastreabilidade da versão anterior.

`PetRepository.PossuiRegistrosClinicos()` consulta avaliações, atendimentos, prescrições, documentos clínicos, observações internas, tratamentos e vacinas. **Não consulta diretamente alergias e condições clínicas**. Em `Remover()`, alergias/condições e prontuários vazios são removidos junto com o paciente.

**Achado:** possível lacuna de abrangência da proteção do histórico, dependendo da classificação clínica de alergias/condições. **Não é defeito confirmado.**

**Pendente:** investigar se alertas clínicos são registros protegidos, o versionamento efetivo das alterações, relacionamentos de banco e comportamento real diante de exclusão.

## 8. Estado dos testes e limites

- Inspeções acima: leitura estática de arquivos do Mateus, sem executar API ou banco original.
- Testes comunicados pela usuária no **VetCare Lab**, em outro ambiente e com dados fictícios: cadastro sem Tutor foi impedido; cadastro com Tutor e visualização em dois perfis ocorreram. Isso **não comprova** requisitos na implementação original.
- A alteração de Tutor preservando histórico no Lab e os testes de exclusão/inativação ainda não têm resultado conclusivo registrado nesta análise.

## 9. Encaminhamento

1. Validar com a equipe/cliente os campos editáveis pelo Tutor e a decisão de que ele não pode excluir.
2. Formalizar no documento de requisitos atualizado, **quando for a etapa de revisão documental**, o cadastro pelo Tutor e eventual edição limitada.
3. Concluir inspeção da RN-004 e planejar testes de API/banco antes de afirmar conformidade.
4. Manter os três PDFs acadêmicos originais intactos durante a investigação.

**Síntese:** há boa correspondência estrutural de HU-003 e RN-001. A edição limitada pelo Tutor é uma **melhoria proposta**, não funcionalidade implementada. O cadastro pelo Tutor já existe no código e foi confirmado como desejado; o campo de espécie pode ser implícito no fluxo canino, sem proibição geral de outros animais.
