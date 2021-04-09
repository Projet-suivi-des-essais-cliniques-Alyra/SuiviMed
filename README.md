# Suivi des essais cliniques

Pour améliorer la sécurité et la transparence du système, les données des patients participant aux essais sont cryptées et stockées sur IPFS. Seul l'identifiant du contenu ou le CID (content identifier) renvoyé par IPFS est stocké sur la Blackchaine.

# Installation des différents packages

Il existe plusieurs packages qui permettent d'interagir avec IPFS, pour ce travail nous avons choisi le package [ipfs-core](https://www.npmjs.com/package/ipfs-core) qui est simple d'utilisation et permet de démarrer ipfs sans l'avoir lancé sur le terminal [(voir ce lien)](https://github.com/ipfs/js-ipfs).

```bash
npm i ipfs-core
```

# Interaction avec IPFS
