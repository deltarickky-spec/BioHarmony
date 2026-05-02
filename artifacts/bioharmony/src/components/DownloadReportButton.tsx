import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { FileText, FileDown, Loader2, ChevronDown } from "lucide-react";
import { BioHarmonyReportPDF } from "@/lib/reportPDF";
import { generateDOCX } from "@/lib/reportDOCX";
import type { ReportData } from "@/lib/reportData";
import { cn } from "@/lib/utils";

function slugName(name: string) {
  return name.replace(/\s+/g, "");
}

function slugDate(date: string) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return date.replace(/\s+/g, "-");
  return d.toISOString().split("T")[0];
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

interface Props {
  data: ReportData;
  className?: string;
}

export function DownloadReportButton({ data, className }: Props) {
  const [loading, setLoading] = useState<"pdf" | "docx" | null>(null);
  const [open, setOpen] = useState(false);

  const baseName = `BioHarmony_Report_${slugName(data.clientName)}_${slugDate(data.date)}`;

  async function downloadPDF() {
    setLoading("pdf");
    setOpen(false);
    try {
      const blob = await pdf(<BioHarmonyReportPDF data={data} />).toBlob();
      triggerDownload(blob, `${baseName}.pdf`);
    } catch (err) {
      console.error("PDF generation failed", err);
    } finally {
      setLoading(null);
    }
  }

  async function downloadDOCX() {
    setLoading("docx");
    setOpen(false);
    try {
      const blob = await generateDOCX(data);
      triggerDownload(blob, `${baseName}.docx`);
    } catch (err) {
      console.error("DOCX generation failed", err);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className={cn("relative inline-flex", className)}>
      {/* Primary PDF button */}
      <button
        onClick={downloadPDF}
        disabled={loading !== null}
        className="flex items-center gap-2 pl-5 pr-3 py-2.5 rounded-l-full bg-[#0F5C5E] border border-[#BFA14A]/25 text-[#F4EFE6] text-sm font-medium hover:bg-[#0F5C5E]/80 disabled:opacity-60 transition-all duration-200 shadow-[0_0_16px_rgba(191,161,74,0.2)] hover:shadow-[0_0_24px_rgba(191,161,74,0.35)]"
      >
        {loading === "pdf" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileDown className="w-4 h-4" />
        )}
        {loading === "pdf" ? "Generating PDF…" : "Download PDF"}
      </button>

      {/* Divider */}
      <div className="w-px bg-[#BFA14A]/20 self-stretch" />

      {/* DOCX dropdown toggle */}
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={loading !== null}
        className="flex items-center px-3 py-2.5 rounded-r-full bg-[#0F5C5E] border border-l-0 border-[#BFA14A]/25 text-[#F4EFE6]/70 hover:text-[#F4EFE6] hover:bg-[#0F5C5E]/80 disabled:opacity-60 transition-all duration-200"
        aria-label="More download options"
      >
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-white/10 bg-[#0C1919]/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden z-50">
          <button
            onClick={downloadDOCX}
            disabled={loading !== null}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#F4EFE6]/70 hover:text-[#F4EFE6] hover:bg-white/5 transition-colors duration-150 disabled:opacity-50"
          >
            {loading === "docx" ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#BFA14A]" />
            ) : (
              <FileText className="w-4 h-4 text-[#BFA14A]/60" />
            )}
            {loading === "docx" ? "Generating…" : "Download DOCX"}
          </button>
        </div>
      )}
    </div>
  );
}
