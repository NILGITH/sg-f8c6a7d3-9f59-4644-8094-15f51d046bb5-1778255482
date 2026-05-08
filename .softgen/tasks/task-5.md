---
title: Interface Admin - Dashboard & Auth
status: done
priority: high
type: feature
tags: [admin, auth]
created_by: agent
created_at: 2026-05-08T15:52:00Z
position: 5
---

## Notes
Créer page admin principale avec authentification simple (localStorage), layout admin, navigation entre sections, et dashboard avec statistiques. Authentification basique avec mot de passe stocké en localStorage.

## Checklist
- [x] Créer page /admin/login avec formulaire simple
- [x] Créer layout admin avec navigation sidebar
- [x] Créer dashboard avec stats et aperçu
- [x] Protéger routes admin avec guard
- [x] Fixer erreurs 404 des fichiers JSON (déplacés vers public/data/)

## Acceptance
- Accès admin protégé par login (mot de passe: admin2026)
- Dashboard affiche statistiques du festival
- Navigation fluide entre sections admin
- Données JSON chargées correctement