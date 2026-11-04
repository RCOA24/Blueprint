# Blueprint Group of Companies

Blueprint Group is a Cayman Islands construction partner established in Grand Cayman in 2010. The team works with residential, commercial, and industrial clients, bringing together design, construction, and project management with a focus on craftsmanship, communication, and local understanding.

The website presents Blueprint's services, projects, fencing products, careers, and contact information. Visitors can send an appointment request directly to the team and receive an email copy.

## Website project

The site uses **Next.js App Router, React, and TypeScript**. It is configured as a static export: the production build generates HTML, CSS, JavaScript, images, and a PHP appointment endpoint in the `out/` folder. Hosting needs PHP 8.1 or later, the OpenSSL extension, and SMTP for appointment emails; it does not need a Node.js server or database.

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

The browser test requires an installed Google Chrome browser and a completed production build. It mocks the PHP endpoint; it does not send email. To exercise the real PHP endpoint with an isolated fake mailer, install PHP 8.1 or later and run `node tests/appointment-backend.mjs`. The test creates temporary files and uses no SMTP server. PHP can also be checked with `php -l public/api/appointment.php` and the Composer manifest with `composer validate --no-check-publish` from `mail-backend/`.

The Next.js development server serves static files and does not execute PHP. Use PHP-capable hosting for end-to-end appointment submissions.

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

The ZIP should contain `index.html`, `_next/`, `assets/`, `api/appointment.php`, `contact/`, `services/`, and the other page folders at its top level. It should not contain an enclosing `out/` folder.

### 3. Upload the website

1. Sign in to Hostinger hPanel and open **Websites → Manage site → Files → File Manager** for the intended domain.
2. Open the site's document root, commonly `public_html`. Confirm the correct directory in hPanel, especially for an additional domain or subdomain.
3. Upload `blueprint-site.zip` and extract it into that document root. Confirm that `index.html`, `_next/`, and `assets/` are directly inside the document root.
4. Check for old default pages, `index.php` files, or WordPress rewrite rules that could take precedence or intercept the new routes. Preserve the backup and review any changes needed for other applications on the same hosting account.
5. Connect the domain and confirm that SSL/HTTPS is active in hPanel.

### 3a. Configure appointment email

The PHP endpoint uses [PHPMailer](https://github.com/PHPMailer/PHPMailer) with authenticated SMTP. On Hostinger, create a `blueprint-mail` directory **beside** `public_html`, outside the website document root. Upload `mail-backend/composer.json` and `mail-backend/composer.lock` there and run `composer2 install --no-dev --optimize-autoloader` in that directory (or run Composer locally and upload its `vendor/` folder). The lock file fixes the package version; review and update it when maintaining dependencies. Copy `mail-backend/config.example.php` to `blueprint-mail/config.php` and replace the example SMTP settings with the real mailbox host, port, username, password, and sender address. Keep `config.php` and `vendor/` outside `public_html` and do not add the password to Git or the site ZIP.

The endpoint expects `public_html/api/appointment.php` and `blueprint-mail/` to share the same parent directory. It resolves that location from its own file path, without depending on an account name. If the site uses a different document-root layout, adjust `$privateDirectory` in the endpoint and verify the private directory is not accessible over HTTP. The PHP user needs read access to `config.php` and `vendor/`, and write access to `blueprint-mail/` for `rate-limit.json`. Restrict permissions to the hosting account and web process; never put the private directory, its config, or the rate-limit state in the web root. `mail-backend/config.php`, `mail-backend/vendor/`, and `mail-backend/rate-limit.json` are ignored by Git.

Use the SMTP host and credentials from the mailbox's actual provider. Ports 465 (implicit TLS) and 587 (STARTTLS) are supported with certificate verification enabled. Use an authenticated `from` address authorized by that provider. The request goes to `recipient` (default `info@blueprint.ky`), CCs the visitor, and sets Reply-To to the visitor. A CC sends one message to both parties and exposes each address to the other; the business recipient and visitor address are already needed for the reply. A visitor can submit another person's address, so the rate limit and honeypot reduce but do not eliminate abuse.

The endpoint allows eight POST attempts per client IP in a rolling 15-minute window, including invalid and honeypot submissions. It uses `REMOTE_ADDR`, not forwarded headers, and a locked, bounded state file. Users sharing an IP share the limit, which expires automatically. A missing, unwritable, corrupt or full state file causes a 503 rather than bypassing the limit. The limit assumes one server with a shared local filesystem that supports PHP `flock`; reverse proxies can make all users appear to share one IP. Distributed attackers can evade IP limits: review traffic and add host-level protections if abuse occurs. Never delete or replace the state file while requests are running, because doing so can break locking.

The endpoint rejects requests with a declared body larger than 16 KiB and bounds individual fields. PHP and the web server may parse a request before this code runs; configure appropriate server request and PHP `post_max_size` limits as well, including for requests without a declared length. Verify the settings on the actual host.

Before launch, use a dedicated test SMTP account and set `from`, `username`, `password`, and `recipient` to authorized test values. Submit from the site using a separate visitor address; confirm the team recipient and visitor receive the message, check spam folders, and reply to confirm Reply-To. SMTP acceptance does not guarantee inbox delivery. Then replace the settings with the client's authorized sender and recipient, and repeat the check with approved addresses. To rotate a password, create a new provider credential, update private `config.php`, verify sending, and revoke the old credential. Never commit or share credentials in a support request.

For HTTP 422, check required fields, the Cayman date, service and time selections, field sizes, and email format. For 429, wait for the 15-minute window; users behind the same IP share it. For 503, check the server's PHP error log for the fixed `Blueprint appointment` diagnostic category, ensure the private directory is writable, confirm `config.php`, port, SMTP settings and `vendor/autoload.php`, and review provider connectivity. A 405 from opening the endpoint directly is expected because it accepts POST only. A timeout or SMTP failure can leave the outcome uncertain; contact the team before resubmitting to avoid duplicates.

Before migrating an existing WordPress site, back up its files, database and rewrite rules. Review existing `.htaccess` rules and default `index.php` files so they do not intercept static routes or `/api/appointment.php`; preserve any rules needed by other applications. Verify this in staging on the actual hosting plan before replacing the live site. Domain, DNS, MX, PHP configuration and existing services are managed separately and should not be changed by the static upload.

Hostinger's [File Manager guide](https://www.hostinger.com/support/4548688-basic-actions-in-the-file-manager-in-hostinger/) and [HTTPS guide](https://www.hostinger.com/support/1583201-how-to-enable-or-disable-https-for-your-website-at-hostinger/) describe the current hPanel controls.

### 4. Verify the live site

- Open the homepage and navigate to About, Services, Projects, Products, Careers, and Contact.
- Open and refresh a nested URL such as `/services/general-construction/`. The host must serve each exported folder's `index.html`.
- Check images, the homepage video, mobile navigation, product filters, project galleries, `sitemap.xml`, and `robots.txt`.
- Complete an appointment request and confirm that `info@blueprint.ky` receives it and the visitor receives a copy. Reply to the request and confirm the reply targets the visitor. An appointment is confirmed only after the team responds.
- Test the site on mobile and desktop, and review any redirects needed for URLs from the previous website.

For future updates, pull the latest changes, rebuild with the correct `NEXT_PUBLIC_SITE_URL`, and upload the new contents of `out/` using the same process.

## Contact

- **Email:** [info@blueprint.ky](mailto:info@blueprint.ky)
- **Phone:** +1 (345) 926-4546
- **Address:** Unit 3C, Grand Cayman, 80 Shedden Road, Elizabethan Square, Amerigo House, KY1-1503, Cayman Islands
