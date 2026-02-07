# 🎯 Prochaines Étapes - Configuration Brevo

## Ce qui a été fait ✅

1. ✅ Installation du package `@getbrevo/brevo`
2. ✅ Création du service `BrevoService`
3. ✅ Migration du service d'invitations
4. ✅ Mise à jour des fichiers `.env`
5. ✅ Correction des services frontend (dashboard, invitations)
6. ✅ Création des guides de configuration

---

## Ce qu'il te reste à faire 🚀

### 1. Obtenir ta clé API Brevo (5 minutes)

1. Va sur [https://www.brevo.com](https://www.brevo.com)
2. Crée un compte gratuit (ou connecte-toi)
3. Va dans **Settings** (⚙️) > **SMTP & API**
4. Clique sur **Create a new API key**
5. Nom : `TaskFlow API`
6. Copie la clé (elle commence par `xkeysib-...`)

### 2. Vérifier ton email expéditeur (2 minutes)

1. Dans Brevo, va dans **Senders** (Expéditeurs)
2. Ajoute un email (ex: `noreply@votredomaine.com` ou ton email perso)
3. Clique sur le lien de vérification reçu par email

**Note :** Si tu n'as pas de domaine, utilise l'email de ton compte Brevo.

### 3. Configurer en local (1 minute)

Édite `taskflow-api/.env` :

```env
# Remplace par ta vraie clé API
BREVO_API_KEY=xkeysib-ta-cle-api-ici

# Remplace par ton email vérifié
MAIL_FROM=ton-email@example.com
```

### 4. Tester l'envoi (2 minutes)

#### Option A : Test rapide

```bash
cd taskflow-api

# Édite src/test-brevo-simple.ts
# Remplace :
# - BREVO_API_KEY par ta clé
# - FROM_EMAIL par ton email vérifié
# - TO_EMAIL par ton email perso

# Puis exécute :
npx ts-node src/test-brevo-simple.ts
```

#### Option B : Test via l'app

```bash
# Démarre le backend
cd taskflow-api
npm run start:dev

# Dans un autre terminal, démarre le frontend
cd taskflow-frontend
npm run dev

# Puis :
# 1. Crée un compte
# 2. Crée un projet
# 3. Invite un membre avec ton email
# 4. Vérifie ta boîte mail
```

### 5. Configurer en production (3 minutes)

1. Va sur [render.com](https://render.com)
2. Ouvre ton service backend
3. Va dans **Environment**
4. Ajoute les variables :
   - `BREVO_API_KEY` = `xkeysib-ta-cle-api-ici`
   - `MAIL_FROM` = `ton-email@example.com`
5. Sauvegarde (le service va redémarrer)

### 6. Supprimer l'ancienne config Gmail (optionnel)

Une fois que Brevo fonctionne, tu peux supprimer les anciennes variables dans `.env` :

```env
# À supprimer
# MAIL_HOST=smtp.gmail.com
# MAIL_PORT=587
# MAIL_USER=...
# MAIL_PASSWORD=...
```

---

## 🆘 Problèmes courants

### "API key is invalid"

- Vérifie que la clé commence par `xkeysib-`
- Vérifie qu'il n'y a pas d'espace avant/après
- Régénère une nouvelle clé si besoin

### "Sender email not verified"

- Va dans **Senders** sur Brevo
- Clique sur le lien de vérification reçu par email
- Attends quelques minutes

### Les emails n'arrivent pas

1. Vérifie les logs du backend
2. Vérifie dans **Statistics** sur Brevo
3. Vérifie tes spams
4. Vérifie que l'email destinataire est valide

---

## 📚 Documentation

- [BREVO_SETUP.md](BREVO_SETUP.md) - Guide complet
- [MIGRATION_BREVO.md](MIGRATION_BREVO.md) - Résumé des changements

---

## ✅ Checklist finale

- [ ] Compte Brevo créé
- [ ] Clé API copiée
- [ ] Email expéditeur vérifié
- [ ] `.env` mis à jour avec `BREVO_API_KEY` et `MAIL_FROM`
- [ ] Test d'envoi réussi en local
- [ ] Variables ajoutées sur Render.com
- [ ] Test d'envoi réussi en production
- [ ] Ancienne config Gmail supprimée

---

## 🎉 Une fois terminé

Tu auras :
- ✅ Un système d'envoi d'emails fiable
- ✅ 300 emails gratuits par jour
- ✅ Des statistiques d'envoi
- ✅ Des emails professionnels
- ✅ Plus de problèmes avec Gmail

**Temps total estimé : 15 minutes**

---

## 💡 Astuce

Garde ta clé API Brevo en sécurité ! Ne la commite jamais dans Git.

Le fichier `.env` est déjà dans `.gitignore`, donc tu es protégé. 🔒
