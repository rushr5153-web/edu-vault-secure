import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BookOpen, Download, FileText, Lock, ShieldCheck, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { createUploadUrl, saveDocument, getDownloadUrl } from "@/lib/docs.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

const AD_LINK =
  "https://www.profitableratecpmnetwork.com/id0znyyqq?key=ba1509e59bb6ca1813723f7d0b9dda32";
const WAIT_SECONDS = 30;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vidya PDF Library — අධ්‍යාපනික PDF" },
      { name: "description", content: "Notes, past papers සහ අධ්‍යාපනික PDF නොමිලේ download කරගන්න." },
      { property: "og:title", content: "Vidya PDF Library" },
      { property: "og:description", content: "අධ්‍යාපනික PDF නොමිලේ download කරගන්න." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Doc = {
  id: string;
  title: string;
  description: string;
  file_size: number;
  created_at: string;
};

function Index() {
  const { data: docs = [], isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("id,title,description,file_size,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Doc[];
    },
  });

  return (
    <div className="min-h-screen">
      <Toaster />
      <header className="bg-hero text-primary-foreground">
        <div className="mx-auto max-w-5xl px-5 py-14 md:py-20">
          <div className="flex items-center gap-2 text-sm opacity-90">
            <BookOpen className="h-4 w-4" /> Vidya PDF Library
          </div>
          <h1 className="font-display mt-4 text-4xl font-extrabold leading-tight md:text-6xl">
            ඉගෙනීමට අවශ්‍ය <span className="text-accent">PDF</span> එකම තැනක
          </h1>
          <p className="mt-4 max-w-xl opacity-85">
            Notes, past papers, model papers — නොමිලේ download කරගන්න.
          </p>
          <div className="mt-8">
            <UploadDialog />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-12">
        <h2 className="font-display text-2xl font-bold">සියලු PDF</h2>
        {isLoading ? (
          <p className="mt-6 text-muted-foreground">Loading...</p>
        ) : docs.length === 0 ? (
          <p className="mt-6 text-muted-foreground">තවම PDF කිසිවක් නැත.</p>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {docs.map((d) => (
              <DocCard key={d.id} doc={d} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function DocCard({ doc }: { doc: Doc }) {
  const [seconds, setSeconds] = useState<number | null>(null);
  const [downloading, setDownloading] = useState(false);
  const getUrl = useServerFn(getDownloadUrl);

  useEffect(() => {
    if (seconds === null || seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => (s ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const unlocked = seconds === 0;

  function verify() {
    window.open(AD_LINK, "_blank", "noopener");
    setSeconds(WAIT_SECONDS);
  }

  async function download() {
    setDownloading(true);
    try {
      const { url } = await getUrl({ data: { id: doc.id } });
      window.location.href = url;
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <article className="shadow-soft flex flex-col rounded-2xl border bg-card p-6">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-secondary p-3 text-primary">
          <FileText className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold leading-snug">{doc.title}</h3>
          <p className="text-xs text-muted-foreground">
            {(doc.file_size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      </div>
      {doc.description && (
        <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">
          {doc.description}
        </p>
      )}
      <div className="mt-5 flex flex-wrap gap-3 pt-1">
        <Button variant="outline" onClick={verify} disabled={seconds !== null && seconds > 0}>
          <ShieldCheck /> {seconds !== null && seconds > 0 ? `තප්පර ${seconds}...` : "Verify"}
        </Button>
        <Button onClick={download} disabled={!unlocked || downloading}>
          {unlocked ? <Download /> : <Lock />} Download
        </Button>
      </div>
      {!unlocked && (
        <p className="mt-3 text-xs text-muted-foreground">
          Download unlock කරන්න Verify ඔබා තත්පර {WAIT_SECONDS}ක් රැඳී සිටින්න.
        </p>
      )}
    </article>
  );
}

function UploadDialog() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const qc = useQueryClient();
  const getUploadUrl = useServerFn(createUploadUrl);
  const save = useServerFn(saveDocument);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      toast.error("PDF එකක් තෝරන්න");
      return;
    }
    if (file.type !== "application/pdf") {
      toast.error("PDF files පමණයි");
      return;
    }
    setBusy(true);
    try {
      const { path, token } = await getUploadUrl({ data: { password, fileName: file.name } });
      const { error } = await supabase.storage
        .from("pdfs")
        .uploadToSignedUrl(path, token, file, { contentType: "application/pdf" });
      if (error) throw error;
      await save({ data: { password, title, description, path, size: file.size } });
      toast.success("Upload සාර්ථකයි!");
      setTitle("");
      setDescription("");
      setFile(null);
      setPassword("");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["documents"] });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="lg">
          <Upload /> PDF Upload
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>PDF එකක් Upload කරන්න</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200} />
          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
            rows={4}
          />
          <Input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required />
          <Input
            type="password"
            placeholder="Admin password"
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Uploading..." : "Upload"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
