-- Storage Buckets Creation (To be run manually in Supabase Dashboard if not using seed)
INSERT INTO storage.buckets (id, name, public) VALUES 
('estimation-photos', 'estimation-photos', false),
('estimation-plans', 'estimation-plans', false),
('quotes-pdf', 'quotes-pdf', false),
('user-logos', 'user-logos', false),
('blog-images', 'blog-images', true),
('site-assets', 'site-assets', true);

-- Storage bucket policies mappings
CREATE OR REPLACE FUNCTION storage.foldername(name text)
RETURNS text[] AS $$
BEGIN
  RETURN string_to_array(name, '/');
END;
$$ LANGUAGE plpgsql;

-- Policies for estimation-photos
CREATE POLICY "Auth users can upload photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'estimation-photos' AND auth.role() = 'authenticated');
CREATE POLICY "Users can read own photos" ON storage.objects FOR SELECT USING (bucket_id = 'estimation-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policies for estimation-plans 
CREATE POLICY "Auth users can upload plans" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'estimation-plans' AND auth.role() = 'authenticated');
CREATE POLICY "Users can read own plans" ON storage.objects FOR SELECT USING (bucket_id = 'estimation-plans' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policies for quotes-pdf
CREATE POLICY "Admins can upload pdfs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'quotes-pdf' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
CREATE POLICY "Users can read own pdfs" ON storage.objects FOR SELECT USING (bucket_id = 'quotes-pdf' AND auth.uid()::text = (storage.foldername(name))[1] /* Or similar logic based on metadata */);

-- Policies for user-logos
CREATE POLICY "Users can upload logos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'user-logos' AND auth.role() = 'authenticated');
CREATE POLICY "Users can read own logos" ON storage.objects FOR SELECT USING (bucket_id = 'user-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Public buckets
CREATE POLICY "Public can read blog images" ON storage.objects FOR SELECT USING (bucket_id = 'blog-images');
CREATE POLICY "Public can read site assets" ON storage.objects FOR SELECT USING (bucket_id = 'site-assets');

CREATE POLICY "Admins can upload blog images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'blog-images' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
CREATE POLICY "Admins can upload site assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'site-assets' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
