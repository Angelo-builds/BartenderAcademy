
import { Cocktail, TheorySection, Language, SiteConfig, Certificate, ShareLink } from './types';

// --- IMAGES (High Quality Unsplash IDs) ---
const IMG = {
  // Classics
  MARTINI: 'https://images.unsplash.com/photo-1575023782549-62ca0d2c3b4a?auto=format&fit=crop&w=800&q=80',
  NEGRONI: 'https://images.unsplash.com/photo-1551534066-50e503e9114b?auto=format&fit=crop&w=800&q=80',
  OLD_FASHIONED: 'https://images.unsplash.com/photo-1595977436692-0b815949dc97?auto=format&fit=crop&w=800&q=80',
  MANHATTAN: 'https://images.unsplash.com/photo-1541544741938-0af808871cc8?auto=format&fit=crop&w=800&q=80',
  DAIQUIRI: 'https://images.unsplash.com/photo-1615887023516-9b6bcd559e87?auto=format&fit=crop&w=800&q=80',
  MARGARITA: 'https://images.unsplash.com/photo-1572569028738-411a5b822646?auto=format&fit=crop&w=800&q=80',
  WHISKEY_SOUR: 'https://images.unsplash.com/photo-1629288102432-843825832a8f?auto=format&fit=crop&w=800&q=80',
  MOJITO: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
  SPRITZ: 'https://images.unsplash.com/photo-1560512823-8db03e1b05af?auto=format&fit=crop&w=800&q=80',
  MOSCOW_MULE: 'https://images.unsplash.com/photo-1629246830740-1c3906370649?auto=format&fit=crop&w=800&q=80',
  COSMOPOLITAN: 'https://images.unsplash.com/photo-1550965319-3351d387693d?auto=format&fit=crop&w=800&q=80',
  BLOODY_MARY: 'https://images.unsplash.com/photo-1606263339463-549b49298242?auto=format&fit=crop&w=800&q=80',
  PINA_COLADA: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=800&q=80',
  MAI_TAI: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80', 
  GIN_FIZZ: 'https://images.unsplash.com/photo-1560963689-02e088746ae1?auto=format&fit=crop&w=800&q=80',
  ALEXANDER: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80',
  ESPRESSO_MARTINI: 'https://images.unsplash.com/photo-1612546875501-8b06c8b919d3?auto=format&fit=crop&w=800&q=80',
  LONG_ISLAND: 'https://images.unsplash.com/photo-1578351532450-48455cc48f16?auto=format&fit=crop&w=800&q=80',
  CAIPIRINHA: 'https://images.unsplash.com/photo-1582235965942-880293375b06?auto=format&fit=crop&w=800&q=80',
  WHITE_LADY: 'https://images.unsplash.com/photo-1609345265499-2133bbeb6ce5?auto=format&fit=crop&w=800&q=80',
  SIDECAR: 'https://images.unsplash.com/photo-1619623838089-a2e6f4886636?auto=format&fit=crop&w=800&q=80',
  AMERICANO: 'https://images.unsplash.com/photo-1618214153833-2884a44f9c56?auto=format&fit=crop&w=800&q=80',
  BLACK_RUSSIAN: 'https://images.unsplash.com/photo-1628519395232-a5e691238981?auto=format&fit=crop&w=800&q=80',
  PARADISE: 'https://images.unsplash.com/photo-1599388147551-8935c43d56f5?auto=format&fit=crop&w=800&q=80',
  FRENCH_75: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
  
  // Theory Images
  SETUP: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=1200&q=80',
  GLASSWARE: 'https://images.unsplash.com/photo-1585293678077-d6402377c858?auto=format&fit=crop&w=1200&q=80',
  TECHNIQUES: 'https://images.unsplash.com/photo-1605218427368-35b86121b4a6?auto=format&fit=crop&w=1200&q=80',
  
  // Distillates Images
  VODKA: 'https://images.unsplash.com/photo-1568644396922-5c3bfae12521?auto=format&fit=crop&w=1200&q=80',
  GIN: 'https://images.unsplash.com/photo-1607622750671-6d9eb16b49b6?auto=format&fit=crop&w=1200&q=80',
  RUM: 'https://images.unsplash.com/photo-1614313511387-1436a4480ebb?auto=format&fit=crop&w=1200&q=80',
  TEQUILA: 'https://images.unsplash.com/photo-1516535794938-606387ce5601?auto=format&fit=crop&w=1200&q=80',
  WHISKEY: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=1200&q=80',
  COGNAC: 'https://images.unsplash.com/photo-1628173420803-a1789c836968?auto=format&fit=crop&w=1200&q=80',
};

// Site Config - Italian
const siteConfig_IT: SiteConfig = {
  homeHeroImage: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1920&q=80',
  homeTitle: 'Bartender',
  homeSubtitle: 'L\'eccellenza nella formazione per bartender. Un percorso completo dalla merceologia alla mixology avanzata',
  homeSubtitleEn: 'Excellence in bartender training. A complete journey from product knowledge to advanced mixology',
  homeQuote: 'Il bar non è solo un luogo, è un palcoscenico. Ogni cocktail è una storia, ogni cliente un ospite d\'onore.',
  theoryHeroImage: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=2000&q=80',
  theoryTitle: 'Manuale Operativo',
  theorySubtitle: 'Linee guida tecniche, setup della station e standard di servizio professionali.',
  distillatesHeroImage: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=2000&q=80',
  distillatesTitle: 'Distillati & Liquori',
  distillatesSubtitle: 'Esplora le origini, i metodi di produzione e le caratteristiche dei migliori spiriti del mondo.',
  ollamaUrl: 'http://localhost:11434/api/chat' // Default to localhost, manageable via Admin
};

