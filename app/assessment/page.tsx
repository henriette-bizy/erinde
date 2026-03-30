"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, saveAssessment, getToken, isGuest } from "@/lib/storage";
import { apiCreateAssessment, hasBackend } from "@/lib/api";
import PageSpinner from "@/components/PageSpinner";
import { analyzeRisk } from "@/lib/riskEngine";
import {
  Thermometer, Wind, Activity, Mic2, Brain, RefreshCw, Eye,
  BatteryLow, Bone, HeartPulse, CircleDashed, Droplets,
  Frown, Scan, ArrowUpDown, Droplet,
  Smile, Meh, Clock, Calendar, CalendarDays, CalendarRange,
  AlertTriangle, type LucideIcon,
} from "lucide-react";

type Symptom = { id: string; label: string; Icon: LucideIcon; system: string };

const SYMPTOMS: Symptom[] = [
  { id:"fever",                label:"Fever",                Icon:Thermometer,   system:"General" },
  { id:"cough",                label:"Cough",                Icon:Wind,          system:"Respiratory" },
  { id:"difficulty breathing", label:"Difficulty Breathing", Icon:Activity,      system:"Respiratory" },
  { id:"sore throat",          label:"Sore Throat",          Icon:Mic2,          system:"Respiratory" },
  { id:"headache",             label:"Headache",             Icon:Brain,         system:"Neurological" },
  { id:"dizziness",            label:"Dizziness",            Icon:RefreshCw,     system:"Neurological" },
  { id:"vision problems",      label:"Vision Problems",      Icon:Eye,           system:"Neurological" },
  { id:"fatigue",              label:"Fatigue / Weakness",   Icon:BatteryLow,    system:"General" },
  { id:"body ache",            label:"Body Aches",           Icon:Bone,          system:"General" },
  { id:"chest pain",           label:"Chest Pain",           Icon:HeartPulse,    system:"Emergency" },
  { id:"abdominal pain",       label:"Abdominal Pain",       Icon:CircleDashed,  system:"Digestive" },
  { id:"diarrhea",             label:"Diarrhea",             Icon:Droplets,      system:"Digestive" },
  { id:"vomiting",             label:"Nausea / Vomiting",    Icon:Frown,         system:"Digestive" },
  { id:"rash",                 label:"Skin Rash",            Icon:Scan,          system:"Skin" },
  { id:"swollen limbs",        label:"Swollen Limbs",        Icon:ArrowUpDown,   system:"General" },
  { id:"severe bleeding",      label:"Severe Bleeding",      Icon:Droplet,       system:"Emergency" },
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
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);

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
    const token = getToken();
    try {
      if (hasBackend() && token && !guest) {
        const { assessment } = await apiCreateAssessment(token, {
          symptoms:selected, severity, duration,
          riskLevel:result.level, score:result.score, recommendations:result.recommendations,
        });
        router.push(`/results?id=${assessment.id}`);
      } else {
        const assessment = { id:`a_${Date.now()}`, userId:user.id, symptoms:selected, severity, duration, riskLevel:result.level, score:result.score, date:new Date().toISOString(), recommendations:result.recommendations };
        saveAssessment(assessment);
        router.push(`/results?id=${assessment.id}${guest?"&guest=1":""}`);
      }
    } catch {
      const assessment = { id:`a_${Date.now()}`, userId:user.id, symptoms:selected, severity, duration, riskLevel:result.level, score:result.score, date:new Date().toISOString(), recommendations:result.recommendations };
      saveAssessment(assessment);
      router.push(`/results?id=${assessment.id}`);
    }
  };

  if (!user) return <PageSpinner />;
  const systems = [...new Set(SYMPTOMS.map(s=>s.system))];
  const guest = isGuest(user);

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
      {/* Disclaimer modal — shown before every assessment (EHRA-163) */}
      {!disclaimerAccepted && (
        <div style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(15,23,42,0.6)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px" }}>
          <div className="fade-in" style={{ background:"white", borderRadius:20, padding:"36px 32px", maxWidth:480, width:"100%", boxShadow:"0 24px 80px rgba(0,0,0,0.25)" }}>
            <div style={{ width:52, height:52, borderRadius:14, background:"var(--amber-light)", border:"1.5px solid #FDE68A", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
              <AlertTriangle size={26} color="#D97706" strokeWidth={2} />
            </div>
            <h2 style={{ fontSize:22, fontWeight:800, color:"var(--text-dark)", marginBottom:8, letterSpacing:"-0.4px" }}>Important Notice</h2>
            <p style={{ fontSize:14, color:"var(--text-mid)", lineHeight:1.7, marginBottom:12 }}>
              e-RINDE is a <strong>health awareness tool only</strong>. It does not provide medical diagnoses, prescribe medication, or replace professional medical advice.
            </p>
            <p style={{ fontSize:14, color:"var(--text-mid)", lineHeight:1.7, marginBottom:24 }}>
              If you are experiencing a life-threatening emergency, <strong style={{ color:"#DC2626" }}>call 912 immediately</strong> or go to your nearest emergency room.
            </p>
            <label style={{ display:"flex", alignItems:"flex-start", gap:12, cursor:"pointer", marginBottom:28, padding:"14px 16px", background:"var(--bg)", borderRadius:10, border:`1.5px solid ${disclaimerChecked?"var(--blue)":"var(--border)"}`, transition:"border-color 0.15s" }}>
              <input
                type="checkbox"
                checked={disclaimerChecked}
                onChange={e=>setDisclaimerChecked(e.target.checked)}
                style={{ width:18, height:18, marginTop:1, accentColor:"var(--blue)", flexShrink:0, cursor:"pointer" }}
              />
              <span style={{ fontSize:13, color:"var(--text-dark)", lineHeight:1.6 }}>
                I understand that e-RINDE does <strong>not</strong> provide medical diagnoses and is not a substitute for professional medical advice.
              </span>
            </label>
            <button
              onClick={()=>setDisclaimerAccepted(true)}
              disabled={!disclaimerChecked}
              className="btn-primary"
              style={{ width:"100%", padding:"13px", fontSize:15, opacity:disclaimerChecked?1:0.45, cursor:disclaimerChecked?"pointer":"not-allowed" }}
            >
              I Understand — Start Assessment
            </button>
            <p style={{ fontSize:11, color:"var(--text-light)", textAlign:"center", marginTop:14 }}>
              This notice is shown before every assessment as required by health data regulations.
            </p>
          </div>
        </div>
      )}

      <nav className="nav">
        <Link href="/" className="logo">e<span>-RINDE</span></Link>
        {guest
          ? <Link href="/" className="btn-ghost">← Home</Link>
          : <Link href="/dashboard" className="btn-ghost">← Dashboard</Link>
        }
      </nav>

      {/* Guest banner */}
      {guest && (
        <div style={{ background:"var(--amber-light)", borderBottom:"1px solid #FDE68A", padding:"10px 24px", display:"flex", alignItems:"center", justifyContent:"center", gap:12, flexWrap:"wrap" }}>
          <AlertTriangle size={15} color="#D97706" strokeWidth={2} />
          <span style={{ fontSize:13, color:"#92400E" }}>You are using e-RINDE as a guest. Your results won&apos;t be saved.</span>
          <Link href="/auth/register" style={{ fontSize:13, fontWeight:700, color:"var(--blue)", textDecoration:"none" }}>Create a free account →</Link>
        </div>
      )}

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
                      const iconColor = on ? (emg ? "#DC2626" : "var(--blue)") : "var(--text-mid)";
                      return (
                        <button key={sym.id} onClick={()=>toggle(sym.id)} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:10, border:`1.5px solid ${on?(emg?"#EF4444":"var(--blue)"):"var(--border)"}`, background:on?(emg?"#FEF2F2":"var(--blue-light)"):"white", cursor:"pointer", textAlign:"left", transition:"all 0.15s" }}>
                          <sym.Icon size={18} color={iconColor} strokeWidth={1.8} style={{ flexShrink:0 }} />
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
              <Link href={guest?"/":"/dashboard"} className="btn-ghost">Cancel</Link>
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
                {([{v:"mild",l:"Mild",d:"Noticeable but not stopping activities",Icon:Smile},{v:"moderate",l:"Moderate",d:"Uncomfortable, affecting daily activities",Icon:Meh},{v:"severe",l:"Severe",d:"Very uncomfortable, unable to function normally",Icon:Frown}] as {v:string;l:string;d:string;Icon:LucideIcon}[]).map(o=>(
                  <button key={o.v} onClick={()=>setSeverity(o.v)} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 16px", borderRadius:10, textAlign:"left", border:`1.5px solid ${severity===o.v?"var(--blue)":"var(--border)"}`, background:severity===o.v?"var(--blue-light)":"white", cursor:"pointer", transition:"all 0.15s", width:"100%", marginBottom:8 }}>
                    <o.Icon size={22} color={severity===o.v?"var(--blue)":"var(--text-mid)"} strokeWidth={1.8} style={{ flexShrink:0 }} />
                    <div><div style={{ fontWeight:600, fontSize:14, color:severity===o.v?"var(--blue)":"var(--text-dark)" }}>{o.l}</div><div style={{ fontSize:12, color:"var(--text-mid)" }}>{o.d}</div></div>
                    {severity===o.v && <div style={{ marginLeft:"auto", width:18, height:18, borderRadius:"50%", background:"var(--blue)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"white", fontWeight:700 }}>✓</div>}
                  </button>
                ))}
              </div>

              <div>
                <label style={{ fontSize:14, fontWeight:700, color:"var(--text-dark)", display:"block", marginBottom:12 }}>How long have you had these symptoms?</label>
                {([{v:"less_24h",l:"Less than 24 hours",Icon:Clock},{v:"1_3_days",l:"1 to 3 days",Icon:Calendar},{v:"4_7_days",l:"4 to 7 days",Icon:CalendarDays},{v:"more_than_week",l:"More than a week",Icon:CalendarRange}] as {v:string;l:string;Icon:LucideIcon}[]).map(o=>(
                  <button key={o.v} onClick={()=>setDuration(o.v)} style={{ display:"flex", alignItems:"center", gap:14, padding:"11px 16px", borderRadius:10, textAlign:"left", border:`1.5px solid ${duration===o.v?"var(--blue)":"var(--border)"}`, background:duration===o.v?"var(--blue-light)":"white", cursor:"pointer", transition:"all 0.15s", width:"100%", marginBottom:8 }}>
                    <o.Icon size={20} color={duration===o.v?"var(--blue)":"var(--text-mid)"} strokeWidth={1.8} style={{ flexShrink:0 }} />
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
                  {selected.map(s=>{ const sym=SYMPTOMS.find(x=>x.id===s); return <span key={s} style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 12px", background:"var(--blue-light)", border:"1px solid var(--blue-mid)", borderRadius:999, fontSize:12, color:"var(--blue)", fontWeight:500 }}>{sym && <sym.Icon size={12} strokeWidth={2} />}{sym?.label}</span>; })}
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
              <div style={{ padding:"12px 14px", background:"var(--amber-light)", border:"1px solid #FDE68A", borderRadius:10, fontSize:13, color:"#92400E", display:"flex", alignItems:"center", gap:10 }}>
                <AlertTriangle size={16} color="#D97706" strokeWidth={2} style={{ flexShrink:0 }} />
                By submitting you acknowledge this is not a medical diagnosis.
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
