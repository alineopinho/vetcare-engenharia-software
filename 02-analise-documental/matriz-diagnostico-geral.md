# VetCare — Matriz de Diagnóstico Geral

**Status:** versão inicial de trabalho; **não homologada**  
**Data:** 26/10/2026  
**Objetivo:** criar uma base única para confrontar os documentos originais com evidências de implementação, antes de redigir os três documentos revisados e os novos diagramas.

> **Atenção:** esta é uma **triagem estática**, não uma auditoria funcional completa. A existência de arquivos, métodos ou regras de validação **não comprova que todos os critérios de aceite funcionam**. Os casos classificados como «correspondência estrutural» ainda exigem verificação ponto a ponto.

## 1. Fontes e limites

**Linha de base documental (preservada):**
- `01-documentacao/1_DocumentoVisao_VetCare.pdf` — Documento de Visão, 10/06/2026, 6 páginas.
- `01-documentacao/2_DocumentoRequisitosSoftware_VetCare.pdf` — DRS, 18/06/2026, 21 páginas.
- `01-documentacao/3_DocumentoArquiteturaSoftware_VetCare.pdf` — Arquitetura v4.0, 28/06/2026, 18 páginas.

**Implementação de referência:** [Rozeti/ProjetoVetCare](https://github.com/Rozeti/ProjetoVetCare), principalmente `VetCare.API`, `VetCare.Web`, `VetCare.Mobile`. Arquivos e diretórios consultados no GitHub em 26/10/2026; **não foi fixado hash de commit nem executada a aplicação**. Antes de homologar, registrar SHA e repetir a inspeção na revisão congelada.

**Base de requisitos:** 16 HUs (DRS pp. 3, 5–15), 11 RNs (pp. 16–17), 8 RNFs (pp. 18–19); rastreabilidade original p. 20. A HU-017 **não faz parte desta matriz-base**: sua eventual existência/histórico deve ser investigado à parte, conforme orientação atual, sem supor que sua exclusão já foi homologada.

**Legenda dos diagnósticos:** 
- **Correspondência estrutural:** evidência de artefato ou regra no código; critérios completos ainda não testados.
- **Parcial:** lacuna, cobertura incompleta ou mudança a esclarecer.
- **Pendente de análise detalhada:** componentes localizados, mas métodos e critérios ainda não auditados.
- **Não verificado por teste:** exige execução/medição para qualquer conclusão.
- **Extraescopo:** item adicional, ainda não incorporado à linha de base.

Os caminhos abreviados nas tabelas são relativos a `VetCare.API/`, exceto quando outra raiz for indicada.

## 2. Diagnóstico das histórias de usuário (HU)

| ID | Exigência original resumida | Evidência localizada no código | Diagnóstico preliminar | Próximo exame / recomendação |
|---|---|---|---|---|
| HU-001 | Autenticar usuário | UsuariosController.cs; AutenticarUsuarioUseCase.cs | Correspondência estrutural | Login, JWT e bloqueio identificados; validar navegação, logout e respostas HTTP. |
| HU-002 | Gerenciar usuários | UsuariosController.cs; GerenciarUsuariosUseCase.cs; RecuperarSenhaUseCase.cs | Correspondência estrutural | Verificar cada CA: cadastro, unicidade, edição, desativação e redefinição. |
| HU-003 | Gerenciar pacientes | PetsController.cs; GerenciarPacientesUseCase.cs | Parcial / mudança de escopo | Cadastro e alteração identificados; código inclui cadastro pelo Tutor, ausente na HU original; testar integridade da exclusão. |
| HU-004 | Agenda individual do veterinário | SessoesController.cs; AgendarSessaoUseCase.cs; ConsultarAgendaUseCase.cs | Correspondência estrutural | Há checagem de conflito e agendamento retroativo; verificar visões dia/semana/mês e expediente. |
| HU-005 | Consultar agenda geral | SessoesController.cs; ConsultarAgendaUseCase.cs | Pendente de análise detalhada | Verificar filtro por veterinário, acesso do Apoio e distinção visual no cliente. |
| HU-006 | Confirmar/cancelar presença | SessoesController.cs; AtualizarStatusSessaoUseCase.cs | Correspondência estrutural | Antecedência parametrizável encontrada; verificar notificações e liberação do horário. |
| HU-007 | Registrar avaliação clínica | AvaliacoesController.cs; RegistrarAvaliacaoUseCase.cs | Correspondência estrutural | Campos obrigatórios e arquivamento de versão anterior encontrados; testes e atomicidade pendentes. |
| HU-008 | Registrar atendimento | AtendimentosController.cs; RegistrarAtendimentoUseCase.cs | Correspondência estrutural | Registro, validações e versionamento identificados; verificar vínculo à sessão e critérios completos. |
| HU-009 | Observações internas | ObservacoesInternasController.cs; RegistrarObservacaoInternaUseCase.cs | Correspondência estrutural | Verificar autorização efetiva e não exposição ao Tutor em todos os endpoints. |
| HU-010 | Anexar mídias | MidiasController.cs; AnexarMidiaUseCase.cs | Correspondência estrutural | Extensões .jpg/.jpeg/.png/.webp/.mp4/.mov e limite de 25 MB no código; validar armazenamento e acesso. |
| HU-011 | Consultar prontuário | ProntuariosController.cs; ConsultarProntuarioUseCase.cs | Correspondência estrutural | Linha do tempo e filtragem de notas internas identificadas; validar histórico e mídia em execução. |
| HU-012 | Documentos clínicos | DocumentosController.cs; GerenciarDocumentosUseCase.cs | Pendente de análise detalhada | Conferir tipos, limites, visualização/download e autorização. |
| HU-013 | Acompanhar tratamento | PetsController.cs; ProntuariosController.cs; SessoesController.cs | Parcial / escopo a decidir | Consulta dos próprios pets identificada; novo cadastro pelo Tutor exige decisão documental. |
| HU-014 | Trocar mensagens | MensagensController.cs; MensagensUseCase.cs | Pendente de análise detalhada | Verificar vínculo Tutor–Veterinário, leitura, presença e tempo real. |
| HU-015 | Receber notificações | NotificacoesController.cs; NotificacoesUseCase.cs; serviços hospedados | Pendente de análise detalhada | Confrontar os quatro gatilhos, entrega e destinatários. |
| HU-016 | Indicadores do dia | DashboardController.cs; ConsultarIndicadoresUseCase.cs | Correspondência estrutural | Verificar campos do painel, isolamento por perfil e dia sem dados. |

## 3. Diagnóstico das regras de negócio (RN)

| ID | Exigência original resumida | Evidência localizada no código | Diagnóstico preliminar | Próximo exame / recomendação |
|---|---|---|---|---|
| RN-001 | Um Tutor por paciente; transferir mantendo histórico | Models/Pet.cs; Data/AppDbContext.cs; TransferirPacienteUseCase.cs | Correspondência estrutural | Testar histórico preservado após troca. |
| RN-002 | Impedir sobreposição de horários do veterinário | AgendarSessaoUseCase.cs; repositório de sessões | Correspondência estrutural | A checagem existe; testar concorrência e intervalo de sessões. |
| RN-003 | Observações internas apenas Admin/Veterinário | ConsultarProntuarioUseCase.cs; Security/UsuarioAtual.cs | Correspondência estrutural | Verificar todos os caminhos de consulta e exportação. |
| RN-004 | Não excluir registros confirmados; versionar alterações | Models/VersaoRegistroClinico.cs; RegistrarAvaliacaoUseCase.cs; RegistrarAtendimentoUseCase.cs | Parcial | Versões anteriores arquivadas; atomicidade e abrangência dos registros pendentes. |
| RN-005 | Acesso restrito por perfil | Program.cs; Security/AcessoAoPaciente.cs; controllers | Parcial | Apoio aparece na arquitetura/código, mas não é enumerado nesta RN; matriz de permissões pendente. |
| RN-006 | Bloquear após 5 falhas consecutivas | AutenticarUsuarioUseCase.cs | Correspondência estrutural | Constantes 5 tentativas e 15 minutos; testar fluxo real. |
| RN-007 | Unicidade de e-mail/login | GerenciarUsuariosUseCase.cs; Data/AppDbContext.cs | Pendente de validação | Conferir regra e índice único no banco, inclusive concorrência. |
| RN-008 | Indicadores por perfil | ConsultarIndicadoresUseCase.cs | Pendente de análise detalhada | Verificar limites do Veterinário e visão agregada do Admin. |
| RN-009 | Cancelamento com antecedência definida pela clínica | AtualizarStatusSessaoUseCase.cs; AgendarSessaoUseCase.cs | Correspondência estrutural | Prazo implementado como parâmetro; DRS não fixa número de horas. |
| RN-010 | Campos obrigatórios da avaliação | RegistrarAvaliacaoUseCase.cs | Correspondência estrutural | Comparar nomes/campos com CA de HU-007 e validar payloads. |
| RN-011 | Restringir tamanho e formato de mídia/documento | AnexarMidiaUseCase.cs; GerenciarDocumentosUseCase.cs | Parcial | Mídias: 25 MB e seis extensões identificadas; conferir documentos e segurança do upload. |

## 4. Diagnóstico dos requisitos não funcionais (RNF)

| ID | Exigência original resumida | Evidência localizada no código | Diagnóstico preliminar | Próximo exame / recomendação |
|---|---|---|---|---|
| RNF-001 | Usabilidade: 85% sem auxílio em até 3 minutos | Interfaces web/mobile | Não verificado por teste | Exige protocolo e usuários representativos. |
| RNF-002 | Nenhum acesso não autorizado | Program.cs; controllers; Security/ | Pendente de teste | Exige testes negativos por perfil, clínica e paciente. |
| RNF-003 | Nenhuma nota interna visível ao Tutor | ConsultarProntuarioUseCase.cs; API/DTOs | Pendente de teste | Exige cobertura de todos os endpoints e exportações. |
| RNF-004 | 95% consultas agenda/prontuário inferiores a 2 s | ConsultarAgendaUseCase.cs; ConsultarProntuarioUseCase.cs | Não verificado por teste | Executar carga representativa e definir conjunto de dados. |
| RNF-005 | 99,5% disponibilidade mensal; perda zero | Program.cs health checks; persistência | Não verificado operacionalmente | Health check não comprova SLA, backup ou RPO zero. |
| RNF-006 | Web responsiva em navegadores suportados | VetCare.Web/; VetCare.Mobile/ | Pendente de validação | Definir browsers e matriz de resoluções; app nativo é adicional. |
| RNF-007 | Crescimento sem degradação relevante | Data/AppDbContext.cs; arquitetura | Não verificado por teste | Testar escala/carga crescente e validar projeções. |
| RNF-008 | Consistência visual do design system | VetCare.Web/ | Pendente de inspeção visual | Confrontar telas reais com tokens e guia de interface. |

## 5. Divergências documentais e arquiteturais transversais

| ID | Constatação | Referências | Consequência / ação |
|---|---|---|---|
| DX-01 | Arquitetura original prevê Java 21, Spring Boot/Spring Security e JPA; código utiliza ASP.NET Core/.NET 10, C#, JWT e EF Core/Npgsql | Arquitetura pp. 7, 11–16; `VetCare.API.csproj`, `Program.cs`, `AppDbContext.cs` | Registrar decisão tecnológica; revisar diagramas de componentes, sequência e implantação no documento **proposto**, sem alterar o PDF. |
| DX-02 | Visão e RN-005 enfatizam três perfis; Arquitetura inclui Apoio Administrativo e há entidade correspondente no código | Visão pp. 3–4; DRS p. 16; Arquitetura pp. 5–6; `Models/ApoioAdministrativo.cs` | Definir e aprovar matriz de operações por perfil. |
| DX-03 | HU-003 descreve cadastro pelo Administrador; código também oferece cadastro pelo Tutor | DRS pp. 6–7, 13; `PetsController.cs` | Manter histórico da demanda; decidir explicitamente ampliação e critérios para cadastro/edição próprios. |
| DX-04 | Visão/DRS especificam aplicação web responsiva; implementação possui aplicativo Expo/React Native | Visão p. 6; DRS p. 19; `VetCare.Mobile/package.json` | Decidir se aplicativo nativo pertence ao escopo revisado ou extensão futura. |
| DX-05 | Metas de carga e volume (até 3.000 simultâneos, 150 req/s, 500 GB inicial) são estimadas, sem teste verificado nesta análise | Arquitetura p. 18 | Rever premissas e plano de desempenho antes de reafirmar números no documento revisado. |
| DX-06 | RN-004 exige integridade do histórico; versionamento de avaliação/atendimento identificado, mas consistência transacional não verificada | DRS p. 16; `Models/VersaoRegistroClinico.cs` e respectivos UseCases | Investigar transações, exclusões e histórico de alergias/condições clínicas. |
| DX-07 | O DRS não define valores numéricos para antecedência de cancelamento e formatos/tamanho de upload; código apresenta decisões concretas em alguns casos | DRS p. 17; `AtualizarStatusSessaoUseCase.cs`, `AnexarMidiaUseCase.cs` | Registrar configuração atual como decisão de implementação, sujeita à aprovação. |

### Funcionalidades extraescopo: triagem, não incorporação automática

Além das HUs originais, o código tem componentes de vacinas, prescrições, alergias, tratamentos, administração de clínica, dispositivos e relatórios. **Nem toda classe extra constitui nova HU:** pode apoiar uma HU existente ou refletir evolução ainda não documentada. Para cada item, localizar origem e decisão da equipe antes de classificar como escopo ampliado.

**HU-017:** há relato de exclusão do escopo por impacto no banco de dados. Seu conteúdo anterior, eventual implementação e decisão de retirada **ainda não foram verificados documentalmente**. Não inserir HU-017 no DRS revisado sem nova aprovação.

## 6. Prioridades para a revisão (ordem proposta)

1. **Fechar decisões de produto:** perfis incluindo Apoio; cadastro/edição pelo Tutor; HU-017; web versus aplicativo móvel.
2. **Detalhar lacunas técnicas críticas:** RN-004 (integridade/versões), RN-005/RNF-002/RNF-003 (autorização), RN-001 (vínculos e histórico).
3. **Validar regras configuráveis:** RN-009 e RN-011, evitando fixar parâmetros de implementação como regra não aprovada.
4. **Inspecionar os critérios de aceitação das 16 HUs** e manter checklist por CA, apontando arquivos, rotas e testes faltantes.
5. **Consolidar documentação revisada**: Visão → Requisitos → Arquitetura, todas marcadas como *proposta*.
6. **Desenhar modelos** com base nos novos documentos: casos de uso e classes do domínio; sequência para fluxos críticos; MER/modelo lógico derivado das entidades e restrições documentadas.
7. **Rastrear requisitos → decisões → modelos → código → evidências**, distinguindo implementação de execução.

## 7. Próximos artefatos, seguindo o README

- **Agora:** este arquivo em `02-analise-documental/matriz-diagnostico-geral.md`.
- **Na mesma pasta, depois:** registro de pendências/decisões que dependem do grupo.
- **Documentação revisada:** três documentos completos propostos, em diretório próprio **sem conflito com `03-rastreabilidade`**, até a migração de pastas aprovada.
- **Modelagem revisada:** diagramas UML e modelo de dados derivados dos novos documentos.
- **Rastreabilidade:** atualização dos relatórios existentes e inclusão das evidências encontradas.
- **Portal GitHub Pages:** publicação organizada, somente após definição da navegação dos artefatos.

**Fora do escopo atual:** iniciar Lab, Demo, fork ou alterar a aplicação do Mateus.

## 8. Registro das evidências inspecionadas nesta rodada

Diretórios `VetCare.API/{Controllers,UseCases,Models}`; arquivos `AutenticarUsuarioUseCase.cs`, `AgendarSessaoUseCase.cs`, `AtualizarStatusSessaoUseCase.cs`, `AnexarMidiaUseCase.cs`, além das evidências anteriormente consultadas de `RegistrarAvaliacaoUseCase.cs`, `RegistrarAtendimentoUseCase.cs`, `ConsultarProntuarioUseCase.cs`, `Program.cs`, `AppDbContext.cs`, `VetCare.API.csproj`, `VetCare.Web/package.json`, `VetCare.Mobile/package.json`.

Esta matriz **não contém resultados de testes executados**.