// Site Config - English
const siteConfig_EN: SiteConfig = {
  homeHeroImage: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1920&q=80',
  homeTitle: 'Bartender',
  homeSubtitle: 'L\'eccellenza nella formazione per bartender. Un percorso completo dalla merceologia alla mixology avanzata',
  homeSubtitleEn: 'Excellence in bartender training. A complete journey from product knowledge to advanced mixology',
  homeQuote: 'The bar is not just a place, it is a stage. Every cocktail is a story, every customer a guest of honor.',
  theoryHeroImage: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=2000&q=80',
  theoryTitle: 'Operations Manual',
  theorySubtitle: 'Technical guidelines, station setup, and professional service standards.',
  distillatesHeroImage: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=2000&q=80',
  distillatesTitle: 'Spirits & Liqueurs',
  distillatesSubtitle: 'Explore the origins, production methods, and characteristics of the world\'s finest spirits.',
  ollamaUrl: 'http://localhost:11434/api/chat'
};

// ITALIAN DATA
export const theory_IT: TheorySection[] = [
    // ... existing theory items
  {
    id: 't1', category: 'Basi', title: 'Speed Rack & Setup', slug: 'speed-rack-setup', status: 'published',
    image: IMG.SETUP,
    content: `**Speed Rack (Tipo B)**
Disposizione standard per l'efficienza lavorativa (da destra a sinistra per i destrimani):
- **Sweet & Sour / Lime Juice**: Base acida.
- **Vodka**: Neutra, alta rotazione.
- **Rum Bianco**: Alta rotazione per mojito/daiquiri.
- **Gin**: Base fondamentale.
- **Triple Sec / Cointreau**: Modificatore essenziale.
- **Tequila / Whisky**: A seconda della frequenza di vendita del locale.

**Station Setup**
- **Garnish Tray**: Frutta fresca tagliata (lime, limone, arancia), ciliegie, olive.
- **Ice Bin**: Ghiaccio a cubi (Cube) e ghiaccio tritato (Crushed).
- **Bar Mats**: Sempre puliti per il drenaggio.`
  },
  {
    id: 't2', category: 'Basi', title: 'Cristalleria (Bicchieri)', slug: 'glassware', status: 'published',
    image: IMG.GLASSWARE,
    content: `La scelta del bicchiere influenza la percezione del drink e la temperatura.

**Famiglia a Stelo (Stemware)**
- **Coppa Martini / Cocktail Glass**: (4-6 oz) Per drink "Straight Up" (senza ghiaccio), forma a V per liberare gli aromi.
- **Coppa Margarita**: A doppia coppa, specifica per drink base Tequila o Frozen.
- **Coupe**: (5-7 oz) Alternativa vintage alla coppetta, ideale per drink con albume o champagne.
- **Flute**: Per spumanti e drink a base vino (es. Mimosa).

**Famiglia Tumbler**
- **Tumbler Basso (Old Fashioned / Rock)**: (6-10 oz) Per drink "On the Rocks" o puri.
- **Tumbler Alto (Highball / Collins)**: (10-14 oz) Per Long Drinks, Mojito, Fizz.
- **Shot Glass**: (1.5 - 2 oz) Per distillati lisci o B-52.

**Altri**
- **Mule Mug**: Rame, per mantenere il freddo (Moscow Mule).
- **Julep Cup**: Acciaio/Argento, per Mint Julep.
- **Hurricane**: Grande capacità, per Tiki drinks.`
  },
  {
    id: 't3', category: 'Regole', title: 'Tecniche di Costruzione', slug: 'construction-techniques', status: 'published',
    image: IMG.TECHNIQUES,
    content: `**Build**: Costruzione diretta nel bicchiere con ghiaccio (es. Gin Tonic, Negroni).
**Stir & Strain**: Miscelazione nel Mixing Glass con ghiaccio, poi filtraggio. Per drink di soli alcolici che devono restare limpidi (es. Martini, Manhattan).
**Shake & Strain**: Shakerata energica (Boston o Cobbler). Per drink con succhi, sciroppi, uova o panna. Ossigena e raffredda rapidamente.
**Muddle**: Pestare ingredienti solidi (lime, zucchero, frutta) sul fondo del bicchiere (es. Caipirinha, Mojito).
**Blend**: Frullatore elettrico per drink "Frozen" (es. Piña Colada, Daiquiri Frozen).
**Throwing**: Passaggio del liquido da un tin all'altro a distanza per ossigenare senza diluire eccessivamente (es. Bloody Mary).`
  },
  {
    id: 'd1', category: 'Distillates', title: 'Vodka', status: 'published',
    image: IMG.VODKA,
    content: `**Origine**: Russia / Polonia.

**Materia Prima**: Cereali (grano, segale), patate, o melassa.

**Produzione**: Distillazione continua a colonna per ottenere un alcol puro (fino a 96%), poi rettificato e filtrato (carbone, quarzo, polvere di diamante).

**Caratteristiche**: Incolore, insapore, inodore (nella versione classica).

**Tipologie**:
- *Pure*: Neutrali.
- *Flavored*: Aromatizzate (frutta, spezie).`
  },
  {
    id: 'd2', category: 'Distillates', title: 'Gin', status: 'published',
    image: IMG.GIN,
    content: `**Origine**: Olanda (Genever) -> Inghilterra (Gin).

**Definizione**: Distillato di cereali aromatizzato con bacche di ginepro (*Juniperus Communis*) e botanicals.

**Classificazione**:
- **London Dry Gin**: Metodo più pregiato. Tutti i botanici distillati insieme. Non si possono aggiungere aromi dopo la distillazione, solo acqua e poco zucchero (<0.1g/L). Secco.
- **Distilled Gin**: Simile al London, ma permette aggiunta di aromi post-distillazione.
- **Plymouth Gin**: Solo prodotto a Plymouth, meno secco, più terroso.
- **Old Tom**: Versione dolcificata, storica (XVIII sec).
- **Compound Gin**: Oli essenziali mescolati all'alcol (bassa qualità o homemade).`
  },
  {
    id: 'd3', category: 'Distillates', title: 'Rum / Ron / Rhum', status: 'published',
    image: IMG.RUM,
    content: `**Origine**: Caraibi.

**Materia Prima**: Canna da zucchero.

**Stili**:
- **Industrial (Tradizionale)**: Distillato dalla melassa (sottoprodotto dello zucchero). Stile Spagnolo (Ron, leggero) o Inglese (Rum, più pesante, speziato).
- **Agricole**: Distillato dal puro succo di canna vergine (Vesou). Stile Francese (Rhum, Martinica). Erbaceo, floreale.

**Invecchiamento**:
- *Blanco/Silver*: Non invecchiato o filtrato.
- *Gold/Amber*: Breve invecchiamento o caramello.
- *Dark/Black*: Lungo invecchiamento, botti carbonizzate.
- *Spiced*: Con aggiunta di spezie.`
  },
  {
    id: 'd4', category: 'Distillates', title: 'Tequila & Mezcal', status: 'published',
    image: IMG.TEQUILA,
    content: `**Tequila**:
- Solo dallo stato di Jalisco (Messico) e aree limitrofe.
- Solo Agave Blu Weber.
- Cottura a vapore.
- Classi: *Blanco* (0-2 mesi), *Reposado* (2-12 mesi), *Añejo* (1-3 anni), *Extra Añejo* (>3 anni).

**Mezcal**:
- Prodotto in quasi tutto il Messico (famoso Oaxaca).
- Varie specie di Agave (Espadin, Tobala...).
- Cottura in forni interrati (conferisce sapore affumicato/smoky).
- Spesso artigianale.`
  },
  {
    id: 'd5', category: 'Distillates', title: 'Whisk(e)y', status: 'published',
    image: IMG.WHISKEY,
    content: `Distillato di cereali invecchiato in legno.

**Scozia (Scotch Whisky)**:
- *Single Malt*: 100% orzo maltato, singola distilleria, alambicco discontinuo (Pot Still), torba (spesso).
- *Blended*: Miscela di Single Malt and Grain Whisky.

**Ireland (Irish Whiskey)**:
- Tripla distillazione (più morbido), generalmente non torbato.

**USA**:
- *Bourbon*: Min 51% corn, new charred oak barrels. Sweet, vanilla.
- *Rye*: Min 51% rye. Spicy, dry.
- *Tennessee*: Like bourbon but filtered through maple charcoal (Lincoln County Process - es. Jack Daniel's).`
  },
  {
    id: 'd6', category: 'Distillates', title: 'Brandy & Cognac', status: 'published',
    image: IMG.COGNAC,
    content: `**Brandy**: Termine generico per distillato di vino (ovunque nel mondo).

**Cognac**:
- Brandy prodotto nella regione di Cognac (Francia).
- Uva Ugni Blanc.
- Doppia distillazione in alambicco Charentais.

**Classificazione**:
  - *VS* (Very Special): min 2 years.
  - *VSOP* (Very Superior Old Pale): min 4 years.
  - *XO* (Extra Old): min 10 years.`
  }
];

