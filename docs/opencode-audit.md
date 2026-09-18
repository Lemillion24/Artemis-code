# Audit initial du socle OpenCode

Révision examinée : `014614d35b397775e5d397a490fc72368c894ec2` (`v1.18.31`).
Audit ciblé de lecture et de tests, pas une revue exhaustive du monorepo.

## Structure réellement observée

| Composant | Emplacement | Rôle / décision Artemis |
| --- | --- | --- |
| CLI | `packages/opencode/src/index.ts`, `src/cli/cmd/run.ts` | Réutiliser le lancement et les événements JSON |
| Terminal | `packages/tui/src/` | Réutiliser ; ajouter les objectifs plus tard |
| Serveur de la CLI | `packages/opencode/src/server/server.ts` | Préserver le parcours existant pendant P0 |
| Nouveau serveur et contrat | `packages/server/`, `packages/protocol/` | Respecter leurs dépendances et génération de clients |
| Cœur de sessions | `packages/core/src/session.ts`, `session/input.ts`, `session/store.ts` | Réutiliser l’admission et la persistance des sessions |
| Exécution | `packages/core/src/session/execution/local.ts`, `session/run-coordinator.ts` | Coordination locale au processus ; ne pas la doubler |
| Boucle modèle | `packages/core/src/session/runner/` | Point à intégrer pour objectifs longs et limites |
| Contexte | `session/history.ts`, `session/context-epoch.ts`, `session/compaction.ts` dans core | Réutiliser et vérifier la conservation des contraintes |
| OpenRouter | `packages/core/src/plugin/provider/openrouter.ts` | Fournisseur existant, pas de nouveau client maison |
| Permissions | `packages/core/src/permission.ts` | Réutiliser le service ; préciser la politique Artemis |
| Éditions | `packages/core/src/tool/edit.ts`, `tool/write.ts`, `file-mutation.ts` | Réutiliser, mesurer les cas concurrents avant extension |
| Stockage | `packages/core/src/database/` et migrations de core | Toute extension doit respecter le propriétaire des entités |
| Skills | `packages/core/src/skill.ts`, `skill/discovery.ts`, `tool/skill.ts` | Réutiliser la découverte ; ajouter l’apprentissage évalué |
| Worktrees | `packages/opencode/src/worktree/index.ts`, `control-plane/adapters/worktree.ts` | Auditer avant d’envelopper pour les travailleurs |
| Plugins | `packages/plugin/src/index.ts`, `packages/core/src/plugin/` | Distinguer contrats publics et intégrations internes |

## Résultat principal : coexistence de chemins anciens et nouveaux

La proposition initiale « packages/opencode contient tout le cœur » est trop simple
pour cette version. Le dépôt sépare déjà Schema, Core, Protocol, Server, Client et
TUI, tout en conservant des implémentations historiques dans `packages/opencode`.

Les instructions amont imposent le sens des dépendances : Schema vers Core/Protocol,
puis Core/Protocol vers Server ; les clients ne doivent pas dépendre du runtime Core.
Le prochain lot doit suivre ce découpage. Un package Artemis ne devra pas devenir
un raccourci qui rend le client dépendant du moteur.

Le test terminal prouve le démarrage de l’interface. Les tests core prouvent certains
services V2. Ils ne démontrent pas à eux seuls que chaque action du terminal traverse
exactement les mêmes services. Le parcours E01 passe par `packages/opencode/src/cli/cmd/run.ts`
et la boucle historique `SessionPrompt`, pas par le runner V2 de Core. Cette frontière
devra être traitée explicitement lors de la liaison des objectifs aux sessions en P1.

## Ce qui existe déjà

- Admission durable des prompts et gestion de leurs identifiants dans le cœur V2.
- Sérialisation des exécutions d’une même session et concurrence entre sessions.
- Service de permissions avec décisions et réponses.
- Outils d’édition exacte, écriture et résultats structurés.
- Adaptateur OpenRouter et format de configuration migrable depuis V1.
- API de santé avec authentification du serveur vérifiée localement.

## Ce qui ne doit pas être présumé acquis

- **Reprise après crash :** l’exécuteur local s’appuie sur une coordination en mémoire.
  `AGENTS.md` réserve explicitement la récupération après crash à une conception dédiée.
  Une admission durable ne suffit pas à garantir un rejeu sûr des actions externes.
- **Parité des éditions V2 :** `tool/edit.ts` conserve des TODO pour les corrections
  approximatives, formatters, notifications, snapshots/undo et diagnostics LSP.
  La présence de ces fonctions ailleurs dans le dépôt ne prouve pas leur intégration V2.
- **Sandbox :** ni un worktree, ni une règle d’autorisation ne constitue une isolation
  système. Le parcours de commandes doit être examiné en P1.
- **Hooks de plugins :** leurs déclarations ne prouvent pas leur déclenchement dans
  tous les chemins ; vérifier les points effectifs avant de choisir l’intégration.
- **Budget global et skills appris :** à ajouter et à évaluer pour les objectifs Artemis.

## Réutiliser / adapter / construire

| Réutiliser | Adapter après preuve du parcours | Construire progressivement |
| --- | --- | --- |
| TUI, formats de session, fournisseur | Événements pour l’affichage des objectifs | Objectifs et critères d’acceptation |
| Édition, écriture et recherche | Permissions et héritage de périmètre | Budget commun et détection de stagnation |
| Stockage, contexte et skills | Reprise et gestion des actions incertaines | Validation et promotion des skills |
| API et clients existants | Worktrees et intégration des changements | Planification de tâches entre travailleurs |

## Modifications apportées en P0

Aucune modification du runtime amont ni de son lockfile. Ajouts : documentation,
provenance, exclusions des données locales, fixture et runner d’évaluation. Le README
Artemis remplace le point d’entrée amont, conservé séparément.

La prochaine décision d’architecture portera sur la liaison objectif ↔ session et
son stockage. Elle sera prise à partir du parcours vérifié, sans créer maintenant
un package vide ou une seconde boucle d’agent.
