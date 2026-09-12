import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import toast from 'react-hot-toast';

export const DropzoneUpload = () => {
  const { uploadResume, isUploading, resumeData } = useResumeStore();

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      toast.error('Please upload a valid PDF or DOCX file (max 10MB).');
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      try {
        await uploadResume(file);
      } catch (err) {
        // Handled in store
      }
    }
  }, [uploadResume]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isUploading
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`relative group cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
          isDragActive
            ? 'border-indigo-500 dark:bg-indigo-950/40 bg-indigo-50 scale-[1.01]'
            : isDragReject
            ? 'border-rose-500 dark:bg-rose-950/30 bg-rose-50'
            : 'dark:border-slate-700/80 border-slate-300 dark:bg-slate-900/40 bg-white hover:border-indigo-500/60 dark:hover:bg-slate-900/70 hover:bg-slate-50/80 shadow-sm'
        } ${isUploading ? 'opacity-75 pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} />

        {/* Cyber corner accents */}
        <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-indigo-400/50 group-hover:border-indigo-500 transition" />
        <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-indigo-400/50 group-hover:border-indigo-500 transition" />
        <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-indigo-400/50 group-hover:border-indigo-500 transition" />
        <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-indigo-400/50 group-hover:border-indigo-500 transition" />

        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Animated Icon */}
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl dark:bg-indigo-500/10 bg-indigo-50 border dark:border-indigo-500/30 border-indigo-200 flex items-center justify-center dark:text-indigo-400 text-indigo-600 shadow-inner group-hover:scale-110 transition transform duration-200">
              {isUploading ? (
                <Loader2 className="w-8 h-8 animate-spin dark:text-cyan-400 text-indigo-600" />
              ) : isDragActive ? (
                <Sparkles className="w-8 h-8 dark:text-cyan-300 text-indigo-500 animate-bounce" />
              ) : (
                <UploadCloud className="w-8 h-8 group-hover:text-indigo-500 transition" />
              )}
            </div>
            {resumeData && !isUploading && (
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            )}
          </div>

          {/* Text Instructions */}
          <div className="space-y-1.5 max-w-sm">
            {isUploading ? (
              <div>
                <h4 className="font-semibold dark:text-slate-100 text-slate-800 text-sm flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-500 animate-spin" />
                  Gemini 1.5 Flash is parsing your resume...
                </h4>
                <p className="text-xs dark:text-slate-400 text-slate-500 mt-1">
                  Extracting skill taxonomy, job titles, and experience metrics
                </p>
              </div>
            ) : isDragActive ? (
              <p className="text-sm font-semibold dark:text-cyan-300 text-indigo-600">
                Drop your resume file here to parse...
              </p>
            ) : (
              <>
                <h4 className="font-semibold dark:text-slate-200 text-slate-800 text-sm">
                  Drag and drop your resume, or <span className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2">browse files</span>
                </h4>
                <p className="text-xs dark:text-slate-400 text-slate-500">
                  Supports PDF or Word (.docx) documents up to 10MB
                </p>
              </>
            )}
          </div>

          {/* Current File Status Pill */}
          {resumeData?.filename && !isUploading && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg dark:bg-slate-800/80 bg-slate-100 border dark:border-slate-700 border-slate-200 text-xs dark:text-slate-300 text-slate-700 font-mono">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span className="truncate max-w-[220px] font-medium">{resumeData.filename}</span>
              {resumeData.filesize && (
                <span className="dark:text-slate-500 text-slate-400">({resumeData.filesize})</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
