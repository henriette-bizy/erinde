"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveUser, setCurrentUser, setToken, setGuestSession } from "@/lib/storage";
import { apiRegister, hasBackend } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name:"", email:"", password:"", age:"", gender:"", location:"" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGuest = () => {
    setGuestSession();
    router.push("/assessment");
  };
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => setForm(p=>({...p,[k]:e.target.value}));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!form.name||!form.email||!form.password) { setError("Please fill in all required fields."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    try {
      if (hasBackend()) {
        const { user, token } = await apiRegister(form);
        setToken(token); setCurrentUser(user);
      } else {
        await new Promise(r=>setTimeout(r,600));
        const user = { id:`u_${Date.now()}`, name:form.name, email:form.email, password:form.password, age:form.age, gender:form.gender, location:form.location, createdAt:new Date().toISOString() };
        saveUser(user); setCurrentUser(user);
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", display:"grid", gridTemplateColumns:"1fr 1fr", background:"white" }}>
      {/* Left — blue panel */}
      <div style={{ background:"var(--blue)", display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"48px 56px" }}>
        <Link href="/" style={{ fontWeight:800, fontSize:20, color:"white", textDecoration:"none", letterSpacing:"-0.5px" }}>
          e-RINDE
        </Link>
        <div>
          <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.55)", letterSpacing:2, marginBottom:16 }}>EARLY HEALTH RISK AWARENESS</div>
          <h2 style={{ fontSize:36, fontWeight:800, color:"white", lineHeight:1.2, marginBottom:20, letterSpacing:"-0.5px" }}>
            Your health journey<br/>starts here.
          </h2>
          <p style={{ color:"rgba(255,255,255,0.75)", fontSize:15, lineHeight:1.7, marginBottom:40 }}>
            Join thousands of community members using e-RINDE to stay informed about their health — for free.
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {["Free symptom assessment","Personalized health guidance","Track assessment history","Works in low-connectivity areas"].map(item=>(
              <div key={item} style={{ display:"flex", alignItems:"center", gap:12, color:"rgba(255,255,255,0.9)", fontSize:14 }}>
                <div style={{ width:20, height:20, borderRadius:"50%", background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0 }}>✓</div>
                {item}
              </div>
            ))}
          </div>
        </div>
        <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>African Leadership University · Kigali, Rwanda</p>
      </div>

      {/* Right — form */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"48px 56px", overflowY:"auto" }}>
        <div style={{ width:"100%", maxWidth:400 }} className="fade-in">
          <div style={{ marginBottom:32 }}>
            <div style={{ fontSize:12, color:"var(--text-light)", marginBottom:4 }}>STEP 1 OF 1</div>
            <h1 style={{ fontSize:26, fontWeight:800, color:"var(--text-dark)", marginBottom:6, letterSpacing:"-0.5px" }}>Create your account</h1>
            <p style={{ fontSize:14, color:"var(--text-mid)" }}>
              Already have one?{" "}
              <Link href="/auth/login" style={{ color:"var(--blue)", fontWeight:600, textDecoration:"none" }}>Sign in</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div>
              <label style={{ fontSize:13, fontWeight:600, color:"var(--text-mid)", display:"block", marginBottom:5 }}>Full Name *</label>
              <input className="input-field" placeholder="Henriette Biziyaremye" value={form.name} onChange={f("name")} />
            </div>
            <div>
              <label style={{ fontSize:13, fontWeight:600, color:"var(--text-mid)", display:"block", marginBottom:5 }}>Email Address *</label>
              <input className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={f("email")} />
            </div>
            <div>
              <label style={{ fontSize:13, fontWeight:600, color:"var(--text-mid)", display:"block", marginBottom:5 }}>Password *</label>
              <input className="input-field" type="password" placeholder="Minimum 8 characters" value={form.password} onChange={f("password")} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div>
                <label style={{ fontSize:13, fontWeight:600, color:"var(--text-mid)", display:"block", marginBottom:5 }}>Age</label>
                <input className="input-field" type="number" placeholder="25" value={form.age} onChange={f("age")} />
              </div>
              <div>
                <label style={{ fontSize:13, fontWeight:600, color:"var(--text-mid)", display:"block", marginBottom:5 }}>Gender</label>
                <select className="input-field" value={form.gender} onChange={f("gender")}>
                  <option value="">Select</option>
                  <option>Female</option><option>Male</option><option>Prefer not to say</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize:13, fontWeight:600, color:"var(--text-mid)", display:"block", marginBottom:5 }}>Location</label>
              <input className="input-field" placeholder="e.g. Kigali, Rwanda" value={form.location} onChange={f("location")} />
            </div>

            {error && <div style={{ background:"var(--red-light)", border:"1px solid #FECACA", borderRadius:8, padding:"10px 14px", fontSize:13, color:"var(--red)" }}>{error}</div>}

            <button type="submit" className="btn-primary" style={{ marginTop:4, padding:"13px", fontSize:15, width:"100%" }} disabled={loading}>
              {loading ? "Creating account…" : "Create Account →"}
            </button>
          </form>

          <div style={{ display:"flex", alignItems:"center", gap:12, margin:"20px 0" }}>
            <div style={{ flex:1, height:1, background:"var(--border)" }} />
            <span style={{ fontSize:12, color:"var(--text-light)", fontWeight:500 }}>OR</span>
            <div style={{ flex:1, height:1, background:"var(--border)" }} />
          </div>

          <button
            onClick={handleGuest}
            style={{ width:"100%", padding:"13px", fontSize:14, fontWeight:600, borderRadius:10, border:"1.5px solid var(--border)", background:"white", color:"var(--text-dark)", cursor:"pointer", transition:"all 0.15s" }}
            onMouseOver={e=>(e.currentTarget.style.borderColor="var(--blue-mid)")}
            onMouseOut={e=>(e.currentTarget.style.borderColor="var(--border)")}
          >
            Continue as Guest — No account needed
          </button>
          <p style={{ fontSize:11, color:"var(--text-light)", marginTop:18, lineHeight:1.6, textAlign:"center" }}>
            e-RINDE does not provide medical diagnoses and is not a substitute for professional medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
