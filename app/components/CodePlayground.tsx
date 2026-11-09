'use client';

import { useMemo, useRef, useState, type KeyboardEvent } from 'react';

type EditorTab = 'html' | 'css' | 'js';
type CodeBundle = { html: string; css: string; js: string };

const starterCode: CodeBundle = {
  html: `<main class="demo-card">
  <span class="eyebrow">A SMALL IDEA, LIVE</span>
  <h1>Build something <em>beautiful.</em></h1>
  <p>Change the code on the left, then run it to see your idea come to life.</p>
  <button id="helloButton">Say hello <span>↗</span></button>
  <p class="message" id="message" aria-live="polite"></p>
</main>`,
  css: `* { box-sizing: border-box; }
body {
  min-height: 100vh;
  margin: 0;
  display: grid;
  place-items: center;
  padding: 28px;
  background: #f4f0e7;
  color: #29271f;
  font-family: Arial, sans-serif;
}
.demo-card {
  width: min(100%, 480px);
  padding: 38px;
  border: 1px solid #ded5c5;
  border-radius: 18px;
  background: #fffdf8;
  box-shadow: 0 22px 60px #45351c12;
}
.eyebrow { color: #997348; font-size: 11px; letter-spacing: .16em; }
h1 { margin: 20px 0 12px; font-size: clamp(34px, 7vw, 52px); line-height: 1.05; letter-spacing: -.06em; }
h1 em { color: #ad8050; font-style: normal; }
p { color: #716b60; line-height: 1.7; }
button {
  margin-top: 12px;
  padding: 13px 17px;
  border: 0;
  border-radius: 8px;
  background: #29271f;
  color: #fffdf8;
  cursor: pointer;
}
button span { margin-left: 12px; }
.message { min-height: 24px; color: #68816c; }`,
  js: `const button = document.querySelector('#helloButton');
const message = document.querySelector('#message');

button?.addEventListener('click', () => {
  if (message) {
    message.textContent = 'Hello! Your code is working. ✨';
  }
});`
};

