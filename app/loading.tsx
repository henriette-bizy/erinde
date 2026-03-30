export default function Loading() {
  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:20 }}>
      {/* Animated spinner */}
      <div style={{ position:"relative", width:56, height:56 }}>
        <div style={{
          position:"absolute", inset:0,
          borderRadius:"50%",
          border:"3px solid var(--blue-light)",
          borderTopColor:"var(--blue)",
          animation:"spin 0.8s linear infinite",
        }} />
      </div>
      <p style={{ color:"var(--text-mid)", fontSize:14, fontWeight:500, letterSpacing:"0.2px" }}>Loading…</p>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
