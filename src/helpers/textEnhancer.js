let stylesInjected = false;

export default function textEnhancer(text = '') {
  if (!text || typeof text !== 'string') return text;

  if (!stylesInjected && typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.innerHTML = `
      a {
        color: #1d9bf0;
        text-decoration: none;
        transition: color 0.2s ease;
      }
      a:hover {
        text-decoration: underline;
        color: #0d8ce0;
      }
      a.mention,
      a.hashtag {
        color: #1d9bf0;
      }
    `;
    document.head.appendChild(style);
    stylesInjected = true;
  }

  const escapeHtml = (str) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  let safeText = escapeHtml(text);

  safeText = safeText.replace(/\b((https?:\/\/|www\.)[^\s<]+)/gi, (url) => {
    const href = url.startsWith('http') ? url : `https://${url}`;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });

  safeText = safeText.replace(
    /(^|\s)@([a-zA-Z0-9_]+)/g,
    (match, space, username) =>
      `${space}<a href="/profile/${username}" class="mention">@${username}</a>`
  );

  safeText = safeText.replace(
    /(^|\s)#([a-zA-Z0-9_]+)/g,
    (match, space, tag) => `${space}<a href="/tags/${tag}" class="hashtag">#${tag}</a>`
  );

  return safeText;
}
