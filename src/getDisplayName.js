export default function getDisplayName(Comp) {
  return Comp.displayName || Comp.name || 'Component';
}

