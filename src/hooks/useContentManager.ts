import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

type ContentType = "program" | "gallery" | "reservations" | "blog" | "partners" | "editions";

export function useContentManager<T>(contentType: ContentType, defaultData: T) {
  const storageKey = `festival_${contentType}`;
  const [data, setData, isLoading] = useLocalStorage<T>(storageKey, defaultData);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const stored = window.localStorage.getItem(storageKey);
        if (!stored) {
          const response = await fetch(`/data/${contentType}.json`);
          const jsonData = await response.json();
          setData(jsonData);
        }
      } catch (error) {
        console.error(`Error loading ${contentType} data:`, error);
      }
    };

    loadInitialData();
  }, [contentType, storageKey, setData]);

  const exportData = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${contentType}-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setData(imported);
          resolve(imported);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const resetData = async () => {
    try {
      const response = await fetch(`/data/${contentType}.json`);
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error(`Error resetting ${contentType} data:`, error);
    }
  };

  return {
    data,
    setData,
    isLoading,
    exportData,
    importData,
    resetData,
  };
}