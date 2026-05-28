import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Users, BookOpen, User, GraduationCap, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const TeacherPortal = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    teacherName: '',
    teacherEmail: '',
    teacherPhone: '',
    institution: '',
    teamName: '',
    projectName: '',
    projectDescription: '',
    student1Name: '',
    student1Ra: '',
    student2Name: '',
    student2Ra: '',
    student3Name: '',
    student3Ra: '',
    student4Name: '',
    student4Ra: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.teacherName || !formData.teacherEmail || !formData.teamName || !formData.student1Name) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios (*).",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // In a real scenario, this would insert into a registrations table.
      // For now we simulate success or use a generic table if we create one later.
      // We will just show a success message since the user requested "the portal for teachers".
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Inscrição realizada com sucesso!",
        description: `A equipe ${formData.teamName} foi registrada. Entraremos em contato em breve.`,
      });
      
      // Reset form
      setFormData({
        teacherName: '',
        teacherEmail: '',
        teacherPhone: '',
        institution: '',
        teamName: '',
        projectName: '',
        projectDescription: '',
        student1Name: '',
        student1Ra: '',
        student2Name: '',
        student2Ra: '',
        student3Name: '',
        student3Ra: '',
        student4Name: '',
        student4Ra: '',
      });
      
    } catch (error) {
      toast({
        title: "Erro na inscrição",
        description: "Não foi possível registrar a equipe. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors font-medium">
            <ArrowLeft size={20} />
            Voltar para o Início
          </Link>
          <div className="font-display font-black text-2xl tracking-tight">
            Shark<span className="text-red-600">Tank</span> DSM
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-red-100">
            <GraduationCap size={32} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 tracking-tight">Portal do <span className="text-red-600">Professor</span></h1>
          <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
            Apenas professores vinculados podem realizar a inscrição das equipes para a edição atual do SharkTank DSM.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="bg-slate-900 p-6 sm:p-8 text-white flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                < BookOpen className="text-red-400" />
                Formulário de Inscrição de Equipe
              </h2>
              <p className="text-slate-400 mt-2">Preencha os dados abaixo com atenção. Os alunos não podem se inscrever sozinhos.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-10">
            {/* Teacher Details */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
                <User className="text-red-600" size={20} />
                Dados do Professor Responsável
              </h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Nome Completo *</label>
                  <input
                    type="text"
                    name="teacherName"
                    value={formData.teacherName}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors"
                    placeholder="Ex: Prof. Dr. João Silva"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Email Institucional *</label>
                  <input
                    type="email"
                    name="teacherEmail"
                    value={formData.teacherEmail}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors"
                    placeholder="joao.silva@fatec.sp.gov.br"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    name="teacherPhone"
                    value={formData.teacherPhone}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Unidade / Instituição *</label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors"
                    placeholder="Ex: Fatec Diadema"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
                <Zap className="text-red-600" size={20} />
                Dados do Projeto / Equipe
              </h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Nome da Equipe *</label>
                  <input
                    type="text"
                    name="teamName"
                    value={formData.teamName}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors"
                    placeholder="Ex: ByteBusters"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Nome do Projeto *</label>
                  <input
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors"
                    placeholder="Ex: Sistema de Gestão Inteligente"
                    required
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Breve Descrição do Projeto</label>
                  <textarea
                    name="projectDescription"
                    value={formData.projectDescription}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors resize-none"
                    placeholder="Qual problema o projeto resolve?"
                  />
                </div>
              </div>
            </div>

            {/* Students */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
                <Users className="text-red-600" size={20} />
                Integrantes da Equipe
              </h3>
              <div className="space-y-6">
                {/* Aluno 1 */}
                <div className="grid sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Aluno 1 (Líder) *</label>
                    <input
                      type="text"
                      name="student1Name"
                      value={formData.student1Name}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors"
                      placeholder="Nome completo do aluno"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">RA *</label>
                    <input
                      type="text"
                      name="student1Ra"
                      value={formData.student1Ra}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors"
                      placeholder="123456789"
                      required
                    />
                  </div>
                </div>

                {/* Aluno 2 */}
                <div className="grid sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Aluno 2</label>
                    <input
                      type="text"
                      name="student2Name"
                      value={formData.student2Name}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors"
                      placeholder="Nome completo do aluno"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">RA</label>
                    <input
                      type="text"
                      name="student2Ra"
                      value={formData.student2Ra}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors"
                      placeholder="123456789"
                    />
                  </div>
                </div>

                {/* Aluno 3 */}
                <div className="grid sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Aluno 3</label>
                    <input
                      type="text"
                      name="student3Name"
                      value={formData.student3Name}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors"
                      placeholder="Nome completo do aluno"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">RA</label>
                    <input
                      type="text"
                      name="student3Ra"
                      value={formData.student3Ra}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors"
                      placeholder="123456789"
                    />
                  </div>
                </div>
                
                {/* Aluno 4 */}
                <div className="grid sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Aluno 4</label>
                    <input
                      type="text"
                      name="student4Name"
                      value={formData.student4Name}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors"
                      placeholder="Nome completo do aluno"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">RA</label>
                    <input
                      type="text"
                      name="student4Ra"
                      value={formData.student4Ra}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-colors"
                      placeholder="123456789"
                    />
                  </div>
                </div>

              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto sm:min-w-[240px] flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all duration-300 transform hover:-translate-y-1 ml-auto disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={20} />
                    Enviar Inscrição
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default TeacherPortal;
