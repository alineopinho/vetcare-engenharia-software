# Escopo do VetCare Lab V2

**Tipo:** especificação inicial para implementação independente. **Não aprovada pela equipe.**

## Referências de origem
- `01-documentacao/1_DocumentoVisao_VetCare.pdf` — objetivo e necessidades da VetSPA, pp. 1–6.
- `01-documentacao/2_DocumentoRequisitosSoftware_VetCare.pdf` — 16 HUs, 11 RNs e 8 RNFs, pp. 3–20.
- `01-documentacao/3_DocumentoArquiteturaSoftware_VetCare.pdf` — decisões acadêmicas e diagramas, pp. 4–18.
- `02-analise-documental/` — observações complementares; não altera a autoridade dos originais.

## Propósito
Materializar critérios de aceite e regras de negócio em um ambiente separado, com dados fictícios e evidências de testes reproduzíveis, permitindo comparação posterior com `Rozeti/ProjetoVetCare`.

## Limites da fase 1
- Navegação entre módulos e indicação visual de perfis, sem fluxo de login real.
- Sem gravar ou reproduzir dados clínicos verdadeiros.
- Sem afirmar conformidade com RN-005, RN-004, RNF-002 ou RNF-003 somente com uma interface.
- Nenhum código do Mateus é copiado ou adaptado nesta fase.

## Perfis
- Administrador, Veterinário e Tutor constam da RN-005 (DRS p. 16).
- Apoio Administrativo aparece na Visão (p. 4) e Arquitetura (p. 5); matriz de permissões específica ainda precisa ser aprovada.

## Questões que permanecem abertas
1. Tutor cadastra e edita o próprio pet? Solicitação posterior aponta cadastro e edição limitada; não está explicitada nos critérios originais da HU-003.
2. Quais campos do pet o Tutor pode editar, se essa ampliação for aprovada?
3. Qual é o limite do Apoio Administrativo em cada caso de uso?
4. Quanto tempo antes da sessão o Tutor pode cancelar (RN-009)?
5. Quais formatos e tamanhos são aceitos para mídia e documentos (RN-011)?
6. Como a equipe formalizará a divergência entre a arquitetura acadêmica Java/Spring e a implementação posterior C#/.NET?

## Método de comparação futura
Para cada HU: critério original → decisão de interpretação (se necessária) → resultado dos testes no Lab → resultado dos testes no Mateus → diferença e recomendação. **Ausência de testes significa não verificado, jamais conforme.**
