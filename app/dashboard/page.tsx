"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, setCurrentUser, getToken, setToken, getAssessments, type User, type Assessment } from "@/lib/storage";
import { apiGetAssessments, hasBackend } from "@/lib/api";
import PageSpinner from "@/components/PageSpinner";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User|null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.push("/auth/login"); return; }
    setUser(u);
    const token = getToken();
    if (hasBackend() && token) {
      apiGetAssessments(token)
        .then(data => setAssessments(data.assessments))
        .catch(() => setAssessments(getAssessments(u.id)));
    } else {
      setAssessments(getAssessments(u.id));
    }
  }, [router]);

  const logout = () => { setCurrentUser(null); setToken(null); router.push("/"); };
  if (!user) return <PageSpinner />;

  const last = assessments[0];

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
      <nav className="nav">
        <Link href="/" className="logo">e<span>-RINDE</span></Link>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <Link href="/education" className="btn-ghost">Education</Link>
          <Link href="/profile" className="btn-ghost">Profile</Link>
          <button className="btn-ghost" onClick={logout}>Sign Out</button>
          <Link href="/assessment" className="btn-primary">+ New Assessment</Link>
        </div>
      </nav>

      <div style={{ maxWidth:1060, margin:"0 auto", padding:"40px 32px" }}>
        {/* Header */}
        <div className="fade-in" style={{ marginBottom:32 }}>
          <h1 style={{ fontSize:26, fontWeight:800, color:"var(--text-dark)", marginBottom:4, letterSpacing:"-0.5px" }}>
            Good day, {user.name.split(" ")[0]} 👋
          </h1>
          <p style={{ color:"var(--text-mid)", fontSize:14 }}>Here&apos;s your health overview</p>
        </div>

        {/* Stats row */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:28 }}>
          {[
            { label:"Total Assessments", value: assessments.length.toString(), icon:"📋" },
            { label:"Last Risk Level",   value: last ? last.riskLevel.charAt(0).toUpperCase()+last.riskLevel.slice(1) : "—", icon:"🔬" },
            { label:"Location",          value: user.location||"—", icon:"📍" },
            { label:"Member Since",      value: new Date(user.createdAt).toLocaleDateString("en-GB",{month:"short",year:"numeric"}), icon:"🗓️" },
          ].map((s,i)=>(
            <div key={s.label} className={`card s${i+1} slide-up`}>
              <div style={{ fontSize:24, marginBottom:10 }}>{s.icon}</div>
              <div style={{ fontSize:20, fontWeight:800, color:"var(--text-dark)", letterSpacing:"-0.5px" }}>{s.value}</div>
              <div style={{ fontSize:12, color:"var(--text-light)", marginTop:3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
          {/* Quick actions */}
          <div className="card s1 slide-up">
            <h2 style={{ fontSize:15, fontWeight:700, color:"var(--text-dark)", marginBottom:18 }}>Quick Actions</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[
                { href:"/assessment", icon:"🔍", title:"Start New Assessment",  desc:"Check your current symptoms" },
                { href:"/education",  icon:"📚", title:"Health Education",      desc:"Learn about common conditions" },
                { href:"/profile",    icon:"👤", title:"Update Profile",        desc:"Manage your information" },
              ].map(item=>(
                <Link key={item.href} href={item.href} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", borderRadius:12, background:"var(--bg)", border:"1px solid var(--border)", textDecoration:"none", transition:"all 0.18s" }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.background="var(--blue-light)";(e.currentTarget as HTMLAnchorElement).style.borderColor="var(--blue-mid)";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.background="var(--bg)";(e.currentTarget as HTMLAnchorElement).style.borderColor="var(--border)";}}>
                  <span style={{ fontSize:22 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontWeight:600, fontSize:14, color:"var(--text-dark)" }}>{item.title}</div>
                    <div style={{ fontSize:12, color:"var(--text-mid)" }}>{item.desc}</div>
                  </div>
                  <span style={{ marginLeft:"auto", color:"var(--text-light)", fontSize:16 }}>›</span>
                </Link>
              ))}
            </div>
          </div>

          {/* History */}
          <div className="card s2 slide-up">
            <h2 style={{ fontSize:15, fontWeight:700, color:"var(--text-dark)", marginBottom:18 }}>Recent Assessments</h2>
            {assessments.length === 0 ? (
              <div style={{ textAlign:"center", padding:"32px 0" }}>
                <div style={{ fontSize:44, marginBottom:10 }}>📋</div>
                <p style={{ color:"var(--text-mid)", fontSize:14 }}>No assessments yet.</p>
                <Link href="/assessment" className="btn-primary" style={{ marginTop:14, display:"inline-flex", padding:"9px 18px", fontSize:13 }}>Start one now</Link>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {assessments.slice(0,5).map(a=>{
                  const cls = a.riskLevel==="high"?"badge-high":a.riskLevel==="moderate"?"badge-moderate":"badge-low";
                  return (
                    <Link key={a.id} href={`/results?id=${a.id}`} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 14px", borderRadius:10, background:"var(--bg)", border:"1px solid var(--border)", textDecoration:"none" }}>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:600, color:"var(--text-dark)" }}>
                          {a.symptoms.slice(0,2).join(", ")}{a.symptoms.length>2?` +${a.symptoms.length-2}`:""}
                        </div>
                        <div style={{ fontSize:11, color:"var(--text-light)" }}>{new Date(a.date).toLocaleDateString()}</div>
                      </div>
                      <span className={cls} style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:999 }}>{a.riskLevel.toUpperCase()}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop:20, padding:"12px 18px", background:"var(--amber-light)", border:"1px solid #FDE68A", borderRadius:10, fontSize:13, color:"#92400E" }}>
          ⚠️ <strong>Reminder:</strong> e-RINDE provides health awareness only. It does not diagnose conditions. Always consult a qualified healthcare professional.
        </div>
      </div>
    </div>
  );
}
