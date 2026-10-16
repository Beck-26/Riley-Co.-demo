# Riley Facilities & Maintenance Website — Updated Company Version

This version uses the new registered company name and service list from the company profile:

**Riley Facilities and Maintenance Limited**  
Maintenance & Engineering Services  
Lusaka, Zambia  
Call / WhatsApp: +260 971 757967  
Email: rileyandco.zm@gmail.com

## What changed

- Replaced **Riley & Co.** with **Riley Facilities & Maintenance** / **Riley Facilities and Maintenance Limited**.
- Updated the homepage services to match the profile:
  - HVAC & Environment Control
  - Electrical & Mechanical
  - Metal & Aluminium Fabrication
  - Plumbing & Drainage
  - Building & Construction Works
  - Generators & Power
  - Solar & Renewable Energy
  - General Building & Facilities Works
- Updated the contact section with the phone, email, and Lusaka location.
- Updated the quotation builder branding and print/PDF quotation name.
- Kept the slideshow images and backend quote/contact saving system.

## Run locally

Open this folder in VS Code. Make sure the terminal is inside the folder that contains `server.js` and `package.json`, then run:

```powershell
npm.cmd install
npm.cmd start
```

Open:

```text
http://localhost:3000
```

Quotation builder:

```text
http://localhost:3000/quote.html
```

## Where the images are

Project slideshow images are already inside:

```text
public/assets/project-gallery/
```

To add more pictures, copy a new image into that folder and add a new `<img class="slide" ...>` line in `public/index.html` under the slideshow section you want.
