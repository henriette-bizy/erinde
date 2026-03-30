"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, saveAssessment } from "@/lib/storage";
import { analyzeRisk } from "@/lib/riskEngine";

const SYMPTOMS = [
  { id:"fever",                label:"Fever",                emoji:"🌡️", system:"General" },
  { id:"cough",                label:"Cough",                emoji:"😮‍💨", system:"Respiratory" },
  { id:"difficulty breathing", label:"Difficulty Breathing", emoji:"🫁",  system:"Respiratory" },
  { id:"sore throat",          label:"Sore Throat",          emoji:"🤒",  system:"Respiratory" },
  { id:"headache",             label:"Headache",             emoji:"🤕",  system:"Neurological" },
  { id:"dizziness",            label:"Dizziness",            emoji:"💫",  system:"Neurological" },
  { id:"vision problems",      label:"Vision Problems",      emoji:"👁️",  system:"Neurological" },
  { id:"fatigue",              label:"Fatigue / Weakness",   emoji:"😴",  system:"General" },
  { id:"body ache",            label:"Body Aches",           emoji:"🦴",  system:"General" },
  { id:"chest pain",           label:"Chest Pain",           emoji:"❤️",  system:"Emergency" },
  { id:"abdominal pain",       label:"Abdominal Pain",       emoji:"🫃",  system:"Digestive" },
  { id:"diarrhea",             label:"Diarrhea",             emoji:"💧",  system:"Digestive" },
  { id:"vomiting",             label:"Nausea / Vomiting",    emoji:"🤢",  system:"Digestive" },
  { id:"rash",                 label:"Skin Rash",            emoji:"🦠",  system:"Skin" },
  { id:"swollen limbs",        label:"Swollen Limbs",        emoji:"🦵",  system:"General" },
  { id:"severe bleeding",      label:"Severe Bleeding",      emoji:"🩸",  system:"Emergency" },
];

const STEPS = ["Symptoms","Details","Review"];

