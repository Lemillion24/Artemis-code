# Évaluations Artemis

Le premier scénario utilise `fixtures/cart`, un petit projet JavaScript sans dépendance.
Son défaut est volontaire : le panier vide provoque une exception. Les tests doivent
échouer avant correction. Ce dossier n’entre pas dans les suites des packages OpenCode.

## Exécution du scénario initial

Depuis la racine, avec Bun disponible dans le PATH :

```sh
bun run script/artemis/baseline.ts --prepare
bun run script/artemis/baseline.ts --models
bun run script/artemis/baseline.ts --run
```

`--prepare` crée une copie temporaire et vérifie le défaut sans appeler d’API.
`--models` liste les modèles actuellement gratuits avec appels d’outils, sans clé.
`--run` nécessite `OPENROUTER_API_KEY`, sélectionne un modèle admissible et lance
OpenCode sur la copie. La clé et `ARTEMIS_MODEL` sont chargés depuis `.env.local` ;
les variables déjà exportées ont priorité. `ARTEMIS_MODEL` peut imposer un identifiant OpenRouter gratuit.
L’admissibilité est vérifiée à chaque lancement ; aucun modèle payant de secours
n’est configuré. La gratuité observée dans le catalogue reste soumise au fournisseur.

Les rapports locaux se trouvent dans `.artemis-local/evals/`. Le projet de travail
est créé sous le dossier temporaire système et conservé pour inspection. Le runner
garde ses tests de validation hors du projet présenté à l’agent, et vérifie aussi que
les tests fournis à l’agent n’ont pas été modifiés. Le contrôle externe du résultat
ne se contente pas de la déclaration finale du modèle.

`report.json` est créé avant les préparatifs puis mis à jour jusqu’au résultat final.
`agent.log` est alimenté pendant l’exécution, avec masquage de la clé utilisée.
Le délai de cinq minutes arrête aussi les descendants dans le groupe de processus
sous Linux. Un code de sortie nul ne suffit pas : les trois tests externes doivent
réussir, le diff doit rester limité à `cart.mjs` et les tests fournis doivent être inchangés.

Le profil de permissions limite les outils pour ce scénario de confiance. Il ne
constitue pas une sandbox système ; l’isolation d’un dépôt non fiable est prévue en P1.
Ne pas exécuter ce scénario avec des fichiers sensibles ou un projet tiers.

## Scénarios de référence

| ID | Tâche | Validation | État initial |
| --- | --- | --- | --- |
| E01 | Corriger le panier vide | Tests externes, diff limité à `cart.mjs`, tests fournis inchangés | Réussi le 16/09/2026 via OpenRouter |
| E02 | Ajouter une option répartie entre API et appelant | Tests unitaires et intégration | À implémenter en P1 |
| E03 | Éditer un fichier changé depuis sa lecture | Pas d’écrasement silencieux | À implémenter en P1 |
| E04 | Refuser une commande critique | Aucun effet après refus | Tests amont puis scénario P1 |
| E05 | Subir quota ou coupure fournisseur | État explicite, tentatives bornées | Tests amont puis scénario P2 |
| E06 | Interrompre une tâche puis reprendre | Critères conservés, pas de double effet | À implémenter en P2 |

Pour chaque exécution réelle : révision, modèle, date, durée, événements d’outils,
résultats de validation et coût déclaré quand disponible. Les évaluations sans API
et les performances avec modèle doivent être rapportées séparément.
