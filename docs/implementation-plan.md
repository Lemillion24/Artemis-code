# Plan d’implémentation

Statut : P0 réalisé sur Arch Linux x64 ; P1 à P7 restent à réaliser.
Les résultats et limites sont suivis dans [status.md](status.md).

## Méthode

Un lot se termine avec un résultat exécutable, des preuves de vérification et une
mise à jour de l’état. Les modifications doivent rester petites et révisables.
Ne pas créer toute l’arborescence cible ni réécrire les composants amont par anticipation.

Ordre principal : P0 → P1 → P2 → P3 → P4 → P6 → P7. P5 peut s’insérer après P2,
sans retarder la fiabilité du moteur. Cet ordre décrit le développement du produit ;
il ne demande pas de déléguer le travail actuel à des sous-agents.

## P0 — Import reproductible et audit de la base

### Travail prévu

1. Préserver les documents Artemis et inventorier les contraintes du dossier.
2. Préparer un dépôt OpenCode avec son historique, en respectant les protections
   du workspace. Réalisé ; ne pas remplacer le dossier `.git` existant.
3. Examiner le tag candidat `v1.18.31`, résoudre son commit et conserver le SHA
   exact dans le registre de provenance. Cette version est maintenant importée
   et vérifiée localement ; voir le rapport P0.
4. Conserver l’origine OpenCode comme remote `upstream` et préparer une branche
   Artemis. Définir `origin` seulement quand un dépôt Artemis distant existe.
5. Importer sans écraser cette documentation ; garder le README amont dans un
   emplacement documenté si le README Artemis devient le point d’entrée.
6. Lire les instructions du checkout et des packages concernés, vérifier les
   scripts d’installation, puis préparer Bun à la version du manifeste.
7. Installer avec le lockfile figé, compiler/démarrer le terminal et exécuter les
   vérifications amont pertinentes. Consigner les éventuels échecs préexistants.
8. Cartographier session, fournisseur, outils, permissions, stockage, événements,
   délégation et plugins. Identifier les points d’intégration Artemis réels.
9. Préparer une configuration OpenRouter sans secret dans Git. Le test réel nécessite
   une clé configurée localement ; les autres vérifications restent possibles sans clé.
10. Définir cinq à dix tâches de référence et relever le comportement initial.

### Livrables

- Checkout avec provenance précise, licence et lockfile conservés.
- Guide de développement fondé sur les commandes réellement exécutées.
- Cartographie « réutiliser / adapter / construire » et liste des patches nécessaires.
- Rapport de référence, distinguant tests sans modèle et tests réels.

### Critère de fin

Le terminal démarre sur un dépôt de test ; l’état exact de la base est reproductible.
Une tâche OpenRouter lit, modifie et vérifie un petit projet avec résultats enregistrés.
Si la clé manque, cette preuve reste explicitement en attente et P0 n’est pas déclaré terminé.

## P1 — Premier parcours Artemis avec un agent

### Travail prévu

- Ajouter le premier module Artemis et son adaptateur vers OpenCode.
- Définir les contrats minimaux objectif, critères, événements et budget.
- Relier les outils existants à un périmètre et une politique d’autorisation.
- Présenter l’objectif, l’avancement, le diff, les validations et la consommation.
- Gérer erreurs fournisseur, annulation, limites et sorties d’outils volumineuses.
- Introduire un environnement d’exécution limité pour les scénarios autonomes.

### Critère de fin

Une tâche simple s’exécute de bout en bout ; une action critique attend son approbation ;
un refus empêche réellement son exécution. Une modification concurrente du développeur
est détectée et préservée. L’arrêt demandé interrompt les processus concernés.

## P2 — Autonomie longue et reprise

### Travail prévu

- Ajouter migrations, transitions d’état, journal et checkpoints.
- Lier les tâches aux sessions existantes sans dupliquer les messages.
- Reprendre après crash ou erreur réseau ; traiter explicitement les actions incertaines.
- Préserver les contraintes lors de la réduction du contexte.
- Détecter stagnation et dépassement des budgets ; permettre pause et reprise.
- Rendre le cycle de vie du moteur indépendant de celui du terminal.

### Critère de fin

Une tâche comportant plusieurs étapes continue après fermeture puis reconnexion du
terminal. Après arrêt brutal du moteur, elle reprend sans perte des critères ni
rejeu aveugle d’une action externe. Les boucles répétitives et budgets épuisés conduisent
à un état explicite. Les critères de réussite sont vérifiés avant clôture.

## P3 — Mémoire et skills

### Travail prévu

- Séparer portée utilisateur, projet et équipe ; rendre la mémoire consultable et corrigeable.
- Ajouter recherche, provenance et traitement des faits périmés.
- Extraire des skills candidats à partir de tâches vérifiées.
- Ajouter versions, critères de sélection, validations, retrait et retour arrière.
- Charger les ressources à la demande ; préparer une revue avant partage d’équipe.

