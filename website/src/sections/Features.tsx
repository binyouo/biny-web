import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { useI18n, localePath } from "../i18n";

function MemoryIllustration() {
  const { t } = useI18n();
  const copy = t.features.illustrations.memory;

  return (
    <div className="home-memory-illustration">
      <div className="home-mini-window home-memory-sheet">
        <div className="home-mini-toolbar">
          <Icon name="brain" size={15} />
          <span>{copy.title}</span>
          <span className="home-mini-muted">{copy.scope}</span>
        </div>
        <div className="home-memory-list">
          {copy.notes.map((note) => (
            <div className="home-memory-note" key={note.title}>
              <Icon name="file" size={16} />
              <div>
                <strong>{note.title}</strong>
                <p>{note.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="home-memory-recall">
        <span className="home-mini-label">{copy.recalled}</span>
        <p>{copy.message}</p>
      </div>
    </div>
  );
}

function PermissionIllustration() {
  const { t } = useI18n();
  const copy = t.features.illustrations.permission;

  return (
    <div className="home-mini-window home-permission-illustration">
      <div className="home-mini-toolbar">
        <Icon name="edit" size={14} />
        <span>{copy.title}</span>
        <span className="home-mini-path">src/auth/session.ts</span>
      </div>
      <div className="home-code-preview" aria-label={copy.diffLabel}>
        <div><span className="home-code-number">41</span><code>return retry(async () =&gt; {'{'}</code></div>
        <div className="home-code-added"><span className="home-code-number">42</span><code>+ const controller = new AbortController();</code></div>
        <div className="home-code-added"><span className="home-code-number">43</span><code>+ const timer = setTimeout(() =&gt; …);</code></div>
        <div><span className="home-code-number">44</span><code>  try {'{'} return await request(…); {'}'}</code></div>
        <div><span className="home-code-number">45</span><code>  finally {'{'} clearTimeout(timer); {'}'}</code></div>
        <div><span className="home-code-number">46</span><code>{'}'}, 3);</code></div>
      </div>
      <div className="home-permission-card">
        <div className="home-permission-summary">
          <span className="home-permission-symbol"><Icon name="shield" size={18} /></span>
          <div><strong>{copy.request}</strong><p>{copy.description}</p></div>
        </div>
        <div className="home-permission-options" aria-hidden="true">
          <span>{copy.deny}</span>
          <span className="home-permission-allow">{copy.allow}</span>
        </div>
      </div>
    </div>
  );
}

function TerminalIllustration() {
  const { t } = useI18n();
  const copy = t.features.illustrations.terminal;

  return (
    <div className="home-terminal-illustration">
      <div className="home-terminal-topbar">
        <span className="home-window-dots" aria-hidden="true"><i /><i /><i /></span>
        <span>{copy.title}</span>
        <Icon name="terminal" size={14} />
      </div>
      <div className="home-terminal-content">
        <p className="home-terminal-command"><span>$</span> biny chat</p>
        <p className="home-terminal-welcome">Biny <span>· {copy.workspace}</span></p>
        <p className="home-terminal-prompt"><span>›</span> {copy.prompt}</p>
        <div className="home-terminal-tool"><Icon name="check" size={12} /><span>list_files</span><code>.</code></div>
        <div className="home-terminal-tool"><Icon name="check" size={12} /><span>read_file</span><code>README.md</code></div>
        <p className="home-terminal-answer">{copy.answer}</p>
        <div className="home-terminal-input"><span>›</span><span className="home-terminal-cursor" /></div>
        <div className="home-terminal-status"><span>{copy.permission}</span><span>{copy.status}</span></div>
      </div>
    </div>
  );
}

function ExtensionIllustration() {
  const { t } = useI18n();
  const copy = t.features.illustrations.extensions;

  return (
    <div className="home-extension-illustration">
      <div className="home-extension-workspace"><Icon name="folder" size={19} /><span>{copy.workspace}</span></div>
      <div className="home-extension-line" aria-hidden="true" />
      <div className="home-extension-list">
        {copy.items.map((item) => (
          <div className="home-extension-row" key={item.name}>
            <span className="home-extension-icon"><Icon name={item.icon} size={20} /></span>
            <div><strong>{item.name}</strong><p>{item.description}</p></div>
            <Icon className="home-extension-check" name="check" size={16} />
          </div>
        ))}
      </div>
      <p className="home-extension-note"><Icon name="shield" size={13} />{copy.note}</p>
    </div>
  );
}

const illustrations = {
  memory: MemoryIllustration,
  permission: PermissionIllustration,
  terminal: TerminalIllustration,
  extensions: ExtensionIllustration
};

export function Features() {
  const { t, locale } = useI18n();

  return (
    <section aria-labelledby="home-features-title" className="home-features" id="features">
      <div className="home-wrap">
        <div className="home-section-heading home-features-heading">
          <p className="home-eyebrow">{t.features.eyebrow}</p>
          <h2 id="home-features-title">{t.features.title}</h2>
          <p>{t.features.subtitle}</p>
        </div>
        <div className="home-feature-list">
          {t.features.items.map((item, index) => {
            const Illustration = illustrations[item.visual];

            return (
              <article className={`home-feature-row${index % 2 ? " home-feature-reversed" : ""}`} key={item.visual}>
                <div className="home-feature-copy">
                  <p className="home-feature-label">{item.label}</p>
                  <h3>{item.title}</h3>
                  <p className="home-feature-body">{item.body}</p>
                  <Link className="home-text-link" to={localePath(`/docs/${item.doc}`, locale)}>
                    {item.link}
                    <Icon name="arrowRight" size={15} />
                  </Link>
                </div>
                <figure className={`home-feature-visual home-feature-visual-${item.visual}`}>
                  <Illustration />
                  <figcaption>{t.features.illustrationNote}</figcaption>
                </figure>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
