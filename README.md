# Great Print Shop

## About

We are Great Print Shop, a print shop currently providing high-quality printing services at Shinawatra University’s main campus.

## Supported languages

The website currently supports:

- Arabic
- Dzongkha
- English (Australia, Canada, India, Philippines, Singapore, UK, and US)
- Filipino
- French (Canada)
- German
- Hindi
- Japanese
- Korean
- Lao
- Literary Chinese
- Malay (Malaysia, Arabic and Latin scripts; Singapore, Latin script)
- Burmese
- Nepali
- Persian
- Somali
- Tamil (Singapore)
- Thai
- Vietnamese
- Chinese (Simplified Chinese for China and Singapore; Traditional Chinese for Hong Kong and Taiwan)

## Help with translations

You can help improve an existing translation or add a new language:

1. Edit the matching JSON file in [`src/locales/`](./src/locales). To add a language, create a JSON file named with its locale code, such as `es-ES.json`.
2. Use [`src/locales/en-US.json`](./src/locales/en-US.json) as the reference. Keep the same keys and JSON structure, translate the values, and set `languageName` to the language’s name in that language.
3. Check that the JSON is valid and run `pnpm build`.
4. Open a pull request with your changes.

Locale files are loaded automatically, so a new JSON file will be included in the language picker. 
