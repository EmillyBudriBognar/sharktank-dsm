import { useSearchParams } from 'react-router-dom';
import { useAllEditions, useActiveEdition } from '@/hooks/useActiveEdition';
import { ChevronDown, Calendar } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const EditionSelector = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: allEditions, isLoading: loadingAll } = useAllEditions();
  const { data: activeEditionData } = useActiveEdition();
  
  if (loadingAll || !allEditions || allEditions.length === 0) return null;

  const currentEdition = activeEditionData?.edition;

  const handleSelect = (editionId: string) => {
    searchParams.set('edition', editionId);
    setSearchParams(searchParams);
    
    // Optional: smooth scroll to top when changing edition
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group flex items-center gap-2.5 bg-white hover:bg-gray-50 border border-gray-200 px-5 py-2.5 rounded-full text-slate-800 font-bold transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] focus:outline-none focus:ring-2 focus:ring-red-500/20">
        <div className="bg-red-50 p-1.5 rounded-full">
          <Calendar size={16} className="text-red-600" />
        </div>
        <span className="hidden sm:inline">Explorar Edições</span>
        <span className="hidden sm:inline text-gray-300 mx-1">|</span>
        <span className="text-red-600">
          {currentEdition ? `${currentEdition.year}.${currentEdition.semester}` : '...'}
        </span>
        <ChevronDown size={16} className="text-slate-400 group-hover:text-red-500 transition-colors" />
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-64 bg-white border-gray-200 text-slate-800 rounded-2xl shadow-2xl p-2 z-50">
        <DropdownMenuLabel className="text-slate-500 font-semibold text-xs uppercase tracking-wider px-2 pt-2 pb-3">Histórico do Evento</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-100 mb-2" />
        
        {allEditions.map((ed) => {
          const isSelected = currentEdition?.id === ed.id;
          return (
            <DropdownMenuItem 
              key={ed.id}
              onClick={() => handleSelect(ed.id)}
              className={`cursor-pointer rounded-lg mb-1 px-3 py-2.5 transition-all outline-none ${
                isSelected 
                  ? 'bg-red-50 text-red-600 font-bold' 
                  : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span>SharkTank {ed.year}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isSelected ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-slate-500'}`}>{ed.semester}</span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
