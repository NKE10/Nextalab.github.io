import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown,
  ChevronRight, CircleHelp, Menu, Minus, Plus, Search, ShoppingBag, SlidersHorizontal,
  Sparkles, X, Zap
} from "lucide-react";

const TELEGRAM_USERNAME = import.meta.env.VITE_TELEGRAM_USERNAME || "YOUR_TELEGRAM_USERNAME";

const PRODUCTS = [
  {
    id: "f75-max", name: "AULA F75 Max", maker: "AULA", category: "keyboards",
    type: "75% mechanical keyboard", price: 59.99, badge: "Popular choice",
    description: "A feature-rich 75% board with a clean layout, satisfying sound and a comfortable everyday footprint.",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1100&q=88",
    tone: "sage", specs: [["Layout", "75%"], ["Connection", "Tri-mode"], ["Use", "Gaming + daily work"]]
  },
  {
    id: "s75-pro", name: "AULA S75 Pro", maker: "AULA", category: "keyboards",
    type: "75% mechanical keyboard", price: 49.99, badge: "Desk favourite",
    description: "A compact mechanical keyboard with a balanced layout for gaming, study and everyday typing.",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1100&q=88",
    tone: "sand", specs: [["Layout", "75%"], ["Connection", "Wired / wireless"], ["Use", "Gaming + daily work"]]
  },
  {
    id: "win60-he", name: "AULA Win60 HE", maker: "AULA", category: "keyboards",
    type: "60% Hall Effect keyboard", price: 25, badge: "Hall Effect",
    description: "A compact Hall Effect board built for fast, precise inputs and a minimal desk setup.",
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1100&q=88",
    tone: "blue", specs: [["Layout", "60%"], ["Switches", "Magnetic Hall Effect"], ["Polling", "Up to 8,000 Hz"]]
  },
  {
    id: "mad60-he", name: "MCHOSE MAD60 HE", maker: "MCHOSE", category: "keyboards",
    type: "60% Hall Effect keyboard", price: 30, badge: "Competitive",
    description: "A compact magnetic-switch keyboard for players who want adjustable actuation and a focused layout.",
    image: "https://images.unsplash.com/photo-1595044426077-d36d9236d54a?auto=format&fit=crop&w=1100&q=88",
    tone: "graphite", specs: [["Layout", "60%"], ["Switches", "Hall Effect"], ["Use", "Competitive gaming"]]
  },
  {
    id: "sc620", name: "AULA SC620", maker: "AULA", category: "mice",
    type: "Wireless gaming mouse", price: 18.99, badge: "Lightweight pick",
    description: "A practical wireless mouse for a tidy setup, responsive play and comfortable daily use.",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1100&q=88",
    tone: "sand", specs: [["Connection", "Wireless"], ["Category", "Gaming mouse"], ["Use", "Everyday + gaming"]]
  },
  {
    id: "coiled-cable", name: "Coiled USB-C Cable", maker: "NEXTA LAB PICKS", category: "desk",
    type: "Keyboard cable", price: 9, badge: "Setup detail",
    description: "A coiled cable that adds a considered finishing touch to a custom keyboard setup.",
    image: "https://images.unsplash.com/photo-1612444530582-fc66183b16f4?auto=format&fit=crop&w=1100&q=88",
    tone: "pink", specs: [["Connector", "USB-C"], ["Style", "Coiled"], ["Use", "Mechanical keyboards"]]
  },
  {
    id: "desk-mat", name: "Extended Desk Mat", maker: "NEXTA LAB PICKS", category: "desk",
    type: "Desk accessory", price: 8, badge: "Everyday essential",
    description: "A generous surface for your keyboard and mouse, bringing the whole desk together.",
    image: "https://images.unsplash.com/photo-1615750185825-fc7b4a2f6b72?auto=format&fit=crop&w=1100&q=88",
    tone: "sage", specs: [["Category", "Desk mat"], ["Use", "Desk protection"], ["Style", "Extended"]]
  },
  {
    id: "monitor-light", name: "Monitor Light Bar", maker: "NEXTA LAB PICKS", category: "desk",
    type: "Desk lighting", price: 9.99, badge: "Desk upgrade",
    description: "A simple lighting upgrade that keeps your desk clear and your workspace comfortable.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1100&q=88",
    tone: "blue", specs: [["Category", "Monitor light"], ["Placement", "Monitor top"], ["Use", "Workspace lighting"]]
  }
];

