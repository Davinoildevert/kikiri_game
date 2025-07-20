# Casino Kikiri V2 🎲

Jeu de casino en ligne basé sur le traditionnel "Kikiri" avec système de timer réaliste.

## 🎮 Fonctionnalités

### 🎯 Jeu Kikiri
- **3 dés** lancés sous une coquille virtuelle
- **Paris** sur numéros individuels (1-6) ou combinaisons
- **Gains** : 2x la mise (au moins un dé) ou 3x (triple)
- **Zones de paris** complexes avec formes SVG personnalisées

### ⏰ Timer de Paris Réaliste
- **30 secondes** pour placer vos mises
- **Progression visuelle** : vert → orange → rouge selon le temps restant
- **"Rien ne va plus"** automatique à la fin du timer
- **Lancement automatique** des dés après expiration
- **Plateau désactivé** entre les manches pour éviter les erreurs

### 🎨 Interface
- **Effets visuels** : confettis, particules, halos gagnants
- **Jetons virtuels** : 1, 5, 10, 25, 50, 100
- **Système multijoueur** local
- **Historique des gains** en temps réel

## 🛠️ Technologies

- **Next.js 15** + **React 18** + **TypeScript**
- **Tailwind CSS** + **Shadcn/ui** 
- **Bun** + **Turbopack**

## 🚀 Installation

```bash
# Cloner le projet
git clone [url-du-repo]

# Installer les dépendances
bun install

# Lancer en développement
bun run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 🎯 Comment jouer

1. **Cliquer** "Démarrer une nouvelle manche"
2. **Placer vos mises** pendant les 30 secondes (sélectionner jeton + cliquer zone)
3. **Attendre** "Rien ne va plus" et le lancement automatique des dés
4. **Collecter** vos gains et recommencer !

## 📁 Structure

```
src/
├── app/                 # Pages Next.js
├── components/          # Composants React
│   ├── BettingTimer.tsx # Timer de 30s avec countdown
│   ├── PlateauKikiri.tsx# Plateau de jeu interactif
│   └── ui/             # Composants UI (Shadcn)
├── hooks/              # Hooks personnalisés
└── lib/                # Utilitaires
```

---

**🎰 Vivez l'expérience d'un vrai casino avec le timer réaliste !**

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
