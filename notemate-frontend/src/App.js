import React, {useEffect,useMemo,useState} from 'react';
import axios from 'axios';
const seed=[
['Project Ideas for Q1','Potential Projects:\nMobile App Redesign\nImprove user onboarding flow\nAdd dark mode support\nPerformance optimization\nAPI Integration...','Ideas','Work',true],
["Weekly Grocery List","This Week's Shopping:\nMilk (2% or whole)\nEggs (dozen)\nBread (whole grain)\nChicken breast (2 lbs)\nSalmon fillets...",'Shopping','',true],
['Gym Workout Plan','Weekly Schedule:\nMonday – Upper Body\nBench press: 3x8\nRows: 3x10\nShoulder press: 3x8','Health','Personal',true],
['Morning Routine Ideas','Current Routine:\nWake up at 6:30 AM\n10-minute meditation\nLight stretching\nHealthy breakfast\nReview daily goals...','Health','Personal',true],
["Mom's Chocolate Chip Cookie Recipe",'Ingredients:\n2¼ cups all-purpose flour\n1 tsp baking soda\n1 tsp salt\n1 cup butter, softened','Recipes','Personal'],
['Budget Planning – January','Monthly Budget Breakdown:\nIncome: $4,500\nSalary: $4,200\nFreelance: $300\nExpenses: Rent $1,200...','Finance','Personal'],
['Weekend Trip to Portland','Travel Plans – February 15–17\nHotel: The Benson (booked)\nCheck-in: 3 PM Friday\nCheck-out: 11 AM Sunday','Travel','Personal'],
['Book Recommendations','Currently Reading:\nThe Seven Husbands of Evelyn Hugo\nWant to Read:\nProject Hail Mary\nAtomic Habits...','Ideas','Personal'],
['App Feature Ideas','Keyboard shortcuts\nOffline mode\nBulk archive\nExport notes as Markdown','Work','Ideas'],
['Quick Pasta Carbonara','Pasta, eggs, parmesan, black pepper and pancetta.','Recipes','Personal'],
['Weekend Goals',"Finish the API tutorial\nOrganize notes\nPlan next week's priorities",'Personal','Ideas'],
['Meeting Notes – Team Standup','API endpoints reviewed\nDatabase migration planned\nAdd test coverage and document the service','Work','Ideas']
].map((n,i)=>({id:i+1,title:n[0],content:n[1],category:n[2],extra:n[3],pinned:!!n[4],date:'Jan 11, 2026'}));
const colors={Personal:'green',Work:'blue',Ideas:'purple',Finance:'teal',Health:'pink',Shopping:'orange',Travel:'teal',Recipes:'red',Learning:'purple'};
export default function App(){
 const [notes,setNotes]=useState([]);
 const [view,setView]=useState('all'),[tag,setTag]=useState(''),[query,setQuery]=useState(''),[modal,setModal]=useState(false),[editing,setEditing]=useState(null);
 const [title,setTitle]=useState(''),[content,setContent]=useState(''),[category,setCategory]=useState('Personal'),[toast,setToast]=useState(''),[mobile,setMobile]=useState(false),[list,setList]=useState(false),[selectMode,setSelectMode]=useState(false),[selected,setSelected]=useState([]);
 const [summaries, setSummaries] = useState({});
 const [loadingSummary, setLoadingSummary] = useState(null);
useEffect(() => {
  axios.get('/notes')
    .then(response => {
      const dbNotes = response.data.map(note => ({
        id: note.id,
        title: note.title,
        content: note.content,
        category: note.tag,
        extra: '',
        pinned: note.is_pinned,
        date: 'Saved in database',
        archived: false,
        trashed: false
      }));

      setNotes(dbNotes);
    })
    .catch(error => {
      console.error('Notes load nahi hue:', error);
      setToast('Backend se notes load nahi hue');
    });
}, []);
 useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),2000);return()=>clearTimeout(t)},[toast]);
 const tags=[...new Set(notes.filter(n=>!n.trashed).map(n=>n.category).filter(Boolean))].sort();
 const visible=useMemo(()=>{let a=notes.filter(n=>view==='archive'?n.archived&&!n.trashed:view==='trash'?n.trashed:!n.archived&&!n.trashed);if(tag)a=a.filter(n=>n.category===tag||n.extra===tag);if(query.trim()){const q=query.toLowerCase();a=a.filter(n=>(n.title+' '+n.content+' '+n.category).toLowerCase().includes(q))}return a},[notes,view,tag,query]);
 const pinned=view==='all'?visible.filter(n=>n.pinned):[],rest=visible.filter(n=>!pinned.some(p=>p.id===n.id));
 function edit(n=null){setEditing(n);setTitle(n?.title||'');setContent(n?.content||'');setCategory(n?.category||'Personal');setModal(true)}