export const cocktails_IT: Cocktail[] = [
    // ... existing cocktails
  {
    id: 'c101', name: 'Alexander', method: 'Shake & Strain', glass: 'Coppa Martini', category: 'After Dinner', era: 'Vintage', status: 'published',
    image: IMG.ALEXANDER, garnish: 'Noce Moscata grattugiata',
    ingredients: [{ name: 'Cognac', amount: '1 oz' }, { name: 'Crema di Cacao Scura', amount: '1 oz' }, { name: 'Panna Fresca', amount: '1 oz' }]
  },
  {
    id: 'c102', name: 'Americano', method: 'Build', glass: 'Old Fashioned', category: 'Pre Dinner', era: 'Vintage', status: 'published',
    image: IMG.AMERICANO, garnish: 'Fetta d\'Arancia e Scorza di Limone',
    ingredients: [{ name: 'Campari', amount: '1 oz' }, { name: 'Vermouth Rosso', amount: '1 oz' }, { name: 'Soda', amount: 'Splash' }]
  },
  {
    id: 'c103', name: 'Daiquiri', method: 'Shake & Strain', glass: 'Coppa Martini', category: 'Pre Dinner', era: 'Vintage', status: 'published',
    image: IMG.DAIQUIRI, garnish: 'Spicchio di Lime',
    ingredients: [{ name: 'Rum Bianco', amount: '2 oz' }, { name: 'Succo di Lime Fresco', amount: '¾ oz' }, { name: 'Sciroppo di Zucchero', amount: '¾ oz' }]
  },
  {
    id: 'c104', name: 'Gin Fizz', method: 'Shake & Strain', glass: 'Highball', category: 'Long Drink', era: 'Vintage', status: 'published',
    image: IMG.GIN_FIZZ, garnish: 'Fetta di Limone',
    ingredients: [{ name: 'Gin', amount: '1 ½ oz' }, { name: 'Succo di Limone', amount: '1 oz' }, { name: 'Sciroppo di Zucchero', amount: '½ oz' }, { name: 'Soda', amount: 'Top' }]
  },
  {
    id: 'c105', name: 'Manhattan', method: 'Stir & Strain', glass: 'Coppa Martini', category: 'Pre Dinner', era: 'Vintage', status: 'published',
    image: IMG.MANHATTAN, garnish: 'Ciliegia al Maraschino',
    ingredients: [{ name: 'Rye Whiskey', amount: '2 oz' }, { name: 'Vermouth Rosso', amount: '¾ oz' }, { name: 'Angostura Bitters', amount: '2 dash' }]
  },
  {
    id: 'c106', name: 'Dry Martini', method: 'Stir & Strain', glass: 'Coppa Martini', category: 'Pre Dinner', era: 'Vintage', status: 'published',
    image: IMG.MARTINI, garnish: 'Oliva o Twist di Limone',
    ingredients: [{ name: 'Gin', amount: '2 oz' }, { name: 'Dry Vermouth', amount: '½ oz' }]
  },
  {
    id: 'c107', name: 'Negroni', method: 'Build', glass: 'Old Fashioned', category: 'Pre Dinner', era: 'Vintage', status: 'published',
    image: IMG.NEGRONI, garnish: 'Fetta d\'Arancia',
    ingredients: [{ name: 'Gin', amount: '1 oz' }, { name: 'Campari', amount: '1 oz' }, { name: 'Vermouth Rosso', amount: '1 oz' }]
  },
  {
    id: 'c108', name: 'Old Fashioned', method: 'Build', glass: 'Old Fashioned', category: 'Pre Dinner', era: 'Vintage', status: 'published',
    image: IMG.OLD_FASHIONED, garnish: 'Twist d\'Arancia',
    ingredients: [{ name: 'Bourbon o Rye', amount: '2 oz' }, { name: 'Zolletta di Zucchero', amount: '1' }, { name: 'Angostura', amount: '2-3 dash' }, { name: 'Acqua', amount: 'Splash' }]
  },
  {
    id: 'c109', name: 'Paradise', method: 'Shake & Strain', glass: 'Coppa Martini', category: 'All Day', era: 'Vintage', status: 'published',
    image: IMG.PARADISE, garnish: 'Nessuna',
    ingredients: [{ name: 'Gin', amount: '1 oz' }, { name: 'Apricot Brandy', amount: '¾ oz' }, { name: 'Succo d\'Arancia', amount: '½ oz' }]
  },
  {
    id: 'c110', name: 'Sidecar', method: 'Shake & Strain', glass: 'Coppa Martini', category: 'All Day', era: 'Vintage', status: 'published',
    image: IMG.SIDECAR, garnish: 'Bordatura di Zucchero (opz)',
    ingredients: [{ name: 'Cognac', amount: '1 ½ oz' }, { name: 'Triple Sec', amount: '¾ oz' }, { name: 'Lemon Juice', amount: '¾ oz' }]
  },
  {
    id: 'c111', name: 'Whiskey Sour', method: 'Shake & Strain', glass: 'Old Fashioned', category: 'Pre Dinner', era: 'Vintage', status: 'published',
    image: IMG.WHISKEY_SOUR, garnish: 'Mezza fettina d\'arancia e ciliegia',
    ingredients: [{ name: 'Bourbon', amount: '1 ½ oz' }, { name: 'Succo di Limone', amount: '¾ oz' }, { name: 'Sciroppo di Zucchero', amount: '½ oz' }, { name: 'Albume', amount: '½ oz (opz)' }]
  },
  {
    id: 'c112', name: 'White Lady', method: 'Shake & Strain', glass: 'Coppa Martini', category: 'All Day', era: 'Vintage', status: 'published',
    image: IMG.WHITE_LADY, garnish: 'Twist di Limone',
    ingredients: [{ name: 'Gin', amount: '1 ½ oz' }, { name: 'Triple Sec', amount: '1 oz' }, { name: 'Lemon Juice', amount: '¾ oz' }]
  },
  {
    id: 'c201', name: 'Black Russian', method: 'Build', glass: 'Old Fashioned', category: 'After Dinner', era: 'Classic', status: 'published',
    image: IMG.BLACK_RUSSIAN, garnish: 'Nessuna',
    ingredients: [{ name: 'Vodka', amount: '1 ½ oz' }, { name: 'Liquore al Caffè (Kahlúa)', amount: '¾ oz' }]
  },
  {
    id: 'c202', name: 'Bloody Mary', method: 'Throwing o Build', glass: 'Highball', category: 'Long Drink', era: 'Classic', status: 'published',
    image: IMG.BLOODY_MARY, garnish: 'Sedano, Limone',
    ingredients: [{ name: 'Vodka', amount: '1 ½ oz' }, { name: 'Succo di Pomodoro', amount: '3 oz' }, { name: 'Succo di Limone', amount: '½ oz' }, { name: 'Worcestershire', amount: '2 dash' }, { name: 'Tabasco', amount: 'qb' }, { name: 'Sale & Pepe', amount: 'qb' }]
  },
  {
    id: 'c203', name: 'Caipirinha', method: 'Muddle', glass: 'Old Fashioned', category: 'All Day', era: 'Classic', status: 'published',
    image: IMG.CAIPIRINHA, garnish: 'Spicchi di Lime',
    ingredients: [{ name: 'Cachaça', amount: '2 oz' }, { name: 'Lime', amount: '½ a pezzi' }, { name: 'Zucchero di Canna', amount: '2 cucchiaini' }]
  },
  {
    id: 'c204', name: 'Cosmopolitan', method: 'Shake & Strain', glass: 'Coppa Martini', category: 'All Day', era: 'Classic', status: 'published',
    image: IMG.COSMOPOLITAN, garnish: 'Twist di Lime',
    ingredients: [{ name: 'Vodka Citron', amount: '1 ½ oz' }, { name: 'Cointreau', amount: '1 oz' }, { name: 'Succo di Lime', amount: '½ oz' }, { name: 'Succo di Cranberry', amount: '1 oz' }]
  },
  {
    id: 'c205', name: 'Long Island Iced Tea', method: 'Build', glass: 'Highball', category: 'Long Drink', era: 'Classic', status: 'published',
    image: IMG.LONG_ISLAND, garnish: 'Fetta di Limone',
    ingredients: [{ name: 'Vodka', amount: '½ oz' }, { name: 'Rum Bianco', amount: '½ oz' }, { name: 'Gin', amount: '½ oz' }, { name: 'Tequila', amount: '½ oz' }, { name: 'Triple Sec', amount: '½ oz' }, { name: 'Sweet & Sour', amount: '1 oz' }, { name: 'Coca Cola', amount: 'Top' }]
  },
  {
    id: 'c206', name: 'Mai Tai', method: 'Shake & Strain', glass: 'Tumbler Basso / Tiki', category: 'Long Drink', era: 'Tiki', status: 'published',
    image: IMG.MAI_TAI, garnish: 'Ananas, Foglia di Menta, Lime',
    ingredients: [{ name: 'Rum Ambrato', amount: '1 ½ oz' }, { name: 'Rum Scuro', amount: '½ oz' }, { name: 'Orange Curacao', amount: '½ oz' }, { name: 'Orzata', amount: '½ oz' }, { name: 'Succo di Lime', amount: '¾ oz' }]
  },
  {
    id: 'c207', name: 'Margarita', method: 'Shake & Strain', glass: 'Coppa Margarita', category: 'All Day', era: 'Classic', status: 'published',
    image: IMG.MARGARITA, garnish: 'Bordatura di Sale',
    ingredients: [{ name: 'Tequila Blanco', amount: '1 ½ oz' }, { name: 'Triple Sec', amount: '¾ oz' }, { name: 'Succo di Lime', amount: '½ oz' }]
  },
  {
    id: 'c208', name: 'Mojito', method: 'Build & Muddle', glass: 'Highball', category: 'Long Drink', era: 'Classic', status: 'published',
    image: IMG.MOJITO, garnish: 'Rametto di Menta, Lime',
    ingredients: [{ name: 'Rum Bianco', amount: '1 ½ oz' }, { name: 'Succo di Lime', amount: '¾ oz' }, { name: 'Zucchero Bianco', amount: '2 cucchiaini' }, { name: 'Menta', amount: '6 foglie' }, { name: 'Soda', amount: 'Top' }]
  },
  {
    id: 'c209', name: 'Moscow Mule', method: 'Build', glass: 'Mule Mug', category: 'Long Drink', era: 'Classic', status: 'published',
    image: IMG.MOSCOW_MULE, garnish: 'Lime e Zenzero',
    ingredients: [{ name: 'Vodka', amount: '1 ½ oz' }, { name: 'Succo di Lime', amount: '½ oz' }, { name: 'Ginger Beer', amount: 'Top' }]
  },
  {
    id: 'c210', name: 'Piña Colada', method: 'Blend', glass: 'Hurricane', category: 'Long Drink', era: 'Classic', status: 'published',
    image: IMG.PINA_COLADA, garnish: 'Fetta di Ananas e Ciliegia',
    ingredients: [{ name: 'Rum Bianco', amount: '1 ½ oz' }, { name: 'Succo di Ananas', amount: '3 oz' }, { name: 'Crema di Cocco', amount: '1 oz' }]
  },
  {
    id: 'c301', name: 'Aperol Spritz', method: 'Build', glass: 'Calice Vino', category: 'Pre Dinner', era: 'Modern', status: 'published',
    image: IMG.SPRITZ, garnish: 'Fetta d\'Arancia',
    ingredients: [{ name: 'Prosecco', amount: '3 parti' }, { name: 'Aperol', amount: '2 parti' }, { name: 'Soda', amount: '1 parte' }]
  },
  {
    id: 'c302', name: 'Espresso Martini', method: 'Shake & Strain', glass: 'Coppa Martini', category: 'After Dinner', era: 'Modern', status: 'published',
    image: IMG.ESPRESSO_MARTINI, garnish: '3 Chicchi di Caffè',
    ingredients: [{ name: 'Vodka', amount: '1 ½ oz' }, { name: 'Kahlúa', amount: '1 oz' }, { name: 'Caffè Espresso', amount: '1 tazzina' }, { name: 'Sciroppo di Zucchero', amount: '½ oz' }]
  },
  {
    id: 'c303', name: 'French 75', method: 'Shake & Strain', glass: 'Flute', category: 'Sparkling', era: 'Classic', status: 'published',
    image: IMG.FRENCH_75, garnish: 'Nessuna',
    ingredients: [{ name: 'Gin', amount: '1 oz' }, { name: 'Succo di Limone', amount: '½ oz' }, { name: 'Sciroppo di Zucchero', amount: '½ oz' }, { name: 'Champagne', amount: 'Top' }]
  }
];

