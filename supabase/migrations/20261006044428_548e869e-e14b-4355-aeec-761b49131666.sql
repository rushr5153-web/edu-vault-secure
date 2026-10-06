CREATE TABLE public.documents (id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', file_path TEXT NOT NULL, file_size BIGINT NOT NULL DEFAULT 0, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
GRANT SELECT ON public.documents TO anon, authenticated;
GRANT ALL ON public.documents TO service_role;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view documents" ON public.documents FOR SELECT TO anon, authenticated USING (true);