# État du projet

Date de référence de cette entrée : 16 septembre 2026.

## Réalisé

- Besoin et contraintes reformulés dans la documentation.
- Choix OpenCode confirmé par l’utilisateur.
- Architecture proposée, décisions et limites consignées.
- Plan découpé en lots avec critères de fin et scénarios de vérification.
- Sources officielles et version candidate documentées.
- OpenCode `v1.18.31` importé sur le commit `014614d35b397775e5d397a490fc72368c894ec2`.
- Bun `1.3.14` installé localement et dépendances installées avec le lockfile figé.
- CLI, typage, serveur authentifié, outils d’édition et 73 tests ciblés vérifiés.
- Lanceur Artemis avec modèle gratuit vérifié, clé chargée depuis `.env.local`
  et données isolées sous `.artemis-local/runtime`.
- Cinq tests du lanceur/runner réussis et typage de `script/artemis` vérifié.
- E01 réussi via OpenRouter : seul `cart.mjs` modifié, trois tests externes réussis,
  tests fournis inchangés. Modèle : `cohere/north-mini-code:free`.
- Terminal lancé dans tmux ; prompt, modèle sélectionné et chemin du projet visibles.

## État local actuel

- Aucun code Artemis applicatif ajouté ; la base OpenCode a depuis été importée.
- Le dépôt Git contient l’historique OpenCode ; branche locale `artemis-main`.
- `git`, `node`, `python3` et Bun local sont disponibles dans le PATH de développement.
- Une première tentative E01 avait été arrêtée sans rapport. Le runner corrigé
  conserve ses logs et un rapport final en cas d’échec, délai dépassé ou interruption.

## Prochain travail : P1

Construire le premier parcours Artemis avec objectif, critères, budget et politique
d’autorisation. P0 prouve un parcours CLI existant ; il ne prouve pas encore la
reprise après crash ni les futures fonctions d’autonomie.

La provenance importée est dans [upstream.json](upstream.json). La clé temporaire
a été déplacée dans `.env.local`, ignoré par Git ; `.env.example` ne contient plus de secret.

## Preuves

Voir le [rapport P0](reports/p0-baseline.md) pour les commandes, résultats et limites.
La validation concerne Arch Linux x64, pas encore Windows ou macOS.

## Suivi des lots

| Lot | État |
| --- | --- |
| Cadrage documentaire | Réalisé |
| P0 — Base et audit | Réalisé sur Arch Linux x64 |
| P1 — Parcours avec un agent | À faire |
| P2 — Autonomie et reprise | À faire |
| P3 — Mémoire et skills | À faire |
| P4 — Parallélisme | À faire |
| P5 — Documents | À faire |
| P6 — Équipe et plateformes | À faire |
| P7 — Interfaces et commercialisation | À faire |
