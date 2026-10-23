# VetCare Lab — Registro de execução manual da HU-001

**Data do registro:** 23/10/2026  
**Ambiente:** VetCare Lab local (`07-laboratorio-web/`), HTML/CSS/JavaScript, navegador não informado  
**Origem da evidência:** relatos de execução manual e capturas de tela produzidas pela responsável pelo laboratório  
**Escopo:** protótipo independente. **Não é evidência de teste da API, do banco de dados ou do sistema oficial.**

## CT-AUT-001 — Login válido e exibição do perfil

- **Objetivo:** verificar se, após informar credenciais fictícias válidas, o laboratório exibe o painel e o perfil correspondente.
- **Procedimento relatado:** selecionar e entrar com os perfis demonstrativos disponíveis no laboratório.
- **Esperado:** exibir a interface de demonstração correspondente ao usuário escolhido, sem apresentar erro de autenticação.
- **Observado:** o login foi realizado sem erros; os perfis demonstrativos apareceram corretamente ao selecionar as diferentes contas.
- **Resultado:** **Aprovado no laboratório (execução manual relatada).**
- **Evidências:** relato da execução manual e duas capturas de tela.

  **Evidência 01 — Tela de login**

  ![Tela inicial do VetCare Lab](evidencias/hu-001/CT-AUT-001-login.png)

  **Evidência 02 — Perfil Administrador**

  ![Painel do Administrador](evidencias/hu-001/CT-AUT-001-perfil-administrador.png)

- **Limitação:** este registro não comprova autenticação na API ASP.NET Core, autorização de endpoints nem sessão JWT.

## VAL-HU001-001 — Validação de campos obrigatórios (verificação complementar)

- **Objetivo:** confirmar a mensagem de erro ao enviar o formulário com campos obrigatórios vazios.
- **Procedimento relatado:** clicar em **Entrar** sem preencher os campos.
- **Esperado:** impedir o avanço e mostrar mensagem de orientação.
- **Observado:** a interface exibiu `Informe o e-mail e a senha para entrar.`
- **Resultado:** **Aprovado no laboratório (execução manual relatada).**
- **Rastreabilidade:** complemento de validação de entrada da HU-001; **não equivale** à verificação de credenciais incorretas do CT-AUT-002.

## CT-AUT-002 — Credenciais inválidas

- **Objetivo:** verificar se o laboratório recusa credenciais inválidas sem permitir acesso ao painel demonstrativo.
- **Procedimento relatado:** (1) tentar login com endereço de e-mail inexistente; (2) selecionar a conta Administrador e informar senha incorreta.
- **Esperado:** exibir `E-mail ou senha inválidos.` nas duas tentativas e permanecer na tela de login.
- **Observado:** conforme relato da execução manual, as duas tentativas foram recusadas, com apresentação da mensagem esperada e sem acesso ao painel.
- **Resultado:** **Aprovado no laboratório (execução manual relatada).**
- **Evidências:** duas capturas informadas pela responsável pelo laboratório.

  **Evidência 01 — E-mail inexistente**

  ![Tentativa com e-mail inexistente](evidencias/hu-001/CT-AUT-002-email-invalido.png)

  **Evidência 02 — Senha incorreta**

  ![Tentativa com senha incorreta](evidencias/hu-001/CT-AUT-002-senha-incorreta.png)

- **Limitação:** o resultado é restrito à validação demonstrativa no navegador; não comprova comportamento da API oficial nem segurança da autenticação.

## Situação dos demais testes

| Teste | Situação no sistema oficial | Situação no laboratório |
| --- | --- | --- |
| CT-AUT-001 — Login válido | Não executado | Aprovado (relato manual e imagens) |
| CT-AUT-002 — Credenciais inválidas | Não executado | Aprovado (relato manual e imagens) |
| CT-AUT-003 — Logout | Não executado | Não registrado nesta execução |
| CT-AUT-004 — Bloqueio por tentativas | Não executado | Não implementado |
| CT-AUT-005 — Conta inativa | Não executado | Não implementado |
| CT-AUT-006 — Acesso por perfil | Não executado | Apresentação de perfis observada; autorização não testada |
| CT-AUT-007 — Sessão inválida/expirada | Não executado | Não implementado |
| CT-AUT-008 — Mobile exclusivo Tutor | Não executado | Fora do escopo do laboratório atual |

## Análise de Engenharia de Software

### O que encontramos?

No VetCare Lab, foram executados manualmente login com contas fictícias, verificação de campos obrigatórios e duas tentativas de credenciais incorretas. Os comportamentos observados foram os esperados, conforme os relatos da execução. As capturas foram vinculadas aos testes CT-AUT-001 e CT-AUT-002. O código demonstrativo está em `07-laboratorio-web/js/app.js` e `index.html`.

### Por que isso importa?

Os resultados fornecem evidências de funcionamento dos fluxos demonstrativos e tornam o registro de QA rastreável por caso de teste. **Não comprovam a conformidade do sistema oficial** nem substituem testes da API.

### O que recomendamos?

Manter os testes reais da API como não executados. Executar e registrar o CT-AUT-003 (logout demonstrativo) e, separadamente, conferir a responsividade e a regressão visual após a divisão do CSS. Só discutir correções na implementação do Mateus quando houver evidência sobre o sistema original.

### Como explicar à equipe?

> “Executamos manualmente os cenários de login válido e credenciais inválidas no VetCare Lab, documentando os resultados e associando capturas de tela. Também verificamos a validação de campos vazios. A aprovação é apenas do protótipo; a autenticação real do VetCare ainda não foi testada.”

## Referências

- `05-testes/plano-testes-hu-001-autenticacao.md`
- `07-laboratorio-web/index.html`
- `07-laboratorio-web/js/app.js`
- Repositório de implementação: `Rozeti/ProjetoVetCare` (não executado neste registro)
