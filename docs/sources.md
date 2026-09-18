# Sources et provenance

Références consultées pendant le cadrage. Les pages vivantes peuvent évoluer ;
le code d’une révision figée fera autorité pour l’implémentation.

## Base OpenCode importée

- Dépôt : [anomalyco/opencode](https://github.com/anomalyco/opencode).
- Version retenue : [v1.18.31](https://github.com/anomalyco/opencode/releases/tag/v1.18.31).
- [Manifeste du tag](https://github.com/anomalyco/opencode/blob/v1.18.31/package.json) :
  Bun `1.3.14` déclaré comme gestionnaire, workspaces et scripts amont.
- [Manifeste du bureau](https://github.com/anomalyco/opencode/blob/v1.18.31/packages/desktop/package.json) :
  application Electron. Tauri était une proposition initiale, pas le stack constaté.
- [Guide de contribution](https://github.com/anomalyco/opencode/blob/dev/CONTRIBUTING.md)
  et [instructions amont](https://github.com/anomalyco/opencode/blob/dev/AGENTS.md) :
  relire les versions du checkout avant exécution. Le script de test racine consulté
  refuse l’exécution globale ; cibler les packages selon leurs instructions.
- [Licence](https://github.com/anomalyco/opencode/blob/dev/LICENSE) : MIT ; conserver
  les mentions requises et vérifier les composants ajoutés.

Le commit SHA, la date de récupération et la version de Bun sont consignés dans
[upstream.json](upstream.json). Les vérifications locales sont détaillées dans le
[rapport P0](reports/p0-baseline.md).

## Interfaces d’extension

- [Serveur](https://opencode.ai/docs/server/) : API locale et événements.
- [Fournisseurs](https://opencode.ai/docs/providers/) : intégration OpenRouter.
- [Plugins](https://opencode.ai/docs/plugins/) : outils et points d’extension.
- [Permissions](https://opencode.ai/docs/permissions/) : mécanismes à auditer.

Ces documents expliquent les capacités publiques. Leur existence ne démontre pas
que tous les invariants Artemis soient déjà implémentés.

## Inspirations et alternatives

- [Pi](https://github.com/earendil-works/pi) : composants de harnais réutilisables.
- [Hermes Agent](https://github.com/NousResearch/Hermes-Agent) et son
  [système de skills](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills/) :
  référence pour les procédures et l’apprentissage par expérience.
- [Kimi Code](https://github.com/MoonshotAI/kimi-cli) et
  [présentation de Kimi K2.5](https://www.kimi.com/en/blog/kimi-k2-5) : distinguer
  le CLI public du système Swarm décrit avec son orchestrateur entraîné.

## Fournisseur et documents

- [Limites OpenRouter](https://openrouter.ai/docs/api/reference/limits) et
  [appels d’outils](https://openrouter.ai/docs/guides/features/tool-calling) :
  capacités, quotas et erreurs à traiter ; ne pas figer des modèles gratuits dans le code.
- [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR) et
  [RapidOCR](https://github.com/RapidAI/RapidOCR) : candidats documentaires.
  L’identité de l’outil évoqué par l’utilisateur reste non confirmée.

## Distinction faits / conception

La base et les manifestes sont des observations sourcées. Le découpage des modules,
les états, budgets, critères de validation et étapes d’intégration constituent une
proposition pour Artemis. Le registre des [décisions](decisions.md) précise leur statut.
