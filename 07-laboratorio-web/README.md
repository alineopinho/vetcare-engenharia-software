# VetCare Lab V2 — implementação independente

**Estado:** fase 1 — especificação e protótipo navegável, sem backend.  
**Branch de trabalho:** `feat/vetcare-lab-v2`.

## Objetivo
Construir uma implementação **independente** do VetCare, partindo dos três documentos acadêmicos originais (Visão de 10/06/2026, DRS de 18/06/2026 e Arquitetura v4.0 de 28/06/2026), registrando ambiguidades e decisões antes de implementá-las. A implementação `Rozeti/ProjetoVetCare` é objeto de comparação posterior, **não fonte de código** deste Lab.

## Como visualizar
Abrir `index.html` localmente ou com o Live Server do VS Code. Esta fase é apenas uma **demonstração de navegação**: não há autenticação real, banco de dados ou dados clínicos persistidos. Nunca usar informações reais de pacientes, tutores ou credenciais.

No GitHub Pages já configurado a partir da `main`, este diretório **não será publicado automaticamente** enquanto permanecer somente na branch de desenvolvimento. Para pré-visualização pública, configurar um deploy específico da branch em serviço de previews ou fluxo próprio.

## Escopo e rastreabilidade
- `docs/escopo-laboratorio.md`: objetivos, limites e decisões pendentes.
- `docs/matriz-requisitos.md`: cobertura planejada das 16 HUs e status da fase.
- `docs/decisoes-arquiteturais.md`: estratégia para API C#/ASP.NET Core e PostgreSQL (futura fase).

## Sequência de desenvolvimento
1. Validar a especificação e os atores com a equipe.
2. Projetar domínio e APIs; implementar autenticação e isolamento de dados **no servidor**.
3. Criar cadastros e prontuário com persistência e testes automatizados.
4. Aplicar os mesmos critérios de teste à implementação do Mateus, em ambiente apropriado.

A pasta `07-laboratorio-web/` original permanece intacta; esta versão inicia em `07-laboratorio-web/v2/`.
