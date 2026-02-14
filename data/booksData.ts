export interface BookEntry {
  title: string
  author?: string
  coverUrl?: string
  editionId?: string // Open Library edition identifier (e.g., 'OL7353617M')
  goodreadsUrl?: string // Direct Goodreads URL (overrides ISBN lookup)
  currentlyReading?: boolean
  toRead?: boolean
  rating?: number
}

const booksData: (string | BookEntry)[] = [
  {
    title: 'What The Dog Saw And Other Adventures',
    author: 'Malcom Gladwell',
    coverUrl: 'https://m.media-amazon.com/images/I/61WvcA51fzL._AC_UF1000,1000_QL80_.jpg',
    goodreadsUrl:
      'https://www.goodreads.com/book/show/6516450-what-the-dog-saw-and-other-adventures',
    toRead: true,
  },
  {
    title: 'Bullshit Jobs: A Theory',
    author: 'David Graeber',
    coverUrl: 'https://m.media-amazon.com/images/I/71rDaYBmH5L._AC_UF1000,1000_QL80_.jpg',
    goodreadsUrl: 'https://www.goodreads.com/book/show/34466958-bullshit-jobs',
    currentlyReading: true,
  },
  {
    title: "Lilliput Land: How Small is Driving India's Mega Consumption Story",
    author: 'Rama Bijapurkar',
    coverUrl: 'https://m.media-amazon.com/images/I/617JmWhOjkL._SY522_.jpg',
    goodreadsUrl: 'https://www.goodreads.com/en/book/show/207639030-lilliput-land',
    currentlyReading: true,
  },
  {
    title: 'Flash Boys: A Wall Street Revolt',
    author: 'Michael Lewis',
    coverUrl: 'https://m.media-amazon.com/images/I/51QkiBt2jUL._AC_UF1000,1000_QL80_.jpg',
    goodreadsUrl: 'https://www.goodreads.com/book/show/24724602-flash-boys',
    currentlyReading: false,
    rating: 5,
  },
  {
    title: 'Outliers: The Story of Success',
    author: 'Malcom Gladwell',
    coverUrl: 'https://m.media-amazon.com/images/I/91lYcUJ8JsL._AC_UF1000,1000_QL80_.jpg',
    goodreadsUrl: 'https://www.goodreads.com/book/show/3228917-outliers',
    currentlyReading: false,
    rating: 4,
  },
  {
    title: 'The Arthashastra',
    author: 'Kautilya',
    coverUrl: 'https://m.media-amazon.com/images/I/91lh2LgvORL._UF1000,1000_QL80_.jpg',
    goodreadsUrl: 'https://www.goodreads.com/book/show/1769362.The_Arthashastra',
    currentlyReading: false,
    rating: 3.5,
  },
  {
    title: 'You Can Just Do Things: The Power of Permissionless Action',
    author: 'Jay Yang',
    coverUrl: 'https://m.media-amazon.com/images/I/610-cujJgUL._UF1000,1000_QL80_.jpg',
    goodreadsUrl: 'https://www.goodreads.com/book/show/232294916-you-can-just-do-things',
    rating: 3,
  },
  {
    title: 'Animal Farm',
    editionId: 'OL23269355M',
    goodreadsUrl: 'https://www.goodreads.com/book/show/170448.Animal_Farm',
    rating: 4.5,
  },
  {
    title: 'Running with Purpose',
    author: 'Jim Weber',
    editionId: 'OL46514340M',
    goodreadsUrl: 'https://www.goodreads.com/book/show/59551681-running-with-purpose',
    rating: 4,
  },
  {
    title: 'Atomic Habits',
    goodreadsUrl: 'https://www.goodreads.com/book/show/40121378-atomic-habits',
    rating: 3.5,
  },
  {
    title: 'The Old Man and the Sea',
    goodreadsUrl:
      'https://www.goodreads.com/book/show/59720501-the-old-man-and-the-sea-novel-by-ernest-hemingway',
    rating: 5,
  },
  {
    title: '1984',
    editionId: 'OL37823270M',
    author: 'George Orwell',
    goodreadsUrl: 'https://www.goodreads.com/book/show/5470.1984',
    rating: 4,
  },
  {
    title: 'The Great Gatsby',
    editionId: 'OL35657482M',
    author: 'F. Scott Fitzgerald',
    goodreadsUrl: 'https://www.goodreads.com/book/show/27451',
    rating: 2.5,
  },
  {
    title: 'Ikigai',
    goodreadsUrl: 'https://www.goodreads.com/book/show/124950497-ikigai',
    rating: 4,
  },
  {
    title: "Can't Hurt Me",
    editionId: 'OL49829825M',
    author: 'David Goggins',
    goodreadsUrl: 'https://www.goodreads.com/book/show/41721428-can-t-hurt-me',
    rating: 4.5,
  },
  {
    title: 'Shoe Dog',
    editionId: 'OL36316014M',
    goodreadsUrl: 'https://www.goodreads.com/book/show/27220736-shoe-dog',
    rating: 5,
  },
  {
    title: 'Fahrenheit 451',
    editionId: 'OL26295928M',
    author: 'Ray Bradbury',
    goodreadsUrl: 'https://www.goodreads.com/book/show/4381.Fahrenheit_451',
    rating: 4.5,
  },
  {
    title: 'Catch-22',
    rating: 3.5,
  },
  {
    title: 'The Kite Runner',
    editionId: 'OL57895724M',
    rating: 5,
  },
  { title: 'Never Quit', editionId: 'OL27373108M', rating: 4.5 },
  {
    title: 'What if?',
    editionId: 'OL44567676M',
    rating: 4,
  },
  {
    title: 'A Promised Land',
    rating: 5,
  },
  {
    title: 'Scythe',
    rating: 5,
  },

  // Add more book titles here
  // Or use custom formats:
  //
  // With Open Library edition ID (to choose specific cover):
  // {
  //   title: 'Book Title',
  //   editionId: 'OL7353617M',  // Find this on openlibrary.org
  //   author: 'Author Name'     // Optional: hardcode if API fetch fails
  // }
  //
  // With custom cover URL:
  // {
  //   title: 'Book Title',
  //   author: 'Author Name',
  //   coverUrl: 'https://your-image-url.jpg'
  // }
]

export default booksData
