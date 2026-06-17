import { useCallback, useEffect, useState } from 'react';
import { appText } from '../data/appText';
import { fetchContents, fetchGenerationJobs } from '../services/serverDataClient';
import type { GeneratedContent, MockDatabase, PlantRecord } from '../types/content';
import type { LayoutGenerationJob } from '../types/generationJob';

export function useServerContentData() {
  const [plants, setPlants] = useState<PlantRecord[]>([]);
  const [contents, setContents] = useState<GeneratedContent[]>([]);
  const [generationJobs, setGenerationJobs] = useState<LayoutGenerationJob[]>([]);
  const [dbError, setDbError] = useState<string | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}mock_db.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(appText.errors.loadMockDbFailed);
        }
        return response.json() as Promise<MockDatabase>;
      })
      .then((database) => {
        setPlants(database.plants);
        setDbError(null);
      })
      .catch((error) => {
        setDbError(error instanceof Error ? error.message : appText.errors.loadMockDbFallback);
      });
  }, []);

  const refreshServerData = useCallback(async () => {
    try {
      const [nextContents, nextJobs] = await Promise.all([fetchContents(), fetchGenerationJobs()]);
      setContents(nextContents);
      setGenerationJobs(nextJobs);
      setContentError(null);
    } catch (error) {
      setContentError(error instanceof Error ? error.message : appText.errors.loadServerDataFallback);
    }
  }, []);

  useEffect(() => {
    void refreshServerData();
    const intervalId = window.setInterval(() => {
      void refreshServerData();
    }, 5000);
    return () => window.clearInterval(intervalId);
  }, [refreshServerData]);

  return {
    plants,
    contents,
    setContents,
    generationJobs,
    setGenerationJobs,
    dbError,
    contentError,
    refreshServerData
  };
}
