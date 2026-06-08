import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// BACKGROUND IMAGES — your 5 photos
// To use YOUR actual photos: upload to imgur.com → right-click → copy image address → paste here
// ─────────────────────────────────────────────────────────────────────────────
const BG = {
  hero:      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=85", // mansion exterior
  living:    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=85", // lobby/living
  bedroom:   "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1920&q=85", // dark bedroom
  kitchen:   "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&q=85",   // kitchen
  bathroom:  "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1920&q=85",   // bathroom
};

// ─────────────────────────────────────────────────────────────────────────────
// REAL G2G LISTINGS DATA
// ─────────────────────────────────────────────────────────────────────────────
interface Listing {
  id: number;
  title: string;
  subtitle: string;
  location: string;
  postcode: string;
  price: string;
  period: string;
  type: "TO RENT" | "FOR SALE" | "SHORT TERM" | "INTERNATIONAL";
  beds: number;
  desc: string;
  features: string[];
  images: string[];
  bgKey: keyof typeof BG;
  verified: boolean;
  tag?: string;
}

const LISTINGS: Listing[] = [
  {
    id: 1,
    title: "2 Bedroom Apartment",
    subtitle: "Move straight in, live instantly",
    location: "Seven Sisters, London",
    postcode: "N15 5AX",
    price: "£2,400",
    period: "/ month",
    type: "TO RENT",
    beds: 2,
    desc: "Beautifully presented two-bedroom apartment in Seven Sisters. Modern, fully furnished living with everything you need. Thoughtfully designed with stylish interiors — perfect for professionals, sharers, or small families.",
    features: ["Fully Furnished", "Modern Interiors", "Close to Tube", "Bills Discussion Available", "Move In Ready"],
    images: [
      "https://g2gproperties.uk/wp-content/uploads/2026/03/0f4c87e0-6f54-4725-a84e-7c52398f9e81.jpeg",
      "https://g2gproperties.uk/wp-content/uploads/2026/03/b01e3d64-77f2-4f39-b27c-c1943ae14ea1.jpeg",
      "https://g2gproperties.uk/wp-content/uploads/2026/03/56f08a13-605c-47d8-b430-ed06b67b9bd4.jpeg",
    ],
    bgKey: "bedroom",
    verified: true,
    tag: "AVAILABLE NOW",
  },
  {
    id: 2,
    title: "2 Bedroom Penthouse",
    subtitle: "Luxurious and Special",
    location: "Canary Wharf, London",
    postcode: "E14",
    price: "£250",
    period: "/ night",
    type: "SHORT TERM",
    beds: 2,
    desc: "Stunning penthouse apartment in the heart of Canary Wharf. Floor-to-ceiling windows with panoramic city views. Luxury finishes throughout. Ideal for business travellers and short stays.",
    features: ["Penthouse Floor", "City Views", "Concierge", "Gym Access", "Parking Available"],
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
    ],
    bgKey: "living",
    verified: false,
    tag: "PREMIUM",
  },
  {
    id: 3,
    title: "2 Bedroom Apartment",
    subtitle: "Airy and Spectacular",
    location: "Royal Victoria Dock, London",
    postcode: "E16",
    price: "£180",
    period: "/ night",
    type: "SHORT TERM",
    beds: 2,
    desc: "Professionally decorated apartment overlooking Royal Victoria Dock. Bright, open-plan living space with high-spec kitchen. Moments from the DLR and Elizabeth Line.",
    features: ["Dock Views", "Open Plan", "High Spec Kitchen", "DLR Nearby", "Wi-Fi Included"],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80",
    ],
    bgKey: "living",
    verified: true,
  },
  {
    id: 4,
    title: "2 Bedroom Apartment",
    subtitle: "Professionally Decorated",
    location: "Royal Wharf, London",
    postcode: "E16",
    price: "£165",
    period: "/ night",
    type: "SHORT TERM",
    beds: 2,
    desc: "Elegantly furnished apartment within the prestigious Royal Wharf development. Private balcony, river views, and access to resort-style amenities including pool and gym.",
    features: ["River Views", "Private Balcony", "Pool & Gym", "24hr Security", "Concierge"],
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80",
    ],
    bgKey: "bedroom",
    verified: false,
    tag: "POPULAR",
  },
  {
    id: 5,
    title: "3 Bedroom House",
    subtitle: "Move In Ready",
    location: "Bishop's Stortford, Hertfordshire",
    postcode: "CM23",
    price: "£530,000",
    period: "",
    type: "FOR SALE",
    beds: 3,
    desc: "Impressive 3/4 bedroom family home in Bishop's Stortford. Features underfloor heating, modern kitchen, landscaped garden, and a double garage. Catchment area for outstanding schools.",
    features: ["Underfloor Heating", "Double Garage", "Landscaped Garden", "Outstanding Schools", "Chain Free"],
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
    ],
    bgKey: "hero",
    verified: true,
    tag: "CHAIN FREE",
  },
  {
    id: 6,
    title: "2 Bedroom Flat",
    subtitle: "Investment Opportunity",
    location: "Dagenham, London",
    postcode: "RM10",
    price: "£275,000",
    period: "",
    type: "FOR SALE",
    beds: 2,
    desc: "Well-presented two-bedroom flat in Dagenham — an ideal buy-to-let investment. Close to Dagenham East Underground station, local schools and amenities.",
    features: ["Buy-to-Let Ideal", "Underground Nearby", "Local Amenities", "Good Rental Yield", "EPC Rating C"],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    ],
    bgKey: "bedroom",
    verified: true,
  },
  {
    id: 7,
    title: "2 Bedroom Apartment",
    subtitle: "New Development",
    location: "Shepherd's Bush, London",
    postcode: "W12 7RQ",
    price: "£2,800",
    period: "/ month",
    type: "TO RENT",
    beds: 2,
    desc: "Brand new development apartment in sought-after W12. Contemporary design, integrated appliances, private terrace. Walking distance to Westfield shopping centre and excellent transport links.",
    features: ["Brand New Build", "Private Terrace", "Integrated Appliances", "Westfield Nearby", "Tube Zone 2"],
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80",
    ],
    bgKey: "kitchen",
    verified: true,
    tag: "NEW BUILD",
  },
  {
    id: 8,
    title: "2 Bedroom Garden Flat",
    subtitle: "Split Level with Private Garden",
    location: "Brixton / Oval, London",
    postcode: "SW9",
    price: "£2,200",
    period: "/ month",
    type: "TO RENT",
    beds: 2,
    desc: "Spacious two-bedroom split level garden flat. Two good-size double bedrooms, spacious reception and dining room, good kitchen and lovely bathroom. Private rear garden. Close to Oval and Brixton tube stations and Loughborough Junction mainline.",
    features: ["Private Garden", "Split Level", "2 Receptions", "Oval Tube Nearby", "Brixton Nearby"],
    images: [
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=800&q=80",
    ],
    bgKey: "living",
    verified: false,
  },
  {
    id: 9,
    title: "2 Bedroom Apartments",
    subtitle: "Newly Built Development",
    location: "Bodrum, Turkey",
    postcode: "International",
    price: "From €95,000",
    period: "",
    type: "INTERNATIONAL",
    beds: 2,
    desc: "Newly built luxury apartments in the prestigious resort town of Bodrum, Turkey. Stunning sea views, communal pool, and rooftop terrace. Ideal as a holiday home or investment property.",
    features: ["Sea Views", "Communal Pool", "Rooftop Terrace", "Rental Income Potential", "Managed Complex"],
    images: [
      "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&q=80",
      "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=800&q=80",
    ],
    bgKey: "bathroom",
    verified: false,
    tag: "OVERSEAS",
  },
  {
    id: 10,
    title: "The Minthis Residence",
    subtitle: "Contemporary and Timeless",
    location: "Cyprus",
    postcode: "International",
    price: "From £320,000",
    period: "",
    type: "INTERNATIONAL",
    beds: 3,
    desc: "The Minthis Residence — a collection of architecturally stunning villas and apartments set within a championship golf course in Cyprus. Golden visa eligible. G2G's exclusive investment opportunity.",
    features: ["Golf Course Views", "Golden Visa Eligible", "G2G Exclusive", "Managed Rentals", "5-Star Amenities"],
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    ],
    bgKey: "hero",
    verified: true,
    tag: "G2G EXCLUSIVE",
  },
];

