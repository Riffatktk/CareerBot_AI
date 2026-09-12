import React, { useState } from 'react';
import { X, Server, CheckCircle2, AlertCircle, RefreshCw, Cpu } from 'lucide-react';
import { setApiBaseUrl, setMockMode, isMockModeEnabled } from '../../api/axios';
import toast from 'react-hot-toast';
import axios from 'axios';

export const ApiSettingsModal = ({ isOpen, onClose }) => {
  const currentUrl = localStorage.getItem('careerbot_api_url') || 'http://localhost:8000';
  const [url, setUrl] = useState(currentUrl);
  const [useMock, setUseMock] = useState(isMockModeEnabled());
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await axios.get(`${url}/docs`, { timeout: 3000 });
      setTestResult({ success: true, message: `FastAPI Connected! (Status: ${res.status})` });
      toast.success('FastAPI backend connection successful!');
    } catch (e) {
      setTestResult({
        success: false,
        message: e.code === 'ERR_NETWORK' 
          ? 'FastAPI server not reachable at this URL. Is uvicorn running?' 
          : `Backend responded with: ${e.message}`
      });
      toast.error('Backend offline or unreachable.');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    setApiBaseUrl(url);
    setMockMode(useMock);
    toast.success('API configuration updated!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#111827] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2 text-slate-100 font-bold text-lg">
            <Server className="w-5 h-5 text-indigo-400" />
            Backend Connection Settings
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Mock Mode Toggle */}
          <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/20">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-200">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  Standalone Demo / Mock Mode
                </div>
                <p className="text-xs text-slate-400">
                  Simulates full Gemini AI extraction, JobSpy scraping, & APScheduler cron loops without running FastAPI.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useMock}
                  onChange={(e) => setUseMock(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>

          {/* FastAPI Base URL input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              FastAPI Endpoint URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="http://localhost:8000"
                className="flex-1 px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
              />
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg flex items-center gap-1 transition"
              >
                {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Server className="w-3.5 h-3.5" />}
                Test
              </button>
            </div>
          </div>

          {/* Connection Test Result */}
          {testResult && (
            <div className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
              testResult.success 
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' 
                : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
            }`}>
              {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />}
              <div>{testResult.message}</div>
            </div>
          )}

          <div className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-800/80 pt-3">
            <span className="font-semibold text-slate-400">Endpoints implemented:</span> <code className="text-indigo-300">POST /api/resume/upload</code>, <code className="text-indigo-300">POST /api/agent/start</code>, <code className="text-indigo-300">POST /api/agent/stop</code>, <code className="text-indigo-300">GET /api/agent/status</code>, <code className="text-indigo-300">GET /api/jobs</code>.
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/60">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition shadow-lg shadow-indigo-600/20"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
