# iem-express

Application to manage the media files for Sony Alpha cameras.

## Features

- import the media files and sort by date created and type.
- export the media files to a specific location.
- initialize a connection to Google Photos API.
- publish the photos JPG to a specific album.

## Requirements

### Configuration - Google Photos API

Set up your file `oauth2.key.json` in `./src/settings/` to use **Google Photos API**.

```sh
.
└── src
    └── settings
        └── oauth2.key.json
```

Inside the file google.config.json, set up the following fields:

- client_id
- client_secret
- project_id

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

## Installation

Run `npm install`.

## Help

```
Usage:
  ts-node app.ts [COMMAND] [OPTION]...

Commands:
  import,           import files
  export,           export files
  init,             log in for the Cloud Photos API
  token,            get the token for the Cloud Photos API
  albums,           get the albums collection or upload images to the Cloud Photos

Options:
  -s, --source=PATH  source location
  -d, --dest=PATH    destination location
  -f, --force        force the copy of the files if they already exist
  -t, --title=ARG    title of the album
  -p, --provider=ARG chose the provider: Google Photos or Amazon Photos
  -h, --help         display this help
```

## Usage

### Case 1 - import media files from SD Card

The command lines will import the media files from `/storage/0000-0000` to `/home/user/pictures`

```sh
# display the content of the SD Card directory
> tree /storage/0000-0000
/storage/0000-0000
├── DCIM
│   └── 100MSDCF
│       ├── DSC00001.ARW
│       └── DSC00001.JPG
└── PRIVATE
    └── M4ROOT
        └── CLIP
            └── C0001.MP4

# run the import command
> ts-node app.ts import -s /storage/0000-0000 -d /home/user/pictures

# display the content of the imported files
> tree /home/user/pictures
/home/user/pictures
└── 2024-03-22
    ├── ARW
    │   └── DSC00001.ARW
    ├── JPG
    │   └── DSC00001.JPG
    └── MP4
        └── C0001.MP4
```

## Case 2 - export to external storage

The command line will copy the content from `/home/user/pictures` to `/mnt/e/pictures`

```sh
# run the import command
> ts-node app.ts export -s /home/user/pictures -d /mnt/e/pictures
```

## Case 3 - upload the images to Google Photos

The command lines will init a valid token and upload all JPG images from `/home/user/pictures`
to the album called `Summer 2024`. If the album doesn't exist, it will be created.

```sh
# open a link to log in, connect to your account then copy / paste the link to extract the code
> ts-node app.ts init
Paste the link after the authentication: https://www.googleapis.com/auth/photoslibrary?code=XXXX-XXX&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fphotoslibrary.sharing+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fphotoslibrary+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fphotoslibrary.appendonly

# upload all images to the album 'summer 2024'
> ts-node app.ts album -t 'Summer 2024' -s /home/user/pictures
```

note: the images can be upload only from album created by this app.
