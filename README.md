# Update Term Store

## `POST /UpdateTerms`

This API is called from a script where body contains all the terms used in the organization.

`Flow:`
1. Get all Terms from *Term Set* in SharePoint
1. Loop through all *Sectors*
    1. If *Sector* exists, move on
    1. If *Sector* doesn't exist, create it with *Term Set* as root
    1. Loop through all *Sections*
        1. If *Section* exists, move on
        1. If *Section* doesn't exist, create it with *Sector* as root
            1. Loop through all *Teams*
                1. If *Team* exists, move on
                1. If *Team* doesn't exist, create it with *Section* as root
1. Return all actions taken structured as log items. The calling script will use this response as actual logging saved to a log file on server

**Add `?dummyRun=true` to do a WhatIf run**

### request

```json
[
  {
      "Id":  "BDK",
      "SeksjonId":  "",
      "Sektor":  "Brukerbehov, digitalisering og kommunikasjon",
      "SektorId":  "BDK",
      "Team":  "",
      "TeamId":  "",
      "Seksjon":  ""
  },
  {
      "Id":  "BDK-ARK",
      "SeksjonId":  "BDK-ARK",
      "Sektor":  "Brukerbehov, digitalisering og kommunikasjon",
      "SektorId":  "BDK",
      "Team":  "",
      "TeamId":  "",
      "Seksjon":  "Arkiv og dokumenthåndtering"
  },
  {
      "Id":  "BDK-IT",
      "SeksjonId":  "BDK-IT",
      "Sektor":  "Brukerbehov, digitalisering og kommunikasjon",
      "SektorId":  "BDK",
      "Team":  "",
      "TeamId":  "",
      "Seksjon":  "IT konserndrift og brukerstøtte"
  },
  {
      "Id":  "BDK-IT-DRIFT",
      "SeksjonId":  "BDK-IT",
      "Sektor":  "Brukerbehov, digitalisering og kommunikasjon",
      "SektorId":  "BDK",
      "Team":  "Team konserndrift",
      "TeamId":  "BDK-IT-DRIFT",
      "Seksjon":  "IT konserndrift og brukerstøtte"
  },
  ...
]
```

### response

```json
{
  "outputLog": [
    "INFO: Processing Sector:  Brukerbehov, digitalisering og kommunikasjon",
    "INFO: Processing Section: Brukerbehov, digitalisering og kommunikasjon / Arkiv og dokumenthåndtering",
    "INFO: Processing Section: Brukerbehov, digitalisering og kommunikasjon / IT konserndrift og brukerstøtte",
    "INFO: Processing Team:    Brukerbehov, digitalisering og kommunikasjon / IT konserndrift og brukerstøtte / Team konserndrift",
    ...
  ]
}
```

## Setup

### App Registration

- Create a new App Registration in Azure Active Directory
- Add and consent these **Application** permissions:
    - TermStore.Read.All
    - TermStore.ReadWrite.All

To allow the App Registration to **create**/**remove** terms in Term Store, the user `app@sharepoint` must be added as an administrator of your Term Store.
AND this has to be done from the classic Term Store center : https://<your-tenant-name>-admin.sharepoint.com/_layouts/15/TermStoreManager.aspx

### `local.settings.json`
```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsStorage": "",
    "GRAPH_VERSION": "beta", // term store is only available in beta as of now
    "GRAPH_AUTH_CLIENT_ID": "app-registration-client-id",
    "GRAPH_AUTH_SECRET": "app-registration-client-secret",
    "TERMSTORE_SET_ID": "guid-of-term-set-to-work-on",
    "JWT_SECRET": "super secret secret",
    "NODE_ENV": "production",
    "PAPERTRAIL_DISABLE_LOGGING": "false",
    "PAPERTRAIL_HOST": "https://logs.collector.solarwinds.com/v1/log",
    "PAPERTRAIL_TOKEN": "secret token",
    "PAPERTRAIL_MINIMUM_REMOTE_LEVEL": "info"
  }
}
```
