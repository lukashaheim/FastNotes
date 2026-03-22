# README

## Oppgave krav

### Kamera-integrasjon

- [x] **Permissions (5%)**  
       Be om og håndtere tilgang til både kamera og enhetens bildegalleri

- [x] **Capture & Pick (10%)**  
       Brukeren kan:
  - Ta nytt bilde i appen
  - Velge eksisterende bilde fra galleri

- [x] **Preview (5%)**  
       Bildet vises i notatvinduet før lagring/opplasting

### Storage & Validering

- [x] **Client-side Validation (10%)**  
       Fil må:
  - Være under 15MB
  - Være JPG, PNG eller WebP

- [x] **Supabase Upload (10%)**  
       Sikker opplasting med:
  - Unike filnavn
  - Ingen overskriving av andre filer

- [x] **DB Linking (5%)**  
       Lagre bilde-URL i notat-tabellen

### UI/UX (Bilde & Feedback)

- [x] **Loading States (10%)**  
       Vis:
  - Progress bar eller spinner  
     Deaktiver lagre-knapp under opplasting

- [x] **Aspect Ratio Handling (10%)**  
       Bilder:
  - Skal ikke strekkes
  - Skal skaleres riktig i "Jobb Notater"

- [x] **Error Messaging (10%)**  
       Vis tydelige feil ved:
  - For stor fil
  - Feil format
  - Feilet opplasting
