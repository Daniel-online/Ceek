import Alpine from 'alpinejs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-go'; // Add other languages as needed
import Fuse from 'fuse.js';

// ... existing code ...

window.Alpine = Alpine;

Alpine.data('ceekFrontend', () => ({
  courses: [],
  classes: [],
  currentPage: 1,
  itemsPerPage: 5,
  searchQuery: '',
  fuseSearch: null,

  init() {
    this.fuseSearch = new Fuse(this.courses, {
      keys: ['title'],
      threshold: 0.6,
    });

    // Fetch courses and classes data (You'll need to implement the fetch logic)
    // For now, let's assume we have fetched data and assigned it to `this.courses` and `this.classes`
  },

  paginatedClasses() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.classes.slice(start, end);
  },

  search() {
    if (!this.searchQuery.trim()) {
      return this.courses;
    }

    return this.fuseSearch.search(this.searchQuery).map((result) => result.item);
  },

  nextPage() {
    if (this.currentPage < Math.ceil(this.classes.length / this.itemsPerPage)) {
      this.currentPage++;
    }
  },

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  },
}));

Alpine.start();

// ... existing code ...

document.addEventListener('htmx:afterSettle', () => {
  Alpine.compile(document.body);
});