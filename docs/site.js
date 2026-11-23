const panels = [...document.querySelectorAll('[data-page]')];
function navigate(scroll) {
  const hash = location.hash.slice(1);
  const page = ['operations', 'digital'].includes(hash) ? hash : 'design';
  for (const panel of panels) panel.hidden = panel.dataset.page !== page;
  for (const link of document.querySelectorAll('header nav a[href^="#"]')) {
    if (link.hash === '#' + page) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  if (scroll && hash) requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView());
}
window.addEventListener('hashchange', () => navigate(true));
navigate(true);
const dialog = document.querySelector('dialog');
const image = document.querySelector('#preview');
const title = document.querySelector('#preview-title');
const flip = document.querySelector('#flip');
const full = document.querySelector('#full');
let front, back, label, reversed;
function render() {
  const side = back ? (reversed ? '背面' : '正面') : '';
  title.textContent = side ? label + ' · ' + side : label;
  image.alt = title.textContent;
  image.src = full.href = reversed ? back : front;
  flip.textContent = reversed ? '看正面' : '看背面';
  flip.hidden = !back;
}
for (const link of document.querySelectorAll('[data-view]')) {
  link.addEventListener('click', event => {
    if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) return;
    event.preventDefault();
    front = link.href;
    back = link.dataset.back;
    label = link.dataset.label || link.querySelector('img').alt;
    reversed = false;
    render();
    dialog.showModal();
  });
}
flip.addEventListener('click', () => { reversed = !reversed; render(); });
dialog.addEventListener('click', event => {
  if (event.target === dialog) {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  }
});
