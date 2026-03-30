export default function PageSpinner() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        border: "3px solid var(--blue-light)",
        borderTopColor: "var(--blue)",
        animation: "spin 0.75s linear infinite",
      }} />
      <p style={{ color: "var(--text-mid)", fontSize: 14, fontWeight: 500 }}>Loading…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
