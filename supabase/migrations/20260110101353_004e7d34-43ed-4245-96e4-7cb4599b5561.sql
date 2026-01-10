-- Drop and recreate policies as PERMISSIVE (default)
DROP POLICY IF EXISTS "Anyone can view skills" ON public.skills;
CREATE POLICY "Anyone can view skills" 
ON public.skills 
FOR SELECT 
TO public
USING (true);

DROP POLICY IF EXISTS "Anyone can view experiences" ON public.experiences;
CREATE POLICY "Anyone can view experiences" 
ON public.experiences 
FOR SELECT 
TO public
USING (true);