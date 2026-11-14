import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowUp,
  faArrowUpRightFromSquare,
  faBars,
  faBookOpen,
  faBookOpenReader,
  faCheck,
  faCircleInfo,
  faCircleNotch,
  faCircleQuestion,
  faCompass,
  faFileCircleCheck,
  faFileLines,
  faHouse,
  faLocationDot,
  faMagnifyingGlass,
  faMessage,
  faMoon,
  faPlus,
  faRoad,
  faShieldHalved,
  faSun,
  faWandMagicSparkles,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  Link,
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { legalDocuments, legalDocumentKeys, legalDraftDate } from "./legal.js";

function makeIcon(icon) {
  return function FontAwesomeGlyph({ size = 16, className = "", ...props }) {
    return (
      <FontAwesomeIcon
        icon={icon}
        {...props}
        className={`fa-icon fa-size-${size}${className ? ` ${className}` : ""}`}
      />
    );
  };
}

const ArrowRight = makeIcon(faArrowRight);
const ArrowUp = makeIcon(faArrowUp);
const BookOpen = makeIcon(faBookOpen);
const BookOpenReader = makeIcon(faBookOpenReader);
const Check = makeIcon(faCheck);
const CircleHelp = makeIcon(faCircleQuestion);
const ExternalLink = makeIcon(faArrowUpRightFromSquare);
const FileCheck2 = makeIcon(faFileCircleCheck);
const FileText = makeIcon(faFileLines);
const Info = makeIcon(faCircleInfo);
const LibraryBig = makeIcon(faBookOpenReader);
const LoaderCircle = makeIcon(faCircleNotch);
const Menu = makeIcon(faBars);
const MessageCircle = makeIcon(faMessage);
const Search = makeIcon(faMagnifyingGlass);
const ShieldCheck = makeIcon(faShieldHalved);
const Sparkles = makeIcon(faWandMagicSparkles);
const X = makeIcon(faXmark);
const Plus = makeIcon(faPlus);
const Home = makeIcon(faHouse);
const Compass = makeIcon(faCompass);
const Road = makeIcon(faRoad);

const articles = [
  {
    slug: "how-to-read-a-legal-source",
    category: "A practical guide",
    title: "How to read a legal source record",
    excerpt:
      "A quick guide to the details that help you understand where a rule came from and whether the record is current.",
    readTime: "4 min read",
    icon: FileCheck2,
    sections: [
      {
        heading: "Start with the source, not a summary",
        text: "A plain-language explanation is a starting point. Open the underlying source and check its title, issuing body, and the provision it points to. Those details help you identify the document being described.",
      },
      {
        heading: "Check version and validity details",
        text: "A record may show a version, effective dates, and a last-verified date. Treat these as useful context, not a guarantee that a law has not changed since review. If a date or status is missing, verify the current instrument through an authorized official source.",
      },
      {
        heading: "Read the whole provision",
        text: "Definitions, exceptions, conditions, and related provisions can affect how a section applies. A short excerpt may not show all of that context. Follow the citation to the source document and read the surrounding material before relying on an interpretation.",
      },
    ],
  },
  {
    slug: "what-a-citation-can-tell-you",
    category: "Using the assistant",
    title: "What an AI citation can  and can’t  tell you",
    excerpt:
      "Learn what a source link adds to an answer, and why a citation is an invitation to verify rather than a legal decision.",
    readTime: "3 min read",
    icon: Search,
    sections: [
      {
        heading: "A citation gives you a trail to follow",
        text: "When the assistant returns citations, each one identifies a source record and provision used in its response. Use that trail to inspect the available text, dates, and source details for yourself.",
      },
      {
        heading: "A citation does not prove every claim",
        text: "A citation is not a court ruling, an official notice, or a guarantee that every sentence in an AI-generated answer is correct. The assistant can misunderstand context or leave out an important qualification.",
      },
      {
        heading: "Verify important questions",
        text: "Read the underlying legal instrument and seek guidance from an authorized official channel or a qualified legal professional when the issue affects you. Never treat this assistant as confirmation that a fine was issued or is owed.",
      },
    ],
  },
  {
    slug: "when-to-check-an-official-source",
    category: "Know the limits",
    title: "When to check an official source",
    excerpt:
      "Some questions need a current document or an authorized person. Here’s when to pause and verify beyond an AI response.",
    readTime: "3 min read",
    icon: ShieldCheck,
    sections: [
      {
        heading: "When the answer affects a real decision",
        text: "If you need to decide what to do about a notice, a deadline, an offence, or a payment, check the relevant official source directly. This information service does not access enforcement records or handle payments.",
      },
      {
        heading: "When a source is missing or unclear",
        text: "The available source collection may be incomplete. If an answer has no citations, a source link is unavailable, or a date or qualification is unclear, do not fill in the gaps by guessing. Ask an authorized official channel to confirm the current rule.",
      },
      {
        heading: "Protect your personal information",
        text: "Ask general questions only. Do not enter your name, licence or registration details, payment information, notice numbers, or other identifying information into the assistant.",
      },
    ],
  },
];

