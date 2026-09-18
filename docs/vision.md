# Vision et synthèse des échanges

Date de référence : 15 septembre 2026. Ce document reformule les échanges ;
il ne constitue pas une transcription mot à mot.

## Besoin exprimé

Construire un agent de code pour une équipe de développeurs, avec une possibilité
de commercialisation si sa qualité est suffisante. Le créateur développe seul,
sous Arch Linux, et connaît Python, JavaScript et C++, tout en apprenant Rust.
Les plateformes visées sont Linux, macOS et Windows.

L’utilisateur a choisi de partir d’une base open source et a ensuite confirmé
OpenCode. Il demande de documenter les échanges, l’architecture et le plan avant
de commencer l’implémentation.

## Expérience souhaitée

- Terminal en premier ; bureau et extension VS Code après consolidation du harnais.
- Travail prolongé sur un objectif avec peu d’intervention.
- Validation pour les actions critiques, sans demandes répétitives inutiles.
- Modifications de code précises, inspirées de l’expérience Codex et Claude Code.
- Plusieurs agents travaillant en parallèle sans écraser leurs changements.
- Apprentissage de procédures réutilisables, inspiré des skills d’Hermes.
- Possibilité de changer de fournisseur et, à terme, d’utiliser des modèles locaux.

Le « harnais » désigne les mécanismes autour du modèle : contexte, outils,
permissions, exécution, persistance, reprise et vérification.

## Inspirations et portée

| Référence | Élément apprécié | Traduction dans Artemis |
| --- | --- | --- |
| Codex et Claude Code | Qualité des modifications, délégation | Éditions ciblées, vérification et tâches déléguées explicites |
| Kimi et sa fonction Swarm | Travail parallèle coordonné | Coordinateur, travailleurs isolés et intégration contrôlée |
| Hermes | Création et amélioration de skills | Procédures versionnées, évaluées et réutilisées |
| OpenCode | Base open source et expérience de code | Socle retenu, moteur partagé et interfaces réutilisées |

Ces références expriment des objectifs d’expérience. Elles ne garantissent pas
que les mêmes performances soient obtenues avec d’autres modèles ou que toutes
les fonctions observées existent dans les dépôts publics.

## Contraintes et ressources

- OpenRouter est le premier fournisseur demandé.
- Modèles gratuits ou peu coûteux pendant la création et les tests.
- Aucun budget chiffré ni délai ferme n’a été fixé.
- La qualité prime sur la vitesse de livraison.
- L’estimation évoquée de quatre à huit mois pour une première version d’équipe
  est indicative, dépend du temps disponible et sera révisée après le lot initial.
- Un outil chinois de lecture documentaire, au logo rappelant une patte de panda,
  a été évoqué. Son identité reste inconnue ; PaddleOCR et RapidOCR sont des pistes.

## Premier périmètre fonctionnel

Lire et rechercher dans un dépôt, modifier des fichiers, exécuter des commandes
et tests, présenter les résultats et les diffs, gérer les permissions, conserver
une session et mesurer les appels modèle. Une première tâche réelle et bornée
doit traverser toute cette chaîne.

La première version interne vise un moteur local par développeur. Les règles et
skills de projet pourront être partagés par Git. Un service central pour l’équipe,
la synchronisation des conversations et la facturation ne sont pas présumés nécessaires.

## Extensions prévues

1. Objectifs durables, reprise et gestion du contexte sur les tâches longues.
2. Mémoire du projet et apprentissage de skills.
3. Parallélisation contrôlée, d’abord avec deux travailleurs.
4. Lecture documentaire locale optionnelle.
5. Distribution sur les trois plateformes, bureau et VS Code.
6. Fonctions commerciales fondées sur les retours d’usage de l’équipe.

## Mesure du succès

Pour un ensemble de tâches versionnées : taux de réussite, régressions, coût,
durée, nombre d’interventions humaines et incidents d’autorisation. Comparer
chaque ajout à la base OpenCode avec le même modèle et les mêmes conditions.

L’autonomie se mesure par des tâches terminées et vérifiées. Le nombre d’agents,
le nombre de skills ou la durée d’exécution seuls ne sont pas des preuves de qualité.
