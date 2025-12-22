export interface BookEntry {
  title: string
  author?: string
  coverUrl?: string
  editionId?: string // Open Library edition identifier (e.g., 'OL7353617M')
  goodreadsUrl?: string // Direct Goodreads URL (overrides ISBN lookup)
  currentlyReading?: boolean
  toRead?: boolean
}

const booksData: (string | BookEntry)[] = [
  {
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    toRead: true,
  },
  {
    title: 'What The Dog Saw And Other Adventures',
    author: 'Malcom Gladwell',
    coverUrl: 'https://m.media-amazon.com/images/I/61WvcA51fzL._AC_UF1000,1000_QL80_.jpg',
    goodreadsUrl:
      'https://www.goodreads.com/book/show/6516450-what-the-dog-saw-and-other-adventures',
    currentlyReading: true,
  },
  {
    title: 'Flash Boys: A Wall Street Revolt',
    author: 'Michael Lewis',
    coverUrl: 'https://m.media-amazon.com/images/I/51QkiBt2jUL._AC_UF1000,1000_QL80_.jpg',
    goodreadsUrl: 'https://www.goodreads.com/book/show/24724602-flash-boys',
    currentlyReading: true,
  },
  {
    title: 'Outliers: The Story of Success',
    author: 'Malcom Gladwell',
    coverUrl: 'https://m.media-amazon.com/images/I/91lYcUJ8JsL._AC_UF1000,1000_QL80_.jpg',
    goodreadsUrl: 'https://www.goodreads.com/book/show/3228917-outliers',
    currentlyReading: false,
  },
  {
    title: 'The Arthashastra',
    author: 'Kautilya',
    coverUrl: 'https://m.media-amazon.com/images/I/91lh2LgvORL._UF1000,1000_QL80_.jpg',
    goodreadsUrl: 'https://www.goodreads.com/book/show/1769362.The_Arthashastra',
    currentlyReading: false,
  },
  {
    title: 'You Can Just Do Things: The Power of Permissionless Action',
    author: 'Jay Yang',
    coverUrl: 'https://m.media-amazon.com/images/I/610-cujJgUL._UF1000,1000_QL80_.jpg',
    goodreadsUrl: 'https://www.goodreads.com/book/show/232294916-you-can-just-do-things',
  },
  {
    title: 'Animal Farm',
    editionId: 'OL23269355M',
    goodreadsUrl: 'https://www.goodreads.com/book/show/170448.Animal_Farm',
  },
  {
    title: 'Running with Purpose',
    author: 'Jim Weber',
    editionId: 'OL46514340M',
    goodreadsUrl: 'https://www.goodreads.com/book/show/59551681-running-with-purpose',
  },
  {
    title: 'Atomic Habits',
    goodreadsUrl: 'https://www.goodreads.com/book/show/40121378-atomic-habits',
  },
  {
    title: 'The Old Man and the Sea',
    goodreadsUrl:
      'https://www.goodreads.com/book/show/59720501-the-old-man-and-the-sea-novel-by-ernest-hemingway',
  },
  {
    title: '1984',
    editionId: 'OL37823270M',
    author: 'George Orwell',
    goodreadsUrl: 'https://www.goodreads.com/book/show/5470.1984',
  },
  {
    title: 'The Great Gatsby',
    editionId: 'OL35657482M',
    author: 'F. Scott Fitzgerald',
    goodreadsUrl: 'https://www.goodreads.com/book/show/27451',
  },
  {
    title: 'Ikigai',
    goodreadsUrl: 'https://www.goodreads.com/book/show/124950497-ikigai',
  },
  {
    title: "Can't Hurt Me",
    editionId: 'OL49829825M',
    author: 'David Goggins',
    goodreadsUrl: 'https://www.goodreads.com/book/show/41721428-can-t-hurt-me',
  },
  {
    title: 'Shoe Dog',
    editionId: 'OL36316014M',
    goodreadsUrl: 'https://www.goodreads.com/book/show/27220736-shoe-dog',
  },
  {
    title: 'Fahrenheit 451',
    editionId: 'OL26295928M',
    author: 'Ray Bradbury',
    goodreadsUrl: 'https://www.goodreads.com/book/show/4381.Fahrenheit_451',
  },
  {
    title: 'Catch-22',
  },
  {
    title: 'The Kite Runner',
    editionId: 'OL57895724M',
  },
  { title: 'Never Quit', editionId: 'OL27373108M' },
  {
    title: 'What if?',
    editionId: 'OL44567676M',
  },
  {
    title: 'A Promised Land',
  },
  {
    title: 'Scythe',
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
