[home](../../README.md) / amazon

# Amazon Photos

Configure Amazon Photos.

## Requirements

- Have an Amazon account
- Get the credentials from... TBD
- Configure the file `amazon.config.json` in `./src/settings/`

## Configuration

Create or edit the file `amazon.config.json`.

```sh
.
└── src
    └── settings
        └── amazon.config.json
```

Inside the file `google.config.json`, change the fields:

- client_id
- client_secret

```json
{
  "amz": {
    "client_id": "amzn.application-oa2-client.abc123def456",
    "client_secret": "amzn.oa2-cs.v1.abc123def456",
    "auth_uri": "https://api.amazon.com/auth/o2/create/codepair",
    "token_uri": "https://api.amazon.com/auth/o2/token",
    "auth_dir": "./src/settings/.aphotos_auth"
  }
}
```

## Usage
