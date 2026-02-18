import { useState } from "react";

const COLORS = {
    bg: "#0f1117",
    sidebar: "#161821",
    sidebarHover: "#1e2030",
    sidebarActive: "#252840",
    header: "#161821",
    content: "#1a1c2a",
    card: "#1e2035",
    cardHover: "#252845",
    border: "#2a2d45",
    primary: "#6c8cff",
    primaryMuted: "#4a5e99",
    accent: "#50e3c2",
    accentOrange: "#ffb347",
    accentRed: "#ff6b6b",
    text: "#e8eaf0",
    textMuted: "#8890a8",
    textDim: "#555a72",
    nodeSource: "#50e3c2",
    nodeProcessor: "#6c8cff",
    nodeSink: "#ffb347",
    nodeKamelet: "#c084fc",
};

const NAV_ITEMS = [
    { id: "projects", icon: "📁", label: "Projects" },
    { id: "routes", icon: "🔀", label: "Routes" },
    { id: "designer", icon: "✏️", label: "Designer" },
    { id: "deployments", icon: "🚀", label: "Deployments" },
    { id: "kamelets", icon: "🔌", label: "Kamelets" },
    { id: "settings", icon: "⚙️", label: "Settings" },
];

function Sidebar({ active, onNav, collapsed }) {
    return (
        <div
            style={{
                width: collapsed ? 56 : 200,
                minWidth: collapsed ? 56 : 200,
                background: COLORS.sidebar,
                borderRight: `1px solid ${COLORS.border}`,
                display: "flex",
                flexDirection: "column",
                transition: "width 0.2s, min-width 0.2s",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    padding: collapsed ? "18px 12px" : "18px 20px",
                    borderBottom: `1px solid ${COLORS.border}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    whiteSpace: "nowrap",
                }}
            >
                <span style={{ fontSize: 22 }}>🐪</span>
                {!collapsed && (
                    <span
                        style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontWeight: 700,
                            fontSize: 15,
                            color: COLORS.text,
                            letterSpacing: "-0.3px",
                        }}
                    >
            CamelPlatform
          </span>
                )}
            </div>

            <div style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
                {NAV_ITEMS.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => onNav(item.id)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: collapsed ? "10px 14px" : "10px 14px",
                            borderRadius: 8,
                            cursor: "pointer",
                            background: active === item.id ? COLORS.sidebarActive : "transparent",
                            color: active === item.id ? COLORS.primary : COLORS.textMuted,
                            fontSize: 13,
                            fontWeight: active === item.id ? 600 : 400,
                            transition: "all 0.15s",
                            whiteSpace: "nowrap",
                            borderLeft: active === item.id ? `2px solid ${COLORS.primary}` : "2px solid transparent",
                        }}
                        onMouseEnter={(e) => {
                            if (active !== item.id) e.currentTarget.style.background = COLORS.sidebarHover;
                        }}
                        onMouseLeave={(e) => {
                            if (active !== item.id) e.currentTarget.style.background = "transparent";
                        }}
                    >
                        <span style={{ fontSize: 16, width: 22, textAlign: "center" }}>{item.icon}</span>
                        {!collapsed && <span>{item.label}</span>}
                    </div>
                ))}
            </div>

            <div
                style={{
                    padding: "12px 8px",
                    borderTop: `1px solid ${COLORS.border}`,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 14px",
                        borderRadius: 8,
                        whiteSpace: "nowrap",
                    }}
                >
                    <div
                        style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#fff",
                        }}
                    >
                        D
                    </div>
                    {!collapsed && (
                        <div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>Developer</div>
                            <div style={{ fontSize: 10, color: COLORS.textDim }}>Admin</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Header({ title, subtitle, actions }) {
    return (
        <div
            style={{
                height: 56,
                padding: "0 28px",
                borderBottom: `1px solid ${COLORS.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: COLORS.header,
            }}
        >
            <div>
                <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>{title}</span>
                {subtitle && (
                    <span style={{ fontSize: 12, color: COLORS.textDim, marginLeft: 12 }}>{subtitle}</span>
                )}
            </div>
            <div style={{ display: "flex", gap: 8 }}>{actions}</div>
        </div>
    );
}

function Btn({ children, variant = "default", small, onClick }) {
    const styles = {
        primary: { background: COLORS.primary, color: "#fff", border: "none" },
        default: { background: "transparent", color: COLORS.textMuted, border: `1px solid ${COLORS.border}` },
        ghost: { background: "transparent", color: COLORS.textMuted, border: "none" },
    };
    return (
        <button
            onClick={onClick}
            style={{
                ...styles[variant],
                padding: small ? "4px 12px" : "6px 16px",
                borderRadius: 6,
                fontSize: small ? 11 : 12,
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s",
            }}
        >
            {children}
        </button>
    );
}

function StatusBadge({ status }) {
    const map = {
        running: { color: COLORS.accent, label: "Running" },
        stopped: { color: COLORS.textDim, label: "Stopped" },
        error: { color: COLORS.accentRed, label: "Error" },
        deploying: { color: COLORS.accentOrange, label: "Deploying" },
    };
    const s = map[status] || map.stopped;
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                color: s.color,
                fontWeight: 500,
            }}
        >
      <span
          style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: s.color,
              boxShadow: status === "running" ? `0 0 6px ${s.color}` : "none",
          }}
      />
            {s.label}
    </span>
    );
}