export default function AssessmentPage() {
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [severity, setSeverity] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.push("/auth/login"); return; }
    setUser(u);
  }, [router]);

  const toggle = (id: string) => setSelected(p => p.includes(id) ? p.filter(s=>s!==id) : [...p,id]);

  const submit = async () => {
    if (!user) return;
    setLoading(true);
    await new Promise(r=>setTimeout(r,900));
    const result = analyzeRisk({ symptoms:selected, severity, duration, age:user.age||"30" });
    const assessment = { id:`a_${Date.now()}`, userId:user.id, symptoms:selected, severity, duration, riskLevel:result.level, score:result.score, date:new Date().toISOString(), recommendations:result.recommendations };
    saveAssessment(assessment);
    router.push(`/results?id=${assessment.id}`);
  };

  if (!user) return null;
  const systems = [...new Set(SYMPTOMS.map(s=>s.system))];

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
      <nav className="nav">
        <Link href="/" className="logo">e<span>-RINDE</span></Link>
        <Link href="/dashboard" className="btn-ghost">← Dashboard</Link>
      </nav>

      <div style={{ maxWidth:680, margin:"0 auto", padding:"40px 24px" }}>
        {/* Progress bar */}
        <div style={{ marginBottom:36 }}>
          <div style={{ display:"flex", gap:0, marginBottom:10 }}>
            {STEPS.map((s,i)=>(
              <div key={s} style={{ flex:1, display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, background:i<=step?"var(--blue)":"var(--border)", color:i<=step?"white":"var(--text-light)", flexShrink:0 }}>{i+1}</div>
                <span style={{ fontSize:13, fontWeight:i===step?700:400, color:i===step?"var(--blue)":"var(--text-light)" }}>{s}</span>
                {i<STEPS.length-1 && <div style={{ flex:1, height:1, background:i<step?"var(--blue)":"var(--border)", margin:"0 8px" }}/>}
              </div>
            ))}
          </div>
        </div>

        {/* Step 0: Symptoms */}
        {step===0 && (
          <div className="fade-in">
            <div className="card" style={{ marginBottom:16 }}>
              <h2 style={{ fontSize:20, fontWeight:800, color:"var(--text-dark)", marginBottom:4, letterSpacing:"-0.3px" }}>What symptoms do you have?</h2>
              <p style={{ color:"var(--text-mid)", fontSize:13, marginBottom:24 }}>Select all that apply — you can pick multiple.</p>
              {systems.map(sys=>(
                <div key={sys} style={{ marginBottom:18 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:"var(--blue)", letterSpacing:1.5, marginBottom:8 }}>{sys.toUpperCase()}</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    {SYMPTOMS.filter(s=>s.system===sys).map(sym=>{
                      const on = selected.includes(sym.id);
                      const emg = ["chest pain","difficulty breathing","severe bleeding"].includes(sym.id);
                      return (
                        <button key={sym.id} onClick={()=>toggle(sym.id)} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:10, border:`1.5px solid ${on?(emg?"#EF4444":"var(--blue)"):"var(--border)"}`, background:on?(emg?"#FEF2F2":"var(--blue-light)"):"white", cursor:"pointer", textAlign:"left", transition:"all 0.15s" }}>
                          <span style={{ fontSize:18 }}>{sym.emoji}</span>
                          <span style={{ fontSize:13, fontWeight:500, color:on?(emg?"#DC2626":"var(--blue)"):"var(--text-dark)", flex:1 }}>{sym.label}</span>
                          {on && <div style={{ width:16, height:16, borderRadius:"50%", background:emg?"#EF4444":"var(--blue)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:"white", fontWeight:700, flexShrink:0 }}>✓</div>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <Link href="/dashboard" className="btn-ghost">Cancel</Link>
              <button className="btn-primary" disabled={selected.length===0} onClick={()=>setStep(1)} style={{ opacity:selected.length===0?.5:1 }}>Next: Add Details →</button>
            </div>
          </div>
        )}

        {/* Step 1: Details */}
        {step===1 && (
          <div className="fade-in">
            <div className="card" style={{ marginBottom:16 }}>
              <h2 style={{ fontSize:20, fontWeight:800, color:"var(--text-dark)", marginBottom:4, letterSpacing:"-0.3px" }}>Tell us more</h2>
              <p style={{ color:"var(--text-mid)", fontSize:13, marginBottom:24 }}>These details improve risk accuracy.</p>

              <div style={{ marginBottom:24 }}>
                <label style={{ fontSize:14, fontWeight:700, color:"var(--text-dark)", display:"block", marginBottom:12 }}>How severe are your symptoms?</label>
                {[{v:"mild",l:"Mild",d:"Noticeable but not stopping activities",e:"😐"},{v:"moderate",l:"Moderate",d:"Uncomfortable, affecting daily activities",e:"😟"},{v:"severe",l:"Severe",d:"Very uncomfortable, unable to function normally",e:"😣"}].map(o=>(
                  <button key={o.v} onClick={()=>setSeverity(o.v)} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 16px", borderRadius:10, textAlign:"left", border:`1.5px solid ${severity===o.v?"var(--blue)":"var(--border)"}`, background:severity===o.v?"var(--blue-light)":"white", cursor:"pointer", transition:"all 0.15s", width:"100%", marginBottom:8 }}>
                    <span style={{ fontSize:22 }}>{o.e}</span>
                    <div><div style={{ fontWeight:600, fontSize:14, color:severity===o.v?"var(--blue)":"var(--text-dark)" }}>{o.l}</div><div style={{ fontSize:12, color:"var(--text-mid)" }}>{o.d}</div></div>
                    {severity===o.v && <div style={{ marginLeft:"auto", width:18, height:18, borderRadius:"50%", background:"var(--blue)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"white", fontWeight:700 }}>✓</div>}
                  </button>
                ))}
              </div>

              <div>
                <label style={{ fontSize:14, fontWeight:700, color:"var(--text-dark)", display:"block", marginBottom:12 }}>How long have you had these symptoms?</label>
                {[{v:"less_24h",l:"Less than 24 hours",e:"⏰"},{v:"1_3_days",l:"1 to 3 days",e:"📅"},{v:"4_7_days",l:"4 to 7 days",e:"🗓️"},{v:"more_than_week",l:"More than a week",e:"📆"}].map(o=>(
                  <button key={o.v} onClick={()=>setDuration(o.v)} style={{ display:"flex", alignItems:"center", gap:14, padding:"11px 16px", borderRadius:10, textAlign:"left", border:`1.5px solid ${duration===o.v?"var(--blue)":"var(--border)"}`, background:duration===o.v?"var(--blue-light)":"white", cursor:"pointer", transition:"all 0.15s", width:"100%", marginBottom:8 }}>
                    <span style={{ fontSize:20 }}>{o.e}</span>
                    <span style={{ fontWeight:500, fontSize:14, color:duration===o.v?"var(--blue)":"var(--text-dark)" }}>{o.l}</span>
                    {duration===o.v && <div style={{ marginLeft:"auto", width:18, height:18, borderRadius:"50%", background:"var(--blue)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"white", fontWeight:700 }}>✓</div>}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <button className="btn-ghost" onClick={()=>setStep(0)}>← Back</button>
              <button className="btn-primary" disabled={!severity||!duration} onClick={()=>setStep(2)} style={{ opacity:!severity||!duration?.5:1 }}>Review →</button>
            </div>
          </div>
        )}

        {/* Step 2: Review */}
        {step===2 && (
          <div className="fade-in">
            <div className="card" style={{ marginBottom:16 }}>
              <h2 style={{ fontSize:20, fontWeight:800, color:"var(--text-dark)", marginBottom:4, letterSpacing:"-0.3px" }}>Review & Submit</h2>
              <p style={{ color:"var(--text-mid)", fontSize:13, marginBottom:24 }}>Please confirm before we analyze your symptoms.</p>
              <div style={{ padding:"14px 16px", background:"var(--bg)", borderRadius:10, border:"1px solid var(--border)", marginBottom:14 }}>
                <div style={{ fontSize:11, fontWeight:700, color:"var(--blue)", letterSpacing:1.5, marginBottom:10 }}>SYMPTOMS ({selected.length})</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {selected.map(s=>{ const sym=SYMPTOMS.find(x=>x.id===s); return <span key={s} style={{ padding:"4px 12px", background:"var(--blue-light)", border:"1px solid var(--blue-mid)", borderRadius:999, fontSize:12, color:"var(--blue)", fontWeight:500 }}>{sym?.emoji} {sym?.label}</span>; })}
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
                {[["SEVERITY",severity],["DURATION",duration.replace(/_/g," ")]].map(([l,v])=>(
                  <div key={l} style={{ padding:"12px 14px", background:"var(--bg)", borderRadius:10, border:"1px solid var(--border)" }}>
                    <div style={{ fontSize:11, color:"var(--text-light)", marginBottom:3 }}>{l}</div>
                    <div style={{ fontWeight:600, fontSize:14, textTransform:"capitalize" }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding:"12px 14px", background:"var(--amber-light)", border:"1px solid #FDE68A", borderRadius:10, fontSize:13, color:"#92400E" }}>
                ⚠️ By submitting you acknowledge this is not a medical diagnosis.
              </div>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <button className="btn-ghost" onClick={()=>setStep(1)}>← Back</button>
              <button className="btn-primary" onClick={submit} disabled={loading} style={{ padding:"11px 28px" }}>
                {loading?"Analyzing symptoms…":"Submit & Get Results →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
