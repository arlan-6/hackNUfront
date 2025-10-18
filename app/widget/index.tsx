import { hydrateRoot } from 'react-dom/client';
import { WidgetContainer } from './components/widget-container';
// import './styles/style.css';
import { MantineProvider } from '@mantine/core';

function initializeWidget() {
  if (document.readyState !== 'loading') {
    onReady();
  } else {
    document.addEventListener('DOMContentLoaded', onReady);
  }
}

function onReady() {
  try {
    const element = document.createElement('div');
    const shadow = element.attachShadow({ mode: 'open' });
    const shadowRoot = document.createElement('div');
    const clientKey = getClientKey();

    shadowRoot.id = 'widget-root';

    const component = (
      <MantineProvider defaultColorScheme='auto'>
        <WidgetContainer clientKey={clientKey} />
      </MantineProvider>
    );

    shadow.appendChild(shadowRoot);
    injectStyle(shadowRoot);
    hydrateRoot(shadowRoot, component);

    document.body.appendChild(element);
  } catch (error) {
    console.warn('Widget initialization failed:', error);
  }
}

function injectStyle(shadowRoot: HTMLElement) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';

  const styleUrl = getStyleUrl();
  const fileName = process.env.WIDGET_NAME || 'widget';
  link.href = styleUrl || process.env.WIDGET_CSS_URL || `/${fileName}.css`;

  shadowRoot.appendChild(link);
}


function getClientKey() {
  const script = document.currentScript as HTMLScriptElement;
  const clientKey = script?.getAttribute('data-client-key');

  if (!clientKey) {
    throw new Error('Missing data-client-key attribute');
  }

  return clientKey;
}
function getStyleUrl() {
  const script = document.currentScript as HTMLScriptElement;
  return script?.getAttribute('data-style-url') || ''; // fallback empty
}
initializeWidget();