const FILTERS = [
  { id: "all", label: "All gear" },
  { id: "keyboards", label: "Keyboards" },
  { id: "mice", label: "Mice" },
  { id: "desk", label: "Desk accessories" }
];

const BUILD_OPTIONS = [
  { id: "board", title: "Keyboard", hint: "Choose your foundation", choices: [
    { id: "win60", label: "AULA Win60 HE", price: 25 },
    { id: "mad60", label: "MCHOSE MAD60 HE", price: 30 },
    { id: "f75", label: "AULA F75 Max", price: 59.99 }
  ]},
  { id: "case", title: "Case", hint: "Give it a personal finish", choices: [
    { id: "stock", label: "Original case", price: 0 },
    { id: "clear", label: "Clear acrylic case", price: 4 },
    { id: "carbon", label: "Carbon-style case", price: 10 }
  ]},
  { id: "keycaps", title: "Keycaps", hint: "Pick a look", choices: [
    { id: "stockcaps", label: "Original keycaps", price: 0 },
    { id: "clearcaps", label: "Clear keycap set", price: 5 },
    { id: "accentcaps", label: "Accent 21-key set", price: 3 }
  ]},
  { id: "cable", title: "Cable", hint: "Finish the setup", choices: [
    { id: "none", label: "No extra cable", price: 0 },
    { id: "blackcable", label: "Black coiled cable", price: 9 },
    { id: "whitecable", label: "White coiled cable", price: 9 }
  ]}
];

const money = value => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

function telegramLink(message) {
  const text = encodeURIComponent(message);
  const username = TELEGRAM_USERNAME.trim().replace(/^@/, "");
  return username && username !== "YOUR_TELEGRAM_USERNAME"
    ? `https://t.me/${username}?text=${text}`
    : `https://t.me/share/url?url=${encodeURIComponent("NEXTA LAB")}&text=${text}`;
}

function Brand({ onClick }) {
  return <button className="brand" onClick={onClick} aria-label="NEXTA LAB home">
    <span className="brand-mark">N<span>X</span></span>
    <span className="brand-word">NEXTA <b>LAB</b></span>
  </button>;
}

function ProductArtwork({ product, large = false }) {
  return <div className={`product-artwork tone-${product.tone || "sage"} ${large ? "artwork-large" : ""}`}>
    <div className="artwork-meta"><span>{product.maker}</span><span>NL / 0{PRODUCTS.indexOf(product) + 1}</span></div>
    <img src={product.image} alt={product.name} loading="lazy" />
    <span className="artwork-index">NEXTA LAB · SELECTED GEAR</span>
  </div>;
}

function ProductCard({ product, onOpen, onAdd }) {
  return <article className="product-card">
    <button className="product-image" onClick={() => onOpen(product)} aria-label={`View ${product.name}`}>
      <ProductArtwork product={product} />
      <span className="product-tag">{product.badge}</span>
      <span className="image-open"><ArrowUpRight size={17} /></span>
    </button>
    <div className="product-meta"><span>{product.maker}</span><span>{product.type}</span></div>
    <div className="product-card-title"><button onClick={() => onOpen(product)}>{product.name}</button><strong>{money(product.price)}</strong></div>
    <div className="product-card-foot"><span>Pre-order · Cambodia</span><button onClick={() => onAdd(product)} aria-label={`Add ${product.name} to cart`}><Plus size={16} /></button></div>
  </article>;
}

