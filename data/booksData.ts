export interface BookEntry {
  title: string
  author?: string
  coverUrl?: string
}

const booksData: (string | BookEntry)[] = [
  'Animal Farm',
  'Atomic Habits',
  'The Old Man and the Sea',
  // Add more book titles here
  // Or use custom format:
  // {
  //   title: 'Book Title',
  //   author: 'Author Name',
  //   coverUrl: 'https://your-image-url.jpg'
  // }
]

export default booksData
