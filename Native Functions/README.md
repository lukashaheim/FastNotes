# README

## Oppgave krav

### Kamera-integrasjon

- [ ] **Permissions (5%)**  
       Be om og håndtere tilgang til både kamera og enhetens bildegalleri

- [ ] **Capture & Pick (10%)**  
       Brukeren kan:
  - Ta nytt bilde i appen
  - Velge eksisterende bilde fra galleri

- [ ] **Preview (5%)**  
       Bildet vises i notatvinduet før lagring/opplasting

### Storage & Validering

- [ ] **Client-side Validation (10%)**  
       Fil må:
  - Være under 15MB
  - Være JPG, PNG eller WebP

- [ ] **Supabase Upload (10%)**  
       Sikker opplasting med:
  - Unike filnavn
  - Ingen overskriving av andre filer

- [ ] **DB Linking (5%)**  
       Lagre bilde-URL i notat-tabellen

### UI/UX (Bilde & Feedback)

- [ ] **Loading States (10%)**  
       Vis:
  - Progress bar eller spinner  
     Deaktiver lagre-knapp under opplasting

- [ ] **Aspect Ratio Handling (10%)**  
       Bilder:
  - Skal ikke strekkes
  - Skal skaleres riktig i "Jobb Notater"

- [ ] **Error Messaging (10%)**  
       Vis tydelige feil ved:
  - For stor fil
  - Feil format
  - Feilet opplasting
