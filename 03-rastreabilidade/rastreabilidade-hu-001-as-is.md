# VetCare — HU-001 | Matriz de rastreabilidade preliminar (AS-IS)

**Data da análise:** 23/10/2026  
**Estado:** comparação documental e inspeção estática; não representa homologação do sistema oficial.  
**Escopo:** documento original de requisitos (18/06/2026), implementação `Rozeti/ProjetoVetCare` e resultados do laboratório independente.

## 1. O que encontramos?

A HU-001 — **Autenticar usuário** — do DRS original descreve uma tela de login única para Administrador, Veterinário ou Tutor e estabelece **quatro critérios de aceite**. A RN-005 exige controle de acesso por perfil; a RN-006 exige bloqueio temporário após cinco tentativas malsucedidas. O código atual introduz também o perfil Apoio e separa o portal da aplicação móvel (exclusiva para Tutor). Os testes executados no VetCare Lab não constituem testes do código original.

### 1.1 Rastreabilidade dos quatro critérios originais

| Origem no DRS | Exigência original, resumida | Implementação identificada (inspeção) | Evidência do VetCare Lab | Situação |
| --- | --- | --- | --- | --- |
| **HU-001, CA-1** | Login válido dá acesso ao painel compatível com o perfil | `AutenticarUsuarioUseCase.Executar`; `VetCare.Web/src/App.tsx` redireciona Tutor para `/meus-pets` e equipe para `/`; no mobile só Tutor prossegue | CT-AUT-001 aprovado; listas de perfis verificadas no CT-AUT-006 | **Correspondência aparente no código; funcionamento real não testado.** Controle de acesso da API pendente |
| **HU-001, CA-2** | Credenciais inválidas são recusadas sem revelar qual campo errou | `AutenticarUsuarioUseCase` responde `E-mail ou senha inválidos.` para e-mail inexistente ou senha incorreta; clientes exibem erro | CT-AUT-002 aprovado com dados fictícios | **Correspondência aparente; sistema real não testado** |
| **HU-001, CA-3** | Logout encerra sessão e retorna à tela inicial de login | Web: `Layout.tsx` chama `sair()` e navega `/login`; mobile: `Perfil.tsx` pede confirmação e `AuthContext.tsx` remove dados locais, fazendo o navegador alternar para Login | CT-AUT-003 aprovado no simulador; sem screenshot anexada | **Correspondência aparente; sistema real não testado.** Logout local não equivale à revogação de JWT já emitido |
| **HU-001, CA-4** | Após cinco falhas consecutivas, bloquear temporariamente na sexta tentativa | `AutenticarUsuarioUseCase`: limite 5, bloqueio 15 minutos; o código marca bloqueio na quinta falha e rejeita a tentativa seguinte durante o prazo | Não implementado no Lab | **Correspondência aparente; teste real pendente** |

**Nota sobre CA-4:** o DRS não determina a duração de bloqueio; *15 minutos* é uma escolha observada no código. O fluxo no caso de uso devolve mensagem genérica na quinta falha e apresenta o bloqueio na tentativa seguinte.

### 1.2 Regras e extensões que precisam de decisão nos novos documentos

| Referência | Achado | Encaminhamento recomendado |
| --- | --- | --- |
| **RN-005** | DRS lista Administrador, Veterinário e Tutor; implementação também utiliza **Apoio**, com restrições de menu/rotas | Decidir se Apoio integra formalmente a nova especificação; conferir autorização nos endpoints antes de declarar atendimento integral |
| **RN-006** | Contagem e bloqueio de 15 minutos no caso de uso | Documentar como comportamento AS-IS e decidir se o prazo constará como requisito verificável da versão proposta |
| **HU-001 — nota técnica** | DRS recomenda hash de senha e expiração automática; implementação usa `PasswordHasher` e JWT | Formalizar critérios testáveis caso façam parte da futura versão; testes de expiração reais pendentes |
| **Conta inativa** | `AutenticarUsuarioUseCase` recusa login de conta inativa com mensagem específica | Manter como comportamento observado; avaliar inclusão como critério explícito na nova HU-001 |
| **Mobile exclusivo Tutor** | `VetCare.Mobile/src/contextos/AuthContext.tsx` rejeita perfis diferentes de Tutor antes de salvar a sessão | Explicitar separação dos clientes e públicos no novo DRS, mediante validação da equipe |
| **Recuperação / primeiro acesso** | Portal oferece `/recuperar-senha` e `/primeiro-acesso`; mobile oferece recuperação por código; API tem `RecuperarSenhaUseCase` | Mapear como fluxo relacionado; **não afirmar que integra os quatro critérios originais da HU-001** sem decisão de escopo |
| **Persistência e perda de sessão** | Web usa `localStorage`, mobile usa `AsyncStorage`; revalidação usa `/api/usuarios/me` | Testar cenários de expiração, 401, 403 e indisponibilidade de rede antes de homologar |

