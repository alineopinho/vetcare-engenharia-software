# VetCare Lab — Registro de execução manual da HU-001

**Data do registro:** 23/10/2026  
**Ambiente:** VetCare Lab local (`07-laboratorio-web/`), HTML/CSS/JavaScript, navegador não informado  
**Origem da evidência:** relato da execução manual da responsável pelo laboratório  
**Escopo:** protótipo independente. **Não é evidência de teste da API, do banco de dados ou do sistema oficial.**

## CT-AUT-001 — Login válido e exibição do perfil

- **Objetivo:** verificar se, após informar credenciais fictícias válidas, o laboratório exibe o painel e o perfil correspondente.
- **Procedimento relatado:** selecionar e entrar com os perfis demonstrativos disponíveis no laboratório.
- **Esperado:** exibir a interface de demonstração correspondente ao usuário escolhido, sem apresentar erro de autenticação.
- **Observado:** o login foi realizado sem erros; os perfis demonstrativos apareceram corretamente ao selecionar as diferentes contas.
- **Resultado:** **Aprovado no laboratório (execução manual relatada).**
- **Evidência:** relato textual de execução manual, recebido em 23/10/2026. Não foi fornecida captura de tela, log ou gravação.
- **Limitação:** este registro não comprova autenticação na API ASP.NET Core, autorização de endpoints nem sessão JWT.

## VAL-HU001-001 — Validação de campos obrigatórios (verificação complementar)

- **Objetivo:** confirmar a mensagem de erro ao enviar o formulário com campos obrigatórios vazios.
- **Procedimento relatado:** clicar em **Entrar** sem preencher os campos.
- **Esperado:** impedir o avanço e mostrar mensagem de orientação.
- **Observado:** a interface exibiu `Informe o e-mail e a senha para entrar.`
- **Resultado:** **Aprovado no laboratório (execução manual relatada).**
- **Rastreabilidade:** complemento de validação de entrada da HU-001; **não equivale** a executar integralmente o CT-AUT-002 (credenciais incorretas).

## Situação dos demais testes

| Teste | Situação no sistema oficial | Situação no laboratório |
| --- | --- | --- |
| CT-AUT-001 — Login válido | Não executado | Aprovado (relato manual) |
| CT-AUT-002 — Credenciais inválidas | Não executado | Não executado integralmente |
| CT-AUT-003 — Logout | Não executado | Não registrado nesta execução |
| CT-AUT-004 — Bloqueio por tentativas | Não executado | Não implementado |
| CT-AUT-005 — Conta inativa | Não executado | Não implementado |
| CT-AUT-006 — Acesso por perfil | Não executado | Apresentação de perfis observada; autorização não testada |
| CT-AUT-007 — Sessão inválida/expirada | Não executado | Não implementado |
| CT-AUT-008 — Mobile exclusivo Tutor | Não executado | Fora do escopo do laboratório atual |

## Análise de Engenharia de Software

### O que encontramos?

O laboratório demonstrou login válido por contas fictícias e validação de campos vazios, conforme execução relatada. O código está em `07-laboratorio-web/js/app.js` e `index.html`.

### Por que isso importa?

O resultado cria evidência inicial de conformidade do **protótipo** com comportamentos associados à HU-001, mas não prova conformidade do sistema oficial.

### O que recomendamos?

Manter os testes reais da API como não executados. Prosseguir com CT-AUT-002 no laboratório, testando e-mail inexistente e senha incorreta; registrar a saída observada. Capturas de tela podem fortalecer a evidência, mas não foram fornecidas nesta execução.

### Como explicar à equipe?
>
> “Executamos manualmente a HU-001 no VetCare Lab, nosso simulador independente. O login válido apresentou os perfis esperados, e o formulário avisou corretamente quando os campos estavam vazios. Registramos esses resultados como aprovados **somente no laboratório**; a autenticação real do VetCare continua aguardando testes.”

## Referências

- `05-testes/plano-testes-hu-001-autenticacao.md`
- `07-laboratorio-web/index.html`
- `07-laboratorio-web/js/app.js`
- Repositório de implementação: `Rozeti/ProjetoVetCare` (não executado neste registro)
