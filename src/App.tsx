import { useEffect, useMemo, useState } from 'react'
import { BookOpen, Search, Heart, Home, Settings, ChevronLeft, ChevronRight, Share2, Type, Moon, Sun, Upload, ListMusic, Info, X, Bookmark } from 'lucide-react'
import { hymns as sampleHymns } from './data'
import type { Hymn } from './data'

type Tab = 'home' | 'catalog' | 'favorites' | 'settings'
const read = <T,>(key:string, fallback:T):T => { try { const v=localStorage.getItem(key); return v ? JSON.parse(v) as T : fallback } catch { return fallback } }

export default function App() {
  const [catalog,setCatalog] = useState<Hymn[]>(() => read('cc-catalog', sampleHymns))
  const [tab,setTab] = useState<Tab>('home')
  const [query,setQuery] = useState('')
  const [selected,setSelected] = useState<string | null>(null)
  const [favorites,setFavorites] = useState<string[]>(() => read('cc-favorites', []))
  const [recent,setRecent] = useState<string[]>(() => read('cc-recent', []))
  const [fontSize,setFontSize] = useState(() => read('cc-font', 19))
  const [dark,setDark] = useState(() => read('cc-dark', false))
  const [showImport,setShowImport] = useState(false)
  const [notice,setNotice] = useState('')

  useEffect(()=>{ localStorage.setItem('cc-catalog',JSON.stringify(catalog)) },[catalog])
  useEffect(()=>{ localStorage.setItem('cc-favorites',JSON.stringify(favorites)) },[favorites])
  useEffect(()=>{ localStorage.setItem('cc-recent',JSON.stringify(recent)) },[recent])
  useEffect(()=>{ localStorage.setItem('cc-font',JSON.stringify(fontSize)) },[fontSize])
  useEffect(()=>{ localStorage.setItem('cc-dark',JSON.stringify(dark)) },[dark])

  const active = catalog.find(h=>h.id===selected) || null
  const filtered = useMemo(()=>catalog.filter(h => `${h.number} ${h.title} ${h.theme} ${h.verses.join(' ')}`.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>a.number-b.number),[catalog,query])
  const openHymn = (id:string) => { setSelected(id); setRecent(prev=>[id,...prev.filter(x=>x!==id)].slice(0,12)); setTab('catalog') }
  const toggleFavorite = (id:string) => setFavorites(prev=>prev.includes(id)?prev.filter(x=>x!==id):[id,...prev])
  const ordered = catalog.slice().sort((a,b)=>a.number-b.number)
  const move = (delta:number) => { if(!active)return; const i=ordered.findIndex(h=>h.id===active.id); const next=ordered[i+delta]; if(next)openHymn(next.id) }
  const share = async () => {
    if(!active)return
    const content = `${active.number} — ${active.title}\n\n${active.verses.join('\n\n')}${active.chorus?'\n\nRefrão:\n'+active.chorus:''}\n\nCantor Cristão Digital`
    try { if(navigator.share) await navigator.share({title:active.title,text:content}); else { await navigator.clipboard.writeText(content); setNotice('Texto copiado para a área de transferência.') } } catch { setNotice('Não foi possível compartilhar neste dispositivo.') }
  }
  const importFile = async (file?:File) => {
    if(!file)return
    try {
      const raw = await file.text()
      const data = JSON.parse(raw) as Hymn[]
      if(!Array.isArray(data) || !data.every(h=>h.id && Number.isFinite(h.number) && h.title && Array.isArray(h.verses))) throw new Error('Formato inválido')
      if(data.some(h=>!['public-domain-verified','licensed'].includes(h.licenseStatus))) throw new Error('Cada hino importado precisa estar marcado como domínio público verificado ou licenciado.')
      setCatalog(prev=>[...prev.filter(h=>!data.some(n=>n.id===h.id)),...data].sort((a,b)=>a.number-b.number))
      setNotice(`${data.length} hino(s) importado(s).`)
      setShowImport(false)
    } catch(e) { setNotice(e instanceof Error?e.message:'Não foi possível importar o arquivo.') }
  }

  return <div className={dark?'app dark':'app'}>
    <header className="topbar">
      <div className="brand" onClick={()=>{setTab('home');setSelected(null)}}><div className="brand-mark"><BookOpen size={22}/></div><div><strong>Cantor Cristão</strong><small>HINÁRIO DIGITAL</small></div></div>
      <button className="icon-btn desktop-only" aria-label="Alternar tema" onClick={()=>setDark(!dark)}>{dark?<Sun/>:<Moon/>}</button>
    </header>

    <main className="main">
      {active ? <section className="reader">
        <button className="back-link" onClick={()=>setSelected(null)}><ChevronLeft size={17}/> Voltar ao catálogo</button>
        <div className="reader-head"><div><span className="eyebrow">HINO {String(active.number).padStart(3,'0')}</span><h1>{active.title}</h1><p className="muted">{active.theme} · {active.author}</p></div><button className={`round-action ${favorites.includes(active.id)?'is-fav':''}`} onClick={()=>toggleFavorite(active.id)} aria-label="Favoritar"><Heart fill={favorites.includes(active.id)?'currentColor':'none'}/></button></div>
        {active.sample&&<div className="sample-note"><Info size={16}/> Texto original demonstrativo, não pertencente ao hinário oficial.</div>}
        <article className="lyrics" style={{fontSize}}>{active.verses.map((v,i)=><div className="verse" key={i}><span className="verse-number">{i+1}</span><p>{v}</p></div>)}{active.chorus&&<div className="chorus"><b>Refrão</b><p>{active.chorus}</p></div>}</article>
        <div className="reader-tools"><button className="secondary" onClick={()=>setFontSize(Math.max(15,fontSize-1))}><Type size={16}/> A−</button><button className="secondary" onClick={()=>setFontSize(Math.min(30,fontSize+1))}>A+</button><button className="secondary" onClick={share}><Share2 size={16}/> Compartilhar</button></div>
        <div className="prev-next"><button className="secondary" onClick={()=>move(-1)}><ChevronLeft/> Anterior</button><button className="secondary" onClick={()=>move(1)}>Próximo <ChevronRight/></button></div>
      </section> : <>
        {tab==='home'&&<section className="hero">
          <div className="hero-copy"><span className="eyebrow">MÚSICA, MEMÓRIA E FÉ</span><h1>Encontre inspiração<br/><em>em cada hino.</em></h1><p>Seu hinário digital para ler, pesquisar e guardar canções que acompanham a caminhada de fé.</p>
          <button className="primary" onClick={()=>setTab('catalog')}><BookOpen size={18}/> Explorar hinário</button></div>
          <div className="hero-art"><div className="sun-disc"/><BookOpen size={94} strokeWidth={1}/><span>CC</span></div>
        </section>}
        <section className="search-wrap"><div className="search-box"><Search size={20}/><input value={query} onChange={e=>{setQuery(e.target.value);if(tab==='home')setTab('catalog')}} placeholder="Buscar por número, título ou palavra..." /><kbd>⌕</kbd></div></section>
        {tab==='home'&&<section className="content-section"><div className="section-heading"><div><span className="eyebrow">RETOME SUA LEITURA</span><h2>Acessados recentemente</h2></div><button className="text-button" onClick={()=>setTab('catalog')}>Ver catálogo <ChevronRight size={16}/></button></div>
          {recent.length? <div className="hymn-list">{recent.map(id=>catalog.find(h=>h.id===id)).filter(Boolean).map(h=><HymnRow key={h!.id} hymn={h!} onClick={()=>openHymn(h!.id)} favorite={favorites.includes(h!.id)} onFavorite={()=>toggleFavorite(h!.id)}/>)}</div>:<div className="empty"><Bookmark size={25}/><p>Os hinos que você abrir aparecerão aqui.</p></div>}
          <div className="feature-grid"><button onClick={()=>setTab('catalog')}><ListMusic/><b>Catálogo</b><span>Explore os hinos</span></button><button onClick={()=>setTab('favorites')}><Heart/><b>Favoritos</b><span>Suas seleções</span></button><button onClick={()=>setTab('settings')}><Settings/><b>Preferências</b><span>Personalize a leitura</span></button></div>
        </section>}
        {tab==='catalog'&&<section className="content-section"><div className="section-heading"><div><span className="eyebrow">COLEÇÃO</span><h2>Catálogo de hinos</h2><p className="muted">{filtered.length} resultado(s)</p></div></div>{filtered.length?<div className="hymn-list">{filtered.map(h=><HymnRow key={h.id} hymn={h} onClick={()=>openHymn(h.id)} favorite={favorites.includes(h.id)} onFavorite={()=>toggleFavorite(h.id)}/>)}</div>:<div className="empty"><Search/><p>Nenhum hino encontrado para “{query}”.</p></div>}</section>}
        {tab==='favorites'&&<section className="content-section"><div className="section-heading"><div><span className="eyebrow">SUA COLEÇÃO PESSOAL</span><h2>Hinos favoritos</h2></div></div>{favorites.length?<div className="hymn-list">{favorites.map(id=>catalog.find(h=>h.id===id)).filter(Boolean).map(h=><HymnRow key={h!.id} hymn={h!} onClick={()=>openHymn(h!.id)} favorite onFavorite={()=>toggleFavorite(h!.id)}/>)}</div>:<div className="empty"><Heart/><p>Toque no coração de um hino para salvá-lo aqui.</p></div>}</section>}
        {tab==='settings'&&<section className="content-section settings"><div className="section-heading"><div><span className="eyebrow">PERSONALIZAÇÃO</span><h2>Ajustes</h2></div></div>
          <div className="setting-row"><div><b>Aparência</b><small>Escolha o tema de leitura</small></div><button className="secondary" onClick={()=>setDark(!dark)}>{dark?<Sun size={17}/>:<Moon size={17}/>} {dark?'Claro':'Escuro'}</button></div>
          <div className="setting-row"><div><b>Tamanho do texto</b><small>Prévia: {fontSize}px</small></div><div className="inline-tools"><button className="secondary" onClick={()=>setFontSize(Math.max(15,fontSize-1))}>A−</button><button className="secondary" onClick={()=>setFontSize(Math.min(30,fontSize+1))}>A+</button></div></div>
          <div className="setting-row"><div><b>Importar catálogo autorizado</b><small>Arquivo JSON com metadados de licença.</small></div><button className="primary small" onClick={()=>setShowImport(true)}><Upload size={16}/> Importar</button></div>
          <div className="legal-card"><Info/><div><b>Sobre conteúdo e direitos autorais</b><p>Esta versão contém somente textos demonstrativos originais. O catálogo integral do Cantor Cristão só deve ser adicionado a partir de fontes de domínio público verificadas, conteúdo licenciado ou autorização dos titulares. Não copiamos letras ou código do site de referência.</p></div></div>
          <div className="about"><b>Cantor Cristão Digital</b><span>Versão 1.0.0 · PWA com suporte offline</span></div>
        </section>}
      </>}
    </main>

    {!active&&<nav className="bottom-nav">
      <NavButton active={tab==='home'} icon={<Home/>} label="Início" onClick={()=>setTab('home')}/>
      <NavButton active={tab==='catalog'} icon={<BookOpen/>} label="Hinário" onClick={()=>setTab('catalog')}/>
      <NavButton active={tab==='favorites'} icon={<Heart/>} label="Favoritos" onClick={()=>setTab('favorites')}/>
      <NavButton active={tab==='settings'} icon={<Settings/>} label="Ajustes" onClick={()=>setTab('settings')}/>
    </nav>}
    {showImport&&<div className="modal-backdrop" onClick={()=>setShowImport(false)}><div className="modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setShowImport(false)}><X/></button><span className="eyebrow">IMPORTAÇÃO</span><h2>Adicionar hinos autorizados</h2><p>Selecione um JSON. Cada registro deve conter id, number, title, verses e licenseStatus com valor <code>licensed</code> ou <code>public-domain-verified</code>.</p><input type="file" accept=".json,application/json" onChange={e=>importFile(e.target.files?.[0])}/><p className="muted tiny">A importação ocorre localmente neste dispositivo.</p></div></div>}
    {notice&&<div className="toast" onClick={()=>setNotice('')}>{notice}</div>}
    <footer className="footer">Cantor Cristão Digital <span>·</span> Conteúdo demonstrativo</footer>
  </div>
}

function HymnRow({hymn,onClick,favorite,onFavorite}:{hymn:Hymn;onClick:()=>void;favorite:boolean;onFavorite:()=>void}) {
  return <div className="hymn-row"><button className="hymn-open" onClick={onClick}><span className="hymn-num">{String(hymn.number).padStart(3,'0')}</span><span className="hymn-meta"><b>{hymn.title}</b><small>{hymn.theme} {hymn.sample?'· Amostra':''}</small></span><ChevronRight size={18}/></button><button className={`favorite-mini ${favorite?'is-fav':''}`} onClick={onFavorite} aria-label="Favoritar"><Heart size={18} fill={favorite?'currentColor':'none'}/></button></div>
}
function NavButton({active,icon,label,onClick}:{active:boolean;icon:React.ReactNode;label:string;onClick:()=>void}) {
  return <button className={active?'nav-item active':'nav-item'} onClick={onClick}>{icon}<span>{label}</span></button>
}