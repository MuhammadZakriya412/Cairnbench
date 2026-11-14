export const COPY = {
  'nav.home': 'Home',
  'nav.apps': 'Apps',
  'nav.mcp': 'Connect AI',
  'nav.vault': 'Vault',
  'action.save': 'Save to vault',
  'action.saved': 'Saved to vault',
  'hero.title': 'Get your code ready for AI, without leaking secrets.',
  'hero.lead':
    'Pack files into one clean block, hide keys and tokens before anything is shared, then test requests, read logs and write prompts. Free, and it runs in your browser.',
  'hero.cta.primary': 'Open the workbench',
  'hero.cta.signedin': 'Go to the workbench',
  'hero.cta.tour': 'Watch the 60-second tour',
  'tutorials.title': 'See each tool in under a minute',
  'tutorials.sub': 'Short walkthroughs with captions, played on the real app.',
  'tools.title': 'Tools that share one vault',
  'tools.sub': 'Save a result once, find it from any tool, share it with your team.',
  'trust.1':
    'Stays in your browser. As a guest, nothing leaves this device. Sign in only to sync.',
  'trust.2':
    'No AI calls inside. Cairnbench prepares text for AI; it never sends yours to a model.',
  'trust.3': 'Free to use. No card, no trial clock.',
  'mcp.title': 'Let your AI agent use it too',
  'mcp.sub': 'Connect over MCP with scoped tokens you can revoke.',
  'mcp.cta': 'Set up your AI tool',
  'paste.placeholder': 'Paste code, logs or a prompt, or drop files here',
  'paste.cta': 'Pack for AI',
  'apps.recent': 'Pick up where you left off',
  'apps.recent.empty': 'Nothing here yet. Paste something above, or open a tool below.',
  'apps.tools': 'Tools',
  'action.opentool': 'Open tool',
  'action.watchtutorial': 'Watch tutorial',
  'action.open': 'Open app',
  'action.watch': 'Watch overview',
  'action.copy': 'Copy',
  'action.copied': 'Copied',
  'action.retry': 'Try again',
  'action.delete': 'Delete item',
  'action.deleted': 'Item deleted',
  'action.share': 'Create share link',
  'action.shared': 'Share link created',
  'action.invite': 'Create invite link',
  'action.signin': 'Sign in',
  'action.signout': 'Sign out',
  'guest.banner':
    'You are using Cairnbench as a guest. Items stay on this device. Sign in to sync and share.',
  'empty.vault': 'Nothing saved yet. Run an app, then choose Save to vault.',
  'error.network':
    'Cairnbench could not reach the server. Check your connection, then try again.',
  'error.quota':
    'This item is larger than 512 KB. Remove content or save it to a file instead.',
  'error.version':
    'Someone changed this item while you were editing. Reload to see their version.',
  'error.generic':
    'That did not complete. Try again. If it keeps happening, report code {code}.',
  'cloud.off':
    'Cloud sync is off because the project is not connected to Supabase. Guest mode still works.',
  'scrub.disclaimer':
    'Redaction finds common secret formats. It can miss some. Review the preview before you copy.',
  'encrypt.confirm':
    'I understand I cannot recover this item if I forget the passphrase, and search and AI tools cannot read it.',
} as const;

export type CopyKey = keyof typeof COPY;

export function formatGenericError(code: string): string {
  return COPY['error.generic'].replace('{code}', code);
}
