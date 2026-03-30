"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FileQuestion, ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex", flexDirection:"column" }}>
      <nav className="nav">
        <Link href="/" className="logo">e<span>-RINDE</span></Link>
        <Link href="/" className="btn-ghost">← Home</Link>
      </nav>

      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 24px" }}>
        <div className={mounted?"fade-in":""} style={{ textAlign:"center", maxWidth:480 }}>
          {/* Icon */}
          <div style={{ width:100, height:100, borderRadius:24, background:"var(--blue-light)", border:"1.5px solid var(--blue-mid)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 28px" }}>
            <FileQuestion size={48} color="var(--blue)" strokeWidth={1.5} />
          </div>

          {/* Error code */}
          <div style={{ fontSize:80, fontWeight:900, color:"var(--blue)", lineHeight:1, letterSpacing:"-4px", marginBottom:8 }}>404</div>
          <h1 style={{ fontSize:24, fontWeight:800, color:"var(--text-dark)", marginBottom:10, letterSpacing:"-0.4px" }}>Page not found</h1>
          <p style={{ color:"var(--text-mid)", fontSize:15, lineHeight:1.7, marginBottom:36 }}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            <br />
            If you think this is a mistake, please try again.
          </p>

          {/* Actions */}
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <Link href="/" className="btn-primary" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"12px 22px" }}>
              <Home size={16} strokeWidth={2} />
              Go to Home
            </Link>
            <Link href="/assessment" className="btn-outline" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"12px 22px" }}>
              <Search size={16} strokeWidth={2} />
              Start Assessment
            </Link>
          </div>

          {/* Help links */}
          <div style={{ marginTop:40, display:"flex", gap:24, justifyContent:"center", flexWrap:"wrap" }}>
            {[
              { href:"/auth/login",  label:"Sign In" },
              { href:"/auth/register", label:"Register" },
              { href:"/education",   label:"Health Education" },
              { href:"/dashboard",   label:"Dashboard" },
            ].map(l=>(
              <Link key={l.href} href={l.href} style={{ fontSize:13, color:"var(--blue)", textDecoration:"none", fontWeight:500, display:"inline-flex", alignItems:"center", gap:5 }}>
                <ArrowLeft size={12} strokeWidth={2} />
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <footer style={{ textAlign:"center", padding:"20px 24px", fontSize:12, color:"var(--text-light)", borderTop:"1px solid var(--border)" }}>
        e-RINDE — Early Health Risk Awareness System · African Leadership University
      </footer>
    </div>
  );
}
