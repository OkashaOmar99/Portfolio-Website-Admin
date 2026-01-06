-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy for user_roles - admins can view all, users can view their own
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Create portfolio_items table
CREATE TABLE public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  techstack TEXT[] NOT NULL DEFAULT '{}',
  images TEXT[] NOT NULL DEFAULT '{}',
  metrics JSONB DEFAULT '{"timeSaved": "0%", "leads": "0", "roi": "0x"}',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on portfolio_items
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

-- Public can read all portfolio items
CREATE POLICY "Anyone can view portfolio items"
ON public.portfolio_items
FOR SELECT
USING (true);

-- Only admins can insert portfolio items
CREATE POLICY "Admins can insert portfolio items"
ON public.portfolio_items
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update portfolio items
CREATE POLICY "Admins can update portfolio items"
ON public.portfolio_items
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete portfolio items
CREATE POLICY "Admins can delete portfolio items"
ON public.portfolio_items
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_portfolio_items_updated_at
BEFORE UPDATE ON public.portfolio_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate slug from title
CREATE OR REPLACE FUNCTION public.generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(REGEXP_REPLACE(REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Enable realtime for portfolio_items
ALTER PUBLICATION supabase_realtime ADD TABLE public.portfolio_items;

-- Create storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-images', 'portfolio-images', true);

-- Storage policies for portfolio images
CREATE POLICY "Portfolio images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'portfolio-images');

CREATE POLICY "Admins can upload portfolio images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update portfolio images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete portfolio images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-images' AND public.has_role(auth.uid(), 'admin'));