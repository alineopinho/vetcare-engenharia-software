# VetCare — RN-005 | Controle de acesso por perfil (AS-IS)

**Análise:** 23/10/2026  
**Escopo:** comparação da documentação original com inspeção estática da implementação `Rozeti/ProjetoVetCare`.  
**Status:** investigação parcial; **não equivale a testes executados nem homologação**.  
**Vínculos:** HU-001 (autenticação), HU-002 (usuários), HU-003 (pacientes), HU-011 (prontuário), HU-013 (área do Tutor), HU-014 (mensagens), RN-003 (observações internas).

## 1. Base documental

- **Documento de Requisitos (18/06/2026), RN-005:** cada usuário acessa funcionalidades e dados compatíveis com seu perfil; enumera **Administrador, Veterinário e Tutor**. Impactos indicados: HU-001 e HU-014.
- **Documento de Requisitos, HU-001:** login conforme o perfil, sem citar Apoio Administrativo entre os atores da descrição.
- **Documento de Arquitetura, seção 1.2 e apresentação lógica:** inclui **Administrador, Veterinário, Tutor e Apoio Administrativo**.
- **Documento de Visão:** destaca os três perfis principais e também menciona equipe de apoio entre as partes interessadas, conforme análise documental existente em `02-analise-documental/analise-arquitetura.md`.

**Achado documental RN005-DOC-01:** os documentos não enumeram os perfis de maneira uniforme. **Não é correto** concluir que o quarto perfil surgiu sem previsão acadêmica: ele aparece na Arquitetura. Manter a divergência registrada, sem alterar documentos de referência nesta etapa.

## 2. Evidências da implementação (inspeção de código)

### 2.1 Web — navegação e menu

- `VetCare.Web/src/App.tsx`: componente `Protegida` verifica autenticação e perfil para rotas específicas; usuários sem permissão são redirecionados.
- `VetCare.Web/src/components/Layout.tsx`: menu apresenta opções segundo a lista de perfis admitidos. O item **Usuários** aparece para Administrador e Apoio, mas isso não implica autorização de escrita.

**Interpretação:** controles de interface e navegação ajudam na experiência, mas **não substituem** autorização de servidor.

### 2.2 API — gerenciamento de usuários

**Fonte:** `VetCare.API/Controllers/UsuariosController.cs`.

| Ação / endpoint | Perfis declarados |
| --- | --- |
| `GET /api/usuarios` e `GET /api/usuarios/{id}` | Administrador, Apoio |
| `POST /api/usuarios` | Administrador |
| `PUT /api/usuarios/{id}` | Administrador |
| `PATCH /api/usuarios/{id}/status` | Administrador |
| `POST /api/usuarios/{id}/redefinir-senha` | Administrador |
| `GET /api/usuarios/me`, `PUT /api/usuarios/me/senha`, `PUT /api/usuarios/me/preferencias-de-notificacao` | Usuário autenticado |
| `POST /api/usuarios/login`, `POST /api/usuarios/recuperar-senha`, `POST /api/usuarios/redefinir-senha` | Acesso anônimo previsto |

- `VetCare.API/UseCases/GerenciarUsuariosUseCase.cs`: consultas e alterações por ID verificam vínculo com a clínica atual. A desativação aciona invalidação de conta ativa.
- `VetCare.API/Program.cs`: autenticação JWT e revalidação do estado ativo no servidor; a eficácia operacional ainda depende de testes.

**Achado RN005-COD-01:** para gerenciamento de usuários, a distinção *Apoio consulta / Administrador modifica* aparece explicitamente nos atributos `[Authorize(Roles = ...)]`.

### 2.3 API — pacientes e prontuários

**Fontes:** `VetCare.API/Controllers/PetsController.cs`, `VetCare.API/UseCases/GerenciarPacientesUseCase.cs`, `VetCare.API/Security/AcessoAoPaciente.cs`, `VetCare.API/Controllers/ProntuariosController.cs`, `VetCare.API/UseCases/ConsultarProntuarioUseCase.cs`, `VetCare.API/Security/UsuarioAtual.cs`.

| Perfil | Recorte de consulta a pacientes identificado no código |
| --- | --- |
| Administrador | Pacientes da clínica |
| Apoio | Pacientes da clínica |
| Veterinário | Pacientes atribuídos ao profissional |
| Tutor | Animais vinculados ao próprio tutor |