### Critère de fin

Sur des tâches répétées et des variantes distinctes des exemples d’apprentissage,
comparer avec et sans skill. Mesurer réussite, coût et régressions. Un skill incorrect
est retirable et ne peut pas augmenter les permissions ni divulguer une mémoire privée.

## P4 — Coordinateur et deux travailleurs

### Travail prévu

- Ajouter dépendances de tâches, affectations, communication et limites de concurrence.
- Créer un worktree et un environnement borné par travailleur.
- Partager les budgets et sérialiser l’intégration ainsi que les mutations Git nécessaires.
- Gérer les travailleurs interrompus et les conflits de texte ou de comportement.

### Critère de fin

Deux tâches indépendantes aboutissent à un résultat commun validé. Une collision
volontaire est détectée et résolue sans perte de changements. Les tests parallèles
ne partagent pas accidentellement ports ou bases. Comparer coût, réussite et durée
au même scénario exécuté avec un seul agent avant d’augmenter la concurrence.

## P5 — Lecture documentaire locale

### Travail prévu

- Identifier si possible l’outil évoqué ; comparer les candidats sur un corpus réel.
- Vérifier licences, langues, dépendances, matériel et téléchargement des poids.
- Ajouter un module optionnel : texte natif, OCR, erreurs et provenance par page.
- Distinguer extraction et vision, avec politique explicite d’envoi aux API.

### Critère de fin

Un corpus comprenant PDF textuel, scan et image produit des résultats évalués.
Après installation des poids, l’extraction locale fonctionne sans réseau ; les
limites de lecture visuelle et les éventuels envois API sont clairement indiqués.

## P6 — Version utilisable par une équipe

### Travail prévu

- Automatiser les vérifications sur Linux, macOS et Windows.
- Tester installation, chemins, shells, permissions, mises à jour et migrations.
- Préparer politiques et skills de projet versionnés et protection des secrets.
- Mettre en place un pilote avec des développeurs et suivre les tâches échouées.
- Vérifier attribution, licences et provenance des composants distribués.

### Critère de fin

Des développeurs autres que le créateur installent et utilisent Artemis sur les
plateformes visées. Les résultats, incidents et limites sont consignés ; aucune
plateforme n’est annoncée validée uniquement sur la base d’une compilation croisée.

## P7 — Bureau, VS Code et préparation commerciale

### Travail prévu

- Comparer réutilisation du bureau Electron amont et alternatives, dont Tauri.
- Connecter le bureau et VS Code aux mêmes sessions, états et autorisations.
- Gérer reconnexion et affichage des demandes d’approbation depuis plusieurs clients.
- Définir avec l’usage réel la distribution, le support et les éventuels services payants.

### Critère de fin

Le passage du terminal à une autre interface conserve l’état. Une approbation ne
s’exécute qu’une fois même avec plusieurs clients. Les coûts de support et les
limites connues éclairent la décision de commercialisation.

## Scénarios de vérification transversaux

| Scénario | Preuve attendue |
| --- | --- |
| Bug avec test de régression | Correction vérifiée, sans modification étrangère à la tâche |
| Modification de plusieurs fichiers | Comportement intégré validé |
| Fichier modifié après lecture | Précondition en échec, données utilisateur conservées |
| Commande critique refusée | Aucun effet produit |
| Erreur 429 ou flux interrompu | Reprise bornée et état compréhensible |
| Arrêt moteur pendant une action | Résultat réconcilié avant nouvelle tentative |
| Contexte réduit | Objectif et contraintes encore appliqués |
| Budget partagé épuisé | Pas de nouveaux appels non autorisés |
| Travailleur disparu | Tâche récupérée sans double exécution |
| Skill erroné | Retrait possible et absence d’élévation de permission |

Les vérifications du moteur emploient des réponses simulées ou enregistrées quand
elles suffisent. Les performances agentiques nécessitent des appels réels, avec
modèle, paramètres, révision, répétitions et consommation consignés.

## Définition de terminé pour chaque lot

- Critères du lot remplis avec preuves ; points non vérifiés signalés.
- Vérifications pertinentes passées ; échecs amont distingués des régressions.
- Documentation et décisions synchronisées avec le résultat réel.
- Aucun secret dans les fichiers partagés ni les rapports.
- Versions reproductibles et changements assez isolés pour permettre un retour arrière.

## Mise à jour de la base OpenCode

Traiter chaque mise à jour comme un changement contrôlé : lire les notes de version,
intégrer dans une branche dédiée, résoudre les conflits, exécuter les scénarios
pertinents et comparer les résultats. Ne pas suivre automatiquement une branche mouvante.
