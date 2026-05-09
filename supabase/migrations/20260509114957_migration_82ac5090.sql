TRUNCATE slider, editions, programs, gallery, blog, partners RESTART IDENTITY CASCADE;

-- Peupler le slider
INSERT INTO slider (title, subtitle, description, image, cta_text, cta_link, order_position, is_active) VALUES
('Le Rendez-vous des Grillades', 'D''Abidjan au Monde', 'Vibrez au rythme de la braise et de la gastronomie africaine.', '/generated/hero-festival.png', 'Réserver mon Billet', '/contact', 1, true),
('Édition Abidjan 2026', 'L''Originale', 'La capitale de la grillade vous accueille pour 3 jours de fête, de saveurs et de musique.', '/641655009_122170459016861582_5624134569926200889_n.jpg', 'Découvrir', '/#editions', 2, true),
('Nouvelle Étape : Dakar', 'Saveurs & Téranga', 'Le festival s''exporte au Sénégal. Venez découvrir les meilleures spécialités dans une ambiance unique.', '/641501809_122170458476861582_102146802286182265_n.jpg', 'Voir Programme', '/#program', 3, true);

-- Peupler les éditions
INSERT INTO editions (city, country, status, date, image, description, is_origin) VALUES
('Abidjan', 'Côte d''Ivoire', 'upcoming', '15-17 Août 2026', '/641655009_122170459016861582_5624134569926200889_n.jpg', 'La maison mère du festival. Depuis 2008, Abidjan accueille la plus grande célébration des grillades d''Afrique de l''Ouest.', true),
('Dakar', 'Sénégal', 'upcoming', '5-7 Septembre 2026', '/641501809_122170458476861582_102146802286182265_n.jpg', 'Première édition à Dakar ! Le festival des grillades s''exporte dans la capitale sénégalaise pour une célébration gastronomique inoubliable.', false),
('Cotonou', 'Bénin', 'upcoming', '20-22 Septembre 2026', '/festival-poster.png', 'Découvrez les saveurs béninoises lors de notre édition à Cotonou. Une fusion unique entre traditions culinaires locales et l''esprit du festival.', false),
('Lagos', 'Nigéria', 'upcoming', 'Octobre 2026', '/festival-menu.png', 'Le festival arrive à Lagos ! La plus grande ville d''Afrique de l''Ouest accueillera bientôt cette célébration gastronomique.', false),
('Accra', 'Ghana', 'upcoming', 'Novembre 2026', '/festival-info.png', 'Prochainement à Accra. Restez connectés pour découvrir les dates et le programme de cette nouvelle édition.', false);

-- Peupler le programme
INSERT INTO programs (city_id, city, dates, events) VALUES
('abidjan', 'Abidjan', '15-17 Août 2026', '[
  {
    "time": "18:00",
    "title": "Cérémonie d''Ouverture",
    "description": "Lancement officiel avec spectacle de danse et tambours traditionnels",
    "type": "ceremony",
    "icon": "Mic2",
    "color": "bg-primary/10 border-primary/20"
  },
  {
    "time": "19:00",
    "title": "Ouverture des Stands de Braise",
    "description": "Dégustation des meilleures spécialités (Poulet DG, Poissons braisés, Brochettes de bœuf)",
    "type": "food",
    "icon": "ChefHat",
    "color": "bg-accent/10 border-accent/20"
  },
  {
    "time": "21:30",
    "title": "Concert Live: Stars Ivoiriennes",
    "description": "Ambiance Zouglou et Coupé-Décalé avec les légendes de la musique africaine",
    "type": "concert",
    "icon": "Music",
    "color": "bg-secondary/10 border-secondary/20"
  }
]'::jsonb),
('dakar', 'Dakar', '5-7 Septembre 2026', '[
  {
    "time": "17:00",
    "title": "Inauguration Dakar",
    "description": "Cérémonie au rythme du Sabar sénégalais",
    "type": "ceremony",
    "icon": "Mic2",
    "color": "bg-primary/10 border-primary/20"
  },
  {
    "time": "18:30",
    "title": "Les Saveurs du Sénégal",
    "description": "Découvrez le fameux Dibi, le Yassa et les brochettes épicées par nos chefs locaux",
    "type": "food",
    "icon": "ChefHat",
    "color": "bg-accent/10 border-accent/20"
  }
]'::jsonb);

