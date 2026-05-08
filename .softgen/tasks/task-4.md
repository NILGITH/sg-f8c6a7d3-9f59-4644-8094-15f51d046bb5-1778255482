---
title: Système de données JSON + localStorage
status: in_progress
priority: urgent
type: feature
tags: [data, admin]
created_by: agent
created_at: 2026-05-08T15:52:00Z
position: 4
---

## Notes
Créer la structure de données avec fichiers JSON initiaux dans `/data/` et hooks personnalisés pour gérer localStorage. Permet édition en temps réel avec export/import JSON pour sauvegarder les modifications.

## Checklist
- [x] Créer structure JSON pour programme, galerie, réservations, blog
- [x] Créer hooks useLocalStorage et useContentManager
- [ ] Créer système d'export/import JSON
- [ ] Mettre à jour composants publics pour utiliser les données du système

## Acceptance
- Les composants publics affichent les données depuis le système
- Les modifications dans localStorage sont persistées
- Export JSON fonctionne et peut être réimporté