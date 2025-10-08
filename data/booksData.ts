export interface BookEntry {
  title: string
  author?: string
  coverUrl?: string
  editionId?: string // Open Library edition identifier (e.g., 'OL7353617M')
}

const booksData: (string | BookEntry)[] = [
  { title: 'Animal Farm', editionId: 'OL23269355M' },
  { title: 'Running with Purpose', editionId: 'OL46514340M' },
  'Atomic Habits',
  'The Old Man and the Sea',
  { title: '1984', editionId: 'OL37823270M', author: 'George Orwell' },
  { title: 'The Great Gatsby', editionId: 'OL35657482M', author: 'F. Scott Fitzgerald' },
  'Ikigai',
  { title: "Can't Hurt Me", editionId: 'OL49829825M', author: 'David Goggins' },
  { title: 'Shoe Dog', editionId: 'OL36316014M' },
  { title: 'Fahrenheit 451', editionId: 'OL26295928M', author: 'Ray Bradbury' },

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
