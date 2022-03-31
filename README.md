# Update Term Store

## `POST /UpdateTerms`

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