function Header({ page, setPage, cartCount, onCart }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const go = next => { setPage(next); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return <>
    <div className="announcement"><span className="announcement-dot" /> CURATED GAMING GEAR · PRE-ORDER IN CAMBODIA <span className="announcement-right">EST. 2026</span></div>
    <header className="header">
      <Brand onClick={() => go("home")} />
      <nav className={menuOpen ? "nav nav-open" : "nav"}>
        <button className={page === "home" ? "nav-active" : ""} onClick={() => go("home")}>Home</button>
        <button className={page === "shop" ? "nav-active" : ""} onClick={() => go("shop")}>Shop</button>
        <button className={page === "builder" ? "nav-active" : ""} onClick={() => go("builder")}>Custom build</button>
        <button className={page === "about" ? "nav-active" : ""} onClick={() => go("about")}>Our story</button>
      </nav>
      <div className="header-actions">
        <button className="cart-trigger" onClick={onCart}><ShoppingBag size={17} /><span>Bag</span><i>{cartCount}</i></button>
        <button className="mobile-menu" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
      </div>
    </header>
  </>;
}

function Hero({ setPage }) {
  return <section className="hero">
    <div className="hero-copy">
      <p className="eyebrow"><span className="eyebrow-line" /> GEAR FOR YOUR NEXT LEVEL</p>
      <h1>Make your<br />setup <em>yours.</em></h1>
      <p className="hero-description">Thoughtful gaming accessories. Better details, useful features, and prices that make sense. Selected for the way you play and create.</p>
      <div className="hero-actions">
        <button className="button button-dark" onClick={() => setPage("shop")}>Explore the collection <ArrowUpRight size={16} /></button>
        <button className="button button-quiet" onClick={() => setPage("builder")}>Build a keyboard <ArrowRight size={15} /></button>
      </div>
      <div className="hero-footnote"><span>01 / CURATED GEAR</span><span>02 / PRE-ORDER SERVICE</span><span>03 / CAMBODIA</span></div>
    </div>
    <div className="hero-stage">
      <div className="stage-top"><span>THE DESK EDITION</span><span>PHNOM PENH / 2026</span></div>
      <div className="hero-photo"><img src="https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1500&q=90" alt="Mechanical keyboard and clean desk setup" /></div>
      <div className="hero-caption"><span className="caption-number">N° 001</span><div><strong>Small details.</strong><br /><span>Noticeable difference.</span></div><ArrowDownRight size={23} /></div>
      <span className="stage-vertical">NEXTA LAB / HARDWARE SELECTION</span>
    </div>
  </section>;
}

function SectionHeading({ kicker, title, note, action }) {
  return <div className="section-heading">
    <div><p className="eyebrow">{kicker}</p><h2>{title}</h2></div>
    <div className="section-heading-right">{note && <p>{note}</p>}{action}</div>
  </div>;
}

function Home({ setPage, onOpen, onAdd }) {
  return <>
    <Hero setPage={setPage} />
    <div className="proof-strip"><span>01</span><p>GOOD GEAR, <b>NO GUESSWORK.</b></p><span className="proof-line" /><p>SELECTED FOR EVERYDAY PLAY.</p><span>CAMBODIA · EST. 2026</span></div>
    <section className="section featured-section">
      <SectionHeading kicker="THE CURRENT SELECTION" title={<>A few good <em>upgrades.</em></>} note="A focused edit of keyboards, mice and desk essentials." action={<button className="text-link" onClick={() => setPage("shop")}>View all products <ArrowUpRight size={15} /></button>} />
      <div className="product-grid home-grid">{PRODUCTS.slice(0, 4).map(product => <ProductCard key={product.id} product={product} onOpen={onOpen} onAdd={onAdd} />)}</div>
    </section>
    <section className="builder-banner">
      <div className="builder-banner-copy"><p className="eyebrow">MAKE IT YOURS / 001</p><h2>Your keyboard.<br /><em>Your combination.</em></h2><p>Choose a board, case, keycaps and cable. See your build come together with a clear estimated total.</p><button className="button button-light" onClick={() => setPage("builder")}>Open the custom builder <ArrowUpRight size={16} /></button></div>
      <div className="builder-banner-visual"><div className="builder-label"><span>CONFIGURATION 001</span><span>PERSONALISE</span></div><div className="key-grid">{Array.from({ length: 35 }, (_, i) => <span key={i} className={i % 7 === 0 || i % 9 === 0 ? "key-accent" : ""} />)}</div><div className="builder-visual-bottom"><span>60% / 75% LAYOUTS</span><span>DESIGNED BY YOU ↗</span></div></div>
    </section>
    <section className="section values-section">
      <SectionHeading kicker="THE NEXTA LAB STANDARD" title={<>Less noise. <em>More purpose.</em></>} note="We keep the selection focused so choosing your next upgrade feels simple." />
      <div className="values-grid">
        <div><span className="value-number">01</span><Zap size={19} /><h3>Useful by design</h3><p>We focus on practical features and gear that earns its place on your desk.</p></div>
        <div><span className="value-number">02</span><Sparkles size={19} /><h3>Considered selection</h3><p>A focused range of accessories, with options for different setups and budgets.</p></div>
        <div><span className="value-number">03</span><CircleHelp size={19} /><h3>Direct support</h3><p>Ask about compatibility, pricing and availability before you place an order.</p></div>
      </div>
    </section>
    <Footer setPage={setPage} />
  </>;
}

function Shop({ onOpen, onAdd }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const visible = useMemo(() => {
    let list = PRODUCTS.filter(p => (filter === "all" || p.category === filter) && (p.name + " " + p.maker + " " + p.type).toLowerCase().includes(query.toLowerCase()));
    if (sort === "low") list = [...list].sort((a,b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a,b) => b.price - a.price);
    if (sort === "az") list = [...list].sort((a,b) => a.name.localeCompare(b.name));
    return list;
  }, [filter, query, sort]);
  return <>
    <main className="page section">
      <div className="page-intro"><p className="eyebrow">THE COLLECTION / 2026</p><h1>Find your next<br /><em>favourite.</em></h1><p>Keyboards, mice and desk accessories selected for your setup. Browse the edit and ask us about availability.</p></div>
      <div className="shop-toolbar">
        <div className="filter-tabs">{FILTERS.map(f => <button key={f.id} className={filter === f.id ? "filter-active" : ""} onClick={() => setFilter(f.id)}>{f.label}</button>)}</div>
        <div className="shop-tools"><label className="search-box"><Search size={15} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search gear..." /></label><label className="sort-box"><SlidersHorizontal size={14} /><select value={sort} onChange={e => setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="az">Name: A to Z</option></select><ChevronDown size={13} /></label></div>
      </div>
      <div className="results-count"><span>{visible.length} ITEMS</span><span>USD · PRE-ORDER</span></div>
      {visible.length ? <div className="product-grid shop-grid">{visible.map(p => <ProductCard key={p.id} product={p} onOpen={onOpen} onAdd={onAdd} />)}</div> : <div className="no-results"><Search size={22} /><h3>No gear found</h3><p>Try another search or category.</p><button className="text-link" onClick={() => {setFilter("all");setQuery("");}}>Clear filters <ArrowRight size={14} /></button></div>}
    </main>
    <Footer />
  </>;
}

function Builder({ onAddBuild }) {
  const [selection, setSelection] = useState({ board: "win60", case: "stock", keycaps: "stockcaps", cable: "none" });
  const selected = BUILD_OPTIONS.map(group => ({ group, choice: group.choices.find(c => c.id === selection[group.id]) }));
  const total = selected.reduce((sum, item) => sum + item.choice.price, 0);
  const board = selected[0].choice.label;
  const update = (group, choice) => setSelection(prev => ({ ...prev, [group]: choice }));
  return <main className="page section">
    <div className="page-intro"><p className="eyebrow">CUSTOM KEYBOARD / CONFIGURATOR</p><h1>Build your<br /><em>own combination.</em></h1><p>Start with a board, choose the details, and get an estimated total. We'll confirm exact options and availability with you.</p></div>
    <div className="builder-layout">
      <div className="builder-options">{BUILD_OPTIONS.map((group, index) => <section className="option-group" key={group.id}>
        <div className="option-heading"><span>0{index + 1}</span><div><h3>{group.title}</h3><p>{group.hint}</p></div></div>
        <div className="option-choices">{group.choices.map(choice => <button key={choice.id} className={selection[group.id] === choice.id ? "option-choice option-selected" : "option-choice"} onClick={() => update(group.id, choice.id)}><span className="choice-radio">{selection[group.id] === choice.id && <Check size={12} />}</span><span>{choice.label}</span><b>{choice.price ? `+${money(choice.price)}` : "Included"}</b></button>)}</div>
      </section>)}</div>
      <aside className="build-summary">
        <div className="summary-top"><span>YOUR CONFIGURATION</span><span>NL / CUSTOM</span></div>
        <div className="summary-preview"><div className="summary-keys">{Array.from({length: 30}, (_,i)=><span key={i} className={i%6===0 || i%11===0 ? "key-accent" : ""} />)}</div></div>
        <p className="eyebrow">BUILD SUMMARY</p><h2>{board}</h2><p className="summary-muted">Your selected combination</p>
        <div className="summary-list">{selected.map(({group,choice})=><div key={group.id}><span>{group.title}</span><b>{choice.label}</b></div>)}</div>
        <div className="summary-total"><span>ESTIMATED TOTAL</span><strong>{money(total)}</strong></div>
        <button className="button button-dark summary-button" onClick={() => onAddBuild({ id: "custom-build", name: `Custom build — ${board}`, price: total, selection: selected.map(x => `${x.group.title}: ${x.choice.label}`).join(" · ") })}>Add build to bag <ArrowUpRight size={15} /></button>
        <p className="summary-disclaimer">Estimate only. Final price, compatibility and availability are confirmed before ordering.</p>
      </aside>
    </div>
    <Footer />
  </main>;
}

function About({ setPage }) {
  return <>
    <main className="page section about-page">
      <div className="page-intro"><p className="eyebrow">A LITTLE ABOUT US</p><h1>Good gear.<br /><em>Good decisions.</em></h1><p>NEXTA LAB is a Cambodia-focused gaming accessories store built around a simple idea: a better setup should feel within reach.</p></div>
      <div className="about-story"><div className="about-big">NX<span>.</span></div><div><p className="eyebrow">OUR APPROACH</p><h2>We care about what<br />goes on your desk.</h2><p>From compact mechanical keyboards to the small accessories that bring a setup together, we look for useful features, considered design and fair value.</p><p>We operate on a pre-order basis for selected products. That lets us keep the range flexible and talk through the details with you before you commit.</p><button className="button button-dark" onClick={() => setPage("shop")}>Explore the collection <ArrowUpRight size={15} /></button></div></div>
      <div className="about-facts"><div><span>01 / FOCUS</span><b>Gaming accessories</b></div><div><span>02 / SERVICE</span><b>Direct, personal support</b></div><div><span>03 / BASE</span><b>Cambodia</b></div></div>
    </main>
    <Footer setPage={setPage} />
  </>;
}

function Footer({ setPage }) {
  return <footer className="footer"><div className="footer-main"><div><Brand onClick={() => {setPage?.("home");window.scrollTo({top:0,behavior:"smooth"});}} /><p>Thoughtful gear for your next level.</p></div><div><span className="footer-label">EXPLORE</span><button onClick={() => setPage?.("shop")}>Shop all gear</button><button onClick={() => setPage?.("builder")}>Custom keyboard</button><button onClick={() => setPage?.("about")}>Our story</button></div><div><span className="footer-label">GET IN TOUCH</span><a href={telegramLink("Hi NEXTA LAB! I'd like to ask about your products.")} target="_blank" rel="noreferrer">Telegram <ArrowUpRight size={13} /></a><span className="footer-small">Cambodia · USD pricing</span></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} NEXTA LAB</span><span>MADE FOR YOUR SETUP.</span><span>PRICES SUBJECT TO CONFIRMATION</span></div></footer>;
}

