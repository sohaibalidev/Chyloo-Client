const getPlaceholderColor = (username) => {
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#F9A826',
    '#A3A1F8',
    '#FF9FF3',
    '#54A0FF',
    '#5F27CD',
    '#00D2D3',
    '#FF9F43',
    '#10AC84',
    '#EE5A24',
    '#0652DD',
    '#D980FA',
    '#B53471',
  ];

  if (!username) return colors[0];

  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  return colors[hash % colors.length];
};

export default getPlaceholderColor;
