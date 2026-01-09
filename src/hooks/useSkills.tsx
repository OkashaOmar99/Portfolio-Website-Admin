import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Skill {
  id: string;
  category: string;
  name: string;
  level: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const useSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('category')
        .order('sort_order');

      if (error) throw error;
      setSkills(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();

    const channel = supabase
      .channel('skills-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'skills' }, () => {
        fetchSkills();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createSkill = async (skill: Omit<Skill, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('skills')
      .insert(skill)
      .select()
      .single();
    if (error) throw error;
    return data;
  };

  const updateSkill = async (id: string, updates: Partial<Omit<Skill, 'id' | 'created_at' | 'updated_at'>>) => {
    const { data, error } = await supabase
      .from('skills')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  };

  const deleteSkill = async (id: string) => {
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) throw error;
  };

  const getCategories = () => {
    const categories = [...new Set(skills.map((s) => s.category))];
    return categories;
  };

  const getSkillsByCategory = () => {
    const grouped: Record<string, Skill[]> = {};
    skills.forEach((skill) => {
      if (!grouped[skill.category]) {
        grouped[skill.category] = [];
      }
      grouped[skill.category].push(skill);
    });
    return grouped;
  };

  return {
    skills,
    isLoading,
    error,
    createSkill,
    updateSkill,
    deleteSkill,
    getCategories,
    getSkillsByCategory,
    refetch: fetchSkills,
  };
};
