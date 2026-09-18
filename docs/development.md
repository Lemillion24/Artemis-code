# Développement local

## Base installée

OpenCode `v1.18.31`, commit `014614d35b397775e5d397a490fc72368c894ec2`,
branche `artemis-main`, remote `upstream`. Aucun remote Artemis distant configuré.
Le manifeste amont et `bun.lock` sont conservés. Le README d’origine est archivé
dans [README.opencode.md](README.opencode.md).

## Bun

Dans ce workspace Linux x64, Bun `1.3.14` est installé dans `.artemis-local/bin/bun`.
Ce répertoire est ignoré par Git ; l’installation n’a pas modifié le PATH global.
Depuis la racine :

```sh
export PATH="$PWD/.artemis-local/bin:$PATH"
bun --version
```

Sur un nouveau poste, installer Bun selon la version `packageManager` du manifeste,
puis utiliser le lockfile existant :

```sh
bun install --frozen-lockfile
```

L’installation initiale a employé `HUSKY=0` pour ne pas modifier les hooks Git dans
le dossier protégé, et un cache sous `.artemis-local/cache/bun`. Les scripts amont
de postinstallation ont été exécutés. Le checksum de l’archive Bun figure dans la
[provenance](upstream.json).

## Lancer le terminal

```sh
bun run script/artemis/dev.ts --check
bun run script/artemis/dev.ts /chemin/du/projet
```

Le lanceur charge `.env.local` depuis la racine Artemis, vérifie le modèle dans le
catalogue gratuit avec outils et utilise `.artemis-local/runtime` pour les données
et la configuration. Les configurations personnelles et de projet OpenCode sont
écartées dans ce profil de développement. Les lectures sont autorisées ; les autres
outils demandent validation. Le PATH des sous-processus inclut le Bun utilisé.

Le lancement direct amont reste possible avec
`bun run --cwd packages/opencode src/index.ts /chemin/du/projet` ; il utilise les
configurations OpenCode habituelles et ne charge pas automatiquement `.env.local`.

La session préparée pendant la revue est accessible avec
`tmux -L artemis-dev attach -t artemis` tant qu’elle reste ouverte.
Détacher avec `Ctrl+b`, puis `d` ; `/exit` ferme le terminal.

Le nom affiché reste OpenCode dans ce lot : aucun changement de marque ni réécriture
du terminal n’est inclus. La version de développement peut afficher `local` ; la
révision Git et [upstream.json](upstream.json) identifient la base exacte.

## Configurer OpenRouter sans exposer la clé

Si `.env.local` n’existe pas, copier `.env.example` puis le remplir dans un éditeur.
Ne pas écraser un fichier local déjà configuré. Le runner reçoit la clé depuis ce
fichier ; il ne faut ni la mettre dans un argument de commande ni la coller dans le chat.

```sh
bun run script/artemis/baseline.ts --prepare
bun run script/artemis/baseline.ts --models
bun run script/artemis/baseline.ts --run
```

`--prepare` ne fait aucun appel réseau. `--models` interroge seulement le catalogue
public OpenRouter. `--run` crée une configuration temporaire, utilise un modèle
gratuit proposant les outils et exécute une tâche bornée à huit étapes configurées
et cinq minutes au niveau du lanceur. Ces limites d’évaluation ne sont pas encore
le système de budget ni la gestion complète des processus d’Artemis prévus en P1/P2.

L’appel réel E01 a réussi avec `cohere/north-mini-code:free` le 16 septembre 2026.
Le runner échoue explicitement si la clé manque. Aucun appel payant de secours n’est prévu. Les détails et limites
de l’évaluation figurent dans [evals/README.md](../evals/README.md).

Le runner écrit `report.json` dès le début et `agent.log` pendant l’exécution.
Un délai dépassé ou une interruption arrête le groupe de processus sous Linux et
conserve le résultat de vérification. Les tests externes sont préparés avant l’agent.

## Vérifications du socle

Les commandes de tests et de typage s’exécutent depuis les packages concernés,
conformément à `AGENTS.md`. Ne pas lancer la commande de tests racine.

Pour les scripts Artemis, depuis la racine :

```sh
cd script/artemis
bun typecheck
bun test
```

Le typage réutilise les définitions Bun installées avec `packages/opencode`.

```sh
cd packages/opencode
bun typecheck
```

Depuis la racine, pour reproduire les tests du cœur sélectionnés :

```sh
cd packages/core
bun test test/session-run-coordinator.test.ts test/session-prompt.test.ts test/permission.test.ts test/plugin/provider-openrouter.test.ts --timeout 30000 --only-failures
bun test test/tool-edit.test.ts test/tool-write.test.ts --timeout 30000 --only-failures
```

Pendant la validation initiale, les variables XDG de ces tests pointaient vers
`/tmp/artemis-tests/{data,config,cache,state}`. Les préchargements amont utilisent
une base en mémoire et un catalogue de modèles figé pour ces tests.

## Particularités de cet environnement

- Le montage du workspace présente des différences de droits exécutables. La
  configuration Git locale `core.fileMode=false` évite des milliers de faux changements.
- Les accès réseau, les sockets tmux et l’écoute du serveur local peuvent nécessiter
  l’autorisation du bac à sable. Un échec à ce niveau ne prouve pas un défaut d’OpenCode.
- Le runner de tests Node a échoué dans le bac à sable de cette session ; la même
  préparation a réussi après autorisation hors du bac à sable, sans changement de fixture.
- Les preuves initiales concernent Arch Linux x64. Windows, macOS, le packaging
  autonome et l’ensemble des tests du monorepo ne sont pas encore validés.

## Mettre à jour la base

Conserver `upstream`, choisir une révision fixe, intégrer dans une branche dédiée,
relancer les vérifications pertinentes et mettre à jour la provenance. Ne pas
remplacer le lockfile uniquement pour résoudre une erreur d’installation locale.
