-- Fix RLS policies for skills table - allow public read access
DROP POLICY IF EXISTS "Anyone can view skills" ON public.skills;
CREATE POLICY "Anyone can view skills" 
ON public.skills 
FOR SELECT 
USING (true);

-- Fix RLS policies for experiences table - allow public read access
DROP POLICY IF EXISTS "Anyone can view experiences" ON public.experiences;
CREATE POLICY "Anyone can view experiences" 
ON public.experiences 
FOR SELECT 
USING (true);