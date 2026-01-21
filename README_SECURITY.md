# 🔐 Sécurité

## ⚠️ IMPORTANT : Clé API Google

**NE JAMAIS** commiter de clés API dans le code !

### Configuration sécurisée

1. Créez un fichier `.env` (déjà dans .gitignore) :

```bash
echo "GOOGLE_API_KEY=votre_cle_api_google" > .env
```

2. Utilisez la variable d'environnement :

```javascript
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
```

### Révoquer une clé exposée

Si vous avez accidentellement exposé une clé API :

1. Allez sur https://console.cloud.google.com/apis/credentials
2. Trouvez la clé exposée
3. Cliquez sur "Supprimer" ou "Régénérer"
4. Créez une nouvelle clé
5. Ajoutez des restrictions (HTTP referrers, IP, etc.)

### Bonnes pratiques

- ✅ Utilisez `.env` pour les secrets
- ✅ Ajoutez `.env` dans `.gitignore`
- ✅ Utilisez des variables d'environnement
- ✅ Activez les restrictions sur vos clés API
- ❌ Ne jamais hardcoder de clés dans le code
- ❌ Ne jamais commiter de fichiers .env
