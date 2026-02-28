const C = { blue:"#49A6DC", gold:"#FCB517", goldLight:"#FCD971", navy:"#162D49", black:"#0E0E0E", gray:"#BFBFBF", lightBlue:"#D1DAEA" };
const CATEGORIES = ["All","Arts & Crafts","Sports & Outdoor","Medical/First Aid","Office & Admin"];
const CAT_ICONS = {"Arts & Crafts":"🎨","Sports & Outdoor":"⚽","Medical/First Aid":"🩺","Office & Admin":"📋"};
const USERS = [
  {id:1,name:"Admin",email:"admin@marannook.org",password:"admin123"},
  {id:2,name:"Staff",email:"staff@marannook.org",password:"staff123"},
  {id:3,name:"Sid Baxter",email:"sid@marannook.org",password:"sidbaxter"}
];
const SEED = [
  {id:1,name:"Acrylic Paint Sets",category:"Arts & Crafts",qty:8,threshold:5,reorderAmt:20,unit:"sets",vendor:"Dick Blick",notes:"",image:null},
  {id:2,name:"Construction Paper",category:"Arts & Crafts",qty:3,threshold:10,reorderAmt:30,unit:"reams",vendor:"Amazon",notes:"Assorted colors",image:null},
  {id:3,name:"Paintbrushes",category:"Arts & Crafts",qty:45,threshold:20,reorderAmt:60,unit:"pcs",vendor:"Dick Blick",notes:"",image:null},
  {id:4,name:"Glue Sticks",category:"Arts & Crafts",qty:2,threshold:15,reorderAmt:50,unit:"pcs",vendor:"Amazon",notes:"",image:null},
  {id:5,name:"Soccer Balls",category:"Sports & Outdoor",qty:12,threshold:6,reorderAmt:12,unit:"balls",vendor:"BSN Sports",notes:"",image:null},
  {id:6,name:"Frisbees",category:"Sports & Outdoor",qty:20,threshold:8,reorderAmt:24,unit:"pcs",vendor:"BSN Sports",notes:"",image:null},
  {id:7,name:"Life Jackets (Child)",category:"Sports & Outdoor",qty:4,threshold:15,reorderAmt:10,unit:"pcs",vendor:"L.L. Bean",notes:"Sizes S-L",image:null},
  {id:8,name:"Band-Aids (Asst.)",category:"Medical/First Aid",qty:6,threshold:10,reorderAmt:20,unit:"boxes",vendor:"Medline",notes:"",image:null},
  {id:9,name:"Antiseptic Spray",category:"Medical/First Aid",qty:9,threshold:5,reorderAmt:15,unit:"bottles",vendor:"Medline",notes:"",image:null},
  {id:10,name:"Latex Gloves",category:"Medical/First Aid",qty:1,threshold:5,reorderAmt:10,unit:"boxes",vendor:"Medline",notes:"Nitrile preferred",image:null},
  {id:11,name:"Printer Paper",category:"Office & Admin",qty:18,threshold:5,reorderAmt:20,unit:"reams",vendor:"Staples",notes:"",image:null},
  {id:12,name:"Sharpies",category:"Office & Admin",qty:3,threshold:8,reorderAmt:24,unit:"packs",vendor:"Staples",notes:"",image:null},
];

function stockStatus(qty, threshold) {
  if (qty === 0) return "out";
  if (qty < threshold) return "low";
  return "ok";
}

