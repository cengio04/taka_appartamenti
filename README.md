# Sito “Taká appartamenti”

## Contenuto
Sito statico HTML/CSS/JS per presentare i 4 appartamenti a Cisterna d’Asti.

## Struttura
- `index.html`: pagina principale con sezioni (Hero, Appartamenti, Servizi, Galleria, Dove siamo, Contatti)
- `styles.css`: stile responsive
- `script.js`: menu mobile, scroll fluido, link WhatsApp dinamici, semplice validazione privacy
- `privacy.html`: informativa privacy
- `images/`: metti qui le immagini reali (hero.jpg, takapradalu.jpg, takalcastel.jpg, takamusica1.jpg, takamusica2.jpg, ecc.)

## Personalizzazioni rapide
- Colore principale: cambia `--primary` in `styles.css`
- Aggiungi o modifica prezzi: modifica gli `<span class="price">`
- Messaggio WhatsApp precompilato: funzione `buildWaHref` in `script.js`
- Galleria: sostituisci o aggiungi `<img>` in sezione `#galleria`
- Dominio personalizzato: aggiungi file `CNAME` con il tuo dominio

## Pubblicazione (GitHub Pages)
1. Carica i file su branch `main`
2. Settings → Pages → Deploy from a branch → `main` / root → Save
3. Attendi il build, poi visita l’URL mostrato

## Note
- Parcheggio: privato per Takápradalù, vicino per gli altri
- Animali ammessi e kit colazione omaggio evidenziati nei badge
- Se vuoi aggiungere una pagina “Tariffe” crea `tariffe.html` duplicando lo scheletro di `index.html`
- Per analytics leggeri (privacy-friendly) puoi aggiungere Plausible o Umami (facoltativo)

## Prossimi miglioramenti possibili
- Versione inglese (aggiungere i18n o pagina `en/index.html`)
- Sezione “Esperienze in zona”
- Ottimizzazione immagini (WebP/AVIF)
- Workflow CI per auto-deploy

## Licenza
Contenuti e immagini: di proprietà di Taká appartamenti (sostituisci quando carichi le tue foto).
