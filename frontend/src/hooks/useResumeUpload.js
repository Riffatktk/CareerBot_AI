import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadResume, startAgent } from "@/api/client";
import { useAgentStore } from "@/store/agentStore";
import { MAX_FILE_SIZE_MB } from "@/utils/constants";

function buildDemoFile(profile) {
  const content = `Demo profile: ${profile.title}\nSkills: ${profile.skills.join(", ")}`;
  const blob = new Blob([content], { type: "application/pdf" });
  const filename = `${profile.title.replace(/[^a-z0-9]+/gi, "_")}.pdf`;
  return new File([blob], filename, { type: "application/pdf" });
}

export function useResumeUpload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState(null);
  const [parsedResume, setParsedResume] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const setAgentData = useAgentStore((s) => s.setAgentData);
  const setResume = useAgentStore((s) => s.setResume);

  const handleFileDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setError(null);
      setSelectedDemo(null);
      setFile(acceptedFiles[0]);
      setParsedResume(null);
    }
  }, []);

  const handleFileReject = useCallback((rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      const tooLarge = rejection.errors?.some(
        (e) => e.code === "file-too-large"
      );
      setError(
        tooLarge
          ? `File is too large. Maximum size is ${MAX_FILE_SIZE_MB} MB.`
          : "Only PDF and DOCX files are supported. Please try again."
      );
    }
  }, []);

  const handleDemoSelect = useCallback((profile) => {
    setError(null);
    setFile(null);
    setParsedResume(null);
    setSelectedDemo((current) =>
      current?.id === profile.id ? null : profile
    );
    setPrompt(profile.default_prompt);
  }, []);

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    setSelectedDemo(null);
    setParsedResume(null);
    setError(null);
  }, []);

  const handlePromptChange = useCallback((value) => {
    setPrompt(value);
  }, []);

  const canSubmit =
    Boolean(file || selectedDemo) &&
    prompt.trim().length > 0 &&
    !isUploading &&
    !isStarting;

  const handleSubmit = useCallback(async () => {
    if (!(file || selectedDemo) || prompt.trim().length === 0) return;

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    const uploadTarget = file || buildDemoFile(selectedDemo);
    const progressTimer = setInterval(() => {
      setUploadProgress((p) => (p < 90 ? p + 10 : p));
    }, 120);

    let resumeResponse;
    try {
      resumeResponse = await uploadResume(uploadTarget);
      setUploadProgress(100);
      setParsedResume(resumeResponse.parsed || null);
      setResume(resumeResponse);
    } catch (err) {
      setError(err.message);
      setIsUploading(false);
      clearInterval(progressTimer);
      return;
    }
    clearInterval(progressTimer);
    setIsUploading(false);

    setIsStarting(true);
    try {
      const agentResponse = await startAgent({
        resumeId: resumeResponse.resume_id,
        prompt: prompt.trim(),
      });
      setAgentData(agentResponse);
      navigate("/job-feed");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsStarting(false);
    }
  }, [file, selectedDemo, prompt, setAgentData, setResume, navigate]);

  return {
    file,
    selectedDemo,
    prompt,
    isUploading,
    isStarting,
    error,
    parsedResume,
    uploadProgress,
    canSubmit,
    handleFileDrop,
    handleFileReject,
    handleDemoSelect,
    handleRemoveFile,
    handlePromptChange,
    handleSubmit,
    setError,
  };
}
