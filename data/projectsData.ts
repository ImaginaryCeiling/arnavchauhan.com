interface Project {
  title: string,
  description: string,
  imgSrc?: string,
  href: string,
  github?: string,
  youtube?: string,

}

const projectsData: Project[] = [
  {
    title: "Poker? I hardly know her!",
    description: "A Meta Ray-Ban Glasses-powered system that lets you play poker and do homework at the same time—but the better you do at one, the worse you perform at the other.",
    imgSrc: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/6d8ec4172c2d78efe3d8e30a3b9f8f23a7beb001_scr-20250404-dctf.jpeg",
    href: "https://github.com/sahitid/meta-vision-project",
    github: "https://github.com/sahitid/meta-vision-project",
    youtube: "https://www.youtube.com/watch?v=JVtFxCJw5ng",


  },
  {
    title: "DECA 2025 - SEOR - Cary Tennis Park",
    description: "Our DECA paper for the Sports and Entertainment Operations Research Event from 2025, where we analyzed Cary Tennis Park and proposed a plan to implement AI at the facility.",
    imgSrc: "https://www.timmons.com/wp-content/uploads/2020/01/web_cary-tennis-park-110222-image-seq-019.jpg",
    href: "https://deca2025.vercel.app",
    github: "https://github.com/ImaginaryCeiling/deca_site",
  },
  
]

export default projectsData
