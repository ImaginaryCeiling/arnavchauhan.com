interface Project {
  title: string
  description: string
  imgSrc?: string
  href: string
  github?: string
  youtube?: string
}

const projectsData: Project[] = [
  {
    title: 'Poker? I hardly know her!',
    description:
      'A Meta Ray-Ban Glasses-powered system that lets you play poker and do homework at the same time—but the better you do at one, the worse you perform at the other.',
    imgSrc:
      'https://hc-cdn.hel1.your-objectstorage.com/s/v3/6d8ec4172c2d78efe3d8e30a3b9f8f23a7beb001_scr-20250404-dctf.jpeg',
    href: 'https://github.com/sahitid/meta-vision-project',
    github: 'https://github.com/sahitid/meta-vision-project',
    youtube: 'https://www.youtube.com/watch?v=JVtFxCJw5ng',
  },
  {
    title: 'DECA 2025 - SEOR - Cary Tennis Park',
    description:
      'Our DECA paper for the Sports and Entertainment Operations Research Event from 2025, where we analyzed operations at Cary Tennis Park and proposed a plan to implement AI at the facility.',
    imgSrc:
      'https://www.timmons.com/wp-content/uploads/2020/01/web_cary-tennis-park-110222-image-seq-019.jpg',
    href: 'https://deca2025.vercel.app',
    github: 'https://github.com/ImaginaryCeiling/deca_site',
  },
  {
    title: 'MBDump💩',
    description:
      'I got tired of using the notes app to dump random links or ideas, so I made this app to dump them all in the Mac Menu Bar.',
    imgSrc: '/static/images/MBDump.png',
    href: 'https://github.com/ImaginaryCeiling/MBDump/releases',
    github: 'https://github.com/ImaginaryCeiling/MBDump',
  },
  {
    title: 'Frog Population Simulator',
    description:
      'Got bored and started making simulations for my teachers to use in their classes. Now making tools for any teacher to use natural language to generate their own custom simulations instantly.',
    imgSrc: '/static/images/frog-population-simulator.png',
    href: 'https://frog-population.streamlit.app/',
    github: 'https://github.com/ImaginaryCeiling/frog-population-simulator',
  },
  {
    title: 'Vitalis Health',
    description:
      '1st Place in the Healthcare track at HackNYU 2025. Built a central OS for nurses to monitor their hospital floors easier and spend more time taking care of their patients. Snuck into an emergency room and found a nurse to interview to help us make the product.',
    imgSrc: '',
    href: 'https://main.d204vv20o17ygk.amplifyapp.com/',
    github: 'https://github.com/SupratikPanuganti/HackNYU',
  },
]

export default projectsData