function ProductModal({ product, onClose, onAdd }) {
  const [variant, setVariant] = useState("Black");
  if (!product) return null;
  return <div className="overlay" onMouseDown={e => {if(e.target === e.currentTarget) onClose();}}>
    <section className="product-modal" role="dialog" aria-modal="true" aria-label={product.name}>
      <button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
      <div className="modal-art"><ProductArtwork product={product} large /></div>
      <div className="modal-info"><p className="eyebrow">{product.maker} / PRODUCT DETAILS</p><h2>{product.name}</h2><span className="modal-price">{money(product.price)}</span><p className="modal-description">{product.description}</p>
        <div className="spec-list">{product.specs.map(([label,value])=><div key={label}><span>{label}</span><b>{value}</b></div>)}</div>
        <div className="variant-select"><span>COLOUR PREFERENCE</span><div>{["Black","White","Other / Ask"].map(v=><button key={v} className={variant===v?"variant-active":""} onClick={()=>setVariant(v)}>{v}</button>)}</div></div>
        <button className="button button-dark modal-add" onClick={() => {onAdd(product, variant);onClose();}}>Add to bag <Plus size={15} /></button>
        <small className="modal-note">Pre-order item. We'll confirm colour, stock and final details with you.</small>
      </div>
    </section>
  </div>;
}

