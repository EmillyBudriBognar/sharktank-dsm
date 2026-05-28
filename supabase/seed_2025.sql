-- Script para popular os conteúdos da Landing Page (Edição 2025 - 1º Semestre)
-- Copie e rode no SQL Editor do seu Supabase!

DO $$ 
DECLARE
  v_edition_id UUID;
  v_phase1_id UUID;
  v_phase2_id UUID;
BEGIN
  -- 1. Insert Edition
  INSERT INTO public.st_editions (year, semester, is_active, theme_primary_color, theme_secondary_color)
  VALUES ('2025', '1º Semestre', true, '#ef4444', '#fecaca')
  RETURNING id INTO v_edition_id;

  -- 2. Insert Hero
  INSERT INTO public.st_hero (edition_id, title_part1, title_part2, title_part3, subtitle_line1, subtitle_highlighted1, subtitle_line2, subtitle_line3, subtitle_highlighted2)
  VALUES (v_edition_id, 'SHARK', 'TANK', 'DSM', 'ONDE', 'TUBARÕES DA PROGRAMAÇÃO', 'SE ENCONTRAM', 'COM A', 'TECNOLOGIA DO FUTURO');

  -- 3. Insert About
  INSERT INTO public.st_about (edition_id, description, highlighted_text, stats)
  VALUES (
    v_edition_id,
    'O SharkTank DSM é a prova de fogo onde os alunos do curso de Desenvolvimento de Software Multiplataforma da FATEC Franca apresentam seus projetos inovadores para uma banca de especialistas. Uma noite de',
    'tecnologia, negócios e muita adrenalina.',
    '[{"icon": "Rocket", "label": "Projetos", "value": "30+"}, {"icon": "Users", "label": "Participantes", "value": "120+"}, {"icon": "Trophy", "label": "Edições", "value": "4+"}]'::jsonb
  );

  -- 4. Insert Future
  INSERT INTO public.st_future (edition_id, title, highlighted_title, description, items)
  VALUES (
    v_edition_id,
    'O FUTURO É',
    'AGORA',
    'O SharkTank DSM é apenas o começo de uma jornada épica. Prepare-se para as próximas edições ainda mais impressionantes!',
    '[{"icon": "Calendar", "title": "Próxima Edição", "description": "SharkTank DSM 2.0 já está em planejamento! Ainda mais desafiador e com prêmios maiores."}, {"icon": "TrendingUp", "title": "Novos Desafios", "description": "Temáticas mais complexas, tecnologias emergentes e problemas reais do mercado."}, {"icon": "Users", "title": "Mais Equipes", "description": "Expansão para receber mais times e criar uma comunidade ainda maior de desenvolvedores."}, {"icon": "Zap", "title": "Parcerias Especiais", "description": "Colaborações com empresas tech para mentorias, vagas e oportunidades exclusivas."}]'::jsonb
  );

  -- 5. Insert Phase 1
  INSERT INTO public.st_phases (edition_id, number, title, subtitle, highlighted_subtitle, description, overview_title, overview_description, overview_tag)
  VALUES (
    v_edition_id,
    '1',
    'FASE',
    'A competição que definiu os',
    'melhores projetos',
    '',
    'A Batalha Final',
    '8 equipes incríveis se enfrentaram em uma maratona de desenvolvimento.',
    'COMPETIÇÃO ACIRRADA'
  ) RETURNING id INTO v_phase1_id;

  -- 6. Insert Phase 1 Winners
  INSERT INTO public.st_winners (phase_id, position, medal, name, project_name, votes, video_url, members, differentials)
  VALUES (
    v_phase1_id, 1, '🥇', 'Equipe Alpha', 'Sistema de Gestão Inteligente', 45, '/videos/alpha-demo.mp4',
    '[{"name": "Ana Silva", "role": "Full Stack"}, {"name": "Carlos Santos", "role": "Backend"}, {"name": "Marina Oliveira", "role": "Frontend"}, {"name": "Pedro Costa", "role": "DevOps"}]'::jsonb,
    '["Interface intuitiva com drag-and-drop", "Relatórios automáticos em tempo real", "Integração com 10+ plataformas", "Machine learning para previsões"]'::jsonb
  );

  INSERT INTO public.st_winners (phase_id, position, medal, name, project_name, votes, video_url, members, differentials)
  VALUES (
    v_phase1_id, 2, '🥈', 'Code Warriors', 'Plataforma de E-Learning', 38, '/videos/warriors-demo.mp4',
    '[{"name": "João Mendes", "role": "Full Stack"}, {"name": "Beatriz Lima", "role": "UI/UX"}, {"name": "Rafael Souza", "role": "Backend"}]'::jsonb,
    '["Aulas em tempo real com chat", "Sistema de gamificação", "Exercícios interativos", "Dashboard de progresso"]'::jsonb
  );

  -- 7. Insert Phase 2
  INSERT INTO public.st_phases (edition_id, number, title, subtitle, highlighted_subtitle, description, overview_title, overview_description, overview_tag)
  VALUES (
    v_edition_id,
    '2',
    'FASE',
    'A',
    'batalha final',
    'que coroou os grandes vencedores',
    'A Grande Final',
    'As 6 melhores equipes da Fase 1 se enfrentaram em uma demonstração épica de seus projetos aprimorados.',
    'BATALHA FINAL'
  ) RETURNING id INTO v_phase2_id;

  -- 8. Insert Phase 2 Winners
  INSERT INTO public.st_winners (phase_id, position, medal, name, project_name, votes, video_url, members, differentials)
  VALUES (
    v_phase2_id, 1, '🥇', 'Tech Masters', 'AI-Powered Analytics Platform', 45, '/videos/tech-masters-demo.mp4',
    '[{"name": "Ana Silva", "role": "Tech Lead"}, {"name": "Carlos Santos", "role": "Frontend"}, {"name": "Marina Costa", "role": "Backend"}, {"name": "Ricardo Lima", "role": "Data Science"}]'::jsonb,
    '["Análise preditiva em tempo real", "Interface drag-and-drop intuitiva", "Integração com múltiplas fontes", "Relatórios automáticos com IA"]'::jsonb
  );

  INSERT INTO public.st_winners (phase_id, position, medal, name, project_name, votes, video_url, members, differentials)
  VALUES (
    v_phase2_id, 2, '🥈', 'Digital Pioneers', 'Smart Health Monitor', 38, '/videos/digital-pioneers-demo.mp4',
    '[{"name": "Fernanda Oliveira", "role": "Product Manager"}, {"name": "Pedro Alves", "role": "Full Stack"}, {"name": "Juliana Rocha", "role": "UI/UX"}, {"name": "Lucas Martins", "role": "Mobile"}]'::jsonb,
    '["Monitoramento contínuo 24/7", "Alertas inteligentes de saúde", "Integração com wearables", "Dashboard médico completo"]'::jsonb
  );

  INSERT INTO public.st_winners (phase_id, position, medal, name, project_name, votes, video_url, members, differentials)
  VALUES (
    v_phase2_id, 3, '🥉', 'Future Coders', 'EcoTrack Solution', 35, '/videos/future-coders-demo.mp4',
    '[{"name": "Beatriz Souza", "role": "Project Lead"}, {"name": "Rafael Torres", "role": "Backend"}, {"name": "Camila Nunes", "role": "Frontend"}, {"name": "Diego Ferreira", "role": "DevOps"}]'::jsonb,
    '["Cálculo automático de pegada", "Recomendações sustentáveis", "Relatórios de impacto ambiental", "Gamificação e recompensas"]'::jsonb
  );

  -- 9. Insert Awards
  INSERT INTO public.st_awards (edition_id, position, title, prize, icon, emoji, image_url, extras)
  VALUES 
    (v_edition_id, 1, '1º LUGAR GERAL', 'R$ 5.000 + Mentoria', 'Trophy', '🥇', 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&q=80', '["Troféu SharkTank Ouro", "Acesso VIP ao Hub de Inovação", "Destaque no Hall da Fama"]'::jsonb),
    (v_edition_id, 2, '2º LUGAR', 'R$ 2.500', 'Medal', '🥈', 'https://images.unsplash.com/photo-1561489422-45de3d015e3e?auto=format&fit=crop&q=80', '["Medalha de Prata", "Mentoria de Negócios"]'::jsonb),
    (v_edition_id, 3, '3º LUGAR', 'R$ 1.000', 'Award', '🥉', 'https://images.unsplash.com/photo-1589810635656-91e84fc76882?auto=format&fit=crop&q=80', '["Medalha de Bronze", "Curso de Empreendedorismo"]'::jsonb);

  -- 10. Insert Workshops
  INSERT INTO public.st_workshops (edition_id, title, speaker, speaker_role, speaker_image, date, time, location, status, video_url, order_index)
  VALUES 
    (v_edition_id, 'Pitch Perfeito: Como vender sua ideia', 'Marcos Santos', 'Startup Mentor & Angel Investor', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80', '15 Mai', '19:00', 'Auditório Principal', 'recorded', 'https://youtube.com/watch?v=123', 1),
    (v_edition_id, 'Arquitetura Escalável para Startups', 'Ana Beatriz', 'Senior Cloud Architect', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', '16 Mai', '20:00', 'Lab 4', 'live', null, 2),
    (v_edition_id, 'UX Design: Focando no Usuário', 'Carlos Ruiz', 'Lead UX Designer', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', '17 Mai', '19:30', 'Online', 'upcoming', null, 3);

  -- 11. Insert Gallery
  INSERT INTO public.st_gallery (edition_id, image_url, caption, category, span_cols, span_rows, order_index)
  VALUES
    (v_edition_id, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80', 'Abertura do Evento', 'Geral', 1, 1, 1),
    (v_edition_id, 'https://youtube.com/watch?v=123', 'Highlights da Fase 1', 'Geral', 1, 1, 2),
    (v_edition_id, 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80', 'Times em Ação', 'Geral', 1, 1, 3),
    (v_edition_id, 'https://youtube.com/watch?v=456', 'Workshop em Destaque', 'Geral', 1, 1, 4),
    (v_edition_id, 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80', 'Mentoria dos Vencedores', 'Geral', 1, 1, 5),
    (v_edition_id, 'https://youtube.com/watch?v=789', 'Apresentação Final', 'Geral', 1, 1, 6),
    (v_edition_id, 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80', 'Cerimônia de Premiação', 'Geral', 1, 1, 7),
    (v_edition_id, 'https://youtube.com/watch?v=abc', 'Depoimentos dos Campeões', 'Geral', 1, 1, 8);

END $$;
