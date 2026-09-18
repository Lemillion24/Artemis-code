# Registre de décisions

Date de référence : 15 septembre 2026.

« Validé » signifie explicitement choisi par l’utilisateur. « Direction retenue »
désigne une proposition technique de travail, révisable avec les résultats de l’audit.

## D001 — Partir d’OpenCode

**Statut : validé.** Adapter une base open source ; OpenCode a été explicitement choisi.

Conserver l’historique amont, les licences, les outils de développement et la
structure initiale. Ajouter les comportements Artemis dans des modules distincts.
Utiliser les points d’extension existants avant de modifier les composants centraux.

Alternative examinée : Pi pour un moteur plus directement assemblable. Hermes
reste une référence pour la mémoire ; Kimi pour la coordination.

Conséquence : prévoir le coût de compréhension du monorepo et de mise à jour du fork.

## D002 — Terminal puis interfaces supplémentaires

**Statut : validé.** Terminal d’abord, bureau et extension VS Code après stabilisation.

Direction retenue : moteur local commun, API et événements partagés. Les interfaces
ne portent pas de logique d’exécution ou d’autorisation indépendante.

## D003 — TypeScript et outillage amont

**Statut : direction retenue.** TypeScript pour le moteur et les interfaces concernées ;
Bun et dépendances déterminés par la version importée. Python est réservé au module
documentaire optionnel. Aucun composant Rust ou C++ supplémentaire au départ.

## D004 — OpenRouter en premier

**Statut : validé.** Réutiliser le fournisseur existant, sans créer un deuxième client
modèle dans les modules Artemis. Prévoir les autres fournisseurs et le local à terme.

Direction retenue : profils de modèles explicites, capacités vérifiées, budgets
par objectif et plafond partagé par les travailleurs. Aucun basculement vers un
modèle payant hors de la politique de coût de l’utilisateur.

## D005 — Autonomie et permissions

**Statut : besoin validé ; politique précise à définir.** Peu d’intervention et
validation des actions critiques. Les permissions sont appliquées par l’exécuteur,
y compris pour les commandes, extensions et travailleurs.

Direction retenue : permissions limitées à un périmètre et enregistrées ; une
approbation ne s’étend pas automatiquement à une autre action ou à un autre projet.

## D006 — État durable et stockage local

**Statut : direction retenue.** Réutiliser le stockage des sessions d’OpenCode.
Conserver les objectifs, tâches et budgets Artemis dans des tables dédiées avec
migrations. SQLite est la cible initiale.

Le choix entre la même base physique et une base séparée dépend de l’audit. Chaque
entité a un seul propriétaire ; ne pas copier l’historique des conversations pour
créer une seconde source de vérité.

## D007 — Parallélisme progressif

**Statut : besoin validé ; mécanisme proposé.** Un coordinateur et deux travailleurs
pour commencer ; chaque travailleur dispose d’un espace de travail et d’un budget.
L’intégration des modifications est sérialisée et vérifiée.

Les worktrees Git séparent les fichiers. Ils ne constituent pas une sandbox et
n’éliminent ni les conflits sémantiques ni les ressources externes partagées.

## D008 — Apprentissage par skills

**Statut : besoin validé ; mécanisme proposé.** Enregistrer des procédures et références,
sans entraînement automatique des poids des modèles. Distinguer skill candidat,
skill validé et skill retiré. Versionner, tester, conserver la provenance et permettre
un retour à une version antérieure.

Direction retenue : partage dans la bibliothèque de l’équipe après revue ; aucune
permission supplémentaire accordée par le contenu d’un skill.

## D009 — Lecture documentaire optionnelle

**Statut : direction retenue, outil à choisir.** Extraction native avant OCR ; modèle
de vision lorsque la tâche exige une compréhension visuelle. Tester les langues,
le matériel, les licences du code et des poids avant intégration.

Un prétraitement local peut être suivi d’un envoi du texte à une API. Ne pas présenter
ce parcours comme entièrement hors ligne.

## D010 — Bureau : décision différée

**Statut : ouvert.** Tauri avait été proposé dans l’échange initial. Le manifeste
OpenCode v1.18.31 consulté utilise Electron. Pour limiter la divergence, évaluer
d’abord la réutilisation du bureau amont ; ne pas programmer une migration Tauri
avant un besoin démontré. Voir les [sources](sources.md).

## Questions ouvertes sans blocage du cadrage

- Budget mensuel et modèles OpenRouter de référence.
- Liste précise des actions critiques et des périmètres autorisables.
- Identité de l’outil documentaire et ressources CPU/GPU disponibles.
- Plateformes et architectures matérielles accessibles pour les tests.
- Mode de distribution, licence des ajouts Artemis et fonctions commerciales.
- Besoin éventuel de coordination entre plusieurs machines d’une équipe.

Ces questions seront traitées au lot concerné. Elles n’empêchent pas la préparation
de la base et des évaluations sans appel à un modèle payant.