const TYPES = ["ALL", "TO RENT", "FOR SALE", "SHORT TERM", "INTERNATIONAL"];

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL CSS
// ─────────────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #060606; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 2px; }
  ::-webkit-scrollbar-track { background: #060606; }
  ::-webkit-scrollbar-thumb { background: rgba(200,168,75,0.22); border-radius: 2px; }
  input, textarea, select, button { font-family: inherit; outline: none; }

  @keyframes fadeUp  { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
  @keyframes marquee { from { transform:translateX(0); } to { transform:translateX(-50%); } }
  @keyframes pulse   { 0%,100% { opacity:.2; } 50% { opacity:.6; } }
  @keyframes slideR  { from { transform:translateX(100%); } to { transform:translateX(0); } }
  @keyframes imgZoom { from { transform:scale(1); } to { transform:scale(1.06); } }

  .fu  { animation: fadeUp  0.7s ease both; }
  .fi  { animation: fadeIn  0.55s ease both; }

  .btn-gold {
    background: rgba(200,168,75,0.1); border: 1px solid rgba(200,168,75,0.38);
    color: #c8a84b; font-family: 'Montserrat',sans-serif; font-size: 9px;
    letter-spacing: 0.4em; padding: 14px 36px; cursor: pointer;
    transition: background .3s, border-color .3s; white-space: nowrap;
  }
  .btn-gold:hover   { background: rgba(200,168,75,0.2); border-color: rgba(200,168,75,0.65); }
  .btn-gold:disabled { opacity: .5; cursor: not-allowed; }

  .btn-ghost {
    background: transparent; border: 1px solid rgba(232,226,210,0.15);
    color: rgba(232,226,210,0.5); font-family: 'Montserrat',sans-serif;
    font-size: 9px; letter-spacing: 0.4em; padding: 14px 36px; cursor: pointer;
    transition: border-color .3s, color .3s; white-space: nowrap;
  }
  .btn-ghost:hover { border-color: rgba(232,226,210,0.4); color: #e8e2d2; }

  .nav-btn {
    font-family: 'Montserrat',sans-serif; font-size: 9px; letter-spacing: 0.34em;
    color: rgba(232,226,210,0.38); background: none; border: none;
    cursor: pointer; transition: color .3s; padding: 0;
  }
  .nav-btn:hover { color: #e8e2d2; }

  .type-pill {
    font-family: 'Montserrat',sans-serif; font-size: 8px; letter-spacing: 0.34em;
    padding: 9px 18px; cursor: pointer;
    border: 1px solid rgba(255,255,255,0.07); background: transparent;
    color: rgba(232,226,210,0.3); transition: all .25s;
  }
  .type-pill.on  { background: rgba(200,168,75,0.1); border-color: rgba(200,168,75,0.42); color: #c8a84b; }
  .type-pill:hover:not(.on) { border-color: rgba(255,255,255,0.14); color: rgba(232,226,210,0.58); }

  .field {
    width: 100%; background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.08); color: #e8e2d2;
    font-family: 'Montserrat',sans-serif; font-size: 11px; letter-spacing: 0.04em;
    padding: 13px 15px; transition: border-color .3s;
  }
  .field:focus { border-color: rgba(200,168,75,0.38); }
  .field.err   { border-color: rgba(220,80,80,0.5); }
  .field::placeholder { color: rgba(232,226,210,0.18); }

  .lcard { transition: background .35s; cursor: pointer; }
  .lcard:hover { background: rgba(255,255,255,0.038) !important; }
  .lcard:hover .lbar  { width: 100% !important; }
  .lcard:hover .ltitle { color: #fff !important; }
  .lcard:hover .limg  { transform: scale(1.05) !important; }

  .bg-layer {
    position: fixed; inset: 0; z-index: 0;
    background-size: cover; background-position: center;
    transition: opacity 1.2s cubic-bezier(0.4,0,0.2,1);
    will-change: opacity;
  }

  @media (max-width: 768px) {
    .hide-m   { display: none !important; }
    .col1     { grid-template-columns: 1fr !important; }
    .cpad     { padding: 72px 20px !important; }
    .spad     { padding: 0 20px !important; }
    .htitle   { font-size: clamp(36px,10vw,56px) !important; }
    .stitle   { font-size: clamp(22px,7vw,38px) !important; }
    .nav-i    { padding: 18px 20px !important; }
    .drawer   { width: 100vw !important; }
    .detail-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
    .stat-row { grid-template-columns: 1fr 1fr !important; }
  }
  @media (max-width: 480px) {
    .btn-gold, .btn-ghost { padding: 12px 22px; font-size: 8px; }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// BG MANAGER
// ─────────────────────────────────────────────────────────────────────────────
function BgManager({ activeKey }: { activeKey: keyof typeof BG }) {
  const [cur, setCur]   = useState<keyof typeof BG>(activeKey);
  const [nxt, setNxt]   = useState<keyof typeof BG | null>(null);
  const [fading, setFading] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>|null>(null);

  useEffect(() => {
    if (activeKey === cur) return;
    if (t.current) clearTimeout(t.current);
    setNxt(activeKey); setFading(true);
    t.current = setTimeout(() => { setCur(activeKey); setNxt(null); setFading(false); }, 1200);
    return () => { if (t.current) clearTimeout(t.current); };
  }, [activeKey]);

  const overlay = "linear-gradient(to bottom, rgba(6,6,6,0.65) 0%, rgba(6,6,6,0.38) 50%, rgba(6,6,6,0.75) 100%)";
  const base: React.CSSProperties = { position:"fixed", inset:0, zIndex:0, backgroundSize:"cover", backgroundPosition:"center", transition:"opacity 1.2s cubic-bezier(0.4,0,0.2,1)" };

  return (
    <>
      <div className="bg-layer" style={{ ...base, backgroundImage:`${overlay}, url(${BG[cur]})`, opacity: fading ? 0 : 1 }} />
      {nxt && <div className="bg-layer" style={{ ...base, backgroundImage:`${overlay}, url(${BG[nxt]})`, opacity: fading ? 1 : 0 }} />}
      <div style={{ position:"fixed", inset:0, zIndex:1, opacity:0.38, pointerEvents:"none",
        backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`
      }} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL BG TRACKER
// ─────────────────────────────────────────────────────────────────────────────
function useScrollBg(cb: (k: keyof typeof BG) => void) {
  useEffect(() => {
    const map = [
      { id:"s-hero",    key:"hero"     as keyof typeof BG },
      { id:"s-living",  key:"living"   as keyof typeof BG },
      { id:"s-bedroom", key:"bedroom"  as keyof typeof BG },
      { id:"s-kitchen", key:"kitchen"  as keyof typeof BG },
      { id:"s-bath",    key:"bathroom" as keyof typeof BG },
    ];
    const obs: IntersectionObserver[] = [];
    map.forEach(({ id, key }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const o = new IntersectionObserver(e => { if (e[0].isIntersecting) cb(key); }, { threshold: 0.2 });
      o.observe(el); obs.push(o);
    });
    return () => obs.forEach(o => o.disconnect());
  }, [cb]);
}

// ─────────────────────────────────────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────────────────────────────────────
type Page = "home" | "listing";

export default function App() {
  const [page, setPage]         = useState<Page>("home");
  const [selected, setSelected] = useState<Listing|null>(null);
  const [activeBg, setActiveBg] = useState<keyof typeof BG>("hero");
  const [activeType, setActiveType] = useState("ALL");
  const [entered, setEntered]   = useState(false);
  const [loaded, setLoaded]     = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [bookListing, setBookListing] = useState("");

  useEffect(() => { setTimeout(() => setLoaded(true), 380); }, []);
  const setBg = useCallback((k: keyof typeof BG) => setActiveBg(k), []);

  const openListing = (l: Listing) => {
    setSelected(l); setActiveBg(l.bgKey); setPage("listing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goHome = () => {
    setPage("home"); setActiveBg("hero"); setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const openBook = (title = "") => { setBookListing(title); setBookOpen(true); };

  const filtered = activeType === "ALL" ? LISTINGS : LISTINGS.filter(l => l.type === activeType);

  return (
    <div style={{ background:"#060606", minHeight:"100vh", color:"#e8e2d2", fontFamily:"'Georgia',serif", position:"relative" }}>
      <style>{CSS}</style>
      <BgManager activeKey={activeBg} />

      {/* INTRO */}
      {!entered && (
        <div style={{ position:"fixed", inset:0, zIndex:300, background:"#000", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", opacity:loaded?1:0, transition:"opacity .5s" }}>
          <div style={{ width:"1px", height:"50px", background:"linear-gradient(to bottom,transparent,rgba(200,168,75,.4))", marginBottom:"38px", animation:"pulse 2s infinite" }} />
          <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:"clamp(44px,12vw,100px)", letterSpacing:"0.28em", color:"#e8e2d2", opacity:loaded?1:0, transform:loaded?"translateY(0)":"translateY(18px)", transition:"all 1.2s ease .3s", lineHeight:1 }}>G2G</div>
            <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"clamp(8px,2vw,11px)", letterSpacing:"0.55em", color:"rgba(200,168,75,0.6)", marginTop:"8px", opacity:loaded?1:0, transition:"opacity 1s ease .7s" }}>PROPERTIES</div>
            <div style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"8px", letterSpacing:"0.48em", color:"rgba(200,168,75,0.28)", marginTop:"6px", marginBottom:"48px", opacity:loaded?1:0, transition:"opacity 1s ease .9s" }}>GOING THAT EXTRA MILE</div>
          </div>
          <button className="btn-gold" onClick={() => setEntered(true)} style={{ opacity:loaded?1:0, transition:"opacity 1s ease 1.2s, background .3s, border-color .3s" }}>ENTER</button>
          <div style={{