function CartDrawer({ open, items, onClose, onQty, onRemove, onCheckout }) {
  if (!open) return null;
  const total = items.reduce((sum,item)=>sum+item.price*item.qty,0);
  return <div className="drawer-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
    <aside className="cart-drawer" aria-label="Shopping bag">
      <div className="drawer-header"><div><p className="eyebrow">YOUR SELECTION</p><h2>Shopping bag <span>({items.reduce((s,i)=>s+i.qty,0)})</span></h2></div><button className="icon-button" onClick={onClose} aria-label="Close bag"><X /></button></div>
      {items.length ? <><div className="cart-list">{items.map(item=><div className="cart-row" key={item.key}><div className="cart-thumb"><ShoppingBag size={19}/></div><div className="cart-row-info"><b>{item.name}</b><small>{item.variant || item.selection || "Pre-order"}</small><div className="qty-control"><button onClick={()=>onQty(item.key,-1)} aria-label="Decrease quantity"><Minus size={12}/></button><span>{item.qty}</span><button onClick={()=>onQty(item.key,1)} aria-label="Increase quantity"><Plus size={12}/></button><button className="remove-link" onClick={()=>onRemove(item.key)}>Remove</button></div></div><strong>{money(item.price*item.qty)}</strong></div>)}</div><div className="drawer-bottom"><div className="drawer-total"><span>Estimated subtotal</span><b>{money(total)}</b></div><p>Delivery and final availability are confirmed separately.</p><button className="button button-dark checkout-button" onClick={onCheckout}>Continue to order request <ArrowUpRight size={15}/></button><button className="drawer-continue" onClick={onClose}>Continue browsing</button></div></> : <div className="empty-bag"><ShoppingBag size={28}/><h3>Your bag is taking a break.</h3><p>Add something good to your setup.</p><button className="button button-dark" onClick={onClose}>Keep exploring <ArrowRight size={15}/></button></div>}
    </aside>
  </div>;
}

