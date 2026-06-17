export interface ExhibitionSite {
  id: string;
  name: string;
  imageSrc: string;
}

export const exhibitionSites: ExhibitionSite[] = [
  {
    id: 'baekdudaegan',
    name: '국립백두대간수목원',
    imageSrc: `${import.meta.env.BASE_URL}images/baekdu.jpg`
  },
  {
    id: 'sejong',
    name: '국립세종수목원',
    imageSrc: `${import.meta.env.BASE_URL}images/sejong.jpg`
  },
  {
    id: 'native-plants',
    name: '국립한국자생식물원',
    imageSrc: `${import.meta.env.BASE_URL}images/korea.jpg`
  },
  {
    id: 'garden-culture',
    name: '국립정원문화원',
    imageSrc: `${import.meta.env.BASE_URL}images/garden.jpg`
  }
];

export const exhibitionSiteMap = new Map(exhibitionSites.map((site) => [site.id, site]));
