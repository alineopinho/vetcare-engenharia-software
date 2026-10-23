// HU-001: simulação de interface; nunca utilizar estas contas como autenticação real.
const users = Object.freeze({
  admin: { email: 'admin@vetcare.test', password: 'Demo123!', name: 'Alex', profile: 'Administrador', features: ['Gerenciar usuários', 'Agenda geral', 'Indicadores da clínica'] },
  vet: { email: 'veterinario@vetcare.test', password: 'Demo123!', name: 'Dra. Marina', profile: 'Veterinário', features: ['Minha agenda', 'Registrar avaliação', 'Prontuário clínico'] },
  tutor: { email: 'tutor@vetcare.test', password: 'Demo123!', name: 'João', profile: 'Tutor', features: ['Meus pets', 'Confirmar sessões', 'Acompanhar tratamento'] },
  apoio: { email: 'apoio@vetcare.test', password: 'Demo123!', name: 'Rafaela', profile: 'Apoio administrativo', features: ['Consultar agenda geral', 'Apoiar cadastros', 'Confirmar agendamentos'] },
});

const form = document.querySelector('#login-form');
const emailField = document.querySelector('#email');
const passwordField = document.querySelector('#password');
const feedback = document.querySelector('#feedback');
const loginView = document.querySelector('#login-view');
const dashboardView = document.querySelector('#dashboard-view');

function showError(message) {
  feedback.textContent = message;
  feedback.hidden = false;
}

function clearError() {
  feedback.textContent = '';
  feedback.hidden = true;
}

for (const button of document.querySelectorAll('[data-user]')) {
  button.addEventListener('click', () => {
    const user = users[button.dataset.user];
    emailField.value = user.email;
    passwordField.value = user.password;
    clearError();
    emailField.focus();
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearError();
  const email = emailField.value.trim().toLowerCase();
  const password = passwordField.value;
  if (!email || !password) return showError('Informe o e-mail e a senha para entrar.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showError('Informe um e-mail válido.');
  const user = Object.values(users).find((item) => item.email === email && item.password === password);
  if (!user) return showError('E-mail ou senha inválidos.');
  document.querySelector('#welcome').textContent = `Olá, ${user.name}!`;
  document.querySelector('#profile-message').textContent = `Perfil demonstrativo: ${user.profile}`;
  const list = document.querySelector('#resources');
  list.replaceChildren();
  for (const feature of user.features) {
    const li = document.createElement('li');
    li.textContent = feature;
    list.append(li);
  }
  loginView.hidden = true;
  dashboardView.hidden = false;
});

document.querySelector('#logout').addEventListener('click', () => {
  form.reset();
  clearError();
  dashboardView.hidden = true;
  loginView.hidden = false;
  emailField.focus();
});