function Checkout({ items, onBack }) {
  const [name,setName] = useState("");
  const [contact,setContact] = useState("");
  const [notes,setNotes] = useState("");
  const [submitted,setSubmitted] = useState(false);
  const total = items.reduce((sum,item)=>sum+item.price*item.qty,0);
  const message = [
    "Hi NEXTA LAB! I'd like to request an order.",
    `Name: ${name}`,
    `Contact: ${contact}`,
    ...items.map(i=>`- ${i.name} x${i.qty} — ${money(i.price*i.qty)} (${i.variant||i.selection||"Pre-order"})`),
    `Estimated subtotal: ${money(total)}`,
    `Notes: ${notes || "None"}`,
    "Please confirm availability, delivery and final pricing."
  ].join("\n");
  const link = telegramLink(message);
  return <main className="page section checkout-page">
    <button className="back-link" onClick={onBack}><ArrowLeft size={14}/> Back to bag</button>
    <div className="page-intro checkout-intro"><p className="eyebrow">ORDER REQUEST / NOT A PAYMENT</p><h1>Almost <em>yours.</em></h1><p>Send us your selection and contact details. We'll confirm availability, delivery and the final price with you.</p></div>
    <div className="checkout-layout"><form className="order-form" onSubmit={e=>{e.preventDefault();setSubmitted(true);window.open(link,"_blank","noopener,noreferrer");}}>
      <label>Your name<input required value={name} onChange={e=>setName(e.target.value)} placeholder="Name" /></label>
      <label>Telegram or phone number<input required value={contact} onChange={e=>setContact(e.target.value)} placeholder="How can we reach you?" /></label>
      <label>Anything else? <span className="optional">(optional)</span><textarea rows="4" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Colour preference, delivery area, questions..." /></label>
      <div className="notice"><b>This is an order request, not a payment.</b><p>Nothing is charged here. Telegram opens with your order details so you can review and send the request.</p></div>
      <button className="button button-dark" type="submit" disabled={!items.length}>Send order request <ArrowUpRight size={15}/></button>
      {submitted && <p className="sent-note"><Check size={14}/> Telegram opened. Send the prepared message to complete your request.</p>}
    </form><aside className="order-summary"><p className="eyebrow">YOUR ORDER</p>{items.map(i=><div className="order-summary-line" key={i.key}><div><b>{i.name}</b><span>{i.qty} × {money(i.price)}</span></div><strong>{money(i.price*i.qty)}</strong></div>)}<div className="order-summary-total"><span>Estimated subtotal</span><b>{money(total)}</b></div><small>Delivery and final pricing will be confirmed by NEXTA LAB.</small></aside></div>
  </main>;
}

