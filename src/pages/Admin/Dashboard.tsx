import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

export default function Dashboard() {
  const [editions, setEditions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newEdition, setNewEdition] = useState({ year: new Date().getFullYear(), semester: 1, theme_primary_color: '#EF4444', theme_secondary_color: '#09090b' });
  const [isCreating, setIsCreating] = useState(false);

  const fetchEditions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('st_editions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setEditions(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEditions();
  }, []);

  const handleSetActive = async (id: string) => {
    // Set all to false first
    await supabase.from('st_editions').update({ is_active: false }).neq('id', '00000000-0000-0000-0000-000000000000');
    // Set selected to true
    await supabase.from('st_editions').update({ is_active: true }).eq('id', id);
    fetchEditions();
    toast({ title: "Sucesso", description: "Edição ativada com sucesso." });
  };

  const handleCreateEdition = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    
    const { data, error } = await supabase
      .from('st_editions')
      .insert([{
        year: newEdition.year,
        semester: newEdition.semester,
        theme_primary_color: newEdition.theme_primary_color,
        theme_secondary_color: newEdition.theme_secondary_color,
        is_active: editions.length === 0 // Make active if it's the first one
      }])
      .select();

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso", description: "Edição criada com sucesso." });
      setIsCreateModalOpen(false);
      fetchEditions();
    }
    setIsCreating(false);
  };

  const handleDeleteEdition = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta edição? Todos os dados vinculados (fases, participantes, prêmios) poderão ser perdidos ou ficar órfãos.')) return;

    const { error } = await supabase.from('st_editions').delete().eq('id', id);
    if (error) {
      toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso", description: "Edição excluída com sucesso." });
      fetchEditions();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Edições</h2>
          <p className="text-gray-500 mt-1">Gerencie as edições do Sharktank DSM</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="bg-red-600 hover:bg-red-700 text-white gap-2">
          <Plus className="w-4 h-4" /> Nova Edição
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ano/Semestre</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Cores (Prim/Sec)</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Carregando edições...
                  </td>
                </tr>
              ) : editions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Nenhuma edição encontrada. Crie a primeira!
                  </td>
                </tr>
              ) : (
                editions.map((edition) => (
                  <tr key={edition.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {edition.year}.{edition.semester}
                    </td>
                    <td className="px-6 py-4">
                      {edition.is_active ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Ativa
                        </span>
                      ) : (
                        <button 
                          onClick={() => handleSetActive(edition.id)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Inativa (Ativar)
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <div className="w-6 h-6 rounded border border-gray-200 shadow-sm" style={{ backgroundColor: edition.theme_primary_color }} title={edition.theme_primary_color}></div>
                        <div className="w-6 h-6 rounded border border-gray-200 shadow-sm" style={{ backgroundColor: edition.theme_secondary_color }} title={edition.theme_secondary_color}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          to={`/admin/editions/${edition.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDeleteEdition(edition.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nova Edição */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Nova Edição</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateEdition} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Ano</label>
                  <Input 
                    type="number" 
                    value={newEdition.year} 
                    onChange={e => setNewEdition({...newEdition, year: parseInt(e.target.value)})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Semestre</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newEdition.semester}
                    onChange={e => setNewEdition({...newEdition, semester: parseInt(e.target.value)})}
                  >
                    <option value={1}>1º Semestre</option>
                    <option value={2}>2º Semestre</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Cor Primária (HEX)</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      className="w-10 h-10 rounded cursor-pointer"
                      value={newEdition.theme_primary_color}
                      onChange={e => setNewEdition({...newEdition, theme_primary_color: e.target.value})}
                    />
                    <Input 
                      type="text" 
                      value={newEdition.theme_primary_color}
                      onChange={e => setNewEdition({...newEdition, theme_primary_color: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Cor Secundária (HEX)</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      className="w-10 h-10 rounded cursor-pointer"
                      value={newEdition.theme_secondary_color}
                      onChange={e => setNewEdition({...newEdition, theme_secondary_color: e.target.value})}
                    />
                    <Input 
                      type="text" 
                      value={newEdition.theme_secondary_color}
                      onChange={e => setNewEdition({...newEdition, theme_secondary_color: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white" disabled={isCreating}>
                  {isCreating ? 'Criando...' : 'Criar Edição'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
