# Bartender Academy App

Benvenuto nella documentazione tecnica del progetto Bartender Academy.
Questa applicazione è una piattaforma completa per la formazione di bartender, che include ricettari, teoria, quiz e gestione certificati.

## Funzionalità Principali

### 1. Ricettario Cocktails (`/cocktails`)
- **Lista Completa:** Visualizza tutti i cocktail IBA e moderni.
- **Filtri:** Filtra per categoria (Pre Dinner, After Dinner, Long Drink, etc.) o Era (Vintage, Classic, Modern).
- **Ricerca:** Cerca per nome o ingrediente.
- **Dettaglio:** Scheda tecnica con ingredienti, metodo, bicchiere e guarnizione.
- **Immagini Locali:** Supporto per immagini caricate localmente nella cartella `/public/images`.

### 2. Bartender Academy (`/academy`)
- **Flashcards:** Modalità di studio interattiva. Gira la carta per vedere ricetta e metodo.
- **Speed Quiz:** Test a tempo per verificare la conoscenza degli ingredienti.
- **Gamification:** Punteggi e feedback immediato.

### 3. Teoria & Manuale (`/theory`)
- **Manuale Operativo:** Guide su Setup, Bicchieri e Tecniche.
- **Distillati (`/distillates`):** Enciclopedia completa sui principali spiriti (Vodka, Gin, Rum, Tequila, Whisky, Brandy).
- **Immagini:** Ogni sezione ha un'immagine associata che può essere personalizzata localmente.

### 4. Strumenti Utili
- **Convertitore Unità:** Calcolatore integrato per convertire oz/ml/cl.
- **Admin Panel (`/admin`):**
  - Gestione completa del database (Aggiungi/Modifica/Elimina Cocktails e Teoria).
  - Configurazione del sito (Titoli, Sottotitoli, Immagini di copertina).
  - Gestione Certificati studenti.
  - Sincronizzazione dati locali -> Database.

## Gestione Immagini

Il sistema utilizza un componente intelligente (`SmartImage`) per gestire le immagini.
Priorità di caricamento:
1. **Immagine Locale (Inglese):** Cerca in `/public/images/` usando lo slug inglese (es. `glassware.jpg`).
2. **Immagine Locale (Nome Esatto):** Cerca usando il nome esatto (es. `Cristalleria.jpg`).
3. **URL Database:** Se non trova nulla in locale, usa l'URL salvato nel database (es. Unsplash).

Per i dettagli sui nomi dei file, consulta il file `README.md` all'interno della cartella `/public/images`.

## Installazione e Avvio

1. **Installare le dipendenze:**
   ```bash
   npm install
   ```

2. **Avviare il server di sviluppo:**
   ```bash
   npm run dev
   ```

3. **Build per produzione:**
   ```bash
   npm run build
   ```

## Tecnologie

- **Frontend:** React, TypeScript, Tailwind CSS, Vite.
- **Backend/Database:** Supabase.
- **Icone:** Lucide React.
- **Routing:** React Router Dom.