function ModalForm({ mode, item, onSave, onClose }) {
  const blank = {id:null,name:"",category:"Arts & Crafts",qty:0,threshold:5,reorderAmt:10,unit:"pcs",vendor:"",notes:"",image:null};
  const [form, setForm] = React.useState(item ? {...item} : blank);
  const set = (k, v) => setForm(p => ({...p, [k]: v}));
  const fileRef = React.useRef();

  const handleImg = e => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = ev => set("image", ev.target.result);
    r.readAsDataURL(f);
  };

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{position:"fixed",inset:0,background:"rgba(22,45,73,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}}>
      <div style={{background:"white",borderRadius:20,padding:"36px 32px",width:520,maxWidth:"95vw",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 40px 100px rgba(0,0,0,0.3)"}}>
        <div style={{fontWeight:800,fontSize:24,color:C.navy,marginBottom:24}}>{mode==="add"?"ADD NEW ITEM":"EDIT ITEM"}</div>

        <div style={{marginBottom:16}}>
          <label style={{display:"block",fontSize:11,fontWeight:700,color:C.navy,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Photo</label>
          <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleImg} />
          <div onClick={() => fileRef.current.click()}
            style={{border:"2px dashed #e0e5ec",borderRadius:12,padding:form.image?8:24,textAlign:"center",cursor:"pointer",background:"#f8fafc"}}>
            {form.image
              ? <><img src={form.image} style={{width:"100%",maxHeight:160,objectFit:"contain",borderRadius:8,display:"block"}} />
                  <button onClick={e=>{e.stopPropagation();set("image",null)}} style={{marginTop:8,fontSize:11,color:"#e74c3c",background:"none",border:"none",cursor:"pointer",textDecoration:"underline"}}>Remove photo</button></>
              : <><div style={{fontSize:28,marginBottom:6}}>📷</div><div style={{fontSize:13,color:C.gray}}>Click to upload a photo</div></>}
          </div>
        </div>

        {[["Item Name","name","text","e.g. Acrylic Paint Sets"],["Unit","unit","text","pcs, boxes, reams…"],["Vendor","vendor","text","e.g. Amazon"]].map(([label,key,type,ph]) => (
          <div key={key} style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:C.navy,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{label}</label>
            <input type={type} value={form[key]} onChange={e=>set(key,e.target.value)} placeholder={ph}
              style={{width:"100%",padding:"10px 12px",border:"2px solid #e8ecf0",borderRadius:10,fontFamily:"inherit",fontSize:14,outline:"none",boxSizing:"border-box"}} />
          </div>
        ))}

        <div style={{marginBottom:16}}>
          <label style={{display:"block",fontSize:11,fontWeight:700,color:C.navy,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Category</label>
          <select value={form.category} onChange={e=>set("category",e.target.value)}
            style={{width:"100%",padding:"10px 12px",border:"2px solid #e8ecf0",borderRadius:10,fontFamily:"inherit",fontSize:14,outline:"none"}}>
            {CATEGORIES.filter(c=>c!=="All").map(c=><option key={c}>{c}</option>)}
          </select>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
          {[["Current Qty","qty"],["Threshold","threshold"],["Reorder Amt","reorderAmt"]].map(([label,key]) => (
            <div key={key}>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:C.navy,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{label}</label>
              <input type="number" min="0" value={form[key]} onChange={e=>set(key,parseInt(e.target.value)||0)}
                style={{width:"100%",padding:"10px 12px",border:"2px solid #e8ecf0",borderRadius:10,fontFamily:"inherit",fontSize:14,outline:"none",boxSizing:"border-box"}} />
            </div>
          ))}
        </div>

        <div style={{marginBottom:24}}>
          <label style={{display:"block",fontSize:11,fontWeight:700,color:C.navy,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Notes</label>
          <textarea value={form.notes} onChange={e=>set("notes",e.target.value)}
            style={{width:"100%",padding:"10px 12px",border:"2px solid #e8ecf0",borderRadius:10,fontFamily:"inherit",fontSize:14,outline:"none",resize:"vertical",minHeight:60,boxSizing:"border-box"}} />
        </div>

        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={{padding:"10px 20px",background:"#f0f3f7",color:"#666",border:"none",borderRadius:10,fontFamily:"inherit",fontSize:14,cursor:"pointer"}}>Cancel</button>
          <button onClick={()=>form.name.trim()&&onSave(form)}
            style={{padding:"10px 24px",background:C.navy,color:"white",border:"none",borderRadius:10,fontWeight:700,fontSize:14,cursor:"pointer"}}>
            {mode==="add"?"Add Item":"Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = React.useState(null);
  const [items, setItems] = React.useState(SEED);
  const [category, setCategory] = React.useState("All");
  const [search, setSearch] = React.useState("");
  const [modal, setModal] = React.useState(null);
  const [ordererEmail, setOrdererEmail] = React.useState("supplies@marannook.org");
  const [toast, setToast] = React.useState(null);
  const [loginForm, setLoginForm] = React.useState({email:"",password:""});
  const [loginError, setLoginError] = React.useState("");
  const [lightbox, setLightbox] = React.useState(null);
  const toastTimer = React.useRef(null);

  const showToast = (msg, icon="✅") => {
    setToast({msg,icon});
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  };

  const handleLogin = () => {
    const u = USERS.find(u => u.email===loginForm.email && u.password===loginForm.password);
    if (u) { setUser(u); setLoginError(""); }
    else setLoginError("Invalid email or password.");
  };

  const filtered = items.filter(i =>
    (category==="All" || i.category===category) &&
    (i.name.toLowerCase().includes(search.toLowerCase()) || i.vendor?.toLowerCase().includes(search.toLowerCase()))
  );

  const lowItems = items.filter(i => stockStatus(i.qty,i.threshold) !== "ok");

  const updateQty = (id, val) => {
    const newQty = Math.max(0, parseInt(val)||0);
    setItems(prev => prev.map(i => {
      if (i.id !== id) return i;
      const updated = {...i, qty:newQty};
      if (stockStatus(newQty,i.threshold) !== "ok" && stockStatus(i.qty,i.threshold) === "ok")
        showToast(`Low stock alert sent to ${ordererEmail} for "${i.name}"`, "📧");
      return updated;
    }));
  };

  const saveItem = data => {
    if (modal.mode==="add") { setItems(prev=>[...prev,{...data,id:Date.now()}]); showToast(`"${data.name}" added`); }
    else { setItems(prev=>prev.map(i=>i.id===data.id?data:i)); showToast(`"${data.name}" updated`); }
    setModal(null);
  };

  const deleteItem = id => {
    const item = items.find(i=>i.id===id);
    setItems(prev=>prev.filter(i=>i.id!==id));
    showToast(`"${item.name}" removed`,"🗑️");
  };

  const total=items.length, inStock=items.filter(i=>stockStatus(i.qty,i.threshold)==="ok").length,
    low=items.filter(i=>stockStatus(i.qty,i.threshold)==="low").length,
    out=items.filter(i=>stockStatus(i.qty,i.threshold)==="out").length;

  if (!user) return (
    <div style={{minHeight:"100vh",background:`linear-gradient(145deg,${C.navy},#1e3d5f,${C.navy})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"white",borderRadius:20,padding:"48px 40px",width:380,boxShadow:"0 32px 80px rgba(0,0,0,0.4)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:32}}>
          <div style={{width:48,height:48,background:C.blue,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:900,fontSize:26}}>M</div>
          <div>
            <div style={{fontWeight:800,fontSize:20,color:C.navy,letterSpacing:2}}>MARANNOOK</div>
            <div style={{fontSize:11,color:C.gray,letterSpacing:1}}>CAMP INVENTORY</div>
          </div>
        </div>
        <div style={{fontWeight:800,fontSize:26,color:C.navy,marginBottom:6}}>Welcome Back</div>
        <div style={{fontSize:13,color:C.gray,marginBottom:24}}>Sign in to manage camp supplies</div>
        {["email","password"].map(f => (
          <div key={f} style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:C.navy,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{f}</label>
            <input type={f} value={loginForm[f]} onChange={e=>setLoginForm(p=>({...p,[f]:e.target.value}))}
              onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder={f==="email"?"you@marannook.org":"••••••••"}
              style={{width:"100%",padding:"12px 14px",border:"2px solid #e8ecf0",borderRadius:10,fontFamily:"inherit",fontSize:14,outline:"none",boxSizing:"border-box"}} />
          </div>
        ))}
        <button onClick={handleLogin}
          style={{width:"100%",padding:14,background:C.navy,color:"white",border:"none",borderRadius:10,fontWeight:800,fontSize:16,letterSpacing:2,cursor:"pointer",marginTop:8}}>
          SIGN IN
        </button>
        {loginError && <div style={{color:"#e74c3c",fontSize:12,marginTop:10,textAlign:"center"}}>{loginError}</div>}
        <div style={{fontSize:11,color:C.gray,textAlign:"center",marginTop:16}}>Try admin@marannook.org / admin123</div>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"#f0f3f7",fontFamily:"inherit"}}>
      {/* Header */}
      <header style={{background:C.navy,padding:"0 32px",display:"flex",alignItems:"center",justifyContent:"space-between",height:64,position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 16px rgba(0,0,0,0.3)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:38,height:38,background:C.blue,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:900,fontSize:20}}>M</div>
          <div>
            <div style={{fontWeight:800,fontSize:16,color:"white",letterSpacing:3}}>MARANNOOK</div>
            <div style={{fontSize:10,color:C.lightBlue,letterSpacing:2}}>INVENTORY MANAGER</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.1)",padding:"6px 14px 6px 8px",borderRadius:100}}>
            <div style={{width:28,height:28,background:C.gold,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,color:C.navy}}>{user.name[0]}</div>
            <span style={{fontSize:13,color:"white"}}>{user.name}</span>
          </div>
          <button onClick={()=>setUser(null)} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.2)",color:"rgba(255,255,255,0.7)",padding:"6px 14px",borderRadius:8,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Sign Out</button>
        </div>
      </header>

      <div style={{padding:"28px 32px",maxWidth:1400,margin:"0 auto"}}>
        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:28}}>
          {[{label:"Total Items",num:total,icon:"📦",bg:C.lightBlue},{label:"In Stock",num:inStock,icon:"✅",bg:"#d4edda"},{label:"Low Stock",num:low,icon:"⚠️",bg:"#fff3cd"},{label:"Out of Stock",num:out,icon:"🚨",bg:"#feeaea"}].map(s=>(
            <div key={s.label} style={{background:"white",borderRadius:14,padding:"20px 24px",display:"flex",alignItems:"center",gap:16,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
              <div style={{width:44,height:44,borderRadius:12,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{s.icon}</div>
              <div>
                <div style={{fontWeight:800,fontSize:32,color:C.navy,lineHeight:1}}>{s.num}</div>
                <div style={{fontSize:11,color:C.gray,textTransform:"uppercase",letterSpacing:1}}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Orderer email */}
        <div style={{background:"white",borderRadius:12,padding:"14px 20px",display:"flex",alignItems:"center",gap:12,marginBottom:20,boxShadow:"0 2px 8px rgba(0,0,0,0.06)",flexWrap:"wrap"}}>
          <label style={{fontSize:12,fontWeight:700,color:C.navy,textTransform:"uppercase",letterSpacing:1,whiteSpace:"nowrap"}}>📧 Orderer Email</label>
          <input value={ordererEmail} onChange={e=>setOrdererEmail(e.target.value)} type="email"
            style={{flex:1,minWidth:200,padding:"8px 12px",border:"2px solid #e8ecf0",borderRadius:8,fontSize:13,fontFamily:"inherit",outline:"none"}} />
          <span style={{fontSize:12,color:C.gray}}>Low-stock alerts go here automatically</span>
        </div>

        {/* Alert banner */}
        {lowItems.length > 0 && (
          <div style={{background:"linear-gradient(135deg,#fff3cd,#fff8e1)",border:`2px solid ${C.gold}`,borderRadius:12,padding:"14px 20px",marginBottom:20,display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:20}}>⚠️</span>
            <span style={{fontSize:13,color:"#7d5a00",fontWeight:500}}>
              <strong style={{color:C.navy}}>{lowItems.length} item{lowItems.length>1?"s":""} need attention:</strong>{" "}
              {lowItems.map(i=>i.name).join(", ")}
            </span>
          </div>
        )}

        {/* Controls */}
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,flexWrap:"wrap"}}>
          <div style={{position:"relative",flex:1,minWidth:200}}>
            <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:C.gray}}>🔍</span>
            <input placeholder="Search items or vendors…" value={search} onChange={e=>setSearch(e.target.value)}
              style={{width:"100%",padding:"10px 16px 10px 40px",border:"2px solid #e8ecf0",borderRadius:10,fontFamily:"inherit",fontSize:14,outline:"none",background:"white",boxSizing:"border-box"}} />
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {CATEGORIES.map(c=>(
              <button key={c} onClick={()=>setCategory(c)}
                style={{padding:"8px 16px",borderRadius:100,fontSize:12,fontWeight:600,border:`2px solid ${category===c?C.navy:"transparent"}`,background:category===c?C.navy:"white",color:category===c?"white":"#666",cursor:"pointer",fontFamily:"inherit"}}>
                {c!=="All"&&CAT_ICONS[c]+" "}{c}
              </button>
            ))}
          </div>
          <button onClick={()=>setModal({mode:"add"})}
            style={{padding:"10px 20px",background:C.gold,color:C.navy,border:"none",borderRadius:10,fontWeight:700,fontSize:14,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit"}}>
            + Add Item
          </button>
        </div>

        {/* Table */}
        <div style={{background:"white",borderRadius:16,boxShadow:"0 2px 12px rgba(0,0,0,0.07)",overflow:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:800}}>
            <thead style={{background:C.navy}}>
              <tr>
                {["Item","Category","Quantity","Threshold","Reorder Qty","Vendor","Status","Actions"].map(h=>(
                  <th key={h} style={{padding:"14px 16px",textAlign:"left",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:C.lightBlue,whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length===0 && (
                <tr><td colSpan={8} style={{padding:60,textAlign:"center",color:C.gray,fontSize:14}}>🏕️ No items found</td></tr>
              )}
              {filtered.map(item => {
                const st = stockStatus(item.qty, item.threshold);
                return (
                  <tr key={item.id} style={{borderBottom:"1px solid #f0f3f7",background:st==="out"?"#fff5f5":st==="low"?"#fffbf0":"white"}}>
                    <td style={{padding:"14px 16px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        {item.image
                          ? <img src={item.image} onClick={()=>setLightbox(item)} style={{width:40,height:40,borderRadius:8,objectFit:"cover",border:"2px solid #e8ecf0",cursor:"zoom-in"}} />
                          : <div style={{width:40,height:40,borderRadius:8,background:"#f0f3f7",border:"2px dashed #e0e5ec",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>📷</div>
                        }
                        <div>
                          <div style={{fontWeight:600,color:C.navy}}>{item.name}</div>
                          {item.notes && <div style={{fontSize:11,color:C.gray}}>{item.notes}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{padding:"14px 16px"}}>
                      <span style={{background:C.lightBlue,color:C.navy,padding:"3px 10px",borderRadius:100,fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>
                        {CAT_ICONS[item.category]} {item.category}
                      </span>
                    </td>
                    <td style={{padding:"14px 16px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <input type="number" min="0" value={item.qty} onChange={e=>updateQty(item.id,e.target.value)}
                          style={{width:70,padding:"6px 10px",border:"2px solid #e8ecf0",borderRadius:8,fontSize:14,fontWeight:600,textAlign:"center",color:C.navy,outline:"none",fontFamily:"inherit"}} />
                        <span style={{fontSize:11,color:C.gray}}>{item.unit}</span>
                      </div>
                    </td>
                    <td style={{padding:"14px 16px",color:C.gray,fontSize:13}}>{item.threshold} {item.unit}</td>
                    <td style={{padding:"14px 16px",color:C.gray,fontSize:13}}>{item.reorderAmt} {item.unit}</td>
                    <td style={{padding:"14px 16px",fontSize:13}}>{item.vendor||"—"}</td>
                    <td style={{padding:"14px 16px"}}>
                      <span style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:12,fontWeight:700,textTransform:"uppercase",color:st==="ok"?"#27ae60":st==="low"?"#d4890a":"#e74c3c"}}>
                        <span style={{width:8,height:8,borderRadius:"50%",background:st==="ok"?"#27ae60":st==="low"?C.gold:"#e74c3c",display:"inline-block"}} />
                        {st==="ok"?"In Stock":st==="low"?"Low":"Out"}
                      </span>
                    </td>
                    <td style={{padding:"14px 16px"}}>
                      <div style={{display:"flex",gap:6}}>
                        <button onClick={()=>setModal({mode:"edit",item})} title="Edit" style={{width:32,height:32,borderRadius:8,border:"none",background:C.lightBlue,cursor:"pointer",fontSize:14}}>✏️</button>
                        <button onClick={()=>deleteItem(item.id)} title="Delete" style={{width:32,height:32,borderRadius:8,border:"none",background:"#feeaea",cursor:"pointer",fontSize:14}}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal && <ModalForm mode={modal.mode} item={modal.item} onSave={saveItem} onClose={()=>setModal(null)} />}

      {toast && (
        <div style={{position:"fixed",bottom:24,right:24,zIndex:999,background:C.navy,color:"white",padding:"14px 20px",borderRadius:12,fontSize:13,fontWeight:500,boxShadow:"0 8px 32px rgba(0,0,0,0.3)",display:"flex",alignItems:"center",gap:10}}>
          <span>{toast.icon}</span><span>{toast.msg}</span>
        </div>
      )}

      {lightbox && (
        <div onClick={()=>setLightbox(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,cursor:"pointer"}}>
          <img src={lightbox.image} style={{maxWidth:"90vw",maxHeight:"85vh",borderRadius:12}} />
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
