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

## File naming

- Use lowercase kebab-case for new media and document filenames: no spaces, underscores, or ambiguous abbreviations.
- For ordered project assets, use `project-v#-topic-##-description.ext`; keep the sequence number two digits. Example: `poluto-v1-ssh-03-laptop-raspberry-pi-access.png`.
- Use a clear project or series prefix, followed by the subject and a concise description. Omit the version or sequence only when it does not apply.

## Development and verification

Serve the repository locally with:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

There is no build or automated test process. The user will verify changes
manually; end responses with a concise summary of files changed.

## Git push troubleshooting

If `git push` fails with an HTTP 400, an unexpected sideband disconnect, and a
misleading `Everything up-to-date` message, retry the push with HTTP/1.1 and a
larger one-time upload buffer:

```sh
git -c http.version=HTTP/1.1 -c http.postBuffer=524288000 push origin main
```

Verify that the push succeeded by confirming `git status --short --branch` no
longer reports the local branch as ahead of `origin/main`. Keep these settings
command-local unless repeated failures justify changing the Git configuration.
