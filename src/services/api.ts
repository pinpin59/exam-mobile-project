// Simule le temps de réponse d'un vrai serveur
export const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));
