(function() {
  let open = false;
  const root = document.getElementById('tad-assistant-root');
  if (!root) return;

  root.innerHTML = `
    <button id="tad-fab" title="Abrir asistente">🤖</button>
    <div id="tad-panel" class="tad-hidden">
      <div class="tad-header">
        <h3>Asistente TAD 12</h3>
        <button id="tad-close">✕</button>
      </div>
      <div id="tad-messages">
        <div class="tad-msg bot">¡Hola! Soy tu asistente de datos laborales. ¿En qué puedo ayudarte hoy?</div>
      </div>
      <div id="tad-chips" class="tad-chips">
        <button class="tad-chip">Brecha de género</button>
        <button class="tad-chip">Impacto COVID-19</button>
        <button class="tad-chip">¿Qué es la TGP?</button>
      </div>
      <div class="tad-input-area">
        <textarea id="tad-input" placeholder="Escribe tu duda..." rows="1"></textarea>
        <button id="tad-send">➤</button>
      </div>
    </div>
  `;

  const fab     = document.getElementById('tad-fab');
  const panel   = document.getElementById('tad-panel');
  const close   = document.getElementById('tad-close');
  const messages= document.getElementById('tad-messages');
  const input   = document.getElementById('tad-input');
  const sendBtn = document.getElementById('tad-send');

  const style = document.createElement('style');
  style.textContent = `
    /* Colores exactos de TAD 12 */
    :root {
      --navy: #001F3F;
      --navy-light: #003d66;
      --teal: #0D9488;
      --accent: #E8537A;
      --amber: #F59E0B;
      --white: #FFFFFF;
      --gray-light: #F8F9FA;
      --gray-medium: #E8EAED;
      --text-primary: #2C3E50;
      --text-secondary: #7F8C8D;
    }

    /* Panel flotante */
    #tad-panel {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 380px;
      max-height: 600px;
      background: var(--white);
      border-radius: 12px;
      box-shadow: 0 8px 28px rgba(0, 31, 63, 0.14);
      display: flex;
      flex-direction: column;
      z-index: 9999;
      opacity: 1;
      transform: scale(1);
      transition: all 0.3s ease;
    }

    #tad-panel.tad-hidden {
      opacity: 0;
      transform: scale(0.95);
      pointer-events: none;
    }

    /* Botón flotante */
    #tad-fab {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--teal) 0%, #0a7a6e 100%);
      color: var(--white);
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(0, 31, 63, 0.2);
      transition: all 0.3s ease;
      z-index: 9998;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #tad-fab:hover {
      transform: scale(1.1);
      box-shadow: 0 8px 28px rgba(0, 31, 63, 0.3);
    }

    #tad-fab:active {
      transform: scale(0.95);
    }

    #tad-panel.tad-hidden ~ #tad-fab {
      display: flex;
    }

    #tad-panel:not(.tad-hidden) ~ #tad-fab {
      display: none;
    }

    /* Encabezado */
    .tad-header {
      background: linear-gradient(135deg, var(--navy) 0%, var(--teal) 100%);
      color: var(--white);
      padding: 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 12px 12px 0 0;
      box-shadow: 0 2px 8px rgba(0, 31, 63, 0.1);
    }

    .tad-header h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
      font-family: 'Playfair Display', serif;
      letter-spacing: 0.3px;
    }

    #tad-close {
      background: none;
      border: none;
      color: var(--white);
      cursor: pointer;
      font-size: 1.3rem;
      font-weight: bold;
      transition: all 0.2s ease;
      padding: 0;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #tad-close:hover {
      transform: rotate(90deg);
      opacity: 0.8;
    }

    /* Área de mensajes */
    #tad-messages {
      flex: 1;
      overflow-y: auto;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
      background: var(--gray-light);
    }

    #tad-messages::-webkit-scrollbar {
      width: 6px;
    }

    #tad-messages::-webkit-scrollbar-track {
      background: transparent;
    }

    #tad-messages::-webkit-scrollbar-thumb {
      background: var(--gray-medium);
      border-radius: 3px;
    }

    #tad-messages::-webkit-scrollbar-thumb:hover {
      background: var(--teal);
    }

    /* Mensajes */
    .tad-msg {
      padding: 0.875rem 1rem;
      border-radius: 8px;
      font-size: 0.95rem;
      line-height: 1.5;
      max-width: 85%;
      font-family: 'Inter', sans-serif;
      font-weight: 500;
      word-wrap: break-word;
      animation: messageSlideIn 0.3s ease-out;
    }

    @keyframes messageSlideIn {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Mensaje del bot */
    .tad-msg.bot {
      background: var(--white);
      color: var(--text-primary);
      align-self: flex-start;
      border: 1px solid var(--gray-medium);
      box-shadow: 0 2px 4px rgba(0, 31, 63, 0.05);
    }

    /* Mensaje del usuario */
    .tad-msg.user {
      background: var(--navy);
      color: var(--white);
      align-self: flex-end;
      box-shadow: 0 2px 8px rgba(0, 31, 63, 0.15);
    }

    /* Chips de sugerencias */
    .tad-chips {
      padding: 1rem;
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      background: var(--white);
      border-top: 1px solid var(--gray-medium);
      border-bottom: 1px solid var(--gray-medium);
    }

    .tad-chip {
      padding: 0.5rem 0.875rem;
      border: 1.5px solid var(--teal);
      background: var(--white);
      color: var(--teal);
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      font-family: 'Inter', sans-serif;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .tad-chip:hover {
      background: var(--teal);
      color: var(--white);
      transform: scale(1.05);
      box-shadow: 0 2px 8px rgba(13, 148, 136, 0.2);
    }

    .tad-chip:active {
      transform: scale(0.95);
    }

    /* Área de entrada */
    .tad-input-area {
      padding: 1rem;
      border-top: 1px solid var(--gray-medium);
      display: flex;
      gap: 0.5rem;
      background: var(--white);
      border-radius: 0 0 12px 12px;
    }

    /* Input de texto */
    #tad-input {
      flex: 1;
      border: 1.5px solid var(--gray-medium);
      border-radius: 6px;
      padding: 0.75rem;
      font-size: 0.95rem;
      font-weight: 500;
      font-family: 'Inter', sans-serif;
      color: var(--text-primary);
      outline: none;
      resize: none;
      max-height: 80px;
      transition: all 0.2s ease;
      background: var(--white);
    }

    #tad-input::placeholder {
      color: var(--text-secondary);
      font-weight: 400;
    }

    #tad-input:focus {
      border-color: var(--teal);
      box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
      background: var(--white);
    }

    /* Botón enviar */
    #tad-send {
      background: var(--teal);
      color: var(--white);
      border: none;
      border-radius: 6px;
      width: 40px;
      height: 40px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      font-weight: bold;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    #tad-send:hover {
      background: #0a7a6e;
      transform: scale(1.05);
      box-shadow: 0 2px 8px rgba(13, 148, 136, 0.3);
    }

    #tad-send:active {
      transform: scale(0.95);
    }

    #tad-send:disabled {
      background: var(--gray-medium);
      cursor: not-allowed;
      opacity: 0.6;
    }

    /* Responsive */
    @media (max-width: 480px) {
      #tad-panel {
        width: calc(100% - 32px);
        max-height: 70vh;
        bottom: 16px;
        right: 16px;
      }

      #tad-fab {
        bottom: 16px;
        right: 16px;
      }

      .tad-msg {
        max-width: 90%;
      }
    }
  `;
  document.head.appendChild(style);

  function toggle() {
    open = !open;
    panel.classList.toggle('tad-hidden', !open);
    if (open) input.focus();
  }

  fab.onclick = toggle;
  close.onclick = toggle;

  document.querySelectorAll('.tad-chip').forEach(chip => {
    chip.onclick = () => {
      input.value = chip.innerText;
      sendMessage();
    };
  });

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';
    
    const loadingMsg = addMessage('Pensando...', 'bot');

    try {
      const response = await fetch('/api/grok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await response.json();
      loadingMsg.innerText = data.reply || 'No pude obtener una respuesta.';
    } catch (e) {
      loadingMsg.innerText = 'Error: ' + e.message;
    }
    messages.scrollTop = messages.scrollHeight;
  }

  function addMessage(text, type) {
    const div = document.createElement('div');
    div.className = `tad-msg ${type}`;
    div.innerText = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  sendBtn.onclick = sendMessage;
  input.onkeypress = (e) => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } };

})();
