"use client";

import { useEffect, useRef, useState } from "react";

type WordDetailActionsProps = {
  word: string;
  variant: "pronunciation" | "synonym-placeholder";
};

export function WordDetailActions({ word, variant }: WordDetailActionsProps) {
  const [speechSupported, setSpeechSupported] = useState<boolean | null>(null);
  const [placeholderVisible, setPlaceholderVisible] = useState(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const supported =
      "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
    let supportTimer: number | undefined;

    if (supported) {
      const loadVoices = () => {
        voicesRef.current = window.speechSynthesis.getVoices();
      };

      loadVoices();
      window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
      supportTimer = window.setTimeout(() => setSpeechSupported(true), 0);

      return () => {
        window.clearTimeout(supportTimer);
        window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
        window.speechSynthesis.cancel();
      };
    }

    supportTimer = window.setTimeout(() => setSpeechSupported(false), 0);
    return () => window.clearTimeout(supportTimer);
  }, []);

  if (variant === "synonym-placeholder") {
    return (
      <div>
        <button
          type="button"
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          onClick={() => setPlaceholderVisible(true)}
        >
          查看近义词辨析
        </button>
        {placeholderVisible && (
          <p className="mt-3 text-sm text-slate-600" role="status">
            AI 近义词辨析将在后续版本接入
          </p>
        )}
      </div>
    );
  }

  function speakWord() {
    if (!speechSupported) return;

    try {
      const synthesis = window.speechSynthesis;
      const availableVoices = synthesis.getVoices();
      if (availableVoices.length > 0) {
        voicesRef.current = availableVoices;
      }

      const englishVoice = voicesRef.current.find(
        (voice) => voice.lang.toLowerCase() === "en-us",
      ) ?? voicesRef.current.find(
        (voice) => voice.lang.toLowerCase() === "en-gb",
      ) ?? voicesRef.current.find(
        (voice) => voice.lang.toLowerCase().startsWith("en"),
      );

      const utterance = new SpeechSynthesisUtterance(word);
      utterance.text = word;
      utterance.lang = englishVoice?.lang ?? "en-US";
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      if (englishVoice) utterance.voice = englishVoice;

      utterance.onend = () => {
        utteranceRef.current = null;
      };
      utterance.onerror = (event) => {
        console.warn("单词发音播放失败", {
          word,
          error: event.error,
        });
        utteranceRef.current = null;
      };

      utteranceRef.current = utterance;
      synthesis.cancel();
      synthesis.speak(utterance);
    } catch (error) {
      console.error("无法启动单词发音", { word, error });
      utteranceRef.current = null;
    }
  }

  return (
    <div className="flex items-center">
      <button
        type="button"
        className="inline-flex size-8 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:text-slate-300"
        onClick={speakWord}
        disabled={speechSupported !== true}
        aria-label={`播放 ${word} 的发音`}
        title={speechSupported === false ? "当前浏览器暂不支持发音播放" : "播放发音"}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 5 6.5 9H3v6h3.5L11 19V5Z" />
          <path d="M15 9.5a4 4 0 0 1 0 5" />
          <path d="M18 7a7.5 7.5 0 0 1 0 10" />
        </svg>
      </button>
      {speechSupported === false && (
        <span className="sr-only">当前浏览器暂不支持发音播放</span>
      )}
    </div>
  );
}
