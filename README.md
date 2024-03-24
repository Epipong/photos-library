# iem-express

Application to manage the media files for Sony Alpha cameras.

## Features
- import the media files and sort by date created and type.
- export the media files to a specific location.
- initialize a connection to Google Photos API.
- publish the photos JPG to a specific album.

## Requirements
Set up your file **oauth2.key.json** in **./src/settings/**:
```sh
.
└── src
    └── settings
        └── oauth2.key.json
```

Inside the file oauth2.keys.json:
```json
{
  "web": {
    "client_id": "XXXX-XXXX.apps.googleusercontent.com",
    "project_id": "carbide-XXXX-XXXX",
    "auth_uri": "https://accounts.google.com/o/oauth2/v2/auth",
    "token_uri": "https://www.googleapis.com/oauth2/v4/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "ABCDEFG1234567890-XXXX-X",
    "redirect_uris": [
      "https://www.googleapis.com/auth/photoslibrary.sharing",
      "https://www.googleapis.com/auth/photoslibrary.appendonly",
      "https://www.googleapis.com/auth/photoslibrary"
    ],
    "redirect_uri": "https://www.googleapis.com/auth/photoslibrary"
  }
}
```

## Help
```
Usage:
  ts-node app.ts [COMMAND] [OPTION]

Commands:
  import,          import files
  export,          export files
  init,            log in for Google Photos API
  token,           get the token for the Google Photos API
  albums,          get the albums collection

Options:
  -s, --source=ARG source location to import files
  -t, --target=ARG target location to import files
  -f, --force      force the copy of the files if they already exist
  -t, --title       title of the album
  -h, --help       display this help
```