- `GerenciarPacientesUseCase.Listar` aplica filtros associados ao usuário autenticado; os filtros da URL não devem ampliar o recorte do Tutor ou do Veterinário.
- `AcessoAoPaciente.Permitido` verifica vínculo com Tutor ou Veterinário responsável; Administrador e Apoio podem consultar pacientes de sua clínica.
- `ConsultarProntuarioUseCase.Executar` confere o vínculo do pet com a clínica **e**, depois, a autorização do usuário antes de montar o prontuário.
- Para **observações internas**, `UsuarioAtual.PodeVerObservacoesInternas` retorna verdadeiro apenas para Administrador ou Veterinário; o caso de uso não consulta essas observações para os demais perfis. **Relação direta com RN-003.**

**Achado RN005-COD-02:** há controle de acesso **por registro**, não apenas por rota ou perfil. A presença desses mecanismos não comprova ausência de outros caminhos de acesso.

### 2.4 Extensão encontrada para HU-003

`PetsController.cs` declara `POST /api/pets/meus` exclusivamente para Tutor; `GerenciarPacientesUseCase.CadastrarComoTutor` associa o novo animal ao Tutor do token. A HU-003 original enfatiza o cadastro pelo Administrador. **Registrar como diferença de escopo a investigar**, não como defeito nem como requisito já aprovado.

## 3. Classificação preliminar

| ID | Ponto | Classificação | Falta verificar |
| --- | --- | --- | --- |
| RN005-DOC-01 | Três perfis na HU-001/RN-005; quatro na Arquitetura | **Divergência documental** | Definição consolidada de atores nos artefatos originais |
| RN005-COD-01 | Apoio consulta usuários; administração executa alterações | **Correspondência identificada na implementação** | Requisições reais autorizadas/negadas por papel |
| RN005-COD-02 | Recorte de pacientes por clínica, tutor e veterinário | **Mecanismo identificado** | Casos positivos e negativos com IDs de outra conta/clínica |
| RN003-COD-01 | Observações internas apenas para Admin/Veterinário | **Correspondência identificada com RN-003** | Conferir respostas efetivas e outros endpoints de observações |
| HU003-EXT-01 | Tutor pode cadastrar pet próprio | **Extensão identificada** | Confrontar toda HU-003 e regras RN-001/RN-005 |

## 4. Limites e verificações futuras

1. **Não houve execução da API, banco de dados ou aplicativo oficial.** Os testes do VetCare Lab simulam interface e não validam autorização na API.
2. Para RN-005, testar tanto acesso permitido quanto negado, por **perfil**, **operação** e **propriedade do registro** (pet de outro tutor, paciente de outro veterinário, clínica distinta).
3. Revisar especificamente os outros endpoints clínicos, arquivos assinados, mídia, documentos e observações internas antes de considerar a RN-005 completamente investigada.
4. Verificar se o acesso amplo do Apoio à consulta clínica corresponde ao escopo previsto nos documentos e às responsabilidades operacionais.
5. Nenhuma diferença registrada aqui autoriza automaticamente alterar o sistema ou reescrever os três documentos originais.

## 5. Conclusão e continuidade

A implementação contém controles de acesso em **interface**, **rotas**, **endpoints** e **casos de uso**, com recortes por usuário e clínica em operações inspecionadas. Há **divergência documental na enumeração dos perfis**, mas o Apoio é mencionado no Documento de Arquitetura original. A conformidade integral da RN-005 permanece **pendente de cobertura dos demais endpoints e de testes reais**.

**Próxima investigação:** HU-003 — gerenciamento de pacientes — em conjunto com RN-001 (associação Tutor–Paciente); investigar o cadastro pelo Tutor como extensão. Os três novos documentos (Visão, Requisitos, Arquitetura) permanecem fora do escopo atual.

## 6. Referências

**Originais preservados:** `01-documentacao/1_DocumentoVisao_VetCare.pdf`, `01-documentacao/2_DocumentoRequisitosSoftware_VetCare.pdf`, `01-documentacao/3_DocumentoArquiteturaSoftware_VetCare.pdf`.

**Código-base de referência:** `https://github.com/Rozeti/ProjetoVetCare` — arquivos citados por caminho nas seções anteriores.

**Artefatos correlatos:** `03-rastreabilidade/rastreabilidade-hu-001-as-is.md`; `02-analise-documental/analise-arquitetura.md`; `05-testes/plano-testes-hu-001-autenticacao.md`.