export default function App() {
  const [page,setPage] = useState("home");
  const [cart,setCart] = useState(() => { try { return JSON.parse(localStorage.getItem("nextalab-cart") || "[]"); } catch { return []; } });
  const [cartOpen,setCartOpen] = useState(false);
  const [activeProduct,setActiveProduct] = useState(null);
  const [toast,setToast] = useState("");
  useEffect(()=>{localStorage.setItem("nextalab-cart",JSON.stringify(cart));},[cart]);
  useEffect(()=>{document.body.style.overflow = cartOpen || activeProduct ? "hidden" : "";return ()=>{document.body.style.overflow="";};},[cartOpen,activeProduct]);
  useEffect(()=>{if(!toast)return;const id=window.setTimeout(()=>setToast(""),2200);return()=>window.clearTimeout(id);},[toast]);
  const addItem = (product,variant="") => {
    const key = product.id + (variant ? "-" + variant : "");
    setCart(prev=>{const found=prev.find(i=>i.key===key);return found?prev.map(i=>i.key===key?{...i,qty:i.qty+1}:i):[...prev,{key,id:product.id,name:product.name,price:product.price,variant,qty:1}];});
    setToast(`${product.name} added to your bag`);
  };
  const addBuild = build => {
    const key = `build-${Date.now()}`;
    setCart(prev=>[...prev,{key,id:build.id,name:build.name,price:build.price,selection:build.selection,qty:1}]);
    setToast("Custom build added to your bag");
    setCartOpen(true);
  };
  const changeQty = (key,delta) => setCart(prev=>prev.map(i=>i.key===key?{...i,qty:i.qty+delta}:i).filter(i=>i.qty>0));
  const removeItem = key => setCart(prev=>prev.filter(i=>i.key!==key));
  const cartCount = cart.reduce((sum,i)=>sum+i.qty,0);
  const goCheckout = () => {setCartOpen(false);setPage("checkout");window.scrollTo({top:0,behavior:"smooth"});};
  return <div className="app-shell">
    <Header page={page} setPage={setPage} cartCount={cartCount} onCart={()=>setCartOpen(true)} />
    {page==="home" && <Home setPage={setPage} onOpen={setActiveProduct} onAdd={addItem}/>}
    {page==="shop" && <Shop onOpen={setActiveProduct} onAdd={addItem}/>}
    {page==="builder" && <Builder onAddBuild={addBuild}/>}
    {page==="about" && <About setPage={setPage}/>}
    {page==="checkout" && <Checkout items={cart} onBack={()=>{setCartOpen(true);setPage("home");}}/>}
    {page==="checkout" && <Footer setPage={setPage}/>}
    <ProductModal product={activeProduct} onClose={()=>setActiveProduct(null)} onAdd={addItem}/>
    <CartDrawer open={cartOpen} items={cart} onClose={()=>setCartOpen(false)} onQty={changeQty} onRemove={removeItem} onCheckout={goCheckout}/>
    {toast && <div className="toast" role="status"><Check size={14}/>{toast}</div>}
  </div>;
}