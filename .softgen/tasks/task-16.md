---
title: Créer admin pour gestion des Éditions
status: todo
priority: urgent
type: feature
tags: [admin, editions]
created_by: agent
created_at: 2026-05-08T16:39:00Z
position: 6
---

## Notes
Créer une nouvelle page admin pour gérer les éditions du festival (Abidjan, Dakar, Cotonou, etc.). Permet d'ajouter/modifier/supprimer des villes, dates, statuts, descriptions.

## Checklist
- [ ] Créer src/pages/admin/editions.tsx
- [ ] Formulaire CRUD complet pour les éditions
- [ ] Champs: ville, pays, date, statut (à venir/passé), description, image
- [ ] Stockage dans public/data/editions.json
- [ ] Lien dans navigation admin

## Acceptance
- L'admin peut gérer toutes les éditions du festival
- Les modifications apparaissent sur la section "Nos Éditions" du site