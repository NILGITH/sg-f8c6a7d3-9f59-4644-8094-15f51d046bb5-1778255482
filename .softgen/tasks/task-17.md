---
title: Diviser Partenaires en deux catégories
status: done
priority: high
type: feature
tags: [partners, frontend]
created_by: agent
created_at: 2026-05-08T16:39:00Z
position: 7
---

## Notes
Refondre la section Partenaires pour avoir deux catégories distinctes : "Partenaires Principaux" (grands logos, mise en avant) et "Avec le soutien de" (logos plus petits, grille).

## Checklist
- [x] Mettre à jour src/components/Partners.tsx avec deux sections
- [x] Ajouter champ "category" dans partners.json (principal/support)
- [x] Design différencié: grands logos pour principaux, petits pour support
- [x] Mettre à jour admin partners pour gérer la catégorie

## Acceptance
- Deux sections visibles : "Partenaires Principaux" et "Avec le soutien de"
- Les partenaires sont affichés selon leur catégorie
- L'admin permet de choisir la catégorie