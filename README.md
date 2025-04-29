# Hanime CLI

A command-line tool to fetch trending videos from Hanime TV.

## Installation

```bash
npm install -g .
```

## Usage

```bash
hanime-cli trending [options]
```

Options:

- `-t, --time <time>`  Time range (today, week, month) (default: "today")
- `-p, --page <page>`  Page number (default: "1")

Example:

```bash
hanime-cli trending -t week -p 2
```

## Video Details

```bash
hanime-cli video <url>
```

Fetches full video metadata, including description, streams, tags, and episodes, then prompts you to pick a resolution and opens the stream in VLC (ensure VLC is installed and in your PATH).