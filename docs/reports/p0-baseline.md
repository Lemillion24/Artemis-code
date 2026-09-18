# Rapport P0 — Import et vérification locale

Travail effectué pendant la session du 15–16 septembre 2026, sous Arch Linux x64.

## Base

- OpenCode `v1.18.31`, commit `014614d35b397775e5d397a490fc72368c894ec2`.
- Historique Git récupéré avec filtrage des blobs ; branche `artemis-main` et remote `upstream`.
- Sept documents Artemis préservés lors de l’import ; README amont archivé.
- Bun `1.3.14`, archive officielle avec checksum vérifié.
- Installation : 4 721 packages, lockfile figé, code de sortie 0.
- Aucun changement de contenu dans `bun.lock` ou les packages amont à ce stade.

## Résultats

| Vérification | Résultat | Limite |
| --- | --- | --- |
| CLI `--help` depuis les sources | Réussite, code 0 | Ne vérifie pas un appel modèle |
| `bun typecheck` dans `packages/opencode` | Réussite, code 0 | Typage du package ciblé, pas tous les packages |
| Coordination, prompts, permissions et fournisseur OpenRouter | 56 tests réussis, 0 échec, 124 assertions | Quatre fichiers de tests core |
| Outils edit et write | 17 tests réussis, 0 échec, 80 assertions | Deux fichiers de tests core |
| Terminal dans tmux sur la fixture | Écran de connexion fournisseur et prompt affichés | Aucun modèle connecté |
| Serveur `/global/health` sans authentification | HTTP 401 attendu | Serveur de test limité à localhost |
| Serveur `/global/health` avec authentification | HTTP 200, `healthy: true`, version `local` | Processus arrêté après vérification |
| Fixture E01 avant correction | Échec attendu sur le panier vide | Défaut volontaire, pas une régression du socle |
| Runner `--prepare` | Réussite après autorisation hors bac à sable | Aucun appel API |
| Runner `--models` | Catalogue gratuit avec outils obtenu | Disponibilité susceptible de changer |
| Compilation Bun du runner | Réussite | Ne remplace pas une évaluation réelle |
| Scripts Artemis : `bun typecheck` et `bun test` | Typage réussi ; 5 tests, 18 assertions, 0 échec | Scripts de lancement/évaluation sous Linux |
| Authentification OpenRouter | HTTP 200 avec la clé locale | Valeur non affichée et non enregistrée dans le rapport |
| Tâche OpenRouter E01 | Réussite en 49,866 s, code 0 ; 3 tests externes réussis | Une tâche simple, un modèle gratuit, une exécution complète |
| Lanceur Artemis dans tmux | Prompt, chemin du projet et `cohere/north-mini-code:free` visibles | Interface encore nommée OpenCode |

Total des suites core sélectionnées : **73 tests réussis, 0 échec**.
La fixture délibérément incorrecte est évaluée séparément de ces suites.

## Revue et corrections du 16 septembre

Le lancement précédent ne garantissait ni les chemins XDG annoncés ni le choix
explicite d’un modèle gratuit. Une tentative E01 avait été arrêtée sans rapport ;
son processus actif ne constituait pas une preuve de réussite.

- Clé déplacée de `.env.example` vers `.env.local`, ignoré par Git ; exemple nettoyé.
- Ajout de `script/artemis/dev.ts` : chargement explicite de la clé, choix vérifié
  dans le catalogue, projet absolu, données et configuration de développement isolées.
- Suppression du champ `apiKey` contenant une substitution textuelle dans le JSON
  du runner ; utilisation de l’intégration d’environnement du fournisseur.
- Logs conservés pendant l’exécution et rapport final en cas d’échec ou annulation.
- Arrêt du groupe de processus au dépassement du délai sous Linux, testé avec
  un descendant maintenant les sorties ouvertes.
- Tests externes préparés avant le lancement ; contrôle des trois tests exécutés,
  des tests d’origine inchangés, des erreurs d’agent et du périmètre du diff.
- États documentaires contradictoires corrigés.

## Preuve E01 réelle

Exécution du 16 septembre 2026 à 11:53:28 UTC, avec `cohere/north-mini-code:free`.
Le catalogue OpenRouter indiquait zéro pour ses tarifs et la prise en charge des outils.
L’agent a lu les fichiers, ajouté la valeur initiale `0` au `reduce` de `subtotal`
dans `cart.mjs`, puis exécuté `node --test`. Une tentative `ls -la` a été refusée
par la politique du scénario ; l’agent a poursuivi avec les outils autorisés.

Résultat indépendant : 3 tests réussis, aucun échec, seul `cart.mjs` modifié et
`cart.test.mjs` inchangé. Aucun délai dépassé, aucune interruption, aucune erreur
finale d’agent. Le coût total n’est pas agrégé par le runner.

Preuves locales conservées dans `.artemis-local/evals/artemis-baseline-0GeMdm/` :
`report.json`, `agent.log`, `before.txt`, `after.txt`, `changes.diff` et tests externes.

## Incidents d’environnement

- DNS/registres et écoute locale bloqués dans le bac à sable : opérations reprises
  après autorisation, sans changer les dépendances ni les contrôles de sécurité.
- Le runner Node isolé échouait sans diagnostic utile dans le bac à sable ; le même
  scénario `--prepare` a réussi hors du bac à sable.
- Les droits exécutables exposés par le montage donnaient de faux changements Git ;
  `core.fileMode=false` a été configuré localement. Les contenus restent comparés.

## Preuves et reproduction

Les commandes reproductibles figurent dans [development.md](../development.md).
Les rapports de fixture sont sous `.artemis-local/evals/` (ignorés par Git).
Les captures et sorties de vérification de cette session sont temporaires sous
`/tmp/artemis-*.log` et `/tmp/artemis-tui-capture.txt` ; ce document en conserve la synthèse.

## État de fin

L’import, le démarrage, l’audit initial et la tâche réelle OpenRouter sont vérifiés.
**P0 est réalisé sur Arch Linux x64.** P1 peut commencer. Le test réel utilise
le parcours CLI historique ; il ne démontre pas les propriétés de reprise du cœur V2.

Les fonctionnalités Artemis des lots suivants, la compilation d’un binaire distribué,
les tests complets du monorepo et la compatibilité macOS/Windows ne sont pas déclarés validés.
