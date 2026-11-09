/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HeritageRecord } from './types/heritage';
import { Navbar, ScreenTab } from './components/Navbar';
import { Footer } from './components/Footer';
import { ConverterScreen } from './components/ConverterScreen';
import { LibraryScreen } from './components/LibraryScreen';
import { AiAssistantScreen } from './components/AiAssistantScreen';
import { SourcesScreen } from './components/SourcesScreen';
import { AboutScreen } from './components/AboutScreen';
import { ModalDetail } from './components/ModalDetail';
import { Sparkles, Database, Bot, Layers, Info } from 'lucide-react';

import defaultHeritageData from '../data/disan.json';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ScreenTab>('ai-qa');
  const [records, setRecords] = useState<HeritageRecord[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('disan_local_records');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('Could not read cached records:', e);
      }
    }
    return defaultHeritageData as HeritageRecord[];
  });
  const [selectedRecord, setSelectedRecord] = useState<HeritageRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch updated records from backend if available
  useEffect(() => {
    const fetchHeritageData = async () => {
      try {
        const res = await fetch('/api/heritage');
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            setRecords(json.data);
          }
        }
      } catch {
        // On static hosting like Vercel, defaultHeritageData is already active
      }
    };

    fetchHeritageData();
  }, []);

  // Save converted record into records list and sync with backend / localStorage
  const handleSaveToLibrary = async (newRecord: HeritageRecord) => {
    setRecords((prev) => {
      const updated = [newRecord, ...prev];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('disan_local_records', JSON.stringify(updated));
        } catch {
          // ignore storage error
        }
      }
      return updated;
    });

    try {
      await fetch('/api/heritage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord),
      });
    } catch {
      // Graceful fallback on static hosting
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-100/60 text-stone-900 selection:bg-amber-200 selection:text-amber-950 font-sans pb-16 sm:pb-0">
      {/* Navigation Header with ALWAYS visible 5-Screen strip */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        totalRecordsCount={records.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'converter' && (
          <ConverterScreen
            onSaveToLibrary={handleSaveToLibrary}
            totalRecordsCount={records.length}
            onNavigateToLibrary={() => setCurrentTab('library')}
            onNavigateToScreen={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'library' && (
          <LibraryScreen
            records={records}
            onSelectRecord={(rec) => setSelectedRecord(rec)}
          />
        )}

        {currentTab === 'ai-qa' && (
          <AiAssistantScreen
            records={records}
            onOpenRecord={(rec) => setSelectedRecord(rec)}
          />
        )}

        {currentTab === 'sources' && <SourcesScreen />}

        {currentTab === 'about' && <AboutScreen />}
      </main>

      {/* Detail Modal */}
      <ModalDetail
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />

      {/* Footer */}
      <Footer onNavigate={(tab) => setCurrentTab(tab)} />

      {/* Persistent Bottom Mobile Navigation Bar for 1-Tap Screen Switching */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-stone-950/95 backdrop-blur-md border-t border-stone-800 px-1 py-1.5 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setCurrentTab('converter')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors ${
            currentTab === 'converter'
              ? 'text-amber-400 font-bold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Chuyển đổi</span>
        </button>

        <button
          onClick={() => setCurrentTab('library')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors ${
            currentTab === 'library'
              ? 'text-amber-400 font-bold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Thư viện</span>
        </button>

        <button
          onClick={() => setCurrentTab('ai-qa')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors ${
            currentTab === 'ai-qa'
              ? 'text-amber-400 font-bold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>AI Tra cứu</span>
        </button>

        <button
          onClick={() => setCurrentTab('sources')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors ${
            currentTab === 'sources'
              ? 'text-amber-400 font-bold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Nguồn tư liệu</span>
        </button>

        <button
          onClick={() => setCurrentTab('about')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors ${
            currentTab === 'about'
              ? 'text-amber-400 font-bold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>Giới thiệu</span>
        </button>
      </div>
    </div>
  );
}
