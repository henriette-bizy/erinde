"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUsers, setCurrentUser, setToken, setGuestSession } from "@/lib/storage";
import { apiLogin, hasBackend } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email:"", password:"" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGuest = () => {
    setGuestSession();
    router.push("/assessment");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      if (hasBackend()) {
        const { user, token } = await apiLogin(form.email, form.password);
        setToken(token);
        setCurrentUser(user);
      } else {
        await new Promise(r=>setTimeout(r,500));
        const users = getUsers();
        const user = users[form.email];
        if (!user || user.password !== form.password) throw new Error("Invalid email or password.");
        const { password: _p, ...safe } = user;
        setCurrentUser(safe);
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", display:"grid", gridTemplateColumns:"1fr 1fr", background:"white" }}>
      {/* Left — blue panel */}
      <div style={{ background:"var(--blue)", display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"48px 56px" }}>
        <Link href="/" style={{ fontWeight:800, fontSize:20, color:"white", textDecoration:"none", letterSpacing:"-0.5px" }}>e-RINDE</Link>
        <div>
          <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.55)", letterSpacing:2, marginBottom:16 }}>WELCOME BACK</div>
          <h2 style={{ fontSize:36, fontWeight:800, color:"white", lineHeight:1.2, marginBottom:20, letterSpacing:"-0.5px" }}>
            Sign in to your<br/>account.
          </h2>
          <p style={{ color:"rgba(255,255,255,0.75)", fontSize:15, lineHeight:1.7 }}>
            Continue tracking your health and access all your previous assessment results.
          </p>
        </div>
        <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>African Leadership University · Kigali, Rwanda</p>
      </div>

      {/* Right — form */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"48px 56px" }}>
        <div style={{ width:"100%", maxWidth:380 }} className="fade-in">
          <div style={{ marginBottom:32 }}>
            <h1 style={{ fontSize:26, fontWeight:800, color:"var(--text-dark)", marginBottom:6, letterSpacing:"-0.5px" }}>Welcome back!</h1>
            <p style={{ fontSize:14, color:"var(--text-mid)" }}>
              Sign in to your account.{" "}
              <Link href="/auth/register" style={{ color:"var(--blue)", fontWeight:600, textDecoration:"none" }}>Register</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div>
              <label style={{ fontSize:13, fontWeight:600, color:"var(--text-mid)", display:"block", marginBottom:5 }}>Email</label>
              <input className="input-field" type="email" placeholder="jennifer@gmail.com"
                value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} />
            </div>
            <div>
              <label style={{ fontSize:13, fontWeight:600, color:"var(--text-mid)", display:"block", marginBottom:5 }}>Password</label>
              <input className="input-field" type="password" placeholder="••••••••"
                value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} />
            </div>

            {error && <div style={{ background:"var(--red-light)", border:"1px solid #FECACA", borderRadius:8, padding:"10px 14px", fontSize:13, color:"var(--red)" }}>{error}</div>}

            <button type="submit" className="btn-primary" style={{ marginTop:4, padding:"13px", fontSize:15, width:"100%" }} disabled={loading}>
              {loading ? "Signing in…" : "Login"}
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
          <p style={{ fontSize:11, color:"var(--text-light)", textAlign:"center", marginTop:8 }}>
            Guest results are not saved between sessions.
          </p>

          <div style={{ marginTop:16, padding:"14px 16px", background:"var(--blue-light)", borderRadius:10, border:"1px solid var(--blue-mid)" }}>
            <p style={{ fontSize:13, color:"var(--blue)", fontWeight:600, marginBottom:2 }}>New here?</p>
            <p style={{ fontSize:12, color:"var(--text-mid)" }}>Create a free account — registration takes under 30 seconds!</p>
          </div>

          <div style={{ marginTop:16, textAlign:"center" }}>
            <Link href="/" style={{ fontSize:13, color:"var(--text-light)", textDecoration:"none" }}>← Back</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
