export interface Point {
  x: number;
  y: number;
}

export interface Marker extends Point {
  id: number;
  contentId: string | null;
}
