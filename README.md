# Blueprint Group of Companies

Blueprint Group is a Cayman Islands construction partner established in Grand Cayman in 2010. The team works with residential, commercial, and industrial clients, bringing together design, construction, and project management with a focus on craftsmanship, communication, and local understanding.

The website presents Blueprint's services, projects, fencing products, careers, and contact information. Visitors can request an appointment by opening a prefilled Gmail draft and manually sending it to the team.

## Website project

The site uses **Next.js App Router, React, and TypeScript**. It is configured as a static export: the production build generates HTML, CSS, JavaScript, images, and other assets in the `out/` folder. The hosted site does not need a Node.js server, database, or email backend.

## Run locally

Install Node.js 20 or later and Git, then run:

```powershell
git clone https://github.com/RCOA24/Blueprint.git
cd Blueprint
npm.cmd ci
npm.cmd run dev
```

Open `http://localhost:3000`. On macOS or Linux, use `npm` in place of `npm.cmd`.

To check the project:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npm.cmd run test:e2e
```

The browser test requires an installed Google Chrome browser and a completed production build.

## Deploy to Hostinger

These steps upload the static website through Hostinger File Manager. Confirm the target domain and document root in hPanel before replacing any existing website.

### 1. Build for the final domain

In PowerShell, from the project folder:

```powershell
npm.cmd ci
$env:NEXT_PUBLIC_SITE_URL = 'https://blueprint.ky'
npm.cmd run build
```

Replace `https://blueprint.ky` if the site will use another domain or a staging subdomain. Set this value **before every production build**: it is used for canonical links, sharing metadata, the sitemap, `robots.txt`, and structured data. If omitted, the project defaults to `https://blueprint.ky`.

The build creates the `out/` folder. Its contents are the files to upload. This folder is generated locally and is not stored in GitHub.

### 2. Prepare the upload

Back up the existing website files and any existing rewrite rules first. To create a ZIP containing the **contents** of `out/`, run:

```powershell
Compress-Archive -Path .\out\* -DestinationPath .\blueprint-site.zip -Force
```

The ZIP should contain `index.html`, `_next/`, `assets/`, `contact/`, `services/`, and the other page folders at its top level. It should not contain an enclosing `out/` folder.

### 3. Upload the website

1. Sign in to Hostinger hPanel and open **Websites → Manage site → Files → File Manager** for the intended domain.
2. Open the site's document root, commonly `public_html`. Confirm the correct directory in hPanel, especially for an additional domain or subdomain.
3. Upload `blueprint-site.zip` and extract it into that document root. Confirm that `index.html`, `_next/`, and `assets/` are directly inside the document root.
4. Check for old default pages, `index.php` files, or WordPress rewrite rules that could take precedence or intercept the new routes. Preserve the backup and review any changes needed for other applications on the same hosting account.
5. Connect the domain and confirm that SSL/HTTPS is active in hPanel.

Hostinger's [File Manager guide](https://www.hostinger.com/support/4548688-basic-actions-in-the-file-manager-in-hostinger/) and [HTTPS guide](https://www.hostinger.com/support/1583201-how-to-enable-or-disable-https-for-your-website-at-hostinger/) describe the current hPanel controls.

### 4. Verify the live site

- Open the homepage and navigate to About, Services, Projects, Products, Careers, and Contact.
- Open and refresh a nested URL such as `/services/general-construction/`. The host must serve each exported folder's `index.html`.
- Check images, the homepage video, mobile navigation, product filters, project galleries, `sitemap.xml`, and `robots.txt`.
- Complete an appointment request and confirm that Gmail opens a draft addressed to `info@blueprint.ky`. The visitor must review and send the email; the website does not send or confirm an appointment itself.
- Test the site on mobile and desktop, and review any redirects needed for URLs from the previous website.

For future updates, pull the latest changes, rebuild with the correct `NEXT_PUBLIC_SITE_URL`, and upload the new contents of `out/` using the same process.

## Contact

- **Email:** [info@blueprint.ky](mailto:info@blueprint.ky)
- **Phone:** +1 (345) 926-4546
- **Address:** Unit 3C, Grand Cayman, 80 Shedden Road, Elizabethan Square, Amerigo House, KY1-1503, Cayman Islands
