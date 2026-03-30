"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, getAssessments, type Assessment } from "@/lib/storage";

function ResultsContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [assessment, setAssessment] = useState<Assessment|null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) { router.push("/auth/login"); return; }
    const id = params.get("id");
    if (!id) { router.push("/dashboard"); return; }
    const found = getAssessments(user.id).find(a=>a.id===id);
    if (!found) { router.push("/dashboard"); return; }
    setAssessment(found);
  }, [router, params]);

  if (!assessment) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <p style={{ color:"var(--text-mid)" }}>Loading…</p>
    </div>
  );

  const cfg = {
    low:      { color:"#059669", bg:"var(--green-light)",  border:"#A7F3D0", icon:"✅", label:"Low Risk",      tagline:"Your symptoms appear mild. Monitor and rest at home." },
    moderate: { color:"#D97706", bg:"var(--amber-light)",  border:"#FDE68A", icon:"⚠️", label:"Moderate Risk", tagline:"Consider visiting a clinic within 2–3 days." },
    high:     { color:"#DC2626", bg:"var(--red-light)",    border:"#FECACA", icon:"🚨", label:"High Risk",     tagline:"Please seek medical attention urgently." },
  }[assessment.riskLevel];

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
      <nav className="nav">
        <Link href="/" className="logo">e<span>-RINDE</span></Link>
        <Link href="/dashboard" className="btn-ghost">← Dashboard</Link>
      </nav>

      <div style={{ maxWidth:640, margin:"0 auto", padding:"40px 24px" }}>
        {/* Main result */}
        <div className="fade-in" style={{ background:cfg.bg, border:`1.5px solid ${cfg.border}`, borderRadius:16, padding:"32px", textAlign:"center", marginBottom:20 }}>
          <div style={{ fontSize:56, marginBottom:12 }}>{cfg.icon}</div>
          <h1 style={{ fontSize:28, fontWeight:800, color:cfg.color, marginBottom:6, letterSpacing:"-0.5px" }}>{cfg.label}</h1>
          <p style={{ color:cfg.color, fontSize:15, marginBottom:16 }}>{cfg.tagline}</p>
          <div style={{ display:"inline-block", background:"rgba(255,255,255,0.7)", padding:"5px 16px", borderRadius:999, fontSize:13, fontWeight:600, color:cfg.color }}>
            Risk Score: {assessment.score} / 100
          </div>
        </div>

        {/* Symptoms */}
        <div className="card s1 slide-up" style={{ marginBottom:16 }}>
          <h2 style={{ fontSize:15, fontWeight:700, color:"var(--text-dark)", marginBottom:12 }}>📋 Reported Symptoms</h2>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:12 }}>
            {assessment.symptoms.map(s=>(
              <span key={s} style={{ padding:"5px 12px", background:"var(--blue-light)", border:"1px solid var(--blue-mid)", borderRadius:999, fontSize:12, color:"var(--blue)", fontWeight:500, textTransform:"capitalize" }}>{s}</span>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {[["Severity",assessment.severity],["Duration",assessment.duration.replace(/_/g," ")]].map(([l,v])=>(
              <div key={l} style={{ padding:"10px 12px", background:"var(--bg)", borderRadius:8, border:"1px solid var(--border)" }}>
                <div style={{ fontSize:11, color:"var(--text-light)", marginBottom:2 }}>{l.toUpperCase()}</div>
                <div style={{ fontWeight:600, fontSize:13, textTransform:"capitalize" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="card s2 slide-up" style={{ marginBottom:16 }}>
          <h2 style={{ fontSize:15, fontWeight:700, color:"var(--text-dark)", marginBottom:14 }}>💊 Recommendations</h2>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {assessment.recommendations.map((r,i)=>(
              <div key={i} style={{ display:"flex", gap:12, padding:"11px 14px", background:"var(--bg)", borderRadius:9, border:"1px solid var(--border)" }}>
                <span style={{ color:cfg.color, fontWeight:700, fontSize:13, flexShrink:0, marginTop:1 }}>{i+1}.</span>
                <p style={{ fontSize:13, color:"var(--text-dark)", margin:0, lineHeight:1.6 }}>{r}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency contacts */}
        <div className="card s3 slide-up" style={{ marginBottom:20, background:"var(--blue-light)", border:"1px solid var(--blue-mid)" }}>
          <h2 style={{ fontSize:14, fontWeight:700, color:"var(--blue)", marginBottom:12 }}>📞 Emergency Contacts — Rwanda</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
            {[["🚑 Emergency","912"],["🏥 CHUK","+250 788 303 033"],["📍 Clinic","Visit in person"]].map(([l,v])=>(
              <div key={l} style={{ textAlign:"center", padding:"10px 8px", background:"white", borderRadius:8, border:"1px solid var(--blue-mid)" }}>
                <div style={{ fontSize:12, fontWeight:600, color:"var(--text-dark)", marginBottom:3 }}>{l}</div>
                <div style={{ fontSize:13, fontWeight:700, color:"var(--blue)" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:"flex", gap:12 }}>
          <Link href="/assessment" className="btn-primary" style={{ flex:1, textAlign:"center" }}>New Assessment</Link>
          <Link href="/dashboard" className="btn-outline" style={{ flex:1, textAlign:"center" }}>Back to Dashboard</Link>
        </div>
        <p style={{ fontSize:11, color:"var(--text-light)", textAlign:"center", marginTop:16, lineHeight:1.6 }}>
          {new Date(assessment.date).toLocaleString()} · e-RINDE is not a diagnostic tool. Consult a healthcare professional.
        </p>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return <Suspense><ResultsContent /></Suspense>;
}