// ENGLISH DATA
const theory_EN: TheorySection[] = [
    // ... existing theory items
  {
    id: 't1', category: 'Basics', title: 'Speed Rack & Setup', slug: 'speed-rack-setup', status: 'published',
    image: IMG.SETUP,
    content: `**Speed Rack (Type B)**
Standard arrangement for workflow efficiency (Right to Left for right-handed):
- **Sweet & Sour / Lime Juice**: Acid base.
- **Vodka**: Neutral, high rotation.
- **White Rum**: High rotation for mojito/daiquiri.
- **Gin**: Fundamental base.
- **Triple Sec / Cointreau**: Essential modifier.
- **Tequila / Whisky**: Depending on sales frequency.

**Station Setup**
- **Garnish Tray**: Fresh cut fruit (lime, lemon, orange), cherries, olives.
- **Ice Bin**: Cube ice and Crushed ice.
- **Bar Mats**: Always clean for drainage.`
  },
  {
    id: 't2', category: 'Basics', title: 'Glassware', slug: 'glassware', status: 'published',
    image: IMG.GLASSWARE,
    content: `Glass choice affects drink perception and temperature.

**Stemware**
- **Martini Glass / Cocktail Glass**: (4-6 oz) For "Straight Up" drinks (no ice), V-shape to release aromas.
- **Margarita Glass**: Double-bowl shape, specific for Tequila-based or Frozen drinks.
- **Coupe**: (5-7 oz) Vintage alternative to the martini glass, ideal for drinks with egg white or champagne.
- **Flute**: For sparkling wines and wine-based drinks (e.g., Mimosa).

**Tumblers**
- **Lowball (Old Fashioned / Rock)**: (6-10 oz) For "On the Rocks" drinks or neat spirits.
- **Highball (Collins)**: (10-14 oz) For Long Drinks, Mojito, Fizz.
- **Shot Glass**: (1.5 - 2 oz) For straight spirits or B-52.

**Others**
- **Mule Mug**: Copper, to keep it cold (Moscow Mule).
- **Julep Cup**: Steel/Silver, for Mint Julep.
- **Hurricane**: Large capacity, for Tiki drinks.`
  },
  {
    id: 't3', category: 'Rules', title: 'Construction Techniques', slug: 'construction-techniques', status: 'published',
    image: IMG.TECHNIQUES,
    content: `**Build**: Direct construction in the glass with ice (e.g., Gin Tonic, Negroni).
**Stir & Strain**: Mixing in the Mixing Glass with ice, then filtering. For spirit-only drinks that must remain clear (e.g., Martini, Manhattan).
**Shake & Strain**: Vigorous shaking (Boston or Cobbler). For drinks with juices, syrups, eggs, or cream. Oxygenates and cools rapidly.
**Muddle**: Crushing solid ingredients (lime, sugar, fruit) at the bottom of the glass (e.g., Caipirinha, Mojito).
**Blend**: Electric blender for "Frozen" drinks (e.g., Piña Colada, Frozen Daiquiri).
**Throwing**: Pouring liquid from one tin to another at a distance to oxygenate without excessive dilution (e.g., Bloody Mary).`
  },
  {
    id: 'd1', category: 'Distillates', title: 'Vodka', status: 'published',
    image: IMG.VODKA,
    content: `**Origin**: Russia / Poland.

**Raw Material**: Grains (wheat, rye), potatoes, or molasses.

**Production**: Continuous column distillation to obtain pure alcohol (up to 96%), then rectified and filtered (charcoal, quartz, diamond dust).

**Characteristics**: Colorless, tasteless, odorless (classic style).

**Types**:
- *Pure*: Neutral.
- *Flavored*: Flavored (fruit, spices).`
  },
  {
    id: 'd2', category: 'Distillates', title: 'Gin', status: 'published',
    image: IMG.GIN,
    content: `**Origin**: Holland (Genever) -> England (Gin).

**Definition**: Grain spirit flavored with juniper berries and botanicals.

**Classification**:
- **London Dry Gin**: Premium method. All botanicals distilled together. No flavors can be added after distillation, only water and little sugar (<0.1g/L). Dry.
- **Distilled Gin**: Similar to London, but allows adding flavors post-distillation.
- **Plymouth Gin**: Protected geographic indication, earthier.
- **Old Tom**: Sweetened historical version.`
  },
  {
    id: 'd3', category: 'Distillates', title: 'Rum / Ron / Rhum', status: 'published',
    image: IMG.RUM,
    content: `**Origin**: Caribbean.

**Raw Material**: Sugar cane.

**Styles**:
- **Industrial (Traditional)**: Distilled from molasses (sugar byproduct). Spanish style (Ron, light) or English style (Rum, heavier, spicy).
- **Agricole**: Distilled from pure virgin cane juice (Vesou). French style (Rhum, Martinique). Herbal, floral.

**Aging**:
- *Blanco/Silver*: Unaged or filtered.
- *Gold/Amber*: Brief aging or caramel.
- *Dark/Black*: Long aging, charred barrels.
- *Spiced*: With added spices.`
  },
  {
    id: 'd4', category: 'Distillates', title: 'Tequila & Mezcal', status: 'published',
    image: IMG.TEQUILA,
    content: `**Tequila**:
- Only from the state of Jalisco (Mexico) and surrounding areas.
- Only Blue Weber Agave.
- Steam cooking.
- Classes: *Blanco* (0-2 months), *Reposado* (2-12 months), *Añejo* (1-3 years), *Extra Añejo* (>3 years).

**Mezcal**:
- Produced in almost all of Mexico (famous Oaxaca).
- Various Agave species (Espadin, Tobala...).
- Cooking in underground pits (gives smoky flavor).
- Often artisanal.`
  },
  {
    id: 'd5', category: 'Distillates', title: 'Whisk(e)y', status: 'published',
    image: IMG.WHISKEY,
    content: `Grain spirit aged in wood.

**Scotland (Scotch Whisky)**:
- *Single Malt*: 100% malted barley, single distillery, pot still, peat (often).
- *Blended*: Blend of Single Malt and Grain Whisky.

**Ireland (Irish Whiskey)**:
- Triple distillation (smoother), generally unpeated.

**USA**:
- *Bourbon*: Min 51% corn, new charred oak barrels. Sweet, vanilla.
- *Rye*: Min 51% rye. Spicy, dry.
- *Tennessee*: Like bourbon but filtered through maple charcoal (Lincoln County Process - e.g., Jack Daniel's).`
  },
  {
    id: 'd6', category: 'Distillates', title: 'Brandy & Cognac', status: 'published',
    image: IMG.COGNAC,
    content: `**Brandy**: Generic term for wine distillate (anywhere in the world).

**Cognac**:
- Brandy produced in the Cognac region (France).
- Ugni Blanc grapes.
- Double distillation in Charentais pot still.

**Classification**:
  - *VS* (Very Special): min 2 years.
  - *VSOP* (Very Superior Old Pale): min 4 years.
  - *XO* (Extra Old): min 10 years.`
  }
];

