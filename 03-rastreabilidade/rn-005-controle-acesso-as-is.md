# VetCare — RN-005 | Controle de acesso por perfil (AS-IS)

**Investigação inicial:** 23/10/2026  
**Atualização:** 26/10/2026  
**Método:** documentos originais + inspeção estática da implementação `Rozeti/ProjetoVetCare`.  
**Limitação:** não representa testes reais da API nem homologação.

## 1. Base documental

- RN-005 enumera **Administrador, Veterinário e Tutor**.
- O Documento de Arquitetura também contempla **Apoio Administrativo**.
- A diferença de enumeração entre artefatos deve ser mantida como **divergência documental**, não como evidência de que o Apoio surgiu sem previsão.

## 2. Evidências por camada

### Interface web
`VetCare.Web/src/App.tsx` controla rotas por perfil; `VetCare.Web/src/components/Layout.tsx` apresenta opções conforme permissões. Visibilidade de botões não substitui autorização de servidor.

### API — usuários
`VetCare.API/Controllers/UsuariosController.cs` atribui:
- Leitura de usuários: Administrador e Apoio.
- Criação, alteração, inativação e redefinição administrativa: Administrador.
- Operações pessoais: usuário autenticado, conforme endpoint.

### API — pacientes e prontuários
`PetsController.cs`, `GerenciarPacientesUseCase.cs`, `AcessoAoPaciente.cs` e `ConsultarProntuarioUseCase.cs` indicam:
- Administrador e Apoio: consulta de pacientes da clínica.
- Veterinário: consulta restrita aos pacientes sob sua responsabilidade.
- Tutor: consulta dos animais vinculados à própria conta.
- Observações internas: acesso de Administrador/Veterinário; restringir Tutor e Apoio conforme RN-003.

**Operações sobre pacientes (implementação atual):**

| Operação | Autorização declarada | Observação |
| --- | --- | --- |
| `GET /api/pets/meus` | Tutor | Recorte para próprios animais |
| `POST /api/pets/meus` | Tutor | Cadastro próprio vinculado ao usuário autenticado |
| `POST /api/pets` | Equipe clínica | Cadastro com Tutor selecionado |
| `PUT /api/pets/{id}` | Equipe clínica | Edição cadastral ampla, sem acesso do Tutor |
| `PATCH /api/pets/{id}/status` | Administrador ou Veterinário | Inativação/reativação |
| `DELETE /api/pets/{id}` | Administrador | Exclusão limitada também pela presença de registros |

Os atributos de rota devem ser complementados por testes de autorização e de propriedade dos registros.

## 3. Esclarecimentos e propostas — 26/10/2026

**Cadastro pelo Tutor:** confirmado como comportamento desejado pela integrante da equipe e já presente no código. A HU-003 original destaca o Administrador; falta explicitar documentalmente o novo fluxo. **Não classificar o cadastro do Tutor como defeito.**

**Edição pelo Tutor:** proposta funcional de **edição limitada dos próprios animais**, ainda sem endpoint específico identificado. Os campos editáveis devem ser aprovados antes da implementação. Não liberar indiscriminadamente `PUT /api/pets/{id}` ao Tutor.

**Exclusão pelo Tutor:** deverá continuar vedada, inclusive para pacientes sem registros clínicos, conforme proposta em estudo. Já é bloqueada pelo perfil no controller.

**Espécies:** predominância de cães não implica exclusividade. A apresentação do formulário de «Cadastro de cão» sem seletor de espécie é proposta de interface, não mudança automática da autorização.

## 4. Matriz de conformidade preliminar

| ID | Achado | Classificação |
| --- | --- | --- |
| RN005-DOC-01 | RN-005/HU-001 enumeram três perfis; Arquitetura inclui Apoio | Divergência documental |
| RN005-COD-01 | Apoio consulta usuários; Administrador modifica | Correspondência por inspeção |
| RN005-COD-02 | Acesso a pacientes filtrado por tutor, profissional e clínica | Correspondência por inspeção, teste pendente |
| RN003-COD-01 | Observações internas filtradas por perfil | Correspondência por inspeção, teste pendente |
| HU003-EXT-01 | Tutor cadastra animal próprio | Funcionalidade existente, necessidade confirmada; explicitação documental pendente |
| HU013-PROP-01 | Tutor edita apenas dados autorizados de animal próprio | **Proposta viável, não implementada** |
| HU013-PROP-02 | Tutor não exclui animal | Já restrito no endpoint; manter como decisão a formalizar |

## 5. Testes que continuam necessários

- Tutor tenta consultar e alterar animal de outro Tutor.
- Veterinário tenta acessar animal fora de sua responsabilidade.
- Requisição Tutor ao `PUT /api/pets/{id}` e `DELETE /api/pets/{id}` deve ser recusada na API atual.
- Administrador, Veterinário e Apoio exercitam operações permitidas/proibidas.
- Verificar se a separação por clínica se mantém em todos os endpoints e retornos.
- Inspecionar mídia, anexos, auditoria e demais endpoints clínicos antes de concluir a RN-005.

**Nenhum dos testes acima é marcado como aprovado nesta investigação.** Resultados do VetCare Lab são separados dos testes do sistema original.

## 6. Conclusão

O código de referência apresenta controles em rotas, controllers e casos de uso. O cadastro pelo Tutor está implementado e é desejado; a edição limitada é uma possível evolução, e a exclusão permanece vedada para Tutor. A conformidade integral da RN-005 depende de inspeção restante e execução real.

**Referências:** os três PDFs em `01-documentacao/` e `https://github.com/Rozeti/ProjetoVetCare`.
