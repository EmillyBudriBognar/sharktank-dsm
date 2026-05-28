import { Outlet, Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { Users, Award, PlayCircle, Camera, ArrowLeft, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EditionAdminLayout() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { label: 'Participantes', path: `/admin/editions/${id}/participants`, icon: Users },
    { label: 'Fases e Vencedores', path: `/admin/editions/${id}/phases`, icon: Layers },
    { label: 'Prêmios', path: `/admin/editions/${id}/awards`, icon: Award },
    { label: 'Workshops', path: `/admin/editions/${id}/workshops`, icon: PlayCircle },
    { label: 'Galeria', path: `/admin/editions/${id}/gallery`, icon: Camera },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-gray-200 pb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin')}
          className="text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Voltar
        </Button>
        <div>
          <h2 className="text-2xl font-black text-gray-900">Gerenciar Edição</h2>
          <p className="text-sm text-gray-500">ID: {id}</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto pb-px">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Nested Content */}
      <div className="pt-4">
        <Outlet />
      </div>
    </div>
  );
}
