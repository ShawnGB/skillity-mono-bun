export function getAvatarUrl(firstName: string | null, lastName: string | null) {
  const name = encodeURIComponent(`${firstName ?? ''} ${lastName ?? ''}`.trim() || 'U');
  return `https://ui-avatars.com/api/?name=${name}&background=random&color=fff&size=128`;
}
