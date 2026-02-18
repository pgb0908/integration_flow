const COLORS = {
  card: '#1e2035',
  border: '#2a2d45',
  text: '#e8eaf0',
  textDim: '#555a72',
};

export default function SettingsPage() {
  return (
    <div style={{ padding: 28 }}>
      <div style={{ background: COLORS.card, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: 40, textAlign: 'center' }}>
        <span style={{ fontSize: 14, color: COLORS.textDim }}>Settings page - Coming soon</span>
      </div>
    </div>
  );
}
