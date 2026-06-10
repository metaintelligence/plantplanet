export default function LogPanel({ logs }: { logs: string[] }) {
  return (
    <section className="log-panel">
      <div className="panel-heading compact">
        <div>
          <p className="eyebrow">Runtime</p>
          <h2>작업 로그</h2>
        </div>
      </div>
      <ol>
        {logs.map((log, index) => (
          <li key={`${log}-${index}`}>{log}</li>
        ))}
      </ol>
    </section>
  );
}
