
import { Language } from './types';

export const translations = {
  it: {
    nav: {
      home: 'Home',
      manual: 'Manuale',
      theory: 'Teoria',
      cocktails: 'Ricettario',
      distillates: 'Distillati',
      training: 'Accademia',
      lab: 'AI Lab',
      admin: 'Admin',
      login: 'Accedi',
      logout: 'Esci'
    },
    home: {
      welcome: 'Accademia del Bar',
      title: 'Bartender',
      school: 'School',
      subtitle: 'L\'eccellenza nella formazione per bartender. Un percorso completo dalla merceologia alla mixology avanzata.',
      exploreRecipes: 'Sfoglia Ricettario',
      studyTheory: 'Manuale Tecnico',
      featured: 'Cocktail in Evidenza',
      viewRecipe: 'Vai alla Ricetta',
      quotes: [
        '"Il bar non è solo un luogo, è un palcoscenico. Ogni cocktail è una storia, ogni cliente un ospite d\'onore."',
        '"La mixology è l\'arte di mettere un sorriso in un bicchiere. Miscela con passione."',
        '"La precisione è la virtù del barman, l\'ospitalità la sua anima."',
        '"Un cocktail ben fatto è una poesia liquida che si racconta sorso dopo sorso."',
        '"Non vendiamo alcol, vendiamo emozioni e ricordi indimenticabili."',
        '"La tecnica si impara, lo stile si coltiva, ma il sorriso deve essere spontaneo."'
      ],
      cards: {
        theory: { title: 'Teoria & Tecnica', desc: 'Standard di servizio, cristalleria e setup.' },
        recipes: { title: 'Ricettario', desc: 'Database completo IBA e Twist contemporanei.' },
        distillates: { title: 'Merceologia', desc: 'Vodka, Gin, Rum, Whisky, Tequila e altro.' },
        admin: { title: 'Gestione', desc: 'Pannello di controllo per istruttori.' }
      }
    },
    cocktails: {
      title: 'Ricettario',
      searchPlaceholder: 'Cerca per nome, liquore o metodo...',
      noResults: 'Nessun drink corrisponde ai criteri di ricerca.',
      filters: {
        allEras: 'Tutte le Classificazioni',
        allCategories: 'Tutte le Categorie'
      }
    },
    theory: {
      title: 'Manuale Operativo',
      subtitle: 'Linee guida tecniche, setup della station e standard di servizio professionali.'
    },
    distillates: {
      encyclopedia: 'Enciclopedia degli Spiriti',
      title: 'Distillati & Liquori',
      subtitle: 'Esplora le origini, i metodi di produzione e le caratteristiche dei migliori spiriti del mondo.',
      readMore: 'Vedi altro'
    },
    lab: {
        title: 'Laboratorio AI',
        subtitle: 'Sperimenta, crea e scopri abbinamenti perfetti con l\'assistenza dell\'intelligenza artificiale.',
        tabs: {
            create: 'Creatore',
            twist: 'Twist & Varianti',
            pair: 'Sommelier'
        },
        create: {
            base: 'Base Alcolica',
            mood: 'Stile del Drink',
            type: 'Tipologia',
            extra: 'Ingredienti Extra',
            btn: 'Inventa Drink'
        },
        twist: {
            select: 'Seleziona un Classico',
            btn: 'Genera Varianti'
        },
        pair: {
            mode: 'Modalità',
            foodToDrink: 'Ho il Cibo -> Cerco il Drink',
            drinkToFood: 'Ho il Drink -> Cerco il Cibo',
            inputFood: 'Descrivi il piatto (es. Carbonara, Cheesecake...)',
            inputDrink: 'Descrivi il drink (es. Negroni, vino rosso...)',
            btn: 'Trova Abbinamento'
        }
    },
    comingSoonPage: {
        badge: 'In Sviluppo',
        title: 'Moduli Futuri',
        subtitle: 'Stiamo preparando qualcosa di straordinario. Tecniche avanzate, approfondimenti storici e maestria nel caffè sono all\'orizzonte.',
        cards: {
            molecular: {
                title: 'Mixology Molecolare',
                sub: 'Scienza Avanzata',
                desc: 'Sferificazione, arie, velluti e tecniche di affumicatura per l\'alchimista moderno.'
            },
            vintage: {
                title: 'Vintage & Homemade',
                sub: 'Ricette Storiche',
                desc: 'Creazione di sciroppi artigianali, infusioni, bitter e la riscoperta dei grandi classici dimenticati.'
            },
            coffee: {
                title: 'Barista & Coffee Art',
                sub: 'L\'arte del Caffè',
                desc: 'Dal chicco alla tazza. Estrazione dell\'espresso, scienza del latte e maestria nella Latte Art.'
            }
        },
        newsletter: {
            title: 'Tienimi Aggiornato',
            placeholder: 'Inserisci la tua email',
            button: 'Avvisami',
            disclaimer: 'Sii il primo a sapere quando verranno lanciati i nuovi moduli. Niente spam, solo cocktail.'
        },
        planned: 'Pianificato'
    },
    admin: {
      dashboard: 'Dashboard Istruttore',
      manage: 'Gestione contenuti didattici',
      logout: 'Disconnetti',
      newItem: 'Aggiungi',
      bulkMode: 'Modifica JSON',
      loginTitle: 'Area Riservata',
      loginSubtitle: 'Accesso docenti e amministratori',
      passwordPlaceholder: 'Codice di accesso',
      loginButton: 'Entra',
      tabs: {
        recipes: 'Database Ricette',
        theory: 'Moduli Teorici',
        certificates: 'Certificazioni',
        config: 'Configurazione'
      },
      config: {
        title: 'Configurazione Home Page',
        heroTitle: 'Titolo Hero',
        heroSubtitle: 'Sottotitolo',
        heroImage: 'Immagine Hero',
        quote: 'Citazione',
        save: 'Salva Configurazione'
      },
      form: {
        name: 'Nome del Drink',
        title: 'Titolo',
        status: 'Stato Pubblicazione',
        method: 'Metodo di Preparazione',
        glass: 'Bicchiere di Servizio',
        category: 'Categoria',
        era: 'Classificazione / Stile',
        garnish: 'Guarnizione',
        ingredients: 'Ricetta',
        addIngredient: '+ Ingrediente',
        save: 'Salva Contenuto',
        content: 'Testo (Markdown supportato)',
        published: 'Pubblico',
        draft: 'Bozza',
        comingSoon: 'Coming Soon',
        image: 'URL Foto (es. Unsplash)',
        date: 'Data Conseguimento',
        section: 'Sezione (es. Corsi, Master)',
        desc: 'Descrizione (opzionale)'
      },
      bulk: {
        title: 'Editor Massivo (JSON)',
        desc: 'Modifica direttamente il database JSON. Attenzione: errori di sintassi possono corrompere i dati.',
        placeholder: 'Incolla qui la lista JSON...',
        save: 'Sovrascrivi Database',
        cancel: 'Annulla'
      },
      generator: {
        title: 'Generatore Immagini AI',
        desc: 'Genera foto professionali utilizzando Gemini 3 Pro.',
        size: 'Dimensione',
        generate: 'Genera Immagine',
        generating: 'Creazione in corso...'
      },
      certs: {
          title: 'I Miei Certificati',
          add: 'Nuovo Certificato',
          share: 'Condividi',
          shareTitle: 'Genera Link Condiviso',
          shareDesc: 'Seleziona i certificati che vuoi rendere visibili a chi possiede il link.',
          generateLink: 'Crea Link',
          copyLink: 'Copia Link',
          expires: 'Scadenza (opzionale)',
          noCerts: 'Nessun certificato caricato.',
          linkCopied: 'Link copiato!'
      }
    },
    common: {
        comingSoon: 'In Arrivo'
    }
  },
  en: {
    nav: {
      home: 'Home',
      manual: 'Handbook',
      theory: 'Theory',
      cocktails: 'Recipes',
      distillates: 'Spirits',
      training: 'Academy',
      lab: 'AI Lab',
      admin: 'Admin',
      login: 'Login',
      logout: 'Logout'
    },
    home: {
      welcome: 'Bar Academy',
      title: 'Bartender',
      school: 'School',
      subtitle: 'Excellence in bartender training. A complete journey from product knowledge to advanced mixology.',
      exploreRecipes: 'Browse Recipes',
      studyTheory: 'Technical Manual',
      featured: 'Featured Cocktail',
      viewRecipe: 'View Recipe',
      quotes: [
        '"The bar is not just a place, it is a stage. Every cocktail is a story, every customer a guest of honor."',
        '"Mixology is the art of putting a smile in a glass. Mix with passion."',
        '"Precision is the bartender\'s virtue, hospitality is their soul."',
        '"A well-made cocktail is liquid poetry told sip by sip."',
        '"We don\'t sell alcohol, we sell emotions and unforgettable memories."',
        '"Technique can be learned, style can be cultivated, but the smile must be spontaneous."'
      ],
      cards: {
        theory: { title: 'Theory & Technique', desc: 'Service standards, glassware, and setup.' },
        recipes: { title: 'Cocktail Database', desc: 'Complete IBA collection and modern twists.' },
        distillates: { title: 'Product Knowledge', desc: 'Vodka, Gin, Rum, Whisky, Tequila, and more.' },
        admin: { title: 'Management', desc: 'Control panel for instructors.' }
      }
    },
    cocktails: {
      title: 'Recipes',
      searchPlaceholder: 'Search by name, spirit or method...',
      noResults: 'No drinks match your search criteria.',
      filters: {
        allEras: 'All Classifications',
        allCategories: 'All Categories'
      }
    },
    theory: {
      title: 'Operations Manual',
      subtitle: 'Technical guidelines, station setup, and professional service standards.'
    },
    distillates: {
      encyclopedia: 'Spirits Encyclopedia',
      title: 'Spirits & Liqueurs',
      subtitle: 'Explore the origins, production methods, and characteristics of the world\'s finest spirits.',
      readMore: 'See more'
    },
    lab: {
        title: 'AI Laboratory',
        subtitle: 'Experiment, create, and discover perfect pairings with AI assistance.',
        tabs: {
            create: 'Creator',
            twist: 'Twist & Variants',
            pair: 'Sommelier'
        },
        create: {
            base: 'Base Spirit',
            mood: 'Drink Style',
            type: 'Type',
            extra: 'Extra Ingredients',
            btn: 'Invent Drink'
        },
        twist: {
            select: 'Select a Classic',
            btn: 'Generate Variants'
        },
        pair: {
            mode: 'Mode',
            foodToDrink: 'Have Food -> Need Drink',
            drinkToFood: 'Have Drink -> Need Food',
            inputFood: 'Describe the dish (e.g., Pasta, Steak...)',
            inputDrink: 'Describe the drink (e.g., Negroni, Red Wine...)',
            btn: 'Find Pairing'
        }
    },
    comingSoonPage: {
        badge: 'Work in Progress',
        title: 'Future Modules',
        subtitle: 'We are brewing something extraordinary. Advanced techniques, historical deep-dives, and barista mastery are on the horizon.',
        cards: {
            molecular: {
                title: 'Molecular Mixology',
                sub: 'Advanced Science',
                desc: 'Spherification, foams, airs, and smoking techniques for the modern alchemist.'
            },
            vintage: {
                title: 'Vintage & Homemade',
                sub: 'Historical Recipes',
                desc: 'Crafting artisanal syrups, infusions, bitters, and reviving forgotten classics.'
            },
            coffee: {
                title: 'Barista & Coffee Art',
                sub: 'The Art of Coffee',
                desc: 'From bean to cup. Espresso extraction, milk science, and latte art mastery.'
            }
        },
        newsletter: {
            title: 'Get Notified',
            placeholder: 'Enter your email address',
            button: 'Notify Me',
            disclaimer: 'Be the first to know when new modules launch. No spam, just cocktails.'
        },
        planned: 'Planned'
    },
    admin: {
      dashboard: 'Instructor Dashboard',
      manage: 'Educational content management',
      logout: 'Logout',
      newItem: 'Add New',
      bulkMode: 'Edit JSON',
      loginTitle: 'Restricted Area',
      loginSubtitle: 'Access for teachers and admins',
      passwordPlaceholder: 'Access Code',
      loginButton: 'Enter',
      tabs: {
        recipes: 'Recipe Database',
        theory: 'Theory Modules',
        certificates: 'Certifications',
        config: 'Configuration'
      },
      config: {
        title: 'Home Page Configuration',
        heroTitle: 'Hero Title',
        heroSubtitle: 'Subtitle',
        heroImage: 'Hero Image',
        quote: 'Quote',
        save: 'Save Configuration'
      },
      form: {
        name: 'Drink Name',
        title: 'Title',
        status: 'Publication Status',
        method: 'Preparation Method',
        glass: 'Service Glass',
        category: 'Category',
        era: 'Classification / Style',
        garnish: 'Garnish',
        ingredients: 'Recipe',
        addIngredient: '+ Ingredient',
        save: 'Save Content',
        content: 'Content (Markdown supported)',
        published: 'Public',
        draft: 'Draft',
        comingSoon: 'Coming Soon',
        image: 'Photo URL (e.g. Unsplash)',
        date: 'Date Obtained',
        section: 'Section (e.g., Course, Master)',
        desc: 'Description (optional)'
      },
      bulk: {
        title: 'Bulk Editor (JSON)',
        desc: 'Directly edit the JSON database. Warning: syntax errors can corrupt data.',
        placeholder: 'Paste JSON list here...',
        save: 'Overwrite Database',
        cancel: 'Cancel'
      },
      generator: {
        title: 'AI Image Generator',
        desc: 'Generate professional photos using Gemini 3 Pro.',
        size: 'Size',
        generate: 'Generate Image',
        generating: 'Creating...'
      },
      certs: {
          title: 'My Certificates',
          add: 'New Certificate',
          share: 'Share',
          shareTitle: 'Generate Shared Link',
          shareDesc: 'Select the certificates you want to be visible to those with the link.',
          generateLink: 'Create Link',
          copyLink: 'Copy Link',
          expires: 'Expiration (optional)',
          noCerts: 'No certificates uploaded.',
          linkCopied: 'Link copied!'
      }
    },
    common: {
        comingSoon: 'Coming Soon'
    }
  }
};
