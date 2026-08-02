import campusImg from '../images/UMT Campus.jpg'

export const IMG = {
  campus: campusImg,
  portrait: (seed, w = 600, h = 750) => `https://picsum.photos/seed/${seed}/${w}/${h}`,
  wide: (seed, w = 900, h = 600) => `https://picsum.photos/seed/${seed}/${w}/${h}`,
}
