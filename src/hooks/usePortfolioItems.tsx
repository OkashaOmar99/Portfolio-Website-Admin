import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  techstack: string[];
  images: string[];
  metrics: {
    timeSaved: string;
    leads: string;
    roi: string;
  };
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const usePortfolioItems = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('sort_order')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to ensure proper typing
      const transformedData = (data || []).map(item => ({
        ...item,
        metrics: item.metrics as PortfolioItem['metrics']
      }));
      
      setItems(transformedData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();

    // Set up realtime subscription
    const channel = supabase
      .channel('portfolio-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'portfolio_items'
        },
        () => {
          fetchItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const createItem = async (item: Omit<PortfolioItem, 'id' | 'slug' | 'created_at' | 'updated_at'>) => {
    const slug = generateSlug(item.title);
    const { data, error } = await supabase
      .from('portfolio_items')
      .insert({ ...item, slug })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  };

  const updateItem = async (id: string, updates: Partial<Omit<PortfolioItem, 'id' | 'created_at' | 'updated_at'>>) => {
    const updateData: Record<string, unknown> = { ...updates };
    if (updates.title) {
      updateData.slug = generateSlug(updates.title);
    }
    
    const { data, error } = await supabase
      .from('portfolio_items')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase
      .from('portfolio_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  };

  const reorderItems = async (orderedIds: string[]) => {
    const updates = orderedIds.map((id, index) =>
      supabase.from('portfolio_items').update({ sort_order: index + 1 }).eq('id', id)
    );
    await Promise.all(updates);
    await fetchItems();
  };

  return {
    items,
    isLoading,
    error,
    createItem,
    updateItem,
    deleteItem,
    reorderItems,
    refetch: fetchItems
  };
};
