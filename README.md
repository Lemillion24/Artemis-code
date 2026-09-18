# Artemis Agent

Agent de développement destiné à une équipe, construit à partir d’OpenCode.
Le terminal est la première interface. L’objectif est un moteur capable de mener
une tâche longue, de vérifier son travail et de reprendre après interruption,
avec validation humaine pour les actions critiques.

## État du projet

**Phase actuelle : P0 validé sur Arch Linux ; première correction réelle via OpenRouter réussie.**

La base OpenCode est importée sur une révision fixe. Les fonctionnalités Artemis
décrites sont des objectifs de construction, pas des fonctionnalités disponibles.

## Lancer les essais

Configurer `OPENROUTER_API_KEY` dans `.env.local` (ignoré par Git), puis lancer :

```sh
.artemis-local/bin/bun run script/artemis/dev.ts
```

Le lanceur vérifie un modèle gratuit avec outils, charge la clé et conserve ses
données sous `.artemis-local/runtime`. Un chemin de projet peut être fourni en argument.
L’interface porte encore le nom OpenCode. Voir le [guide local](docs/development.md).

## Documentation

1. [Vision et synthèse des échanges](docs/vision.md) — besoins, contraintes et périmètre.
2. [Décisions](docs/decisions.md) — décisions validées, propositions et questions ouvertes.
3. [Architecture](docs/architecture.md) — composants, responsabilités et invariants.
4. [Plan d’implémentation](docs/implementation-plan.md) — lots, dépendances et critères de fin.
5. [État et prochaines actions](docs/status.md) — travail réalisé et prochain lot.
6. [Sources et base OpenCode](docs/sources.md) — références et éléments vérifiés.
7. [Guide de développement](docs/development.md) — installation locale et commandes de test.

## Premier résultat attendu

Une session dans le terminal reçoit une tâche sur un dépôt de test, réalise une
modification ciblée, exécute les validations nécessaires, montre le diff et
conserve un état permettant une reprise après interruption.

## Direction technique

- Base OpenCode, avec modifications limitées et suivi de l’origine.
- TypeScript et outillage de la version OpenCode retenue.
- OpenRouter en premier ; autres fournisseurs et modèles locaux ensuite.
- Moteur commun aux futures interfaces terminal, bureau et VS Code.
- Autonomie d’un agent avant parallélisation ; mémoire et skills évalués avant partage.

Les choix détaillés et leur statut figurent dans le [registre de décisions](docs/decisions.md).
