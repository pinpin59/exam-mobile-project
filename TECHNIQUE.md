# EventEase – Document technique

J'ai fait l'app avec Expo (SDK 57) et TypeScript, pour pouvoir la tester directement dans Expo Go sans gérer de code natif.

Pour la navigation j'utilise Expo Router, chaque fichier dans `src/app/` est un écran. Les pages sont protégées avec `Stack.Protected`, donc si on n'est pas connecté on est renvoyé vers la connexion. Il y a 3 onglets (Événements, Calendrier, Profil), et la création / modification d'un événement s'ouvre en modal plein écran.

J'ai séparé le code en plusieurs parties : les `services` récupèrent les données, les `contexts` les partagent entre les écrans, et les `components` sont les morceaux d'interface que je réutilise (boutons, champs, cartes...).

Je n'ai pas de vrai serveur, donc les services simulent un backend avec des données mockées et un petit délai. Si un jour on branche une vraie API, il faudra juste changer le contenu des services, pas les écrans.

Pour l'état global j'ai utilisé les Context de React (auth, événements, position, thème). Je n'ai pas pris Redux parce que l'app n'est pas assez grosse pour en avoir besoin.

La session, le thème et la langue sont sauvegardés avec AsyncStorage pour les retrouver au prochain lancement.

Pour le style j'utilise NativeWind (Tailwind). Les couleurs viennent d'une palette avec un mode clair et un mode sombre, je n'écris pas de couleur en dur dans les écrans.

L'app est traduite en français et en anglais avec i18next.

J'utilise expo-location pour afficher la distance jusqu'aux événements et pour remplir le lieu avec sa position. La date et l'heure se choisissent avec le sélecteur natif du téléphone.

La météo de chaque événement vient de l'API Open-Meteo, qui est gratuite et sans clé. Je garde les réponses en cache pour ne pas refaire la même requête plusieurs fois.