const cocktails_EN: Cocktail[] = [
    // ... existing cocktails
  {
    id: 'c101', name: 'Alexander', method: 'Shake & Strain', glass: 'Martini Glass', category: 'After Dinner', era: 'Vintage', status: 'published',
    image: IMG.ALEXANDER, garnish: 'Grated Nutmeg',
    ingredients: [{ name: 'Cognac', amount: '1 oz' }, { name: 'Dark Creme de Cacao', amount: '1 oz' }, { name: 'Fresh Cream', amount: '1 oz' }]
  },
  {
    id: 'c102', name: 'Americano', method: 'Build', glass: 'Old Fashioned', category: 'Pre Dinner', era: 'Vintage', status: 'published',
    image: IMG.AMERICANO, garnish: 'Orange Slice and Lemon Zest',
    ingredients: [{ name: 'Campari', amount: '1 oz' }, { name: 'Red Vermouth', amount: '1 oz' }, { name: 'Soda', amount: 'Splash' }]
  },
  {
    id: 'c103', name: 'Daiquiri', method: 'Shake & Strain', glass: 'Martini Glass', category: 'Pre Dinner', era: 'Vintage', status: 'published',
    image: IMG.DAIQUIRI, garnish: 'Lime Wedge',
    ingredients: [{ name: 'White Rum', amount: '2 oz' }, { name: 'Fresh Lime Juice', amount: '¾ oz' }, { name: 'Sugar Syrup', amount: '¾ oz' }]
  },
  {
    id: 'c104', name: 'Gin Fizz', method: 'Shake & Strain', glass: 'Highball', category: 'Long Drink', era: 'Vintage', status: 'published',
    image: IMG.GIN_FIZZ, garnish: 'Lemon Slice',
    ingredients: [{ name: 'Gin', amount: '1 ½ oz' }, { name: 'Lemon Juice', amount: '1 oz' }, { name: 'Sugar Syrup', amount: '½ oz' }, { name: 'Soda', amount: 'Top' }]
  },
  {
    id: 'c105', name: 'Manhattan', method: 'Stir & Strain', glass: 'Martini Glass', category: 'Pre Dinner', era: 'Vintage', status: 'published',
    image: IMG.MANHATTAN, garnish: 'Maraschino Cherry',
    ingredients: [{ name: 'Rye Whiskey', amount: '2 oz' }, { name: 'Red Vermouth', amount: '¾ oz' }, { name: 'Angostura Bitters', amount: '2 dash' }]
  },
  {
    id: 'c106', name: 'Dry Martini', method: 'Stir & Strain', glass: 'Martini Glass', category: 'Pre Dinner', era: 'Vintage', status: 'published',
    image: IMG.MARTINI, garnish: 'Olive or Lemon Twist',
    ingredients: [{ name: 'Gin', amount: '2 oz' }, { name: 'Dry Vermouth', amount: '½ oz' }]
  },
  {
    id: 'c107', name: 'Negroni', method: 'Build', glass: 'Old Fashioned', category: 'Pre Dinner', era: 'Vintage', status: 'published',
    image: IMG.NEGRONI, garnish: 'Orange Slice',
    ingredients: [{ name: 'Gin', amount: '1 oz' }, { name: 'Campari', amount: '1 oz' }, { name: 'Sweet Vermouth', amount: '1 oz' }]
  },
  {
    id: 'c108', name: 'Old Fashioned', method: 'Build', glass: 'Old Fashioned', category: 'Pre Dinner', era: 'Vintage', status: 'published',
    image: IMG.OLD_FASHIONED, garnish: 'Orange Twist',
    ingredients: [{ name: 'Bourbon or Rye', amount: '2 oz' }, { name: 'Sugar Cube', amount: '1' }, { name: 'Angostura', amount: '2-3 dash' }, { name: 'Water', amount: 'Splash' }]
  },
  {
    id: 'c109', name: 'Paradise', method: 'Shake & Strain', glass: 'Martini Glass', category: 'All Day', era: 'Vintage', status: 'published',
    image: IMG.PARADISE, garnish: 'None',
    ingredients: [{ name: 'Gin', amount: '1 oz' }, { name: 'Apricot Brandy', amount: '¾ oz' }, { name: 'Orange Juice', amount: '½ oz' }]
  },
  {
    id: 'c110', name: 'Sidecar', method: 'Shake & Strain', glass: 'Martini Glass', category: 'All Day', era: 'Vintage', status: 'published',
    image: IMG.SIDECAR, garnish: 'Sugar Rim (opt)',
    ingredients: [{ name: 'Cognac', amount: '1 ½ oz' }, { name: 'Triple Sec', amount: '¾ oz' }, { name: 'Lemon Juice', amount: '¾ oz' }]
  },
  {
    id: 'c111', name: 'Whiskey Sour', method: 'Shake & Strain', glass: 'Old Fashioned', category: 'Pre Dinner', era: 'Vintage', status: 'published',
    image: IMG.WHISKEY_SOUR, garnish: 'Half Orange Slice and Cherry',
    ingredients: [{ name: 'Bourbon', amount: '1 ½ oz' }, { name: 'Lemon Juice', amount: '¾ oz' }, { name: 'Sugar Syrup', amount: '½ oz' }, { name: 'Egg White', amount: '½ oz (opt)' }]
  },
  {
    id: 'c112', name: 'White Lady', method: 'Shake & Strain', glass: 'Martini Glass', category: 'All Day', era: 'Vintage', status: 'published',
    image: IMG.WHITE_LADY, garnish: 'Lemon Twist',
    ingredients: [{ name: 'Gin', amount: '1 ½ oz' }, { name: 'Triple Sec', amount: '1 oz' }, { name: 'Lemon Juice', amount: '¾ oz' }]
  },
  {
    id: 'c201', name: 'Black Russian', method: 'Build', glass: 'Old Fashioned', category: 'After Dinner', era: 'Classic', status: 'published',
    image: IMG.BLACK_RUSSIAN, garnish: 'None',
    ingredients: [{ name: 'Vodka', amount: '1 ½ oz' }, { name: 'Coffee Liqueur (Kahlúa)', amount: '¾ oz' }]
  },
  {
    id: 'c202', name: 'Bloody Mary', method: 'Throwing o Build', glass: 'Highball', category: 'Long Drink', era: 'Classic', status: 'published',
    image: IMG.BLOODY_MARY, garnish: 'Celery, Lemon',
    ingredients: [{ name: 'Vodka', amount: '1 ½ oz' }, { name: 'Tomato Juice', amount: '3 oz' }, { name: 'Lemon Juice', amount: '½ oz' }, { name: 'Worcestershire', amount: '2 dash' }, { name: 'Tabasco', amount: 'to taste' }, { name: 'Salt & Pepper', amount: 'to taste' }]
  },
  {
    id: 'c203', name: 'Caipirinha', method: 'Muddle', glass: 'Old Fashioned', category: 'All Day', era: 'Classic', status: 'published',
    image: IMG.CAIPIRINHA, garnish: 'Lime Wedges',
    ingredients: [{ name: 'Cachaça', amount: '2 oz' }, { name: 'Lime', amount: '½ cut in pieces' }, { name: 'Cane Sugar', amount: '2 tsp' }]
  },
  {
    id: 'c204', name: 'Cosmopolitan', method: 'Shake & Strain', glass: 'Martini Glass', category: 'All Day', era: 'Classic', status: 'published',
    image: IMG.COSMOPOLITAN, garnish: 'Lime Twist',
    ingredients: [{ name: 'Vodka Citron', amount: '1 ½ oz' }, { name: 'Cointreau', amount: '1 oz' }, { name: 'Lime Juice', amount: '½ oz' }, { name: 'Cranberry Juice', amount: '1 oz' }]
  },
  {
    id: 'c205', name: 'Long Island Iced Tea', method: 'Build', glass: 'Highball', category: 'Long Drink', era: 'Classic', status: 'published',
    image: IMG.LONG_ISLAND, garnish: 'Lemon Slice',
    ingredients: [{ name: 'Vodka', amount: '½ oz' }, { name: 'White Rum', amount: '½ oz' }, { name: 'Gin', amount: '½ oz' }, { name: 'Tequila', amount: '½ oz' }, { name: 'Triple Sec', amount: '½ oz' }, { name: 'Sweet & Sour', amount: '1 oz' }, { name: 'Coke', amount: 'Top' }]
  },
  {
    id: 'c206', name: 'Mai Tai', method: 'Shake & Strain', glass: 'Lowball / Tiki', category: 'Long Drink', era: 'Tiki', status: 'published',
    image: IMG.MAI_TAI, garnish: 'Pineapple, Mint Sprig, Lime',
    ingredients: [{ name: 'Amber Rum', amount: '1 ½ oz' }, { name: 'Dark Rum', amount: '½ oz' }, { name: 'Orange Curacao', amount: '½ oz' }, { name: 'Orgeat', amount: '½ oz' }, { name: 'Lime Juice', amount: '¾ oz' }]
  },
  {
    id: 'c207', name: 'Margarita', method: 'Shake & Strain', glass: 'Margarita Glass', category: 'All Day', era: 'Classic', status: 'published',
    image: IMG.MARGARITA, garnish: 'Salt Rim',
    ingredients: [{ name: 'Tequila Blanco', amount: '1 ½ oz' }, { name: 'Triple Sec', amount: '¾ oz' }, { name: 'Lime Juice', amount: '½ oz' }]
  },
  {
    id: 'c208', name: 'Mojito', method: 'Build & Muddle', glass: 'Highball', category: 'Long Drink', era: 'Classic', status: 'published',
    image: IMG.MOJITO, garnish: 'Mint Sprig, Lime',
    ingredients: [{ name: 'White Rum', amount: '1 ½ oz' }, { name: 'Lime Juice', amount: '¾ oz' }, { name: 'White Sugar', amount: '2 tsp' }, { name: 'Mint', amount: '6 leaves' }, { name: 'Soda', amount: 'Top' }]
  },
  {
    id: 'c209', name: 'Moscow Mule', method: 'Build', glass: 'Mule Mug', category: 'Long Drink', era: 'Classic', status: 'published',
    image: IMG.MOSCOW_MULE, garnish: 'Lime and Ginger',
    ingredients: [{ name: 'Vodka', amount: '1 ½ oz' }, { name: 'Lime Juice', amount: '½ oz' }, { name: 'Ginger Beer', amount: 'Top' }]
  },
  {
    id: 'c210', name: 'Piña Colada', method: 'Blend', glass: 'Hurricane', category: 'Long Drink', era: 'Classic', status: 'published',
    image: IMG.PINA_COLADA, garnish: 'Pineapple Slice and Cherry',
    ingredients: [{ name: 'White Rum', amount: '1 ½ oz' }, { name: 'Pineapple Juice', amount: '3 oz' }, { name: 'Coconut Cream', amount: '1 oz' }]
  },
  {
    id: 'c301', name: 'Aperol Spritz', method: 'Build', glass: 'Wine Glass', category: 'Pre Dinner', era: 'Modern', status: 'published',
    image: IMG.SPRITZ, garnish: 'Orange Slice',
    ingredients: [{ name: 'Prosecco', amount: '3 parts' }, { name: 'Aperol', amount: '2 parts' }, { name: 'Soda', amount: '1 part' }]
  },
  {
    id: 'c302', name: 'Espresso Martini', method: 'Shake & Strain', glass: 'Martini Glass', category: 'After Dinner', era: 'Modern', status: 'published',
    image: IMG.ESPRESSO_MARTINI, garnish: '3 Coffee Beans',
    ingredients: [{ name: 'Vodka', amount: '1 ½ oz' }, { name: 'Kahlúa', amount: '1 oz' }, { name: 'Espresso Coffee', amount: '1 cup' }, { name: 'Sugar Syrup', amount: '½ oz' }]
  },
  {
    id: 'c303', name: 'French 75', method: 'Shake & Strain', glass: 'Flute', category: 'Sparkling', era: 'Classic', status: 'published',
    image: IMG.FRENCH_75, garnish: 'None',
    ingredients: [{ name: 'Gin', amount: '1 oz' }, { name: 'Lemon Juice', amount: '½ oz' }, { name: 'Sugar Syrup', amount: '½ oz' }, { name: 'Champagne', amount: 'Top' }]
  }
];

export const getInitialData = (lang: Language) => {
  return lang === 'it' 
    ? { cocktails: cocktails_IT, theory: theory_IT, siteConfig: siteConfig_IT, certificates: [], sharedLinks: [] }
    : { cocktails: cocktails_EN, theory: theory_EN, siteConfig: siteConfig_EN, certificates: [], sharedLinks: [] };
};
