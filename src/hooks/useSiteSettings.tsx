import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SiteSetting {
  id: string;
  key: string;
  value: string | null;
  created_at: string;
  updated_at: string;
}

export const useSiteSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) throw error;
      return data as SiteSetting[];
    },
  });

  const getSetting = (key: string): string | null => {
    const setting = settings.find((s) => s.key === key);
    return setting?.value || null;
  };

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string | null }) => {
      // First, check if the setting exists
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .eq('key', key)
        .maybeSingle();

      if (existing) {
        // Update existing setting
        const { data, error } = await supabase
          .from('site_settings')
          .update({ value, updated_at: new Date().toISOString() })
          .eq('key', key)
          .select()
          .single();

        if (error) {
          console.error('Failed to update setting:', key, error);
          throw error;
        }
        return data;
      } else {
        // Insert new setting
        const { data, error } = await supabase
          .from('site_settings')
          .insert({
            key,
            value,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) {
          console.error('Failed to insert setting:', key, error);
          throw error;
        }
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    },
  });

  const updateSetting = async (key: string, value: string | null) => {
    return updateSettingMutation.mutateAsync({ key, value });
  };

  return {
    settings,
    isLoading,
    getSetting,
    updateSetting,
  };
};
