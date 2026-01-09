import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  duration: string | null;
  location: string;
  type: string;
  description: string;
  skills: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const useExperiences = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      setExperiences(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();

    const channel = supabase
      .channel('experiences-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'experiences' }, () => {
        fetchExperiences();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createExperience = async (experience: Omit<Experience, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('experiences')
      .insert(experience)
      .select()
      .single();
    if (error) throw error;
    return data;
  };

  const updateExperience = async (id: string, updates: Partial<Omit<Experience, 'id' | 'created_at' | 'updated_at'>>) => {
    const { data, error } = await supabase
      .from('experiences')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  };

  const deleteExperience = async (id: string) => {
    const { error } = await supabase.from('experiences').delete().eq('id', id);
    if (error) throw error;
  };

  const reorderExperiences = async (orderedIds: string[]) => {
    const updates = orderedIds.map((id, index) => 
      supabase.from('experiences').update({ sort_order: index + 1 }).eq('id', id)
    );
    await Promise.all(updates);
    await fetchExperiences();
  };

  return {
    experiences,
    isLoading,
    error,
    createExperience,
    updateExperience,
    deleteExperience,
    reorderExperiences,
    refetch: fetchExperiences,
  };
};