function makePreviewDocument(code: CodeBundle) {
  // The preview runs in a sandboxed iframe with an opaque origin. Network access
  // is disabled so visitor code cannot reach the portfolio page or external APIs.
  const safeCss = code.css.replace(/<\/style/gi, '<\\/style');
  const safeJs = code.js.replace(/<\/script/gi, '<\\/script');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: blob:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; font-src data:; media-src data: blob:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'">
<style>${safeCss}</style>
</head>
<body>
${code.html}
<script>${safeJs}<\/script>
</body>
</html>`;
}

export default function CodePlayground() {
  const [draft, setDraft] = useState<CodeBundle>(starterCode);
  const [compiled, setCompiled] = useState<CodeBundle>(starterCode);
  const [activeTab, setActiveTab] = useState<EditorTab>('html');
  const [status, setStatus] = useState('READY TO RUN');
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const previewDocument = useMemo(() => makePreviewDocument(compiled), [compiled]);
  const activeCode = draft[activeTab];
  const lineCount = Math.max(1, activeCode.split('\n').length);
  const filename = activeTab === 'js' ? 'script.js' : activeTab === 'css' ? 'styles.css' : 'index.html';

  const updateActiveCode = (value: string) => {
    setDraft((current) => ({ ...current, [activeTab]: value }));
    setStatus('UNSAVED CHANGES');
  };

  const runCode = () => {
    setCompiled({ ...draft });
    setStatus('PREVIEW UPDATED');
  };

  const resetCode = () => {
    setDraft(starterCode);
    setCompiled(starterCode);
    setActiveTab('html');
    setStatus('STARTER RESTORED');
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(activeCode);
      setCopied(true);
      setStatus(`${filename.toUpperCase()} COPIED`);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setStatus('CLIPBOARD UNAVAILABLE');
    }
  };

  const downloadCode = () => {
    const documentText = makePreviewDocument(draft);
    const blob = new Blob([documentText], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'irfan-playground.html';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1200);
    setStatus('HTML FILE DOWNLOADED');
  };

  const handleEditorKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      runCode();
      return;
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      const target = event.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const nextCode = `${activeCode.slice(0, start)}  ${activeCode.slice(end)}`;
      updateActiveCode(nextCode);
      requestAnimationFrame(() => {
        target.focus();
        target.setSelectionRange(start + 2, start + 2);
      });
    }
  };

  return (
    <section className="playground-section section-shell reveal" id="playground">
      <div className="playground-heading">
        <div>
          <span className="section-index">INTERACTIVE SPACE / 001</span>
          <h2>Try an idea.<br /><em>Make it real.</em></h2>
        </div>
        <p>A little browser playground for curious minds. Edit the HTML, style it with CSS, add JavaScript, and run your own mini experiment.</p>
      </div>

      <div className="playground-window">
        <div className="playground-titlebar">
          <div className="window-dots" aria-hidden="true"><i /><i /><i /></div>
          <div className="playground-filename"><span>IN</span> irfan-playground <b>×</b></div>
          <div className="playground-live"><i /> LOCAL PREVIEW</div>
        </div>

        <div className="playground-workspace">
          <div className="code-pane">
            <div className="editor-toolbar">
              <div className="editor-tabs" role="tablist" aria-label="Code file">
                {(['html', 'css', 'js'] as EditorTab[]).map((tab) => (
                  <button
                    className={activeTab === tab ? 'editor-tab active' : 'editor-tab'}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab}
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'js' ? 'JS' : tab.toUpperCase()}
                  </button>
                ))}
              </div>
              <span className="editor-language">{filename}</span>
            </div>
            <div className="editor-input-wrap">
              <div className="line-numbers" aria-hidden="true">
                {Array.from({ length: lineCount }, (_, index) => <span key={index}>{String(index + 1).padStart(2, '0')}</span>)}
              </div>
              <textarea
                ref={editorRef}
                className="code-editor"
                value={activeCode}
                onChange={(event) => updateActiveCode(event.target.value)}
                onKeyDown={handleEditorKeyDown}
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                aria-label={`Edit ${filename}`}
                aria-describedby="playground-help"
                wrap="off"
              />
            </div>
            <div className="editor-status"><span><i /> HTML · CSS · JS</span><span>UTF-8&nbsp;&nbsp; LF</span><span>{lineCount} LINES</span></div>
          </div>

          <div className="preview-pane">
            <div className="preview-toolbar">
              <span><i /> DESKTOP PREVIEW</span>
              <span className="preview-address">localhost / playground</span>
              <span>100%</span>
            </div>
            <iframe
              className="playground-frame"
              title="Your code preview"
              sandbox="allow-scripts"
              referrerPolicy="no-referrer"
              srcDoc={previewDocument}
            />
            <div className="preview-caption"><span>LIVE SANDBOX</span><span>YOUR CODE · YOUR CANVAS</span></div>
          </div>
        </div>

        <div className="playground-actions">
          <div className="playground-state"><i /> <span>{status}</span></div>
          <div className="playground-buttons">
            <button className="playground-secondary" type="button" onClick={resetCode}>Reset</button>
            <button className="playground-secondary" type="button" onClick={copyCode}>{copied ? 'Copied ✓' : 'Copy code'}</button>
            <button className="playground-secondary download-code" type="button" onClick={downloadCode}>Download HTML ↓</button>
            <button className="playground-run" type="button" onClick={runCode}>Run preview <span>CTRL / ⌘ ↵</span></button>
          </div>
        </div>
      </div>
      <p className="playground-help" id="playground-help">Use the HTML, CSS and JS tabs. Press <kbd>Ctrl</kbd> / <kbd>⌘</kbd> + <kbd>Enter</kbd> to run. Code runs locally in an isolated preview; it is not uploaded or saved to a server.</p>
    </section>
  );
}
