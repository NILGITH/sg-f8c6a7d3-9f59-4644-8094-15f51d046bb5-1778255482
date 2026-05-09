-- Ajouter une politique de lecture publique pour la galerie
CREATE POLICY "public_read" ON gallery FOR SELECT USING (true);