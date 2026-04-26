import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

function MetricCard({ title, value, label, subValue }) {
  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>{title}</h3>
      <div style={styles.cardValue}>{value}</div>
      <div style={styles.cardLabel}>{label}</div>
      {subValue && <div style={styles.cardSubValue}>{subValue}</div>}
    </div>
  );
}

export default function StatusPage() {
  const { isLoading, data, error } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let statusText = "Verificando...";
  let statusColor = "loading";

  if (!isLoading && !error && data) {
    statusText = "Operacional";
    statusColor = "on";
  } else if (error) {
    statusText = "Instável";
    statusColor = "off";
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Sistema Status</h1>
        <div style={styles.statusBadge}>
          <div style={styles.statusDot(statusColor)}></div>
          <span style={styles.statusText}>{statusText}</span>
        </div>
      </header>

      <main style={styles.main}>
        {error && (
          <div style={styles.errorCard}>
            <p>Erro: Falha ao carregar as informações do sistema.</p>
          </div>
        )}

        {!error && data && (
          <div style={styles.grid}>
            <MetricCard
              title="Banco de Dados"
              value={data.dependencies.database.version}
              label="Versão"
            />
            <MetricCard
              title="Conexões Abertas"
              value={data.dependencies.database.opened_connections}
              label="Ativas"
              subValue={`Máximo: ${data.dependencies.database.max_Connections}`}
            />
            <MetricCard
              title="Última Atualização"
              value={new Date(data.update_At).toLocaleTimeString()}
              label={new Date(data.update_At).toLocaleDateString()}
            />
          </div>
        )}

        {isLoading && !data && (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p>Carregando informações do sistema...</p>
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <p>
          © {new Date().getFullYear()} CloneTabNews Status. Todos os sistemas
          monitorados.
        </p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    color: "#f8fafc",
    padding: "2rem 1rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    width: "100%",
    maxWidth: "800px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "3rem",
    borderBottom: "1px solid #1e293b",
    paddingBottom: "1.5rem",
  },
  title: {
    fontSize: "1.875rem",
    fontWeight: "700",
    margin: 0,
    color: "black",
    letterSpacing: "-0.025em",
  },
  statusBadge: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#1e293b",
    padding: "0.5rem 1rem",
    borderRadius: "9999px",
    gap: "0.75rem",
  },
  statusDot: (status) => ({
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor:
      status === "on" ? "#22c55e" : status === "off" ? "#ef4444" : "#eab308",
    boxShadow: `0 0 8px ${status === "on" ? "#22c55e88" : status === "off" ? "#ef444488" : "#eab30888"}`,
    animation: status === "loading" ? "pulse 1.5s infinite" : "none",
  }),
  statusText: {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#e2e8f0",
  },
  main: {
    width: "100%",
    maxWidth: "800px",
    flex: 1,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    backgroundColor: "#1e293b",
    padding: "1.5rem",
    borderRadius: "1rem",
    border: "1px solid #334155",
    transition: "transform 0.2s ease, border-color 0.2s ease",
  },
  cardTitle: {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#94a3b8",
    margin: "0 0 1rem 0",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  cardValue: {
    fontSize: "2.25rem",
    fontWeight: "700",
    color: "#f8fafc",
    margin: "0 0 0.25rem 0",
  },
  cardLabel: {
    fontSize: "0.875rem",
    color: "#64748b",
  },
  cardSubValue: {
    fontSize: "0.75rem",
    color: "#475569",
    marginTop: "0.5rem",
  },
  errorCard: {
    backgroundColor: "#450a0a",
    border: "1px solid #991b1b",
    padding: "1.5rem",
    borderRadius: "0.75rem",
    textAlign: "center",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "4rem 0",
    color: "#94a3b8",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid #1e293b",
    borderTop: "3px solid #3b82f6",
    borderRadius: "50%",
    marginBottom: "1rem",
  },
  footer: {
    marginTop: "4rem",
    color: "#475569",
    fontSize: "0.875rem",
    textAlign: "center",
  },
};
