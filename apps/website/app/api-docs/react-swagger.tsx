'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

// Mute otomatis warning internal swagger-ui agar tidak menembus dev overlay Next.js
if (typeof window !== 'undefined') {
  const originalError = console.error;
  const originalWarn = console.warn;

  console.error = (...args) => {
    const message = args[0]?.toString() || '';
    if (
      message.includes('UNSAFE_componentWillReceiveProps') || 
      message.includes('ModelCollapse') || 
      message.includes('url.parse')
    ) {
      return; // Abaikan dan jangan tampilkan ke overlay
    }
    originalError(...args);
  };

  console.warn = (...args) => {
    const message = args[0]?.toString() || '';
    if (message.includes('url.parse') || message.includes('componentWillReceiveProps')) {
      return;
    }
    originalWarn(...args);
  };
}

type Props = {
  spec: Record<string, any>;
};

function ReactSwagger({ spec }: Props) {
  return <SwaggerUI spec={spec} />;
}

export default ReactSwagger;