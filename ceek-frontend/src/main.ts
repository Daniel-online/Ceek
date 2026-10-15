import Alpine from 'alpinejs';
import axios from 'axios'; // For API calls

interface Course {
  id: number;
  title: string;
}

interface ClassItem {
  id: number;
  courseId: number;
  title: string;
  content: string;
}

let courses: Course[] = [];
let classes: ClassItem[] = [];
let currentPage = 1;

Alpine.data('ceekFrontend', () => ({
  courses,
  classes,
  currentPage,

  init() {
    this.fetchCourses();
  },

  async fetchCourses() {
    try {
      const response = await axios.get<Course[]>('/api/courses');
      courses = response.data;
      this.renderCourses();
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  },

  renderCourses(query?: string) {
    const filteredCourses = query
      ? courses.filter((course) => course.title.toLowerCase().includes(query.toLowerCase()))
      : courses;

    document.getElementById('course-list')!.innerHTML = '';
    filteredCourses.forEach((course) => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="#" data-id="${course.id}" class="block hover:text-blue-500">${course.title}</a>`;
      document.getElementById('course-list')!.appendChild(li);
    });

    this.renderClasses();
  },

  async fetchClasses(courseId: number) {
    try {
      const response = await axios.get<ClassItem[]>(`/api/classes?courseId=${courseId}`);
      classes = response.data;
      currentPage = 1;
      this.renderClasses();
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  },

  renderClasses() {
    const start = (currentPage - 1) * 5;
    const end = start + 5;

    document.getElementById('classes')!.innerHTML = '';
    classes.slice(start, end).forEach((classItem) => {
      const div = document.createElement('div');
      div.innerHTML = `
        <h2>${classItem.title}</h2>
        <pre><code class="language-go">${classItem.content}</code></pre>
      `;
      document.getElementById('classes')!.appendChild(div);
    });

    this.renderPagination();
  },

  renderPagination() {
    const totalPages = Math.ceil(classes.length / 5);

    document.getElementById('pagination')!.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement('button');
      button.innerText = `${i}`;
      button.addEventListener('click', () => {
        currentPage = i;
        this.renderClasses();
      });
      document.getElementById('pagination')!.appendChild(button);
    }
  },
}));

Alpine.start();