-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploaded-files', 'uploaded-files', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for uploaded files
CREATE POLICY "Users can upload their own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'uploaded-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'uploaded-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'uploaded-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create files table to store file metadata
CREATE TABLE public.files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  filename TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own files"
ON public.files FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own files"
ON public.files FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own files"
ON public.files FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create queries table to store AI queries and responses
CREATE TABLE public.queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  file_id UUID REFERENCES public.files(id) ON DELETE CASCADE,
  query_text TEXT NOT NULL,
  response TEXT,
  chart_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.queries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own queries"
ON public.queries FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own queries"
ON public.queries FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own queries"
ON public.queries FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX idx_files_user_id ON public.files(user_id);
CREATE INDEX idx_queries_user_id ON public.queries(user_id);
CREATE INDEX idx_queries_file_id ON public.queries(file_id);