import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function GlobalAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    id: '',
    hero_title: '',
    hero_subtitle: '',
    about_text: '',
    call_to_action: ''
  });

  useEffect(() => {
    fetchGlobalContent();
  }, []);

  const fetchGlobalContent = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('st_global_content')
      .select('*')
      .limit(1)
      .single();

    if (data) {
      setFormData(data);
    } else if (error && error.code !== 'PGRST116') {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (formData.id) {
        // Update
        const { error } = await supabase
          .from('st_global_content')
          .update({
            hero_title: formData.hero_title,
            hero_subtitle: formData.hero_subtitle,
            about_text: formData.about_text,
            call_to_action: formData.call_to_action
          })
          .eq('id', formData.id);
          
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('st_global_content')
          .insert([{
            hero_title: formData.hero_title,
            hero_subtitle: formData.hero_subtitle,
            about_text: formData.about_text,
            call_to_action: formData.call_to_action
          }]);
          
        if (error) throw error;
        fetchGlobalContent(); // re-fetch to get ID
      }
      
      toast({
        title: "Sucesso!",
        description: "Conteúdo global atualizado com sucesso.",
      });
    } catch (err: any) {
      toast({
        title: "Erro",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Carregando conteúdo...</div>;
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Landing Page Global</h2>
        <p className="text-gray-500 mt-1">Configure os textos de marketing que atraem patrocinadores e participantes.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">
        <form onSubmit={handleSave} className="space-y-6">
          
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Seção Hero (Topo)</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Título Principal</label>
              <Input 
                value={formData.hero_title}
                onChange={e => setFormData({...formData, hero_title: e.target.value})}
                placeholder="Ex: SHARKTANK DSM"
                className="font-black text-lg"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Subtítulo</label>
              <Input 
                value={formData.hero_subtitle}
                onChange={e => setFormData({...formData, hero_subtitle: e.target.value})}
                placeholder="Onde tubarões da programação..."
              />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Sobre o Evento</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Texto de Descrição</label>
              <textarea 
                value={formData.about_text}
                onChange={e => setFormData({...formData, about_text: e.target.value})}
                className="w-full min-h-[100px] p-3 rounded-md border border-input bg-transparent text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Descreva o que é o evento de forma atrativa..."
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Texto do Botão CTA (Call to Action)</label>
              <Input 
                value={formData.call_to_action}
                onChange={e => setFormData({...formData, call_to_action: e.target.value})}
                placeholder="Ex: INSCREVA-SE AGORA"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={saving} className="bg-red-600 hover:bg-red-700 text-white gap-2">
              <Save size={16} />
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
