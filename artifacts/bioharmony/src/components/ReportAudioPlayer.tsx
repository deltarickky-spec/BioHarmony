import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Download, Loader2, Headphones, Volume2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface Props {
  cacheKey: string;
  scriptText: string;
  clientName: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type PlayerState = "idle" | "loading" | "ready" | "error";

export function ReportAudioPlayer({ cacheKey, scriptText, clientName }: Props) {
  const { language } = useLanguage();
  const effectiveCacheKey = `${cacheKey}-${language}`;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>("idle");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
      audioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    audioRef.current?.pause();
    audioRef.current = null;
    blobUrlRef.current = null;
    setPlayerState("idle");
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setErrorMsg("");
  }, [effectiveCacheKey]);

  const loadAudio = useCallback(async () => {
    setPlayerState("loading");
    setErrorMsg("");
    try {
      const res = await fetch(`${BASE}/api/narrate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: scriptText, cacheKey: effectiveCacheKey, language }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Audio generation failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      blobUrlRef.current = url;

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onloadedmetadata = () => setDuration(audio.duration);
      audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setPlayerState("error");
        setErrorMsg("Audio playback error.");
      };

      await audio.load();
      setPlayerState("ready");
    } catch (err) {
      setPlayerState("error");
      setErrorMsg(err instanceof Error ? err.message : "Could not generate audio.");
    }
  }, [effectiveCacheKey, scriptText, language]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      void audio.play();
      setIsPlaying(true);
    }
  }

  function seek(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    if (!audio) return;
    const t = Number(e.target.value);
    audio.currentTime = t;
    setCurrentTime(t);
  }

  function downloadAudio() {
    if (!blobUrlRef.current) return;
    const a = document.createElement("a");
    a.href = blobUrlRef.current;
    a.download = `BioHarmony_Report_${clientName.replace(/\s+/g, "")}_Audio.mp3`;
    a.click();
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="rounded-2xl border border-[#0F5C5E]/30 bg-gradient-to-br from-[#0C1919] to-[#091515] overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-3 px-5 pt-5 pb-4 border-b border-white/[0.06]">
        <div className="mt-0.5 w-8 h-8 rounded-lg bg-[#0F5C5E]/30 border border-[#0F5C5E]/40 flex items-center justify-center flex-shrink-0">
          <Headphones className="w-4 h-4 text-[#4ecdc4]" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-[#BFA14A] text-[10px] uppercase tracking-[0.18em] mb-1">Audio Report</p>
          <h4 className="text-[#F4EFE6] text-sm font-medium leading-snug">Listen to Your Report</h4>
          <p className="text-[#F4EFE6]/40 text-xs mt-1 leading-relaxed">
            {language === "en"
              ? "Prefer to listen? Your full report is available as an audio walkthrough."
              : `Audio narration will be generated in your selected language.`}
          </p>
        </div>
      </div>

      {/* Player area */}
      <div className="px-5 py-4">
        {playerState === "idle" && (
          <button
            onClick={() => void loadAudio()}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#0F5C5E] border border-[#BFA14A]/20 text-[#F4EFE6] text-sm font-medium shadow-[0_0_16px_rgba(15,92,94,0.4)] hover:shadow-[0_0_24px_rgba(15,92,94,0.6)] hover:bg-[#0F5C5E]/80 transition-all duration-200"
          >
            <Volume2 className="w-4 h-4" />
            Generate Audio
          </button>
        )}

        {playerState === "loading" && (
          <div className="flex items-center gap-3 text-[#F4EFE6]/50 text-sm py-1">
            <Loader2 className="w-4 h-4 animate-spin text-[#BFA14A]/70" />
            <span>Generating your audio narration…</span>
          </div>
        )}

        {playerState === "error" && (
          <div className="flex items-center justify-between">
            <p className="text-red-400/70 text-xs">{errorMsg}</p>
            <button
              onClick={() => void loadAudio()}
              className="text-[#BFA14A]/60 text-xs hover:text-[#BFA14A] underline underline-offset-2 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {playerState === "ready" && (
          <div className="flex items-center gap-4">
            {/* Play / Pause */}
            <button
              onClick={togglePlay}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0F5C5E] border border-[#BFA14A]/25 flex items-center justify-center shadow-[0_0_12px_rgba(15,92,94,0.5)] hover:shadow-[0_0_20px_rgba(15,92,94,0.7)] hover:bg-[#0F5C5E]/80 transition-all duration-200"
            >
              {isPlaying
                ? <Pause className="w-4 h-4 text-[#F4EFE6]" fill="currentColor" />
                : <Play className="w-4 h-4 text-[#F4EFE6] ml-0.5" fill="currentColor" />
              }
            </button>

            {/* Progress + time */}
            <div className="flex-1 min-w-0">
              <div className="relative group">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  value={currentTime}
                  onChange={seek}
                  className="w-full h-1 appearance-none bg-white/10 rounded-full cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-3
                    [&::-webkit-slider-thumb]:h-3
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-[#BFA14A]
                    [&::-webkit-slider-thumb]:shadow-[0_0_6px_rgba(191,161,74,0.6)]
                    [&::-webkit-slider-track]:rounded-full"
                  style={{
                    background: `linear-gradient(to right, #BFA14A ${progress}%, rgba(255,255,255,0.1) ${progress}%)`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[#F4EFE6]/35 text-[10px] tabular-nums">{formatTime(currentTime)}</span>
                <span className="text-[#F4EFE6]/35 text-[10px] tabular-nums">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Download */}
            <button
              onClick={downloadAudio}
              title="Download MP3"
              className="flex-shrink-0 w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[#F4EFE6]/40 hover:text-[#BFA14A] hover:border-[#BFA14A]/30 hover:bg-white/[0.04] transition-all duration-150"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