### 1.3 Estado dos casos de teste

| Caso | VetCare Lab | Implementação original |
| --- | --- | --- |
| CT-AUT-001 — Login válido | Aprovado (relato manual e imagens) | Não executado |
| CT-AUT-002 — Credenciais inválidas | Aprovado (relato manual e imagens) | Não executado |
| CT-AUT-003 — Logout | Aprovado (relato manual; imagem pendente) | Não executado |
| CT-AUT-004 — Bloqueio | Não implementado | Não executado |
| CT-AUT-005 — Conta inativa | Não implementado | Não executado |
| CT-AUT-006 — Acesso por perfil | Apresentação dos quatro perfis aprovada; **autorização não testada** | Não executado |
| CT-AUT-007 — Sessão inválida/expirada | Não implementado | Não executado |
| CT-AUT-008 — Mobile exclusivo Tutor | Fora do escopo do Lab | Não executado |

## 2. Por que isso importa?

A documentação original é a **linha de base dos requisitos**, mas não deve ser atualizada automaticamente para concordar com o código. A implementação contém decisões adicionais que podem ser úteis ou exigir correção; somente evidência e deliberação da equipe permitem escolher. O laboratório serve para experimentar o comportamento e registrar testes de interface, sem provar segurança, persistência ou autorização da aplicação real.

## 3. O que recomendamos?

1. Preservar os PDFs originais como histórico; produzir uma **versão proposta** de requisitos separada.
2. Classificar cada diferença como **lacuna documental, possível divergência de implementação ou decisão de produto pendente**, sem denominá-la bug antes da validação.
3. Solicitar decisão da equipe sobre o perfil Apoio, a segmentação web/mobile, o bloqueio em 15 minutos e o lugar da recuperação/primeiro acesso no DRS revisado.
4. Quando houver ambiente isolado de teste, executar os casos da HU-001 na implementação original e registrar falhas com evidências reproduzíveis.
5. Iniciar a redação da nova HU-001 somente com itens já sustentados e deixar decisões não aprovadas identificadas como **propostas**, não como fatos consolidados.

## 4. Como explicar à equipe?

> “Comparamos os quatro critérios de aceite da HU-001 do DRS de junho de 2026 com o código atual. Encontramos implementações correspondentes para login, erro genérico, logout e bloqueio, mas ainda não as executamos no sistema original. Identificamos também funcionalidades e regras adicionais, como o perfil Apoio, a restrição do aplicativo ao Tutor e a recuperação de senha. Antes de atualizar os três documentos propostos, precisamos decidir o que será mantido e o que será corrigido. O VetCare Lab permite validar fluxos simulados, mas não substitui os testes reais.”

## 5. Fontes e rastreabilidade

- `01-documentacao/2_DocumentoRequisitosSoftware_VetCare.pdf` — seção **3. Especificação dos requisitos funcionais**, HU-001 (CA-1 a CA-4); seção **4. Lista de regras de negócio**, RN-005 e RN-006.
- `Rozeti/ProjetoVetCare/VetCare.API/UseCases/AutenticarUsuarioUseCase.cs`
- `Rozeti/ProjetoVetCare/VetCare.Web/src/App.tsx`
- `Rozeti/ProjetoVetCare/VetCare.Web/src/pages/Login.tsx`
- `Rozeti/ProjetoVetCare/VetCare.Web/src/components/Layout.tsx`
- `Rozeti/ProjetoVetCare/VetCare.Web/src/pages/RecuperarSenha.tsx`
- `Rozeti/ProjetoVetCare/VetCare.Mobile/src/Navegacao.tsx`
- `Rozeti/ProjetoVetCare/VetCare.Mobile/src/telas/Perfil.tsx`
- `Rozeti/ProjetoVetCare/VetCare.Mobile/src/contextos/AuthContext.tsx`
- `Rozeti/ProjetoVetCare/VetCare.API/UseCases/RecuperarSenhaUseCase.cs`
- `05-testes/plano-testes-hu-001-autenticacao.md`
- `05-testes/execucoes/registro-execucao-hu-001-lab.md`

**Próxima etapa:** usar esta matriz como base para uma proposta de requisitos revisados da HU-001, sem alterar a linha de base original nem antecipar a decisão de implementação do grupo.
