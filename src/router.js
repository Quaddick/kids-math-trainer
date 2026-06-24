import { createAdditionView } from './ui/additionView.js';
import { createMagnitudesView } from './ui/magnitudesView.js';

// Оболочка приложения: вкладки «Сложение | Величины» и переключение разделов.
const TABS = [
  { id: 'addition', label: '➕ Сложение', factory: createAdditionView },
  { id: 'magnitudes', label: '📊 Величины', factory: createMagnitudesView },
];

export function createApp() {
  let current = 'addition';

  const app = document.createElement('div');
  app.className = 'app';

  const tabs = document.createElement('nav');
  tabs.className = 'tabs';
  for (const t of TABS) {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'tabs__tab';
    tab.dataset.view = t.id;
    tab.textContent = t.label;
    tab.addEventListener('click', () => switchTo(t.id));
    tabs.appendChild(tab);
  }
  app.appendChild(tabs);

  const host = document.createElement('div');
  host.className = 'view-host';
  app.appendChild(host);

  function switchTo(id) {
    current = id;
    host.innerHTML = '';
    const tab = TABS.find((t) => t.id === id);
    host.appendChild(tab.factory().el);
    for (const btn of tabs.querySelectorAll('.tabs__tab')) {
      btn.classList.toggle('is-active', btn.dataset.view === id);
    }
  }

  switchTo(current);
  return app;
}
