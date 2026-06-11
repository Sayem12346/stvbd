// Parses M3U/M3U8 playlist content into structured channel data

export type ParsedChannel = {
  name: string;
  streamUrl: string;
  logoUrl: string | null;
  groupTitle: string;
};

export function parseM3U(content: string): ParsedChannel[] {
  const lines = content.split(/\r?\n/);
  const channels: ParsedChannel[] = [];

  let currentName = '';
  let currentLogo: string | null = null;
  let currentGroup = 'Uncategorized';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('#EXTINF')) {
      // Extract tvg-logo
      const logoMatch = line.match(/tvg-logo="([^"]*)"/i);
      currentLogo = logoMatch ? logoMatch[1] : null;

      // Extract group-title
      const groupMatch = line.match(/group-title="([^"]*)"/i);
      currentGroup = groupMatch ? groupMatch[1] : 'Uncategorized';

      // Extract channel name (text after the last comma)
      const nameMatch = line.match(/,(.*)$/);
      currentName = nameMatch ? nameMatch[1].trim() : 'Unnamed Channel';
    } else if (line && !line.startsWith('#')) {
      // This is the stream URL
      if (currentName) {
        channels.push({
          name: currentName,
          streamUrl: line,
          logoUrl: currentLogo,
          groupTitle: currentGroup,
        });
        currentName = '';
        currentLogo = null;
        currentGroup = 'Uncategorized';
      }
    }
  }

  return channels;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