async function save(e) {
  e.preventDefault();

  const data = {
    title: title.trim(),
    content: content.trim(),
    tag: category,
    is_pinned: editing ? editing.pinned : false
  };

  try {
    if (editing) {
      const response = await axios.put(
        `/notes/${editing.id}`,
        data
      );
      const note = response.data;

      setNotes(previous =>
        previous.map(n =>
          n.id === editing.id
            ? {
                ...n,
                title: note.title,
                content: note.content,
                category: note.tag,
                pinned: note.is_pinned
              }
            : n
        )
      );

      setToast('Note updated successfully');
    } else {
      const response = await axios.post('/notes', data);
      const note = response.data;

      setNotes(previous => [
        {
          id: note.id,
          title: note.title,
          content: note.content,
          category: note.tag,
          extra: '',
          pinned: note.is_pinned,
          date: 'Saved in database',
          archived: false,
          trashed: false
        },
        ...previous
      ]);

      setToast('Note created successfully');
    }

    setModal(false);
    setTag('');
    setView('all');
  } catch (error) {
    console.error('Save error:', error.response?.data || error.message);
    setToast('Save failed! Check console');
  }
}

 function pin(id){setNotes(a=>a.map(n=>n.id===id?{...n,pinned:!n.pinned}:n))}
 async function summarizeNote(noteId) {
  setLoadingSummary(noteId);

  try {
    const response = await axios.post(
      `http://localhost:8000/notes/${noteId}/summarize`
    );

    setSummaries(previous => ({
      ...previous,
      [noteId]: response.data.summary
    }));
  } catch (error) {
    console.error(error);
    setToast("Summary not generated");
  } finally {
    setLoadingSummary(null);
  }
}
 function act(id,action){setNotes(a=>action==='delete'?a.filter(n=>n.id!==id):a.map(n=>n.id===id?{...n,archived:action==='archive'?true:false,trashed:action==='trash'?true:false,pinned:false}:n));setToast(action==='archive'?'Note archived':action==='trash'?'Moved to trash':action==='restore'?'Note restored':'Note deleted')}
 function chip(t){return t&&<span className={'chip '+(colors[t]||'')} key={t}>{t}</span>}
 function card(n){return <article className={'note-card '+(list?'list-card':'')} key={n.id} onClick={()=>selectMode?setSelected(s=>s.includes(n.id)?s.filter(i=>i!==n.id):[...s,n.id]):edit(n)}>
 {view==='all'&&<button className={'pin '+(n.pinned?'pinned':'')} title="Pin note" onClick={e=>{e.stopPropagation();pin(n.id)}}>{n.pinned?'📌':'⌁'}</button>}
<h3>{n.title}</h3>
<p className="preview">{n.content}</p>

{summaries[n.id] && (
  <div>
    <strong>✨ AI Summary</strong>
    <p>{summaries[n.id]}</p>
  </div>
)}<div className="card-bottom"><div className="chips">{[n.extra,n.category].filter(Boolean).map(chip)}</div><div className="date">{n.date||'Today'}</div>
 <div className="actions"><button
  onClick={e => {
    e.stopPropagation();
    summarizeNote(n.id);
  }}
  disabled={loadingSummary === n.id}
>
  {loadingSummary === n.id ? "Summarizing..." : "✨ Summarize with AI"}
</button>{selectMode&&<button onClick={e=>{e.stopPropagation();setSelected(s=>s.includes(n.id)?s.filter(i=>i!==n.id):[...s,n.id])}}>{selected.includes(n.id)?'✓ Selected':'Select'}</button>}
 {view==='all'&&<button onClick={e=>{e.stopPropagation();act(n.id,'archive')}}>Archive</button>}
 {view!=='trash'&&<button onClick={e=>{e.stopPropagation();act(n.id,'trash')}}>Trash</button>}
 {view!=='all'&&<button onClick={e=>{e.stopPropagation();act(n.id,'restore')}}>Restore</button>}
 {view==='trash'&&<button onClick={e=>{e.stopPropagation();act(n.id,'delete')}}>Delete forever</button>}</div></div></article>}
 function section(name,items){return items.length>0&&<><div className="section-heading"><span>{name} ({items.length})</span></div><div className={'notes-grid '+(list?'list-grid':'')}>{items.map(card)}</div></>}
 return <div className="app-shell"><aside className={'sidebar '+(mobile?'mobile-open':'')}><div className="brand"><span className="brand-icon">▤</span>NoteMate<button className="collapse" onClick={()=>setMobile(false)}>‹</button></div>
 <button className="new-note" onClick={()=>edit()}>＋ &nbsp; New Note</button><nav className="nav">{[['all','▤','All Notes'],['archive','▣','Archive'],['trash','♜','Trash']].map(([k,i,l])=><button key={k} className={view===k?'active':''} onClick={()=>{setView(k);setTag('');setMobile(false)}}><span>{i}</span>{l}</button>)}</nav>
 <div className="tag-heading">♧ &nbsp; TAGS</div>{tags.map(t=><button key={t} className={'tag-row '+(tag===t?'tag-active':'')} onClick={()=>{setTag(tag===t?'':t);setView('all')}}><span className={'hash '+(colors[t]||'')}>＃</span>{t}<small>{notes.filter(n=>n.category===t&&!n.trashed&&!n.archived).length}</small></button>)}
 <div className="side-bottom"><small>local demo · saved in this browser</small><button onClick={()=>setToast('Settings will be added later')}>⚙ &nbsp; Settings</button><button onClick={()=>setToast('NoteMate frontend demo')}>⇥ &nbsp; About</button></div></aside>
 <main className="main"><header className="topbar"><button className="mobile-menu" onClick={()=>setMobile(!mobile)}>☰</button><div className="search">⌕<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search notes..."/><kbd>⌘ K</kbd></div></header>
 <section className="content"><div className="toolbar"><button onClick={()=>setList(!list)}>☷ &nbsp; View: {list?'List':'Grid'}</button><button onClick={()=>{setSelectMode(!selectMode);setSelected([])}}>{selectMode?'✓ Done':'⊙ Select'}</button>
 {selectMode&&selected.length>0&&<><button onClick={()=>{setNotes(a=>a.map(n=>selected.includes(n.id)?{...n,archived:true,pinned:false}:n));setSelected([]);setSelectMode(false);setToast('Selected notes archived')}}>Archive selected ({selected.length})</button><button onClick={()=>{setNotes(a=>a.map(n=>selected.includes(n.id)?{...n,trashed:true,pinned:false}:n));setSelected([]);setSelectMode(false)}}>Trash selected</button></>}</div>
 {section('PINNED',pinned)}{section(view==='archive'?'ARCHIVE':view==='trash'?'TRASH':tag?tag.toUpperCase():'ALL NOTES',rest)}
 {visible.length===0&&<div className="empty"><h3>No notes found</h3><p>Try another search or create a new note.</p><button className="primary" onClick={()=>edit()}>＋ New Note</button></div>}</section></main>
 {modal&&<div className="backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setModal(false)}}><form className="modal" onSubmit={save}><div className="modal-head"><h2>{editing?'Edit note':'Create a note'}</h2><button type="button" onClick={()=>setModal(false)}>×</button></div>
 <label>Title<input required maxLength="140" value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. FastAPI learning plan"/></label><label>Content<textarea required value={content} onChange={e=>setContent(e.target.value)} placeholder="Write your thoughts here..."/></label>
 <label>Tag<select value={category} onChange={e=>setCategory(e.target.value)}>{['Personal','Work','Ideas','Learning','Finance','Health','Shopping','Travel','Recipes'].map(t=><option key={t}>{t}</option>)}</select></label>
 <div className="modal-actions"><button type="button" className="cancel" onClick={()=>setModal(false)}>Cancel</button><button className="primary">Save note</button></div></form></div>}
 {toast&&<div className="toast">{toast}</div>}</div>
}