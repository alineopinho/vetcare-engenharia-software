# VetCare — Plano de Testes da HU-001: Autenticação de Usuários

**Projeto:** VetCare — Engenharia de Software  
**Tipo:** Plano de testes baseado em requisitos e inspeção estática do código (AS-IS)  
**Data:** 23/10/2026  
**Situação:** **PLANEJADO — testes não executados**  
**Referências:** Documento de Requisitos de Software (18/06/2026), HU-001; RN-005, RN-006; RNF-002; código original `Rozeti/ProjetoVetCare`.

> Este plano é um artefato independente de investigação. Não altera os três documentos acadêmicos nem afirma que o comportamento foi comprovado em execução.

## 1. Objetivo e escopo

Verificar se a autenticação atende aos critérios de aceite da **HU-001** e às regras relacionadas, considerando a API ASP.NET Core, o portal React e o aplicativo Expo/React Native. O foco é validar entradas, saídas, transições de sessão, restrições de acesso e mensagens ao usuário.

**Pré-condições para execução futura:** ambiente de testes isolado; API, web e mobile configurados; banco de dados de teste; usuários fictícios ativos/inativos com perfis Administrador, Veterinário, Tutor e, quando disponível, Apoio; relógio conhecido; possibilidade de limpar sessões e restaurar o estado inicial do banco. Não utilizar credenciais reais nem banco de produção.

**Evidências a coletar:** data/ambiente, identificador do teste, passos e dados fictícios, código HTTP, mensagem mostrada, comportamento de navegação, logs sem segredos, resultado obtido e captura de tela quando pertinente. **Nunca registrar senhas, tokens JWT completos ou dados pessoais reais.**

## 2. Matriz de rastreabilidade

| Caso | Origem | Comportamento esperado |
|---|---|---|
| CT-AUT-001 | HU-001, CA-1 | Usuário ativo com credenciais corretas entra no sistema e acessa interface compatível com seu perfil. |
| CT-AUT-002 | HU-001, CA-2 | Credenciais inválidas são recusadas, sem revelar se e-mail ou senha falhou. |
| CT-AUT-003 | HU-001, CA-3 | Logout encerra a sessão local e retorna ao login. |
| CT-AUT-004 | HU-001, CA-4; RN-006 | Após cinco falhas consecutivas, o acesso é temporariamente bloqueado; a implementação inspecionada usa 15 minutos. |
| CT-AUT-005 | RN-005; HU-002, CA-4 | Conta inativa não consegue iniciar uma sessão. |
| CT-AUT-006 | HU-001, CA-1; RN-005 | Perfis recebem acesso somente aos recursos autorizados. |
| CT-AUT-007 | RNF-002; nota técnica da HU-001 | Sessão expirada/inválida é rejeitada pela API; clientes tratam recusa ao revalidar. |
| CT-AUT-008 | Extensão observada no código mobile | Aplicativo móvel não permite login de perfil diferente de Tutor. |

**Nota:** CA-1 a CA-4 seguem os quatro critérios de aceite do DRS; CT-AUT-005 a 008 são extensões fundamentadas em regras e implementação. A descrição de *15 minutos* é observação do código, não exigência explícita do DRS.

## 3. Casos de teste detalhados

### CT-AUT-001 — Login válido
- **Pré-condição:** usuário fictício ativo, senha correta e acesso ao cliente de teste.
- **Passos:** abrir login; informar e-mail e senha válidos; clicar em Entrar.
- **Esperado:** API aceita a autenticação e devolve dados da sessão; o cliente direciona o usuário para a área adequada ao seu perfil.
- **Verificar também:** não há mensagem de erro; estado da sessão foi atualizado.
- **Status:** Não executado.

### CT-AUT-002 — Credenciais inválidas
- **Pré-condição:** ambiente de teste pronto, sem bloqueio pré-existente.
- **Passos:** tentar login com e-mail inexistente; repetir em outro usuário de teste com senha incorreta (evitar ultrapassar o limite do CT-AUT-004).
- **Esperado:** ambas as tentativas são negadas com mensagem genérica; não ocorre autenticação nem navegação para área restrita.
- **Status:** Não executado.

### CT-AUT-003 — Logout
- **Pré-condição:** usuário autenticado.
- **Passos:** acionar Sair; tentar retornar a uma área protegida; consultar `/api/usuarios/me` sem credencial de sessão.
- **Esperado:** dados locais de sessão removidos e retorno ao login; sem token a API não autoriza `/me`.
- **Atenção:** remover token do cliente **não equivale** a invalidar imediatamente um JWT já emitido no servidor; revogação de token exige validação separada, caso seja requisito.
- **Status:** Não executado.

### CT-AUT-004 — Bloqueio por tentativas
- **Pré-condição:** usuário fictício ativo e desbloqueado; contador de falhas zerado.
- **Passos:** informar senha incorreta cinco vezes; tentar novamente com a senha correta antes de decorrer o período de bloqueio; repetir após o prazo de bloqueio no ambiente de testes.
- **Esperado:** a conta é temporariamente bloqueada após a quinta falha; tentativa subsequente é recusada durante o bloqueio; depois do período a autenticação válida volta a ser possível.
- **Observação de implementação:** o código inspecionado define `MaximoTentativas = 5` e `DuracaoBloqueio = 15 minutos`.
- **Status:** Não executado.

