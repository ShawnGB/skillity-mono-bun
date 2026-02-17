export function getAvatarUrl(firstName: string, lastName: string) {
  const name = encodeURIComponent(`${firstName} ${lastName}`);
  return `https://ui-avatars.com/api/?name=${name}&background=random&color=fff&size=128`;
}
