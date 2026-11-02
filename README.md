# TullyG

A low-key, static artist site for TullyG, published with GitHub Pages. The
optional message form writes to Firebase Cloud Firestore.

The site uses the artist image from the linked Spotify profile for its logo.
The Music section includes TullyG's debut album, *Journey To Identity*, and
its 12-track outline.

## Set up Firebase

1. Create a Firebase project and register a web app.
2. Copy the web app's `apiKey`, `authDomain`, `projectId`, and `appId` into
   `firebase-config.js`. These web app settings are public client configuration,
   not server credentials.
3. Create a Cloud Firestore database.
4. Deploy the included Firestore rules with the Firebase CLI:
   `firebase deploy --only firestore:rules`
5. To protect the public message form from abuse, register the site with
   reCAPTCHA v3 in Firebase App Check, copy its site key into
   `appCheckSiteKey` in `firebase-config.js`, and verify submissions work
   before enabling App Check enforcement for Cloud Firestore.

The Firebase web app config is included. The message form is enabled when the
site can connect to Firebase; Firestore must be created and the included rules
deployed for message submissions to be stored.

## Publish

The GitHub Actions workflow deploys the repository root to GitHub Pages whenever
there is a push to `main`. Enable GitHub Pages for the repository with **GitHub
Actions** as its source; the first deployment then publishes the site at
`https://www.carzzyapps.com/TullyG/`.
