"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, setCurrentUser, saveUser, getUsers, getAssessments, type User } from "@/lib/storage";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User|null>(null);
  const [form, setForm] = useState({ name:"", age:"", gender:"", location:"" });
  const [saved, setSaved] = useState(false);
  const [count, setCount] = useState(0);
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => setForm(p=>({...p,[k]:e.target.value}));

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.push("/auth/login"); return; }
    setUser(u); setForm({ name:u.name, age:u.age||"", gender:u.gender||"", location:u.location||"" });
    setCount(getAssessments(u.id).length);
  }, [router]);

  const save = (e: React.FormEvent) => {
    e.preventDefault(); if (!user) return;
    const updated = { ...user, ...form };
    const users = getUsers(); const wp = users[user.email];
    if (wp) saveUser({ ...wp, ...form });
    setCurrentUser(updated); setUser(updated); setSaved(true); setTimeout(()=>setSaved(false),2500);
  };
  const deleteData = () => { if (!confirm("Delete all your data? Cannot be undone.")) return; setCurrentUser(null); router.push("/"); };
  const logout = () => { setCurrentUser(null); router.push("/"); };

  if (!user) return null;

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)" }}>
      <nav className="nav">
        <Link href="/" className="logo">e<span>-RINDE</span></Link>
        <div style={{ display:"flex", gap:6 }}>
          <Link href="/dashboard" className="btn-ghost">← Dashboard</Link>
          <button className="btn-ghost" onClick={logout}>Sign Out</button>
        </div>
      </nav>

      <div style={{ maxWidth:620, margin:"0 auto", padding:"40px 24px" }}>
        <h1 style={{ fontSize:24, fontWeight:800, color:"var(--text-dark)", marginBottom:4, letterSpacing:"-0.5px" }}>Your Profile</h1>
        <p style={{ color:"var(--text-mid)", fontSize:14, marginBottom:28 }}>Manage your personal information</p>

        {/* Avatar row */}
        <div className="card fade-in" style={{ display:"flex", alignItems:"center", gap:20, marginBottom:20 }}>
          <div style={{ width:64, height:64, borderRadius:"50%", background:"var(--blue)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, color:"white", fontWeight:800, flexShrink:0 }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:18, fontWeight:800, color:"var(--text-dark)", letterSpacing:"-0.3px" }}>{user.name}</div>
            <div style={{ fontSize:13, color:"var(--text-mid)" }}>{user.email}</div>
            <div style={{ fontSize:12, color:"var(--text-light)", marginTop:2 }}>Member since {new Date(user.createdAt).toLocaleDateString("en-GB",{month:"long",year:"numeric"})}</div>
          </div>
          <div style={{ textAlign:"center", padding:"12px 20px", background:"var(--blue-light)", borderRadius:12, border:"1px solid var(--blue-mid)" }}>
            <div style={{ fontSize:22, fontWeight:800, color:"var(--blue)", letterSpacing:"-0.5px" }}>{count}</div>
            <div style={{ fontSize:11, color:"var(--text-mid)" }}>Assessments</div>
          </div>
        </div>

        {/* Form */}
        <div className="card s1 slide-up" style={{ marginBottom:16 }}>
          <h2 style={{ fontSize:15, fontWeight:700, color:"var(--text-dark)", marginBottom:20 }}>Personal Information</h2>
          <form onSubmit={save} style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div>
              <label style={{ fontSize:13, fontWeight:600, color:"var(--text-mid)", display:"block", marginBottom:5 }}>Full Name</label>
              <input className="input-field" value={form.name} onChange={f("name")} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div>
                <label style={{ fontSize:13, fontWeight:600, color:"var(--text-mid)", display:"block", marginBottom:5 }}>Age</label>
                <input className="input-field" type="number" value={form.age} onChange={f("age")} />
              </div>
              <div>
                <label style={{ fontSize:13, fontWeight:600, color:"var(--text-mid)", display:"block", marginBottom:5 }}>Gender</label>
                <select className="input-field" value={form.gender} onChange={f("gender")}>
                  <option value="">Select</option><option>Female</option><option>Male</option><option>Prefer not to say</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize:13, fontWeight:600, color:"var(--text-mid)", display:"block", marginBottom:5 }}>Location</label>
              <input className="input-field" value={form.location} onChange={f("location")} placeholder="e.g. Kigali, Rwanda" />
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <button type="submit" className="btn-primary" style={{ padding:"11px 24px" }}>Save Changes</button>
              {saved && <span style={{ color:"var(--green)", fontWeight:600, fontSize:13 }}>✓ Saved successfully!</span>}
            </div>
          </form>
        </div>

        {/* Danger zone */}
        <div className="card s2 slide-up" style={{ border:"1px solid #FECACA" }}>
          <h2 style={{ fontSize:15, fontWeight:700, color:"var(--red)", marginBottom:6 }}>Danger Zone</h2>
          <p style={{ fontSize:13, color:"var(--text-mid)", marginBottom:14 }}>Once you delete your data, there is no going back.</p>
          <button onClick={deleteData} style={{ padding:"9px 18px", borderRadius:9, border:"1.5px solid var(--red)", background:"transparent", color:"var(--red)", fontWeight:600, cursor:"pointer", fontSize:13, transition:"all 0.18s" }}>
            Delete My Data
          </button>
        </div>
      </div>
    </div>
  );
}