// ─── Pages ───

function ProjectsPage() {
    const projects = [
        { name: "주문 연동 시스템", routes: 12, status: "running", updated: "2분 전" },
        { name: "CRM 데이터 파이프라인", routes: 8, status: "running", updated: "1시간 전" },
        { name: "ERP 마이그레이션", routes: 5, status: "stopped", updated: "3일 전" },
        { name: "IoT 센서 수집기", routes: 24, status: "error", updated: "15분 전" },
    ];
    return (
        <div style={{ padding: 28 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {projects.map((p, i) => (
                    <div
                        key={i}
                        style={{
                            background: COLORS.card,
                            borderRadius: 10,
                            padding: 20,
                            border: `1px solid ${COLORS.border}`,
                            cursor: "pointer",
                            transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = COLORS.primaryMuted;
                            e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = COLORS.border;
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{p.name}</span>
                            <StatusBadge status={p.status} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: COLORS.textDim }}>
                            <span>{p.routes} routes</span>
                            <span>{p.updated}</span>
                        </div>
                    </div>
                ))}

                <div
                    style={{
                        borderRadius: 10,
                        padding: 20,
                        border: `1px dashed ${COLORS.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: COLORS.textDim,
                        fontSize: 13,
                        minHeight: 90,
                        transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = COLORS.primary;
                        e.currentTarget.style.color = COLORS.primary;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = COLORS.border;
                        e.currentTarget.style.color = COLORS.textDim;
                    }}
                >
                    + New Project
                </div>
            </div>
        </div>
    );
}

function RoutesPage({ onOpenDesigner }) {
    const routes = [
        { id: "order-sync", name: "HTTP → Kafka 주문동기화", status: "running", throughput: "1.2k/min", project: "주문 연동" },
        { id: "ftp-import", name: "FTP → DB 일배치", status: "running", throughput: "340/min", project: "CRM 파이프라인" },
        { id: "api-gateway", name: "REST API Gateway", status: "running", throughput: "5.8k/min", project: "주문 연동" },
        { id: "sensor-collect", name: "MQTT → Kafka 센서수집", status: "error", throughput: "0/min", project: "IoT 센서" },
        { id: "erp-migrate", name: "DB → DB 마이그레이션", status: "stopped", throughput: "-", project: "ERP 마이그레이션" },
    ];

    return (
        <div style={{ padding: 28 }}>
            <div
                style={{
                    background: COLORS.card,
                    borderRadius: 10,
                    border: `1px solid ${COLORS.border}`,
                    overflow: "hidden",
                }}
            >
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                    <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                        {["Route Name", "Project", "Status", "Throughput", "Actions"].map((h) => (
                            <th
                                key={h}
                                style={{
                                    textAlign: "left",
                                    padding: "12px 16px",
                                    color: COLORS.textDim,
                                    fontWeight: 500,
                                    fontSize: 11,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                }}
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {routes.map((r) => (
                        <tr
                            key={r.id}
                            style={{ borderBottom: `1px solid ${COLORS.border}`, cursor: "pointer" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.cardHover)}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                            <td style={{ padding: "12px 16px", color: COLORS.text, fontWeight: 500 }}>{r.name}</td>
                            <td style={{ padding: "12px 16px", color: COLORS.textMuted }}>{r.project}</td>
                            <td style={{ padding: "12px 16px" }}>
                                <StatusBadge status={r.status} />
                            </td>
                            <td style={{ padding: "12px 16px", color: COLORS.textMuted, fontFamily: "monospace", fontSize: 12 }}>
                                {r.throughput}
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                                <div style={{ display: "flex", gap: 6 }}>
                                    <Btn small onClick={onOpenDesigner}>
                                        ✏️ Edit
                                    </Btn>
                                    <Btn small>{r.status === "running" ? "⏹ Stop" : "▶️ Start"}</Btn>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function DesignerPage() {
    const [selectedNode, setSelectedNode] = useState("transform-1");
    const [catalogOpen, setCatalogOpen] = useState(true);

    const catalogItems = [
        { cat: "Source", items: [{ icon: "🌐", name: "HTTP" }, { icon: "📨", name: "Kafka" }, { icon: "📁", name: "FTP" }, { icon: "🔌", name: "MQTT" }] },
        { cat: "Processor", items: [{ icon: "🔄", name: "Transform" }, { icon: "🔀", name: "Filter" }, { icon: "📋", name: "Marshal" }, { icon: "⚡", name: "Split" }] },
        { cat: "Sink", items: [{ icon: "🗄️", name: "Database" }, { icon: "📨", name: "Kafka" }, { icon: "📡", name: "REST API" }, { icon: "📁", name: "File" }] },
    ];

    const nodes = [
        { id: "http-in", x: 80, y: 110, label: "HTTP\nEndpoint", type: "source", color: COLORS.nodeSource },
        { id: "transform-1", x: 300, y: 60, label: "JSON\nTransform", type: "processor", color: COLORS.nodeProcessor },
        { id: "filter-1", x: 300, y: 170, label: "Content\nFilter", type: "processor", color: COLORS.nodeProcessor },
        { id: "kafka-out", x: 530, y: 60, label: "Kafka\nProducer", type: "sink", color: COLORS.nodeSink },
        { id: "db-out", x: 530, y: 170, label: "PostgreSQL\nInsert", type: "sink", color: COLORS.nodeSink },
    ];

    const edges = [
        { from: "http-in", to: "transform-1", fromX: 180, fromY: 130, toX: 300, toY: 80 },
        { from: "http-in", to: "filter-1", fromX: 180, fromY: 140, toX: 300, toY: 190 },
        { from: "transform-1", to: "kafka-out", fromX: 400, fromY: 80, toX: 530, toY: 80 },
        { from: "filter-1", to: "db-out", fromX: 400, fromY: 190, toX: 530, toY: 190 },
    ];

    return (
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            {/* Left Panel - Component Catalog */}
            <div
                style={{
                    width: catalogOpen ? 220 : 0,
                    minWidth: catalogOpen ? 220 : 0,
                    background: COLORS.sidebar,
                    borderRight: `1px solid ${COLORS.border}`,
                    overflow: "auto",
                    transition: "all 0.2s",
                }}
            >
                <div style={{ padding: "14px 16px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>Component Catalog</span>
                    <span style={{ fontSize: 10, color: COLORS.textDim, cursor: "pointer" }} onClick={() => setCatalogOpen(false)}>✕</span>
                </div>
                <div style={{ padding: "8px 0" }}>
                    <div style={{ padding: "4px 16px", marginBottom: 4 }}>
                        <input
                            placeholder="Search components..."
                            style={{
                                width: "100%",
                                padding: "6px 10px",
                                borderRadius: 6,
                                border: `1px solid ${COLORS.border}`,
                                background: COLORS.bg,
                                color: COLORS.text,
                                fontSize: 11,
                                outline: "none",
                                boxSizing: "border-box",
                            }}
                        />
                    </div>
                    {catalogItems.map((cat) => (
                        <div key={cat.cat}>
                            <div style={{ padding: "8px 16px 4px", fontSize: 10, fontWeight: 600, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                {cat.cat}
                            </div>
                            {cat.items.map((item) => (
                                <div
                                    key={item.name}
                                    style={{
                                        padding: "6px 16px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        fontSize: 12,
                                        color: COLORS.textMuted,
                                        cursor: "grab",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.sidebarHover)}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                >
                                    <span>{item.icon}</span>
                                    <span>{item.name}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Center - Flow Canvas */}
            <div style={{ flex: 1, position: "relative", background: COLORS.bg }}>
                {/* Canvas Toolbar */}
                <div
                    style={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        zIndex: 10,
                        display: "flex",
                        gap: 4,
                        background: COLORS.card,
                        borderRadius: 8,
                        padding: 4,
                        border: `1px solid ${COLORS.border}`,
                    }}
                >
                    {!catalogOpen && (
                        <Btn small ghost onClick={() => setCatalogOpen(true)}>📦 Catalog</Btn>
                    )}
                    <Btn small ghost>🔍+</Btn>
                    <Btn small ghost>🔍−</Btn>
                    <Btn small ghost>⊞ Fit</Btn>
                    <div style={{ width: 1, background: COLORS.border, margin: "2px 4px" }} />
                    <Btn small ghost>↩️ Undo</Btn>
                    <Btn small ghost>↪️ Redo</Btn>
                </div>

                {/* Route selector tabs */}
                <div
                    style={{
                        position: "absolute",
                        top: 12,
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 10,
                        display: "flex",
                        gap: 2,
                        background: COLORS.card,
                        borderRadius: 8,
                        padding: 3,
                        border: `1px solid ${COLORS.border}`,
                    }}
                >
                    {["order-sync", "retry-handler"].map((tab, i) => (
                        <div
                            key={tab}
                            style={{
                                padding: "5px 14px",
                                borderRadius: 6,
                                fontSize: 11,
                                fontWeight: 500,
                                cursor: "pointer",
                                background: i === 0 ? COLORS.primary + "22" : "transparent",
                                color: i === 0 ? COLORS.primary : COLORS.textDim,
                            }}
                        >
                            {tab}
                        </div>
                    ))}
                    <div style={{ padding: "5px 10px", fontSize: 11, color: COLORS.textDim, cursor: "pointer" }}>+</div>
                </div>

                {/* Grid background */}
                <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
                    <defs>
                        <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                            <circle cx="12" cy="12" r="0.5" fill={COLORS.border + "60"} />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />

                    {/* Edges */}
                    {edges.map((e, i) => {
                        const midX = (e.fromX + e.toX) / 2;
                        return (
                            <path
                                key={i}
                                d={`M ${e.fromX} ${e.fromY} C ${midX} ${e.fromY}, ${midX} ${e.toY}, ${e.toX} ${e.toY}`}
                                fill="none"
                                stroke={COLORS.border}
                                strokeWidth={2}
                                strokeDasharray="none"
                            />
                        );
                    })}

                    {/* Animated dots on edges */}
                    {edges.map((e, i) => {
                        const midX = (e.fromX + e.toX) / 2;
                        return (
                            <circle key={`dot-${i}`} r="3" fill={COLORS.primary}>
                                <animateMotion
                                    dur={`${1.5 + i * 0.3}s`}
                                    repeatCount="indefinite"
                                    path={`M ${e.fromX} ${e.fromY} C ${midX} ${e.fromY}, ${midX} ${e.toY}, ${e.toX} ${e.toY}`}
                                />
                            </circle>
                        );
                    })}
                </svg>

                {/* Nodes */}
                {nodes.map((n) => (
                    <div
                        key={n.id}
                        onClick={() => setSelectedNode(n.id)}
                        style={{
                            position: "absolute",
                            left: n.x,
                            top: n.y,
                            width: 100,
                            padding: "10px 8px",
                            borderRadius: 10,
                            background: COLORS.card,
                            border: `2px solid ${selectedNode === n.id ? n.color : COLORS.border}`,
                            boxShadow: selectedNode === n.id ? `0 0 16px ${n.color}30` : "none",
                            textAlign: "center",
                            cursor: "pointer",
                            zIndex: 5,
                            transition: "border-color 0.15s, box-shadow 0.15s",
                        }}
                    >
                        <div
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: n.color,
                                margin: "0 auto 6px",
                                boxShadow: `0 0 6px ${n.color}60`,
                            }}
                        />
                        <div style={{ fontSize: 10, fontWeight: 600, color: COLORS.text, whiteSpace: "pre-line", lineHeight: 1.3 }}>
                            {n.label}
                        </div>
                        <div style={{ fontSize: 9, color: n.color, marginTop: 3, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            {n.type}
                        </div>
                    </div>
                ))}

                {/* Bottom YAML Preview Toggle */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 12,
                        left: 12,
                        zIndex: 10,
                        display: "flex",
                        gap: 4,
                        background: COLORS.card,
                        borderRadius: 8,
                        padding: 4,
                        border: `1px solid ${COLORS.border}`,
                    }}
                >
                    <Btn small ghost>{"</>"} YAML Preview</Btn>
                </div>

                {/* Mini map hint */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 12,
                        right: selectedNode ? 332 : 12,
                        width: 120,
                        height: 80,
                        background: COLORS.card + "cc",
                        borderRadius: 8,
                        border: `1px solid ${COLORS.border}`,
                        zIndex: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 9,
                        color: COLORS.textDim,
                        transition: "right 0.2s",
                    }}
                >
                    Mini Map
                </div>
            </div>

            {/* Right Panel - Property Editor */}
            {selectedNode && (
                <div
                    style={{
                        width: 320,
                        minWidth: 320,
                        background: COLORS.sidebar,
                        borderLeft: `1px solid ${COLORS.border}`,
                        overflow: "auto",
                    }}
                >
                    <div style={{ padding: "14px 16px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>Properties</span>
                        <span style={{ fontSize: 10, color: COLORS.textDim, cursor: "pointer" }} onClick={() => setSelectedNode(null)}>✕</span>
                    </div>
                    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
                        <div style={{ padding: 12, borderRadius: 8, background: COLORS.nodeProcessor + "15", border: `1px solid ${COLORS.nodeProcessor}30`, display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: COLORS.nodeProcessor + "25", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🔄</div>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>JSON Transform</div>
                                <div style={{ fontSize: 10, color: COLORS.nodeProcessor }}>Processor</div>
                            </div>
                        </div>

                        {[
                            { label: "ID", value: "transform-1", desc: "Unique identifier" },
                            { label: "Expression Language", value: "jsonpath", type: "select" },
                            { label: "Expression", value: "$.order.items[*]", multiline: true },
                            { label: "Result Type", value: "java.util.List", desc: "Output class" },
                        ].map((field) => (
                            <div key={field.label}>
                                <div style={{ fontSize: 11, fontWeight: 500, color: COLORS.textMuted, marginBottom: 5 }}>
                                    {field.label}
                                </div>
                                {field.multiline ? (
                                    <textarea
                                        defaultValue={field.value}
                                        rows={2}
                                        style={{
                                            width: "100%",
                                            padding: "8px 10px",
                                            borderRadius: 6,
                                            border: `1px solid ${COLORS.border}`,
                                            background: COLORS.bg,
                                            color: COLORS.text,
                                            fontSize: 12,
                                            fontFamily: "'JetBrains Mono', monospace",
                                            outline: "none",
                                            resize: "vertical",
                                            boxSizing: "border-box",
                                        }}
                                    />
                                ) : (
                                    <input
                                        defaultValue={field.value}
                                        style={{
                                            width: "100%",
                                            padding: "8px 10px",
                                            borderRadius: 6,
                                            border: `1px solid ${COLORS.border}`,
                                            background: COLORS.bg,
                                            color: COLORS.text,
                                            fontSize: 12,
                                            fontFamily: field.label === "ID" ? "'JetBrains Mono', monospace" : "inherit",
                                            outline: "none",
                                            boxSizing: "border-box",
                                        }}
                                    />
                                )}
                                {field.desc && <div style={{ fontSize: 10, color: COLORS.textDim, marginTop: 3 }}>{field.desc}</div>}
                            </div>
                        ))}

                        <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 14 }}>
                            <div style={{ fontSize: 11, fontWeight: 500, color: COLORS.textMuted, marginBottom: 8 }}>Error Handling</div>
                            <div style={{ display: "flex", gap: 8 }}>
                                <Btn small>On Exception</Btn>
                                <Btn small>Retry Policy</Btn>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function DeploymentsPage() {
    const deploys = [
        { route: "order-sync", version: "v2.3.1", target: "dp-prod-01", time: "14:23", status: "running", by: "Developer" },
        { route: "ftp-import", version: "v1.0.5", target: "dp-prod-02", time: "12:10", status: "running", by: "Developer" },
        { route: "sensor-collect", version: "v3.1.0", target: "dp-prod-01", time: "09:45", status: "error", by: "CI/CD" },
        { route: "api-gateway", version: "v1.2.0", target: "dp-staging", time: "어제", status: "deploying", by: "Developer" },
    ];
    return (
        <div style={{ padding: 28 }}>
            <div
                style={{
                    background: COLORS.card,
                    borderRadius: 10,
                    border: `1px solid ${COLORS.border}`,
                    overflow: "hidden",
                }}
            >
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                    <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                        {["Route", "Version", "Data-Plane", "Status", "Deployed", "By"].map((h) => (
                            <th
                                key={h}
                                style={{
                                    textAlign: "left",
                                    padding: "12px 16px",
                                    color: COLORS.textDim,
                                    fontWeight: 500,
                                    fontSize: 11,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                }}
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {deploys.map((d, i) => (
                        <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                            <td style={{ padding: "12px 16px", color: COLORS.text, fontWeight: 500 }}>{d.route}</td>
                            <td style={{ padding: "12px 16px", color: COLORS.primary, fontFamily: "monospace", fontSize: 12 }}>{d.version}</td>
                            <td style={{ padding: "12px 16px", color: COLORS.textMuted, fontFamily: "monospace", fontSize: 12 }}>{d.target}</td>
                            <td style={{ padding: "12px 16px" }}><StatusBadge status={d.status} /></td>
                            <td style={{ padding: "12px 16px", color: COLORS.textDim, fontSize: 12 }}>{d.time}</td>
                            <td style={{ padding: "12px 16px", color: COLORS.textDim, fontSize: 12 }}>{d.by}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function KameletsPage() {
    const kamelets = [
        { name: "korea-address-normalizer", desc: "한국식 주소 정규화", type: "Processor", used: 8 },
        { name: "tax-calculator", desc: "복합 세금 계산", type: "Processor", used: 4 },
        { name: "oracle-cdc-source", desc: "Oracle CDC 소스 커넥터", type: "Source", used: 12 },
        { name: "slack-alert-sink", desc: "Slack 알림 전송", type: "Sink", used: 15 },
        { name: "s3-archive-sink", desc: "AWS S3 아카이빙", type: "Sink", used: 6 },
    ];
    const typeColor = { Source: COLORS.nodeSource, Processor: COLORS.nodeProcessor, Sink: COLORS.nodeSink };
    return (
        <div style={{ padding: 28 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
                {kamelets.map((k, i) => (
                    <div
                        key={i}
                        style={{
                            background: COLORS.card,
                            borderRadius: 10,
                            padding: 18,
                            border: `1px solid ${COLORS.border}`,
                            cursor: "pointer",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
                            <code style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{k.name}</code>
                            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: typeColor[k.type] + "20", color: typeColor[k.type], fontWeight: 500 }}>
                {k.type}
              </span>
                        </div>
                        <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 10 }}>{k.desc}</div>
                        <div style={{ fontSize: 11, color: COLORS.textDim }}>{k.used} routes에서 사용 중</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SettingsPage() {
    const planes = [
        { name: "dp-prod-01", host: "10.0.1.10:8081", status: "running", routes: 18, cpu: "45%" },
        { name: "dp-prod-02", host: "10.0.1.11:8081", status: "running", routes: 12, cpu: "32%" },
        { name: "dp-staging", host: "10.0.2.10:8081", status: "running", routes: 4, cpu: "12%" },
    ];
    return (
        <div style={{ padding: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 14 }}>Data-Plane Instances</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {planes.map((p, i) => (
                    <div
                        key={i}
                        style={{
                            background: COLORS.card,
                            borderRadius: 10,
                            padding: 18,
                            border: `1px solid ${COLORS.border}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 8, background: COLORS.accent + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>💪</div>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{p.name}</div>
                                <div style={{ fontSize: 11, color: COLORS.textDim, fontFamily: "monospace" }}>{p.host}</div>
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>{p.routes}</div>
                                <div style={{ fontSize: 9, color: COLORS.textDim }}>ROUTES</div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.accent }}>{p.cpu}</div>
                                <div style={{ fontSize: 9, color: COLORS.textDim }}>CPU</div>
                            </div>
                            <StatusBadge status={p.status} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Main App ───

export default function App() {
    const [page, setPage] = useState("designer");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const pageConfig = {
        projects: { title: "Projects", subtitle: "4 projects", actions: <Btn variant="primary">+ New Project</Btn> },
        routes: { title: "Routes", subtitle: "All integration routes", actions: <Btn variant="primary">+ New Route</Btn> },
        designer: { title: "Route Designer", subtitle: "order-sync", actions: <><Btn>💾 Save</Btn><Btn variant="primary">🚀 Deploy</Btn></> },
        deployments: { title: "Deployments", subtitle: "Recent deployments", actions: null },
        kamelets: { title: "Kamelet Catalog", subtitle: "Custom adapters", actions: <Btn variant="primary">+ Register</Btn> },
        settings: { title: "Settings", subtitle: "Platform configuration", actions: <Btn variant="primary">+ Add Data-Plane</Btn> },
    };

    const cfg = pageConfig[page];

    const renderPage = () => {
        switch (page) {
            case "projects": return <ProjectsPage />;
            case "routes": return <RoutesPage onOpenDesigner={() => setPage("designer")} />;
            case "designer": return <DesignerPage />;
            case "deployments": return <DeploymentsPage />;
            case "kamelets": return <KameletsPage />;
            case "settings": return <SettingsPage />;
            default: return <ProjectsPage />;
        }
    };

    return (
        <div
            style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                background: COLORS.bg,
                color: COLORS.text,
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                overflow: "hidden",
            }}
        >
            <Sidebar
                active={page}
                onNav={setPage}
                collapsed={sidebarCollapsed}
            />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <Header title={cfg.title} subtitle={cfg.subtitle} actions={cfg.actions} />
                <div style={{ flex: 1, overflow: "auto", display: page === "designer" ? "flex" : "block" }}>
                    {renderPage()}
                </div>
            </div>
        </div>
    );
}