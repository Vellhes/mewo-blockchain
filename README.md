# Mewo-blockchain

# Dépendances

Il faut installer node.js (version utilisé pour le développement : 16.20.0)

Il faut aussi installer HardHat version 2.8.4  
`` npm install --save-dev hardhat@2.8.4 ``

Il faut aussi installer certaines autres dépendances

```
npm install react-router-dom@6
npm install ipfs-client-@56.0.1
npm i @openzeppelin/contracts@4.5.0
```

# Tests

Lancer la commande  
``` npx hardhat test ```

# Lancer le projet

```
npm hardhat node
npm hardhat run src/backend/scripts/deploy.js --network localhost
npm start
```