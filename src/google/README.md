# Google Photos Library
Configure Google Photos.

## Requirements
- Have a Google account
- Get the credentials in [Google console](https://console.cloud.google.com/apis/credentials)
- Configure the file `google.config.json` in `./src/settings/`

## Configuration
Create or edit the file `google.config.json`.
```sh
.
└── src
    └── settings
        └── google.config.json
```

Inside the file `google.config.json`, change the fields:
- client_id
- client_secret
- project_id (optional)
```json
{
  "web": {
    "client_id": "XXXX-XXX.apps.googleusercontent.com",
    "project_id": "carbide-XXXX-12345",
    "auth_uri": "https://accounts.google.com/o/oauth2/v2/auth",
    "token_uri": "https://www.googleapis.com/oauth2/v4/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "ABCDEFG1234567890-XXXX-X",
    "redirect_uris": [
      "https://www.googleapis.com/auth/photoslibrary.sharing",
      "https://www.googleapis.com/auth/photoslibrary.appendonly",
      "https://www.googleapis.com/auth/photoslibrary"
    ],
    "redirect_uri": "https://www.googleapis.com/auth/photoslibrary",
    "auth_dir": "./src/settings/.gphotos_auth"
  }
}
```

## Usage

Init the token before to call the others services.
```sh
# open a link to log in, connect to your account then copy / paste the link to extract the code
> ts-node app.ts init
Paste the link after the authentication: https://www.googleapis.com/auth/photoslibrary?code=XXXX-XXX&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fphotoslibrary.sharing+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fphotoslibrary+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fphotoslibrary.appendonly
```

Upload the photos to a specific album. If the album doesn't exist, it will be created.
```sh
# upload all images to the album 'summer 2024' from the directory /home/user/pictures
> ts-node app.ts album --title 'Summer 2024' --source /home/user/pictures
```

## Note
You can only upload the images to an album created by this app.