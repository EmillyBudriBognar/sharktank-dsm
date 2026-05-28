-- Seed Data for Sharktank DSM

-- 1. Insert an active edition
INSERT INTO public.st_editions (id, year, semester, is_active, theme_primary_color, theme_secondary_color)
VALUES ('11111111-1111-1111-1111-111111111111', '2024', '1', true, '#ef4444', '#fecaca');

-- 2. Insert About stats
INSERT INTO public.st_about (edition_id, description, highlighted_text, stats)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'A maior competição de desenvolvimento de software da Baixada Santista.',
  'Transformando ideias em realidade.',
  '[
    {"value": "30+", "label": "Projetos", "icon": "Rocket"},
    {"value": "120+", "label": "Participantes", "icon": "Users2"},
    {"value": "R$ 5k+", "label": "em Prêmios", "icon": "Trophy"}
  ]'::jsonb
);

-- 3. Insert Phases
INSERT INTO public.st_phases (id, edition_id, number, title, subtitle, highlighted_subtitle, description, overview_title, overview_description, overview_tag)
VALUES 
(
  '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '1', 'FASE', 'A competição que definiu os', 'melhores projetos', '8 equipes • 2 vencedores • 42 horas', 'TOP 2 VENCEDORES', '8 equipes incríveis se enfrentaram em uma maratona de desenvolvimento.', 'COMPETIÇÃO ACIRRADA'
),
(
  '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '2', 'FASE', 'A', 'batalha final', 'que coroou os grandes vencedores', 'TOP 3 VENCEDORES', 'As 6 melhores equipes da Fase 1 se enfrentaram em uma demonstração épica de seus projetos aprimorados.', 'BATALHA FINAL'
);

-- 4. Insert Winners
INSERT INTO public.st_winners (phase_id, position, medal, name, project_name, votes, video_url, members, differentials)
VALUES 
-- Phase 1 winners
('22222222-2222-2222-2222-222222222222', 1, '🥇', 'Equipe Alpha', 'Sistema de Gestão Inteligente', 45, '/videos/alpha-demo.mp4', '[{"name": "Ana Silva", "role": "Full Stack"}]'::jsonb, '["Interface intuitiva com drag-and-drop"]'::jsonb),
('22222222-2222-2222-2222-222222222222', 2, '🥈', 'Code Warriors', 'Plataforma de E-Learning', 38, '/videos/warriors-demo.mp4', '[{"name": "João Mendes", "role": "Full Stack"}]'::jsonb, '["Aulas em tempo real com chat"]'::jsonb),
-- Phase 2 winners
('33333333-3333-3333-3333-333333333333', 1, '🥇', 'Tech Masters', 'AI-Powered Analytics Platform', 45, '/videos/tech-masters-demo.mp4', '[{"name": "Ana Silva", "role": "Tech Lead"}]'::jsonb, '["Análise preditiva em tempo real"]'::jsonb),
('33333333-3333-3333-3333-333333333333', 2, '🥈', 'Digital Pioneers', 'Smart Health Monitor', 38, '/videos/digital-pioneers-demo.mp4', '[{"name": "Fernanda Oliveira", "role": "Product Manager"}]'::jsonb, '["Monitoramento contínuo 24/7"]'::jsonb),
('33333333-3333-3333-3333-333333333333', 3, '🥉', 'Future Coders', 'EcoTrack Solution', 35, '/videos/future-coders-demo.mp4', '[{"name": "Beatriz Souza", "role": "Project Lead"}]'::jsonb, '["Cálculo automático de pegada"]'::jsonb);

-- 5. Insert Awards
INSERT INTO public.st_awards (edition_id, position, title, prize, icon, emoji, image_url, extras)
VALUES 
('11111111-1111-1111-1111-111111111111', 1, '1° Lugar', 'R$ 3.000', 'Medal', '🥇', '/api/placeholder/300/300', '["Certificado Premium", "Mentoria Exclusiva", "Kit Tech Premium"]'::jsonb),
('11111111-1111-1111-1111-111111111111', 2, '2° Lugar', 'R$ 1.500', 'Star', '🥈', '/api/placeholder/300/300', '["Certificado Gold", "Workshop Gratuito", "Kit Tech"]'::jsonb),
('11111111-1111-1111-1111-111111111111', 3, '3° Lugar', 'R$ 800', 'Sparkles', '🥉', '/api/placeholder/300/300', '["Certificado Silver", "Acesso a Comunidade", "Kit Starter"]'::jsonb);

-- 6. Insert Workshops
INSERT INTO public.st_workshops (edition_id, title, speaker, speaker_role, date, time, location, status)
VALUES 
('11111111-1111-1111-1111-111111111111', 'Como fazer um pitch matador', 'Carlos Inovação', 'Empreendedor', '2024-05-10', '14:00', 'Auditório Principal', 'recorded'),
('11111111-1111-1111-1111-111111111111', 'Modelagem de Banco de Dados', 'Maria Dados', 'Data Engineer', '2024-05-11', '16:00', 'Laboratório 3', 'live');

-- 7. Insert Gallery
INSERT INTO public.st_gallery (edition_id, image_url, caption, category, span_cols, span_rows)
VALUES 
('11111111-1111-1111-1111-111111111111', '/api/placeholder/800/600', 'Abertura do Evento', 'Geral', 2, 2),
('11111111-1111-1111-1111-111111111111', '/api/placeholder/400/400', 'Mentoria', 'Equipes', 1, 1),
('11111111-1111-1111-1111-111111111111', '/api/placeholder/400/400', 'Apresentação Final', 'Apresentações', 1, 1);
