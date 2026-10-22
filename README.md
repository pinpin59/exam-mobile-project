# EventEase

Application mobile pour gérer les événements d'une association (conférences, ateliers, sorties).

## Prérequis

- [Node.js](https://nodejs.org) (version 20 ou plus)
- L'application **Expo Go** sur ton téléphone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)), compatible avec le **SDK 57**

## Lancer le projet

1. Installer les dépendances

   ```bash
   npm install
   ```

2. Démarrer le serveur

   ```bash
   npx expo start
   ```

3. Scanner le QR code affiché dans le terminal :
   - **iPhone** : avec l'appareil photo
   - **Android** : depuis l'application Expo Go

Le téléphone et l'ordinateur doivent être sur le **même réseau Wi-Fi**. Si ça ne marche pas, lance `npx expo start --tunnel`.

## Comptes de test

Tous les comptes ont le mot de passe `password123`.

| Email | Rôle |
|---|---|
| kevin@eventease.dev | Bénévole (peut créer des événements) |
| camille@eventease.dev | Membre |
| lucas@eventease.dev | Membre |
| ines@eventease.dev | Membre |

On peut aussi créer un compte depuis l'écran d'inscription.

## À savoir

- Il n'y a pas de vrai serveur : les données sont simulées. Les événements créés ou modifiés sont donc **remis à zéro** quand on relance l'app.
- La géolocalisation et le choix du lieu fonctionnent sur **téléphone uniquement**, pas sur le web.
- Pour la distance et la météo, il faut **accepter la localisation**.

## Commandes utiles

```bash
npx expo start      # lancer l'app
npx tsc --noEmit    # vérifier les types
npx expo lint       # vérifier le code
```

L'architecture et les choix techniques sont expliqués dans [TECHNIQUE.md](TECHNIQUE.md).
