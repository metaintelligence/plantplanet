import { useEffect, useState } from 'react';
import AdminPanel from './components/AdminPanel';
import LogPanel from './components/LogPanel';
import MobilePreview from './components/MobilePreview';
import type { GenerateInput, GenerateResponse, PageConfig } from './types/pageConfig';

const defaultInput: GenerateInput = {
  plantName: '구상나무',
  template: 'mission',
  purpose: 'education',
  audience: 'children',
  language: 'ko',
  season: 'winter',
  estimatedTime: '1min',
  extraRequest: ''
};

export default function App() {
  const [input, setInput] = useState<GenerateInput>(defaultInput);
  const [pageConfig, setPageConfig] = useState<PageConfig | null>(null);
  const [logs, setLogs] = useState<string[]>(['관리자 데모를 시작했습니다.']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/generated-page/latest')
      .then((response) => (response.ok ? response.json() : null))
      .then((data: PageConfig | null) => {
        if (data) {
          setPageConfig(data);
          setLogs((current) => [...current, '최근 생성된 page-config.json을 불러왔습니다.']);
        }
      })
      .catch(() => {
        setLogs((current) => [...current, '최근 생성 페이지가 아직 없습니다.']);
      });
  }, []);

  const generatePage = async () => {
    setIsLoading(true);
    setError(null);
    setLogs((current) => [...current, '페이지 생성 요청을 백엔드로 전송했습니다.']);

    try {
      const response = await fetch('/api/generate-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message ?? '페이지 생성에 실패했습니다.');
      }

      const result = data as GenerateResponse;
      setPageConfig(result.pageConfig);
      setLogs((current) => [
        ...current,
        `작업 ID ${result.jobId} 생성 완료`,
        ...result.logs
      ]);
    } catch (generateError) {
      const message =
        generateError instanceof Error ? generateError.message : '알 수 없는 오류가 발생했습니다.';
      setError(message);
      setLogs((current) => [...current, `오류: ${message}`]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">PlantPlanet PoC</p>
          <h1>식물해설 Text-to-Page 관리자 데모</h1>
        </div>
        <div className="status-pill">승인 대기</div>
      </header>

      <section className="workspace-grid">
        <AdminPanel
          input={input}
          isLoading={isLoading}
          onChange={setInput}
          onGenerate={generatePage}
        />
        <MobilePreview config={pageConfig} isLoading={isLoading} />
      </section>

      {error && <div className="error-banner">{error}</div>}
      <LogPanel logs={logs} />
    </main>
  );
}
