# Diretrizes arquiteturais — proposta para o Lab V2

**Estado:** proposta técnica, não equivale à arquitetura original aprovada.

O Documento de Arquitetura v4.0 registra Java 21, Spring Boot 3.x, React/TypeScript e PostgreSQL. O Lab V2 poderá adotar **ASP.NET Core em C# e PostgreSQL** por decisão própria; isso será uma **divergência consciente** da arquitetura acadêmica, não uma atualização retroativa do PDF.

## Separação pretendida
- **Interface:** web acessível e responsiva; na fase 1, protótipo estático sem dados persistidos.
- **API futura:** controllers/endpoints HTTP, casos de uso e serviços com regras de autorização no servidor.
- **Persistência futura:** EF Core/PostgreSQL; migrações versionadas; conexões e senhas fora do código versionado.
- **Qualidade futura:** testes unitários, de integração e de autorização, inclusive usuários de clínicas/tutores diferentes.

## Critérios não negociáveis
1. Ocultar botão no navegador não implementa autorização.
2. Alterações e exclusões de registros clínicos exigem regras de integridade auditáveis (RN-004).
3. Acesso de Tutor ao prontuário precisa excluir observações internas em **respostas da API** (RN-003).
4. Nunca usar contas, e-mails ou dados reais no laboratório compartilhável.
5. Não considerar as capacidades do Lab prova de conformidade do projeto do Mateus.

## Próxima decisão arquitetural
Definir se o front-end definitivo será MVC/Razor ou React/TypeScript sobre API ASP.NET Core. O arquivo não assume uma decisão que ainda não foi formalizada.