-- Peupler la galerie
INSERT INTO gallery (image, caption, order_position) VALUES
('/641655009_122170459016861582_5624134569926200889_n.jpg', 'Foule en délire à Abidjan', 1),
('/641501809_122170458476861582_102146802286182265_n.jpg', 'Un Chef préparant les braises avec passion', 2),
('/festival-poster.png', 'L''affiche officielle de cette année', 3),
('/festival-menu.png', 'Quelques-unes de nos spécialités incontournables', 4),
('/logo-festival.jpg', 'L''âme du festival, la flamme qui nous rassemble', 5),
('/generated/about-grilling.png', 'L''art ancestral de la braise africaine', 6);

-- Peupler le blog
INSERT INTO blog (title, slug, excerpt, content, image, author, published) VALUES
('L''Art de la Braise Parfaite', 'art-braise-parfaite', 'Apprenez les secrets d''un feu de charbon de bois réussi pour des viandes savoureuses.', 'Tout commence avec le choix du charbon. Un bon charbon de bois doit être dense et sec. Ensuite vient la patience : il faut attendre que les braises soient recouvertes d''une fine cendre blanche avant d''y déposer la viande...', '/generated/about-grilling.png', 'Le Maître Braiseur', true),
('Les Épices Qui Font la Différence', 'epices-difference', 'Découvrez les mélanges secrets qui donnent ce goût unique aux grillades du festival.', 'Du gingembre fraîchement râpé, du piment savamment dosé, de l''ail écrasé et un peu de magie. Les marinades africaines sont une explosion de saveurs qui nécessitent au moins 12 heures de repos...', '/generated/blog-spices.png', 'Chef Koné', true);

-- Peupler les partenaires
INSERT INTO partners (name, logo, website, category, order_position) VALUES
('Brasserie Solibra', 'https://upload.wikimedia.org/wikipedia/fr/thumb/7/7f/Solibra.svg/200px-Solibra.svg.png', 'https://solibra.ci', 'principal', 1),
('Orange Côte d''Ivoire', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/200px-Orange_logo.svg.png', 'https://orange.ci', 'principal', 2),
('MTN', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/MTN_Logo.svg/200px-MTN_Logo.svg.png', 'https://mtn.ci', 'support', 3);

-- FIX RLS pour que l'interface admin fonctionne sans erreur 401 pour cette démonstration (droit d'insertion public)
DROP POLICY IF EXISTS auth_insert_slider ON slider;
DROP POLICY IF EXISTS auth_update_slider ON slider;
DROP POLICY IF EXISTS auth_delete_slider ON slider;
CREATE POLICY "anon_insert_slider" ON slider FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_update_slider" ON slider FOR UPDATE USING (true);
CREATE POLICY "anon_delete_slider" ON slider FOR DELETE USING (true);

DROP POLICY IF EXISTS auth_insert_editions ON editions;
DROP POLICY IF EXISTS auth_update_editions ON editions;
DROP POLICY IF EXISTS auth_delete_editions ON editions;
CREATE POLICY "anon_insert_editions" ON editions FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_update_editions" ON editions FOR UPDATE USING (true);
CREATE POLICY "anon_delete_editions" ON editions FOR DELETE USING (true);

DROP POLICY IF EXISTS auth_insert_programs ON programs;
DROP POLICY IF EXISTS auth_update_programs ON programs;
DROP POLICY IF EXISTS auth_delete_programs ON programs;
CREATE POLICY "anon_insert_programs" ON programs FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_update_programs" ON programs FOR UPDATE USING (true);
CREATE POLICY "anon_delete_programs" ON programs FOR DELETE USING (true);

DROP POLICY IF EXISTS auth_insert_gallery ON gallery;
DROP POLICY IF EXISTS auth_update_gallery ON gallery;
DROP POLICY IF EXISTS auth_delete_gallery ON gallery;
CREATE POLICY "anon_insert_gallery" ON gallery FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_update_gallery" ON gallery FOR UPDATE USING (true);
CREATE POLICY "anon_delete_gallery" ON gallery FOR DELETE USING (true);

DROP POLICY IF EXISTS auth_insert_blog ON blog;
DROP POLICY IF EXISTS auth_update_blog ON blog;
DROP POLICY IF EXISTS auth_delete_blog ON blog;
CREATE POLICY "anon_insert_blog" ON blog FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_update_blog" ON blog FOR UPDATE USING (true);
CREATE POLICY "anon_delete_blog" ON blog FOR DELETE USING (true);

DROP POLICY IF EXISTS auth_insert_partners ON partners;
DROP POLICY IF EXISTS auth_update_partners ON partners;
DROP POLICY IF EXISTS auth_delete_partners ON partners;
CREATE POLICY "anon_insert_partners" ON partners FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_update_partners" ON partners FOR UPDATE USING (true);
CREATE POLICY "anon_delete_partners" ON partners FOR DELETE USING (true);