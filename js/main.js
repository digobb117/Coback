(function () {
  'use strict';

  var WHATSAPP_URL = 'https://wa.me/5527997966891';

  /* Menu mobile */
  var btn = document.querySelector('.menu-btn');
  var menu = document.getElementById('menu');

  function setMenu(open) {
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }
  btn.addEventListener('click', function () {
    setMenu(btn.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  /* Ano do rodapé */
  document.getElementById('ano').textContent = new Date().getFullYear();

  /* Cards de serviço: pré-selecionam o serviço e levam ao formulário */
  var form = document.getElementById('form');
  var servico = document.getElementById('servico');
  document.querySelectorAll('[data-servico]').forEach(function (b) {
    b.addEventListener('click', function () {
      servico.value = b.getAttribute('data-servico');
      clearError(servico);
      document.getElementById('contato').scrollIntoView({ behavior: 'smooth' });
      setTimeout(function () { document.getElementById('nome').focus({ preventScroll: true }); }, 500);
    });
  });

  /* Validação */
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setError(input, msg) {
    var field = input.closest('.field');
    field.classList.add('invalid');
    input.setAttribute('aria-invalid', 'true');
    field.querySelector('.err').textContent = msg;
  }
  function clearError(input) {
    var field = input.closest('.field');
    field.classList.remove('invalid');
    input.removeAttribute('aria-invalid');
    var err = field.querySelector('.err');
    if (err) err.textContent = '';
  }

  function validate() {
    var f = form.elements, ok = true, first = null;
    function fail(el, msg) { setError(el, msg); ok = false; if (!first) first = el; }

    [f.nome, f.email, f.servico, f.descricao, f.telefone].forEach(clearError);

    if (f.nome.value.trim().length < 3) fail(f.nome, 'Informe seu nome completo.');
    if (!emailRe.test(f.email.value.trim())) fail(f.email, 'Informe um e-mail válido, como nome@empresa.com.');
    if (!f.servico.value) fail(f.servico, 'Escolha o serviço que você procura.');
    if (f.descricao.value.trim().length < 10) fail(f.descricao, 'Descreva seu projeto em pelo menos 10 caracteres.');

    var tel = f.telefone.value.replace(/\D/g, '');
    if (tel && (tel.length < 10 || tel.length > 13)) fail(f.telefone, 'Informe o telefone com DDD, por exemplo (27) 99999-9999.');

    if (first) first.focus();
    return ok;
  }

  form.addEventListener('input', function (e) {
    if (e.target.closest('.field')) clearError(e.target);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;

    var f = form.elements;
    var empresa = f.empresa.value.trim() || 'Não informada';
    var linhas = [
      'Olá! Vim pelo site da COBACK e gostaria de solicitar um atendimento.',
      '',
      'Nome: ' + f.nome.value.trim(),
      'Empresa: ' + empresa,
      'E-mail: ' + f.email.value.trim(),
      'Serviço desejado: ' + f.servico.value,
      'Descrição do projeto: ' + f.descricao.value.trim()
    ];
    if (f.telefone.value.trim()) linhas.push('Telefone: ' + f.telefone.value.trim());
    linhas.push('', 'Aguardo o retorno!');

    var url = WHATSAPP_URL + '?text=' + encodeURIComponent(linhas.join('\n'));
    var win = window.open(url, '_blank', 'noopener');
    if (!win) window.location.href = url; // fallback se o navegador bloquear a nova aba
  });
})();
