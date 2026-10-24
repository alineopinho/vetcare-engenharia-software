// Simulador isolado da HU-003 / RN-001 / RN-004. Sem API, banco ou dados reais.
const tutores = [
  { id: "t1", nome: "João" },
  { id: "t2", nome: "Camila" },
  { id: "t3", nome: "Bruno" },
];
const exemploInicial = () => [
  {
    id: 1,
    nome: "Luna",
    especie: "Cão",
    raca: "SRD",
    nascimento: "2021-04-12",
    tutorId: "t1",
    historico: ["Avaliação inicial fictícia"],
    ativo: true,
  },
  {
    id: 2,
    nome: "Milo",
    especie: "Cão",
    raca: "SRD",
    nascimento: "2023-08-22",
    tutorId: "t2",
    historico: [],
    ativo: true,
  },
];
let pacientes = exemploInicial();
let proximoId = 3;
let perfilAtual = null;
let editando = null;

const $ = (s) => document.querySelector(s);
const formulario = $("#pet-form");
const lista = $("#pet-list");
const aviso = $("#pet-feedback");
const titulo = $("#pets-title");
const campoTutor = $("#pet-tutor");
const legenda = $("#pets-description");
const btnCancelar = $("#pet-cancel");
const campoRaca = $("#pet-breed");
const campoOutraRaca = $("#pet-breed-other");
const areaOutraRaca = $("#pet-breed-other-field");

function atualizarCampoOutraRaca() {
  areaOutraRaca.hidden = campoRaca.value !== "Outra";
  campoOutraRaca.required = !areaOutraRaca.hidden;
  if (areaOutraRaca.hidden) campoOutraRaca.value = "";
}
campoRaca.addEventListener("change", atualizarCampoOutraRaca);