const navigation = [
  { to: "/", label: "Overview", icon: BookOpen },
  { to: "/articles", label: "Guides", icon: FileText },
  { to: "/sources", label: "Legal sources", icon: LibraryBig },
];

const stateLabels = {
  supported: "Evidence found",
  insufficient_evidence: "Not enough evidence",
  conflicting_sources: "Sources conflict",
  possibly_outdated: "Check source status",
  needs_clarification: "More detail needed",
  technical_failure: "Technical problem",
};

function PageTitle({ eyebrow, title, description, children }) {
  return (
    <div className="page-title">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {description && <p className="page-intro">{description}</p>}
      {children}
    </div>
  );
}

function Brand({ compact = false }) {
  return (
    <Link className={`brand${compact ? " brand-compact" : ""}`} to="/" aria-label="MRTLA Malawi home">
      <span className="brand-symbol" aria-hidden="true"><Road size={17} /></span>
      {!compact && (
        <span className="brand-name">
          MRTLA<span>malawi</span>
        </span>
      )}
    </Link>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem("mrtla-theme");
    if (savedTheme) return savedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => setMenuOpen(false), [location.pathname]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("mrtla-theme", theme);
  }, [theme]);

  return (
    <>
      <div className="notice-bar">
        <Info size={14} aria-hidden="true" />
        <span>Independent legal information. Not a government or payment service.</span>
        <Link to="/about">How to use this site <ArrowRight size={13} aria-hidden="true" /></Link>
      </div>
      <header className="site-header">
        <div className="header-inner">
          <Brand />
          <button
            className="mobile-menu-button"
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <nav className={`main-nav${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
            {navigation.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                {label}
              </NavLink>
            ))}
            <NavLink className="nav-ask" to="/assistant">
              <Sparkles size={16} aria-hidden="true" />
              Ask the assistant
            </NavLink>
            <button
              className="theme-toggle"
              type="button"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")}
            >
              <FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} aria-hidden="true" />
            </button>
          </nav>
        </div>
      </header>
    </>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <Brand />
        <p>Malawi Road Traffic Law Assistant</p>
        <div className="footer-links">
          <Link to="/articles">Guides</Link>
          <Link to="/sources">Legal sources</Link>
          <Link to="/about">About &amp; limitations</Link>
          {legalDocumentKeys.map((key) => (
            <Link key={key} to={legalDocuments[key].path}>{legalDocuments[key].footerLabel}</Link>
          ))}
        </div>
        <div className="footer-bottom">
          <span>Independent information service. No government endorsement is implied.</span>
          <span>AI can make mistakes. Check every source.</span>
        </div>
      </div>
    </footer>
  );
}

function SiteLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function ArticleCard({ article, featured = false }) {
  const Icon = article.icon;
  return (
    <Link className={`article-card${featured ? " article-card-featured" : ""}`} to={`/articles/${article.slug}`}>
      <span className="article-icon"><Icon size={19} aria-hidden="true" /></span>
      <span className="article-category">{article.category}</span>
      <h3>{article.title}</h3>
      <p>{article.excerpt}</p>
      <span className="article-card-bottom">
        <span>{article.readTime}</span>
        <ArrowRight size={17} aria-hidden="true" />
      </span>
    </Link>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");

  function startQuestion(event) {
    event.preventDefault();
    navigate("/assistant", { state: { question: question.trim() } });
  }

  return (
    <SiteLayout>
      <section className="hero-section">
        <div className="hero-content">
          <p className="eyebrow hero-location"><FontAwesomeIcon icon={faLocationDot} aria-hidden="true" /> MALAWI ROAD TRAFFIC LAW</p>
          <h1>How can I help<br />you today?</h1>
          <p className="hero-copy">
            Ask a question, explore legal sources, or read practical guides. Start with what you need to know.
          </p>
          <form className="hero-search" onSubmit={startQuestion}>
            <MessageCircle size={19} aria-hidden="true" />
            <label className="sr-only" htmlFor="hero-question">Ask about Malawi road traffic law</label>
            <input
              id="hero-question"
              maxLength={2000}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask about a road traffic rule..."
              value={question}
            />
            <button type="submit" aria-label="Ask the assistant">
              <ArrowUp size={19} aria-hidden="true" />
            </button>
          </form>
          <p className="hero-hint"> Answers are grounded in available sources. Check citations before relying on them.</p>
          <div className="hero-links">
            <Link className="button button-primary" to="/assistant">Explore the assistant <ArrowRight size={17} /></Link>
            <Link className="button button-secondary" to="/articles">Browse practical guides <ArrowRight size={16} /></Link>
          </div>
        </div>
        <div className="hero-art">
          <img
            className="hero-photo"
            src="/images/malawi-traffic-officers.jpg"
            alt="Malawian police officers conducting a roadside traffic check"
          />
          <div className="hero-photo-caption">
           
            <span><strong>Know what the source says.</strong><small>Check the evidence behind every answer.</small></span>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <div><p className="eyebrow">Start with the essentials</p><h2>Useful before you ask</h2></div>
          <Link className="text-link" to="/articles">All guides <ArrowRight size={16} /></Link>
        </div>
        <div className="article-grid">
          {articles.slice(0, 2).map((article) => <ArticleCard key={article.slug} article={article} />)}
        </div>
      </section>

      <section className="source-callout">
        <div className="source-callout-icon"><LibraryBig size={22} /></div>
        <div><p className="eyebrow">Open the record</p><h2>Every answer should have a trail.</h2><p>Browse the source records available to this service. Check the original document and its status before relying on an explanation.</p></div>
        <Link className="button button-light" to="/sources">Explore legal sources <ArrowRight size={16} /></Link>
      </section>

      <section className="disclaimer-band">
       
        <p><strong>Information, not an official decision.</strong> This service does not determine guilt, issue or cancel fines, or accept payments. <Link to="/about">Read about the limitations.</Link></p>
      </section>
    </SiteLayout>
  );
}

function ArticlesPage() {
  return (
    <SiteLayout>
      <div className="content-page">
        <PageTitle
          eyebrow="Learn at your own pace"
          title="Practical guides to road-law information"
          description="Short explainers to help you navigate sources, understand citations, and know when to verify a question elsewhere."
        />
        <div className="article-grid article-grid-all">
          {articles.map((article) => <ArticleCard key={article.slug} article={article} featured />)}
        </div>
        <div className="editorial-note"><Info size={17} /><p>These guides are general information, not legal advice. They do not describe the outcome of a specific case or replace the current legal instrument.</p></div>
      </div>
    </SiteLayout>
  );
}

function ArticlePage() {
  const { slug } = useParams();
  const article = articles.find((item) => item.slug === slug);

  if (!article) return <NotFoundPage />;
  const Icon = article.icon;

  return (
    <SiteLayout>
      <article className="article-detail content-page">
        <Link className="back-link" to="/articles"><ArrowRight size={15} /> All guides</Link>
        <div className="article-detail-heading">
          <span className="article-icon"><Icon size={21} /></span>
          <p className="eyebrow">{article.category} <span>·</span> {article.readTime}</p>
        </div>
        <h1>{article.title}</h1>
        <p className="article-lede">{article.excerpt}</p>
        <div className="article-body">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.text}</p>
            </section>
          ))}
        </div>
        <div className="article-next">
          <div><p className="eyebrow">Continue exploring</p><h2>Check the sources behind an answer.</h2></div>
          <Link className="button button-primary" to="/sources">Browse legal sources <ArrowRight size={16} /></Link>
        </div>
      </article>
    </SiteLayout>
  );
}

function safeHttpUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

async function readJson(response) {
  const resolvedResponse = await response;
  const body = await resolvedResponse.json().catch(() => ({}));
  if (!resolvedResponse.ok) {
    throw new Error(body.error?.message || `The request failed (HTTP ${resolvedResponse.status}).`);
  }
  return body;
}

function SourceStatus({ value }) {
  const current = value === "current" || value === "verified";
  return <span className={`status-pill${current ? " status-good" : ""}`}><span />{value?.replaceAll("_", " ") || "Status not supplied"}</span>;
}

function SourceDetails({ source }) {
  if (!source) {
    return <div className="source-empty"><LibraryBig size={27} /><h2>Select a source</h2><p>Choose a record to review its metadata and available provisions.</p></div>;
  }
  const sourceUrl = safeHttpUrl(source.url);

  return (
    <article className="source-detail">
      <div className="source-detail-heading">
        <p className="eyebrow">Source record</p>
        <h2>{source.title}</h2>
        <div className="status-row"><SourceStatus value={source.verification_status} /><SourceStatus value={source.validity_status} /></div>
      </div>
      <dl className="source-metadata">
        {[
          ["Issuing body", source.issuer],
          ["Version", source.version],
          ["Effective from", source.effective_from],
          ["Effective to", source.effective_to],
          ["Last verified", source.last_verified],
        ].filter(([, value]) => value).map(([label, value]) => (
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
        ))}
      </dl>
      {sourceUrl && <a className="source-open-link" href={sourceUrl} target="_blank" rel="noopener noreferrer">Open original source <ExternalLink size={15} /></a>}
      <div className="provisions-heading"><h3>Available provisions</h3><span>{source.provisions?.length || 0}</span></div>
      {source.provisions?.length ? (
        <div className="provision-list">
          {source.provisions.map((provision) => (
            <section className="provision-card" key={provision.evidence_id}>
              <p className="provision-number">{provision.provision}</p>
              <h4>{provision.topic}</h4>
              <p>{provision.text}</p>
              {provision.conditions?.length > 0 && <ul>{provision.conditions.map((condition) => <li key={condition}>{condition}</li>)}</ul>}
            </section>
          ))}
        </div>
      ) : <p className="empty-note">No provision details are available for this source.</p>}
    </article>
  );
}

function SourcesPage() {
  const [sources, setSources] = useState([]);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("Loading available source records…");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const sourceId = searchParams.get("source");

  useEffect(() => {
    let active = true;
    readJson(fetch("/api/sources"))
      .then((body) => {
        if (!active) return;
        const records = body.sources || [];
        setSources(records);
        setStatus(records.length ? `${records.length} source ${records.length === 1 ? "record" : "records"} available` : "No legal source records are currently available.");
        if (!records.length) setSelected(null);
      })
      .catch((cause) => {
        if (active) {
          setError(cause.message);
          setStatus("");
        }
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    if (!sourceId) {
      setSelected(null);
      return () => { active = false; };
    }
    readJson(fetch(`/api/sources/${encodeURIComponent(sourceId)}`))
      .then((source) => { if (active) setSelected(source); })
      .catch((cause) => { if (active) setError(cause.message); });
    return () => { active = false; };
  }, [sourceId]);

  const visibleSources = sources.filter((source) =>
    `${source.title} ${source.issuer || ""}`.toLowerCase().includes(search.toLowerCase()),
  );

  function selectSource(id) {
    setError("");
    setSearchParams({ source: id });
  }

  return (
    <SiteLayout>
      <div className="content-page">
        <PageTitle
          eyebrow="Transparency starts with the record"
          title="Legal sources"
          description="Browse the legal source records made available to this service. Availability and status come from the backend’s configured collection."
        />
        <div className="sources-status"><span className={error ? "status-dot status-dot-error" : "status-dot"} />{error || status}</div>
        <div className="sources-layout">
          <aside className="sources-sidebar" aria-label="Source records">
            <label className="source-search">
              <Search size={16} aria-hidden="true" />
              <span className="sr-only">Search sources</span>
              <input onChange={(event) => setSearch(event.target.value)} placeholder="Search sources" value={search} />
            </label>
            <div className="source-record-list">
              {visibleSources.map((source) => (
                <button
                  className={`source-record${selected?.source_id === source.source_id || sourceId === source.source_id ? " selected" : ""}`}
                  key={source.source_id}
                  onClick={() => selectSource(source.source_id)}
                  type="button"
                >
                  <FileText size={17} aria-hidden="true" />
                  <span><strong>{source.title}</strong><small>{source.issuer || source.source_id}</small></span>
                  <ArrowRight size={15} aria-hidden="true" />
                </button>
              ))}
              {sources.length > 0 && visibleSources.length === 0 && <p className="empty-note">No sources match that search.</p>}
            </div>
          </aside>
          <div className="source-detail-panel"><SourceDetails source={selected} /></div>
        </div>
        <div className="editorial-note"><Info size={17} /><p>A source record is not a substitute for checking the applicable official legal instrument. Confirm important details through an authorized official channel.</p></div>
      </div>
    </SiteLayout>
  );
}

function CitationList({ citations = [] }) {
  if (!citations.length) return null;
  return (
    <section className="answer-sources">
      <h3><LibraryBig size={16} /> Sources in this answer</h3>
      <ol>
        {citations.map((citation, index) => {
          const href = safeHttpUrl(citation.url);
          return (
            <li key={citation.evidence_id || `${citation.source_id}-${index}`}>
              <span className="citation-index">{index + 1}</span>
              <span>
                <strong>{citation.title}</strong>
                <small>{citation.provision}{citation.version ? ` · ${citation.version}` : ""}{citation.last_verified ? ` · Verified ${citation.last_verified}` : ""}</small>
                {href ? <a href={href} target="_blank" rel="noopener noreferrer">Open official source <ExternalLink size={13} /></a> : <Link to={`/sources?source=${encodeURIComponent(citation.source_id)}`}>View source record <ArrowRight size={13} /></Link>}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function AnswerCard({ entry, onFollowUp }) {
  if (entry.pending) {
    return <article className="chat-response pending-response"><span className="response-orb"><LoaderCircle size={17} className="spin" /></span><p>Checking the available legal records…</p></article>;
  }
  if (entry.error) {
    return <article className="chat-response error-response"><span className="response-orb"><Info size={17} /></span><div><h3>The service could not answer</h3><p>{entry.error}</p></div></article>;
  }
  const answer = entry.answer;
  return (
    <article className="chat-response">
      <div className="response-heading">
        <span className="response-orb"><Sparkles size={17} /></span>
        <div><h3>{stateLabels[answer.state] || "Assistant response"}</h3><span>Based on the available source records</span></div>
      </div>
      <p className="answer-copy">{answer.direct_answer}</p>
      {answer.explanation && <p className="answer-copy">{answer.explanation}</p>}
      {answer.penalty && <div className="answer-callout"><strong>Penalty information</strong><p>{answer.penalty}</p><small>This is not confirmation that a fine has been issued or is owed.</small></div>}
      {answer.qualifications?.length > 0 && <div className="answer-qualifications"><h4>Important qualifications</h4><ul>{answer.qualifications.map((item) => <li key={item}>{item}</li>)}</ul></div>}
      {answer.official_next_step && <div className="answer-callout"><strong>Possible next step</strong><p>{answer.official_next_step}</p></div>}
      <CitationList citations={answer.citations} />
      <div className="follow-up-row">
        <span>Explore next</span>
        {(answer.citations?.length
          ? ["Explain the cited provision in plain language", "What should I verify in the source?"]
          : ["How are legal sources checked?", "What sources are available?"]
        ).map((prompt) => (
          <button key={prompt} onClick={() => onFollowUp(prompt)} type="button">{prompt}</button>
        ))}
      </div>
      {answer.verification_note && <p className="answer-footnote"><Info size={14} />{answer.verification_note}</p>}
      {answer.request_id && <p className="request-reference">Reference: {answer.request_id}</p>}
    </article>
  );
}

function SourceInspector({ citations, onClose }) {
  return (
    <aside className="source-inspector" aria-label="Answer sources panel">
      <div className="inspector-heading">
        <div><p className="eyebrow">Workspace</p><h2>Sources</h2></div>
        <button className="inspector-close" onClick={onClose} type="button" aria-label="Close sources panel">
          <X size={15} />
        </button>
      </div>
      {citations.length ? (
        <div className="inspector-citations">
          <p className="inspector-subtitle">From the latest answer</p>
          {citations.map((citation, index) => (
            <Link
              className="inspector-source"
              key={citation.evidence_id || `${citation.source_id}-${index}`}
              to={`/sources?source=${encodeURIComponent(citation.source_id)}`}
            >
              <span className="inspector-source-icon"><FileText size={15} /></span>
              <span><strong>{citation.title}</strong><small>{citation.provision}</small></span>
              <ArrowRight size={14} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="inspector-empty">
          <span className="inspector-empty-icon"><LibraryBig size={20} /></span>
          <h3>Cited sources appear here</h3>
          <p>When an answer has evidence, use this panel to open the cited record.</p>
        </div>
      )}
      <Link className="inspector-library-link" to="/sources">
        Browse legal sources <ArrowRight size={14} />
      </Link>
      <div className="inspector-guide">
        <span><Compass size={15} /> Quick guide</span>
        <strong>Check the source status and read the full provision before relying on an answer.</strong>
        <Link to="/articles/how-to-read-a-legal-source">How to read a source <ArrowRight size={13} /></Link>
      </div>
    </aside>
  );
}

function AssistantPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const conversationRef = useRef(null);
  const [question, setQuestion] = useState("");
  const [entries, setEntries] = useState([]);
  const [sending, setSending] = useState(false);
  const [railCollapsed, setRailCollapsed] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(true);

  useEffect(() => {
    const initialQuestion = location.state?.question;
    if (initialQuestion) {
      setQuestion(initialQuestion);
      navigate(location.pathname, { replace: true, state: null });
      inputRef.current?.focus();
    }
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    conversationRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [entries]);

  async function submitQuestion(event) {
    event.preventDefault();
    const prompt = question.trim();
    if (!prompt || sending) return;
    setSending(true);
    setQuestion("");
    setEntries((current) => [...current, { question: prompt, pending: true }]);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 40000);
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: prompt }),
        signal: controller.signal,
      });
      const answer = await readJson(response);
      setEntries((current) => current.map((entry, index) =>
        index === current.length - 1 ? { question: prompt, answer } : entry,
      ));
    } catch (cause) {
      const message = cause.name === "AbortError"
        ? "The service took too long to respond. No answer was confirmed. Please try again."
        : cause.message || "Could not connect to the legal information service. No answer was confirmed.";
      setEntries((current) => current.map((entry, index) =>
        index === current.length - 1 ? { question: prompt, error: message } : entry,
      ));
    } finally {
      window.clearTimeout(timeout);
      setSending(false);
      inputRef.current?.focus();
    }
  }

  function useSuggestion(prompt) {
    setQuestion(prompt);
    inputRef.current?.focus();
  }

  const suggestions = [
    "What can a legal citation help me verify?",
    "How do I check whether a source is current?",
    "Where can I find the source behind an answer?",
  ];
  const latestAnswer = [...entries].reverse().find((entry) => entry.answer)?.answer;

  return (
    <SiteLayout>
      <div className={`assistant-workspace${railCollapsed ? " rail-collapsed" : ""}${inspectorOpen ? "" : " inspector-hidden"}`}>
        <aside className="assistant-rail" aria-label="Assistant navigation">
          <div className="rail-brand"><Brand compact /><span>MRTLA</span></div>
          <button
            className="rail-new-chat"
            onClick={() => { setEntries([]); setQuestion(""); }}
            type="button"
          >
            <Plus size={16} /><span>New question</span>
          </button>
          <p className="rail-label">Explore</p>
          <nav className="rail-nav" aria-label="Workspace links">
            <NavLink to="/" end><Home size={17} /><span>Overview</span></NavLink>
            <NavLink to="/articles"><BookOpen size={17} /><span>Guides</span></NavLink>
            <NavLink to="/sources"><LibraryBig size={17} /><span>Legal sources</span></NavLink>
          </nav>
          <div className="rail-bottom">
           
            <span><strong>Evidence first</strong><small>Check every citation.</small></span>
          </div>
        </aside>

        <section className="assistant-stage">
          <div className="assistant-toolbar">
            <button
              className="toolbar-control rail-toggle"
              onClick={() => setRailCollapsed((collapsed) => !collapsed)}
              type="button"
              aria-label={railCollapsed ? "Expand navigation" : "Collapse navigation"}
              aria-expanded={!railCollapsed}
            >
              <Menu size={17} /><span>Workspace</span>
            </button>
            <span className="mode-indicator"><span /> Malawi legal sources</span>
            <button
              className="toolbar-control inspector-toggle"
              onClick={() => setInspectorOpen((open) => !open)}
              type="button"
              aria-label={inspectorOpen ? "Hide sources panel" : "Show sources panel"}
              aria-expanded={inspectorOpen}
            >
              <BookOpenReader size={16} /><span>Sources</span>
            </button>
          </div>

          <div className={`assistant-page${entries.length ? " has-conversation" : ""}`}>
            {!entries.length ? (
              <div className="assistant-welcome">
                <span className="assistant-mark"><Sparkles size={23} /></span>
                <p className="eyebrow">Malawi traffic law assistant</p>
                <h1>What would you like<br />to understand?</h1>
                <p>Ask a general question. I’ll look for supporting legal records and show you where to check the answer.</p>
              </div>
            ) : (
              <div className="conversation-list" ref={conversationRef} aria-live="polite">
                {entries.map((entry, index) => (
                  <div className="conversation-turn" key={`${index}-${entry.question}`}>
                    <div className="user-question"><span>You</span><p>{entry.question}</p></div>
                    <AnswerCard entry={entry} onFollowUp={useSuggestion} />
                  </div>
                ))}
              </div>
            )}

            <div className="assistant-composer-wrap">
              {!entries.length && <div className="suggestion-list" aria-label="Try asking">
                {suggestions.map((prompt) => <button key={prompt} onClick={() => useSuggestion(prompt)} type="button">{prompt}<ArrowRight size={14} /></button>)}
              </div>}
              <form className="assistant-composer" onSubmit={submitQuestion}>
                <label className="sr-only" htmlFor="assistant-question">Your question</label>
                <textarea
                  id="assistant-question"
                  maxLength={2000}
                  onChange={(event) => setQuestion(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      event.currentTarget.form.requestSubmit();
                    }
                  }}
                  placeholder="Ask a question about Malawi road traffic law…"
                  ref={inputRef}
                  rows={2}
                  value={question}
                />
                <div className="composer-bottom">
                  <span>General questions only. Don’t include personal or payment details.</span>
                  <button disabled={!question.trim() || sending} type="submit" aria-label="Send question">
                    {sending ? <LoaderCircle size={18} className="spin" /> : <ArrowUp size={19} />}
                  </button>
                </div>
              </form>
              <p className="assistant-disclaimer">AI can make mistakes. Not legal advice or an official decision. <Link to="/about">Learn about limitations</Link></p>
            </div>
          </div>
        </section>
        {inspectorOpen && <SourceInspector citations={latestAnswer?.citations || []} onClose={() => setInspectorOpen(false)} />}
      </div>
    </SiteLayout>
  );
}

function AboutPage() {
  return (
    <SiteLayout>
      <div className="content-page">
        <PageTitle
          eyebrow="About MRTLA Malawi"
          title="Useful information, with clear limits"
          description="This independent prototype helps people explore Malawi road traffic law using records supplied to its backend. It is not a government service."
        />
        <div className="about-grid">
          <article className="about-card"><span className="article-icon"><LibraryBig size={19} /></span><h2>Sources come first</h2><p>Answers depend on the legal records made available to the backend. Check citations and inspect the underlying source; a citation does not prove a rule applies to your circumstances.</p><Link to="/sources">Browse available records <ArrowRight size={15} /></Link></article>
          <article className="about-card"><span className="article-icon"><CircleHelp size={19} /></span><h2>Sometimes there isn’t enough</h2><p>If the source collection does not contain enough verified evidence, the assistant should say so instead of inventing a rule or penalty.</p><Link to="/articles">Read the practical guides <ArrowRight size={15} /></Link></article>
        </div>
        <section className="limitations-panel">
          <div><h2>What this service does not do</h2></div>
          <ul>
            <li>Give legal advice or make an official determination.</li>
            <li>Determine guilt, issue or cancel fines, or confirm that a fine is owed or paid.</li>
            <li>Process payments or access enforcement records.</li>
            <li>Guarantee that the available sources are complete or up to date.</li>
          </ul>
          <p>Do not enter personal identification, licence, notice, or payment details. Confirm important matters through an authorized official channel.</p>
        </section>
        <div className="editorial-note"><Info size={17} /><p>Reports about answers are not currently stored by the backend. If the interface does not explicitly confirm an action, assume it has not been submitted.</p></div>
      </div>
    </SiteLayout>
  );
}

function HowItWorksPage() {
  const steps = [
    ["Ask a general question", "Write a question without personal, licence, notice, or payment details."],
    ["Find available evidence", "The backend searches its configured legal records. Only records marked verified and current are eligible for answer generation."],
    ["Check the response", "When evidence is available, review the cited records. If evidence is insufficient, the assistant should say so rather than guess."],
  ];
  return (
    <SiteLayout>
      <div className="content-page">
        <PageTitle eyebrow="A transparent process" title="How it works" description="A simple path from a question to the available evidenceand a clear indication when the evidence isn’t there." />
        <ol className="process-steps">
          {steps.map(([title, description], index) => <li key={title}><span className="process-number">0{index + 1}</span><div><h2>{title}</h2><p>{description}</p></div><Check size={18} /></li>)}
        </ol>
        <section className="limitations-panel"><div><Info size={21} /><h2>Current prototype limitations</h2></div><p>The API returns supported or insufficient-evidence results. It does not currently detect conflicting or outdated sources, ask clarification questions, look up structured penalties, or find official next steps. Reports are not persisted.</p></section>
        <Link className="button button-primary" to="/assistant">Ask a question <ArrowRight size={16} /></Link>
      </div>
    </SiteLayout>
  );
}

function LegalDocumentPage({ documentKey }) {
  const document = legalDocuments[documentKey];

  return (
    <SiteLayout>
      <article className="content-page legal-document">
        <PageTitle
          eyebrow={document.eyebrow}
          title={document.title}
          description={document.description}
        />
        <p className="legal-date">Draft prepared {legalDraftDate}</p>
        <div className="legal-draft-notice" role="note">
          <Info size={17} />
          <p>
            Draft for review only. These materials are not legal advice or approved final terms.
            Replace all placeholders and have a Malawi-qualified legal professional review them
            against the deployed service before publication or reliance.
          </p>
        </div>
        {document.sections.map((section) => (
          <section className="legal-section" key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
        ))}
      </article>
    </SiteLayout>
  );
}

function NotFoundPage() {
  return (
    <SiteLayout>
      <div className="content-page not-found">
        <span className="not-found-icon"><CircleHelp size={26} /></span>
        <p className="eyebrow">Page not found</p>
        <h1>That page isn’t here.</h1>
        <p>Try the guides, legal sources, or ask the assistant a question.</p>
        <Link className="button button-primary" to="/">Back to overview <ArrowRight size={16} /></Link>
      </div>
    </SiteLayout>
  );
}

export default function App() {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      "/": "Malawi Road Traffic Law Assistant",
      "/articles": "Practical guides | MRTLA Malawi",
      "/sources": "Legal sources | MRTLA Malawi",
      "/assistant": "Ask the assistant | MRTLA Malawi",
      "/about": "About & limitations | MRTLA Malawi",
      "/how-it-works": "How it works | MRTLA Malawi",
    };
    const legalDocument = Object.values(legalDocuments).find((item) => item.path === location.pathname);
    document.title = titles[location.pathname] || (legalDocument
      ? `${legalDocument.title} | MRTLA Malawi`
      : "MRTLA Malawi");
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/articles" element={<ArticlesPage />} />
      <Route path="/articles/:slug" element={<ArticlePage />} />
      <Route path="/sources" element={<SourcesPage />} />
      <Route path="/assistant" element={<AssistantPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      {legalDocumentKeys.map((key) => (
        <Route
          key={key}
          path={legalDocuments[key].path}
          element={<LegalDocumentPage documentKey={key} />}
        />
      ))}
      <Route path="/Ask.html" element={<Navigate to="/assistant" replace />} />
      <Route path="/road.html" element={<Navigate to="/assistant" replace />} />
      <Route path="/legal-sources.html" element={<Navigate to="/sources" replace />} />
      <Route path="/how-it-works.html" element={<Navigate to="/how-it-works" replace />} />
      <Route path="/about.html" element={<Navigate to="/about" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
