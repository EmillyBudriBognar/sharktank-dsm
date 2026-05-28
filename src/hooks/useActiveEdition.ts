import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useSearchParams } from 'react-router-dom';

export function useGlobalContent() {
  return useQuery({
    queryKey: ['globalContent'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('st_global_content')
        .select('*')
        .limit(1)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    }
  });
}

export function useAllEditions() {
  return useQuery({
    queryKey: ['allEditions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('st_editions')
        .select('*')
        .order('year', { ascending: false })
        .order('semester', { ascending: false });
        
      if (error) throw error;
      return data;
    }
  });
}

export function useActiveEdition() {
  const [searchParams] = useSearchParams();
  const urlEditionId = searchParams.get('edition');

  return useQuery({
    queryKey: ['activeEdition', urlEditionId],
    queryFn: async () => {
      let edition;
      let editionError;

      if (urlEditionId) {
        // Fetch specific edition from URL
        const res = await supabase
          .from('st_editions')
          .select('*')
          .eq('id', urlEditionId)
          .single();
        edition = res.data;
        editionError = res.error;
      } else {
        // Fallback to active edition
        const res = await supabase
          .from('st_editions')
          .select('*')
          .eq('is_active', true)
          .single();
        edition = res.data;
        editionError = res.error;
      }
        
      if (editionError) throw editionError;
      if (!edition) return null;

      const editionId = edition.id;

      // 2. Get related data
      const [
        { data: about },
        { data: hero },
        { data: future },
        { data: phases },
        { data: awards },
        { data: workshops },
        { data: gallery }
      ] = await Promise.all([
        supabase.from('st_about').select('*').eq('edition_id', editionId).single(),
        supabase.from('st_hero').select('*').eq('edition_id', editionId).single(),
        supabase.from('st_future').select('*').eq('edition_id', editionId).single(),
        supabase.from('st_phases').select('*, st_winners(*)').eq('edition_id', editionId).order('number'),
        supabase.from('st_awards').select('*').eq('edition_id', editionId).order('position'),
        supabase.from('st_workshops').select('*').eq('edition_id', editionId).order('date'),
        supabase.from('st_gallery').select('*').eq('edition_id', editionId).order('order_index')
      ]);

      return {
        edition,
        about,
        hero,
        future,
        phases,
        awards,
        workshops,
        gallery
      };
    }
  });
}