function informar(mensagem, erro = false) {
  aviso.textContent = mensagem;
  aviso.hidden = false;
  aviso.classList.toggle("is-error", erro);
}
function limparAviso() {
  aviso.hidden = true;
  aviso.textContent = "";
  aviso.classList.remove("is-error");
}
function nomeTutor(id) {
  return tutores.find((t) => t.id === id)?.nome || "Não encontrado";
}
function preencherTutores() {
  campoTutor.replaceChildren(new Option("Selecione um tutor", ""));
  tutores.forEach((t) => campoTutor.add(new Option(t.nome, t.id)));
}
function reiniciarFormulario() {
  editando = null;
  formulario.reset();
  atualizarCampoOutraRaca();
  $("#pet-submit").textContent = "Cadastrar paciente";
  btnCancelar.hidden = true;
  limparAviso();
  if (perfilAtual === "Tutor") campoTutor.value = "t1";
}
function criarBotao(texto, acao, id, desabilitado = false) {
  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = "small-action";
  botao.textContent = texto;
  botao.dataset.action = acao;
  botao.dataset.id = String(id);
  botao.disabled = desabilitado;
  return botao;
}
function desenharLista() {
  lista.replaceChildren();

  const ehTutor = perfilAtual === "Tutor";
  const exibidos = ehTutor
    ? pacientes.filter((p) => p.tutorId === "t1")
    : pacientes;

  if (!exibidos.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");

    td.colSpan = ehTutor ? 5 : 6;
    td.textContent = "Nenhum paciente encontrado nesta demonstração.";

    tr.append(td);
    lista.append(tr);
    return;
  }

  for (const pet of exibidos) {
    const tr = document.createElement("tr");

    const valores = [
      pet.nome,
      pet.raca,
      nomeTutor(pet.tutorId),
      pet.ativo ? "Ativo" : "Inativo",
      String(pet.historico.length),
    ];

    for (const valor of valores) {
      const td = document.createElement("td");
      td.textContent = valor;
      tr.append(td);
    }

    // Somente a equipe possui a coluna de ações.
    if (!ehTutor) {
      const acoesTd = document.createElement("td");
      const acoes = document.createElement("div");

      acoes.className = "pet-actions";

      acoes.append(criarBotao("Editar", "editar", pet.id));

      if (perfilAtual === "Administrador" || perfilAtual === "Veterinário") {
        acoes.append(
          criarBotao(pet.ativo ? "Inativar" : "Reativar", "status", pet.id),
        );
      }

      if (perfilAtual === "Administrador") {
        acoes.append(criarBotao("Excluir", "excluir", pet.id));
      }

      acoes.append(
        criarBotao("Adicionar registro fictício", "historico", pet.id),
      );

      acoesTd.append(acoes);
      tr.append(acoesTd);
    }

    lista.append(tr);
  }
}
function renderizar() {
  const ehTutor = perfilAtual === 'Tutor';

  document.querySelector('.pet-table thead th:last-child').hidden = ehTutor;

  titulo.textContent = ehTutor ? 'Meus pets' : 'Pacientes';

  legenda.textContent = ehTutor
    ? 'Visualização simulada dos animais vinculados ao tutor fictício João.'
    : 'Cadastre, edite, vincule a um tutor e experimente a preservação do histórico.';

  $('#pet-form-area').hidden = ehTutor;

  desenharLista();
}
formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  limparAviso();
  if (perfilAtual === "Tutor")
    return informar("O Tutor possui acesso somente de consulta.", true);
  const nome = $("#pet-name").value.trim();
  const especie = "Cão";
  const raca =
    campoRaca.value === "Outra" ? campoOutraRaca.value.trim() : campoRaca.value;
  const nascimento = $("#pet-birth").value;
  const tutorId = campoTutor.value;
  if (!nome || !raca || !nascimento)
    return informar("Preencha os dados obrigatórios do paciente.", true);
  if (!tutorId)
    return informar("Selecione o tutor responsável para continuar.", true);
  if (nascimento > new Date().toLocaleDateString("en-CA"))
    return informar("A data de nascimento não pode ser futura.", true);
  if (editando !== null) {
    const pet = pacientes.find((p) => p.id === editando);
    if (!pet) return informar("Paciente não encontrado.", true);
    Object.assign(pet, { nome, especie, raca, nascimento, tutorId });
    informar("Cadastro atualizado. O histórico fictício foi preservado.");
  } else {
    pacientes.push({
      id: proximoId++,
      nome,
      especie,
      raca,
      nascimento,
      tutorId,
      historico: [],
      ativo: true,
    });
    informar("Paciente cadastrado e associado ao tutor selecionado.");
  }
  desenharLista();
  editando = null;
  formulario.reset();
  atualizarCampoOutraRaca();
  $("#pet-submit").textContent = "Cadastrar paciente";
  btnCancelar.hidden = true;
});
btnCancelar.addEventListener("click", reiniciarFormulario);
lista.addEventListener("click", (event) => {
  const alvo = event.target.closest("button[data-action]");
  if (!alvo || perfilAtual === "Tutor") return;
  if (alvo.dataset.action === "excluir" && perfilAtual !== "Administrador")
    return;
  if (
    alvo.dataset.action === "status" &&
    !["Administrador", "Veterinário"].includes(perfilAtual)
  )
    return;
  const pet = pacientes.find((p) => p.id === Number(alvo.dataset.id));
  if (!pet) return;
  limparAviso();
  switch (alvo.dataset.action) {
    case "editar":
      editando = pet.id;
      $("#pet-name").value = pet.nome;
      if ([...campoRaca.options].some((opcao) => opcao.value === pet.raca)) {
        campoRaca.value = pet.raca;
      } else {
        campoRaca.value = "Outra";
      }
      atualizarCampoOutraRaca();
      if (campoRaca.value === "Outra") campoOutraRaca.value = pet.raca;
      $("#pet-birth").value = pet.nascimento;
      campoTutor.value = pet.tutorId;
      $("#pet-submit").textContent = "Salvar alterações";
      btnCancelar.hidden = false;
      formulario.scrollIntoView({ behavior: "smooth", block: "nearest" });
      break;
    case "status":
      pet.ativo = !pet.ativo;
      informar(
        `Paciente ${pet.ativo ? "reativado" : "inativado"} na simulação.`,
      );
      break;
    case "historico":
      pet.historico.push(`Registro fictício ${pet.historico.length + 1}`);
      informar(
        "Registro fictício incluído. Experimente agora tentar excluir o paciente.",
      );
      break;
    case "excluir":
      if (pet.historico.length > 0) {
        informar(
          "Este paciente possui registros clínicos fictícios. Utilize a inativação.",
          true,
        );
      } else {
        pacientes = pacientes.filter((p) => p.id !== pet.id);
        informar("Cadastro sem histórico excluído da simulação.");
      }
      break;
  }
  desenharLista();
});
preencherTutores();
export function iniciarPacientes(perfil) {
  perfilAtual = perfil;
  // Os dados permanecem durante a troca de contas na mesma página.
  // Ao recarregar, o módulo é carregado novamente e restaura os dados iniciais.
  reiniciarFormulario();
  renderizar();
}
export function encerrarPacientes() {
  perfilAtual = null;
  // Encerrar a conta limpa somente o estado da interface, não os pacientes.
  reiniciarFormulario();
}
