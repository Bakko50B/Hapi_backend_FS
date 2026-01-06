# Lagerhanteringssystem – Backend API (Hapi.js)

Detta repository innehåller backend-delen av ett lagerhanteringssystem för ett fiktivt företag.  
API:et är byggt med Hapi.js och hanterar produkter, kategorier, användare, autentisering och bilduppladdning.

---

## Tekniker

- Ramverk: Hapi.js
- Databas: MongoDB (via Mongoose)
- Autentisering: JWT lagrad i httpOnly-cookie
- Lösenordshashning: bcrypt
- Filuppladdning: Cloudinary
- Struktur: MVC (controllers, routes, models, plugins, utils)

---

## Projektstruktur

```txt
src/
├── config/           # Databasanslutning
├── controllers/      # CRUD-logik
├── models/           # Mongoose-modeller
├── plugins/          # AuthGuard för skyddade routes
├── routes/           # API-routes
├── utils/            # Cloudinary-konfiguration
├── server.js         # Hapi-server
.gitignore
.env
``` 


## Autentisering

API:et använder JWT som lagras i en httpOnly-cookie. Webbläsaren skickar cookien automatiskt vid varje request.

### Flöde

- `POST /auth/register` – skapar användare  
- `POST /auth/login` – loggar in och sätter httpOnly-cookie (`token`)  
- Webbläsaren sparar cookien automatiskt  
- Skyddade endpoints läses via cookie (ingen Authorization-header behövs)  
- `POST /auth/logout` – rensar cookien  

> Frontend måste använda `credentials: 'include'` vid anrop till skyddade endpoints.

---

## Endpoints

### Auth

| Metod | Endpoint       | Skyddad | Beskrivning                        |
|-------|----------------|---------|-------------------------------------|
| POST  | /auth/register | Ja      | Skapar ny användare                 |
| POST  | /auth/login    | Nej     | Loggar in och sätter httpOnly-cookie |
| POST  | /auth/logout   | Nej     | Loggar ut och rensar cookie         |

---

### Kategorier

| Metod | Endpoint             | Skyddad | Beskrivning              |
|-------|----------------------|---------|---------------------------|
| GET   | /categories          | Nej     | Hämtar alla kategorier    |
| GET   | /categories/{id}     | Nej     | Hämtar en kategori        |
| POST  | /categories          | Ja      | Skapar ny kategori        |
| PUT   | /categories/{id}     | Ja      | Uppdaterar kategori       |
| DELETE| /categories/{id}     | Ja      | Tar bort kategori         |

---

### Produkter

| Metod | Endpoint                          | Skyddad | Beskrivning                       |
|-------|-----------------------------------|---------|------------------------------------|
| GET   | /products                         | Nej     | Hämtar alla produkter              |
| GET   | /products/{id}                    | Nej     | Hämtar en produkt                  |
| POST  | /products                         | Ja      | Skapar produkt                     |
| POST  | /products/with-image              | Ja      | Skapar produkt med bild            |
| PUT   | /products/{id}/images             | Ja      | Lägger till bilder till produkt    |
| PUT   | /products/{id}                    | Ja      | Uppdaterar produkt                 |
| DELETE| /products/{id}                    | Ja      | Tar bort produkt                   |
| DELETE| /products/{id}/images/{publicId}  | Nej     | Tar bort en bild från Cloudinary   |

---

### Media (bilduppladdning)

| Metod | Endpoint        | Skyddad | Beskrivning                    |
|-------|-----------------|---------|---------------------------------|
| POST  | /media/upload   | Nej     | Laddar upp bild till Cloudinary |
(Används främst internt av produkt‑endpoints.)

## Installation

Följ stegen nedan för att installera och köra backend‑servern lokalt.

### 1. Klona projektet

```bash
git clone <repo-url>
cd HAPI_BACKEND

npm install

```
## ENVfil (typ)

```env

MONGO_URI=mongodb://url till databas
JWT_SECRET=hemligt
CLOUDINARY_NAME=din_cloudinary_cloud
CLOUDINARY_API_KEY=din_api_key
CLOUDINARY_API_SECRET=din_api_secret
``` 

## Utvecklingsserver
```bash
npm run dev
``` 

## CORS

* Servern är konfigurerad för att tillåta cookies från frontend:

routes: {
  cors: {
    origin: ['*'],
    credentials: true
  }
}

* Det innebär att frontend måste skicka:

credentials: 'include'

## COOKIE-inställninar

Servern definierar en httpOnly‑cookie för JWT:

```js
server.state('token', {
  isSecure: false,
  isHttpOnly: true,
  path: '/'
});

```

* httpOnly gör cookien osynlig för JavaScript
* isSecure: false används lokalt (ska vara true i produktion)

Cookien skickas automatiskt med varje request

## Av

Torbjörn Lundberg tolu2403@student.miun.se 