# 🍸 Bartender Academy
> Una piattaforma completa per la formazione professionale di bartender: ricettari IBA, teoria interattiva, quiz e gestione avanzata.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen?style=for-the-badge&logo=vercel)](https://bartender.angihomelab.com)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-green?style=for-the-badge&logo=supabase)](https://supabase.com/)

---

## 🚀 Funzionalità Principali

### 📖 Ricettario & Academy
* **Database Cocktails:** Consultazione completa di cocktail IBA e moderni con filtri per categoria ed era.
* **Academy Interattiva:** Flashcards per lo studio mnemonico e Speed Quiz per testare i riflessi sulle ricette.
* **Enciclopedia dei Distillati:** Sezione dedicata alla teoria su Vodka, Gin, Rum, Tequila, Whisky e Brandy.

### 🛠️ Strumenti & Admin
* **Convertitore Unità:** Calcolo rapido tra oz, ml e cl.
* **Admin Panel:** Dashboard protetta per gestire il database, configurare il sito e gestire i certificati degli studenti.
* **Sincronizzazione Automatica:** Gestione del flusso dati tra modifiche locali e database Supabase.

---

## 🖼️ Gestione Intelligente Immagini
Il sistema utilizza il componente `SmartImage` per garantire una navigazione fluida senza link rotti, seguendo questa gerarchia:

1.  **Locale (Slug):** Cerca in `/public/images/` usando lo slug inglese (es: `negroni.jpg`).
2.  **Locale (Nome):** Cerca usando il nome esatto del file salvato (es: `Cristalleria.jpg`).
3.  **Fallback Cloud:** Se i file locali mancano, carica l'URL remoto salvato nel database (es. Unsplash).

---

## 🛠️ Tech Stack
* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS.
* **Backend/Database:** Supabase (PostgreSQL).
* **Hosting:** Proxmox LXC Container con PM2 per la gestione dei processi.
* **AI Integration:** Supporto per mixology AI tramite Ollama (Llama 3).

---

## 📦 Installazione e Deployment

<details>
<summary><b>Clicca per espandere le istruzioni di installazione locale</b></summary>

### Prerequisiti
* Node.js (versione consigliata 18+)
* Un'istanza Supabase attiva

### Setup Locale
1.  **Clona la repository:**
    ```bash
    git clone [https://github.com/Angelo-builds/BartenderAcademy.git](https://github.com/Angelo-builds/BartenderAcademy.git)
    cd BartenderAcademy
    ```
2.  **Installa le dipendenze:**
    ```bash
    npm install
    ```
3.  **Configura le variabili d'ambiente:**
    Crea un file `.env` con le tue chiavi Supabase:
    ```env
    VITE_SUPABASE_URL=tua_url
    VITE_SUPABASE_ANON_KEY=tua_key
    ```
4.  **Avvia in sviluppo:**
    ```bash
    npm run dev
    ```
</details>

<details>
<summary><b>Deployment Produzione (LXC + PM2)</b></summary>

Per aggiornare il tuo container Proxmox:
1.  Assicurati che il remote sia corretto sul container:
    ```bash
    git remote set-url origin [https://github.com/Angelo-builds/BartenderAcademy.git](https://github.com/Angelo-builds/BartenderAcademy.git)
    ```
2.  Esegui lo script di aggiornamento:
    ```bash
    ./update.sh
    ```
</details>

---

## 📂 Risorse e Documentazione Locale
<details>
<summary><b>Dettagli cartelle manuali</b></summary>

* `/theory`: Manuale operativo su setup, bicchieri e tecniche.
* `/public/images`: Cartella per i media locali. Consulta il `README.md` interno alla cartella per le convenzioni sui nomi.
* `/admin`: Dashboard per la gestione dei certificati e sincronizzazione database.
</details>

---

## 🔗 Link Utili
* **Demo Live:** [bartender.angihomelab.com](https://bartender.angihomelab.com)
* **Repository:** [GitHub](https://github.com/Angelo-builds/BartenderAcademy)

---
**Sviluppato con ❤️ da Angelo per la Bartender Academy.**