### CT-AUT-005 — Conta inativa
- **Pré-condição:** usuário fictício marcado como inativo.
- **Passos:** fornecer credenciais corretas.
- **Esperado:** login recusado; nenhum token utilizável deve ser concedido; a implementação examinada prevê mensagem específica orientando procurar o administrador.
- **Status:** Não executado.

### CT-AUT-006 — Acesso por perfil
- **Pré-condição:** usuários de teste com perfis diferentes.
- **Passos:** autenticar cada perfil no portal; acessar recursos permitidos e tentar, por URL e por chamada à API, acessar recurso reservado a outro perfil.
- **Esperado:** interface encaminha cada perfil corretamente e o servidor nega ações não autorizadas (não basta esconder botões).
- **Status:** Não executado.

### CT-AUT-007 — Sessão expirada ou inválida
- **Pré-condição:** sessão de teste com token controlado ou ambiente onde seja possível simular expiração sem expor segredo.
- **Passos:** reabrir portal/aplicativo com sessão salva; forçar token expirado/inválido; chamar `/api/usuarios/me`.
- **Esperado:** API rejeita credencial inválida; cliente elimina a sessão quando reconhece recusa e permite novo login. Anotar diferenças entre web e mobile e comportamento na falta de rede.
- **Status:** Não executado.

### CT-AUT-008 — Aplicativo exclusivo do Tutor
- **Pré-condição:** contas fictícias de Tutor e Administrador/Veterinário.
- **Passos:** tentar login no mobile com conta administrativa válida; depois com conta Tutor válida.
- **Esperado:** a API pode autenticar ambos, mas o cliente mobile recusa usuário não Tutor **antes de guardar a sessão**; Tutor pode acessar a área do aplicativo.
- **Status:** Não executado.

## 4. Achados de inspeção — não são resultados de teste

- `UsuariosController.cs`: `POST /api/usuarios/login` permite acesso anônimo e invoca `AutenticarUsuarioUseCase.Executar`.
- `AutenticarUsuarioUseCase.cs`: consulta usuário por e-mail, verifica hash da senha, estado ativo, bloqueio e emite JWT via `TokenService`; registra auditoria.
- `UsuarioRepository.cs`: a busca por e-mail usa EF Core e `AppDbContext`.
- `VetCare.Web/src/contexts/AuthContext.tsx`: guarda sessão no `localStorage`, revalida com `GET /api/usuarios/me` e implementa logout local.
- `VetCare.Mobile/src/contextos/AuthContext.tsx`: guarda sessão no `AsyncStorage`, revalida com a API e recusa perfis diferentes de `Tutor`.
- `VetCare.Web/src/services/api.ts` e `VetCare.Mobile/src/services/api.ts`: acrescentam JWT às requisições e tratam recusa de sessão.

## 5. Quatro perguntas de engenharia

**O que encontramos?** O DRS define autenticação por perfil, mensagens genéricas para credenciais inválidas, logout e bloqueio temporário. O código contém mecanismos correspondentes; o mobile acrescenta a restrição ao Tutor.

**Por que isso importa?** A existência das classes não prova que a funcionalidade funciona em todas as condições. Os testes precisam relacionar requisitos, ações observáveis e evidências de execução.

**O que recomendamos?** Executar CT-AUT-001 a 008 em ambiente isolado, registrar eventuais defeitos com passos reproduzíveis e somente então discutir correções. Testar API e interface separadamente quando possível para localizar a origem de falhas.

**Como explicar à equipe?**

> “Transformamos a HU-001 em oito casos verificáveis. Quatro correspondem aos critérios de aceite do documento; outros cobrem regras e comportamentos vistos no código. Por enquanto identificamos implementações, não confirmamos aprovação. Quando executarmos os testes, teremos evidências para corrigir problemas sem alterar funcionalidades no escuro.”

## 6. Registro de execução (preencher depois)

| Caso | Data | Ambiente | Resultado observado | Situação (Passou/Falhou/Bloqueado) | Evidência / issue |
|---|---|---|---|---|---|
| CT-AUT-001 | — | — | — | Não executado | — |
| CT-AUT-002 | — | — | — | Não executado | — |
| CT-AUT-003 | — | — | — | Não executado | — |
| CT-AUT-004 | — | — | — | Não executado | — |
| CT-AUT-005 | — | — | — | Não executado | — |
| CT-AUT-006 | — | — | — | Não executado | — |
| CT-AUT-007 | — | — | — | Não executado | — |
| CT-AUT-008 | — | — | — | Não executado | — |

## 7. Próximo passo

Especificar a demonstração de login do **VetCare Lab** (HTML/CSS/JavaScript) com validações, estados de erro e navegação usando **dados fictícios**. Essa demonstração **não terá autenticação real** até que uma API experimental seja conectada e testada.
