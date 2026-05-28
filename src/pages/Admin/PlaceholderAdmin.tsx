import { FileEdit } from 'lucide-react';

export default function PlaceholderAdmin({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6 text-red-500 shadow-sm border border-red-100">
        <FileEdit size={32} />
      </div>
      <h2 className="text-3xl font-black text-gray-900 mb-3">{title}</h2>
      <p className="text-gray-500 max-w-md text-lg">
        O painel de controle para esta seção está sendo preparado. 
        Em breve você poderá adicionar, editar e excluir esses dados diretamente por aqui!
      </p>
    </div>
  );
}
