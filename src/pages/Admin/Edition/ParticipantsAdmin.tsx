import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function ParticipantsAdmin() {
  const { id: editionId } = useParams();
  const { toast } = useToast();
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    project_name: '',
    github_url: '',
    linkedin_url: ''
  });

  const fetchParticipants = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('st_participants')
      .select('*')
      .eq('edition_id', editionId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setParticipants(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (editionId) {
      fetchParticipants();
    }
  }, [editionId]);

  const handleOpenModal = (participant?: any) => {
    if (participant) {
      setEditingId(participant.id);
      setFormData({
        name: participant.name,
        role: participant.role || '',
        project_name: participant.project_name || '',
        github_url: participant.github_url || '',
        linkedin_url: participant.linkedin_url || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        role: '',
        project_name: '',
        github_url: '',
        linkedin_url: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const payload = {
      ...formData,
      edition_id: editionId
    };

    let error;

    if (editingId) {
      const { error: updateError } = await supabase
        .from('st_participants')
        .update(payload)
        .eq('id', editingId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('st_participants')
        .insert([payload]);
      error = insertError;
    }

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso", description: `Participante ${editingId ? 'atualizado' : 'adicionado'} com sucesso!` });
      setIsModalOpen(false);
      fetchParticipants();
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este participante?')) return;
    
    const { error } = await supabase.from('st_participants').delete().eq('id', id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso", description: "Participante removido." });
      fetchParticipants();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">Gerenciar Participantes</h3>
        <Button onClick={() => handleOpenModal()} className="bg-red-600 hover:bg-red-700 text-white gap-2">
          <Plus className="w-4 h-4" /> Adicionar Participante
        </Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Nome</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Projeto / Papel</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Links</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Carregando...</td></tr>
            ) : participants.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Nenhum participante cadastrado nesta edição.</td></tr>
            ) : (
              participants.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {p.project_name && <div className="font-semibold">{p.project_name}</div>}
                    {p.role && <div>{p.role}</div>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {p.github_url && <a href={p.github_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline block">GitHub</a>}
                    {p.linkedin_url && <a href={p.linkedin_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline block">LinkedIn</a>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleOpenModal(p)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">{editingId ? 'Editar Participante' : 'Novo Participante'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Nome</label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="Nome completo" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Papel (Ex: Frontend)</label>
                  <Input value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="Papel no time" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Nome do Projeto</label>
                  <Input value={formData.project_name} onChange={e => setFormData({...formData, project_name: e.target.value})} placeholder="Nome do projeto" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">URL GitHub</label>
                <Input type="url" value={formData.github_url} onChange={e => setFormData({...formData, github_url: e.target.value})} placeholder="https://github.com/..." />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">URL LinkedIn</label>
                <Input type="url" value={formData.linkedin_url} onChange={e => setFormData({...formData, linkedin_url: e.target.value})} placeholder="https://linkedin.com/in/..." />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white" disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
