# AGENTS.md

## Project

This repository is Eunah Jeong's dependency-free static portfolio for GitHub
Pages. It uses plain HTML and CSS and follows a museum-gallery visual direction.

## Guidelines

- Keep the site framework-free and use relative URLs.
- Put shared styles in `styles.css` and preserve the existing visual language.
- Keep navigation, metadata, section references, and accessibility features
  consistent when changing content.
- Use factual portfolio copy; do not invent personal details.
- Store optimized site media in `assets/` with descriptive names and accessible
  image markup.
- Maintain responsive, keyboard-accessible layouts without horizontal overflow.

## Development and verification

Serve the repository locally with:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

There is no build or automated test process. The user will verify changes
manually; end responses with a concise summary of files changed.
