import React from 'react';

const COLORS = {
  header: '#161821',
  border: '#2a2d45',
  text: '#e8eaf0',
  textDim: '#555a72',
};

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <div
      style={{
        height: 56,
        padding: '0 28px',
        borderBottom: `1px solid ${COLORS.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: COLORS.header,
      }}
    >
      <div>
        <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>{title}</span>
        {subtitle && (
          <span style={{ fontSize: 12, color: COLORS.textDim, marginLeft: 12 }}>{subtitle}</span>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>{actions}</div>
    </div>
  );
}
