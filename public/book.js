document.getElementById('book-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const book = {
      title: document.getElementById('title').value,
      author: document.getElementById('author').value,
      genre: document.getElementById('genre').value,
      publication_date: document.getElementById('publication_date').value,
      isbn: document.getElementById('isbn').value
    };
  
    const response = await fetch('/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    });
  
    const result = await response.json();
    alert(result.message);
    loadBooks();
  });
  
  document.getElementById('filter-btn').addEventListener('click', loadBooks);
  
  async function loadBooks() {
    const title = document.getElementById('filter-title').value;
    const author = document.getElementById('filter-author').value;
    const genre = document.getElementById('filter-genre').value;
    
    const query = new URLSearchParams({ title, author, genre });
    
    const response = await fetch('/api/books?' + query.toString());
    const books = await response.json();
  
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';
  
    books.forEach(book => {
      const bookItem = document.createElement('div');
      bookItem.classList.add('book');
      bookItem.innerHTML = `
        <h3>${book.title}</h3>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Genre:</strong> ${book.genre}</p>
        <p><strong>Publication Date:</strong> ${book.publication_date}</p>
        <p><strong>ISBN:</strong> ${book.isbn}</p>
      `;
      bookList.appendChild(bookItem);
    });
  }
  
  document.getElementById('export-json').addEventListener('click', () => {
    window.location.href = '/api/books/export/json';
  });
  
  document.getElementById('export-csv').addEventListener('click', () => {
    window.location.href = '/api/books/export/csv';
  });
  