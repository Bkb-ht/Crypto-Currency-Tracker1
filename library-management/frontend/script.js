const API_BASE_URL = 'http://localhost:3002/api';
let currentUser = null;
let authToken = null;

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('addBookForm').addEventListener('submit', handleAddBook);
    document.getElementById('borrowForm').addEventListener('submit', handleBorrow);
}

function checkAuth() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');
    
    if (token && user) {
        authToken = token;
        currentUser = JSON.parse(user);
        showMainContent();
        loadDashboard();
    } else {
        showLogin();
    }
}

function showLogin() {
    document.getElementById('loginContainer').style.display = 'flex';
    document.getElementById('registerContainer').style.display = 'none';
    document.getElementById('mainContent').style.display = 'none';
}

function showRegister() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('registerContainer').style.display = 'flex';
    document.getElementById('mainContent').style.display = 'none';
}

function showMainContent() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('registerContainer').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
            email,
            password
        });
        
        authToken = response.data.token;
        currentUser = response.data.member;
        
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showMainContent();
        loadDashboard();
        showAlert('Login successful!', 'success');
    } catch (error) {
        showAlert(error.response?.data?.message || 'Login failed', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('registerName').value,
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value,
        phone: document.getElementById('registerPhone').value,
        address: document.getElementById('registerAddress').value,
        membershipType: document.getElementById('registerMembershipType').value
    };
    
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, formData);
        
        authToken = response.data.token;
        currentUser = response.data.member;
        
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showMainContent();
        loadDashboard();
        showAlert('Registration successful!', 'success');
    } catch (error) {
        showAlert(error.response?.data?.message || 'Registration failed', 'error');
    }
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    authToken = null;
    currentUser = null;
    showLogin();
}

function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    document.getElementById(sectionName).classList.add('active');
    event.target.classList.add('active');
    
    switch(sectionName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'books':
            loadBooks();
            break;
        case 'members':
            loadMembers();
            break;
        case 'transactions':
            loadTransactions();
            break;
    }
}

async function loadDashboard() {
    try {
        const [booksRes, membersRes, transactionsRes] = await Promise.all([
            axios.get(`${API_BASE_URL}/books`),
            axios.get(`${API_BASE_URL}/members`, { headers: { Authorization: `Bearer ${authToken}` } }),
            axios.get(`${API_BASE_URL}/transactions`, { headers: { Authorization: `Bearer ${authToken}` } })
        ]);
        
        const totalBooks = booksRes.data.total || 0;
        const totalMembers = membersRes.data.total || 0;
        const activeTransactions = transactionsRes.data.transactions.filter(t => t.status === 'active').length;
        const overdueTransactions = transactionsRes.data.transactions.filter(t => t.status === 'overdue').length;
        
        document.getElementById('totalBooks').textContent = totalBooks;
        document.getElementById('totalMembers').textContent = totalMembers;
        document.getElementById('borrowedBooks').textContent = activeTransactions;
        document.getElementById('overdueBooks').textContent = overdueTransactions;
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

async function loadBooks() {
    try {
        const response = await axios.get(`${API_BASE_URL}/books`);
        const books = response.data.books || [];
        
        const tbody = document.getElementById('booksTableBody');
        tbody.innerHTML = '';
        
        books.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.isbn}</td>
                <td>${book.category}</td>
                <td>${book.availableCopies}/${book.totalCopies}</td>
                <td>
                    <button class="btn btn-secondary" onclick="editBook('${book._id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteBook('${book._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading books:', error);
    }
}

async function loadMembers() {
    try {
        const response = await axios.get(`${API_BASE_URL}/members`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        const members = response.data.members || [];
        
        const tbody = document.getElementById('membersTableBody');
        tbody.innerHTML = '';
        
        members.forEach(member => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${member.name}</td>
                <td>${member.email}</td>
                <td>${member.membershipId}</td>
                <td>${member.membershipType}</td>
                <td>
                    <span class="status-badge ${member.isActive ? 'status-active' : 'status-overdue'}">
                        ${member.isActive ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-secondary" onclick="editMember('${member._id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading members:', error);
    }
}

async function loadTransactions() {
    try {
        const response = await axios.get(`${API_BASE_URL}/transactions`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        const transactions = response.data.transactions || [];
        
        const tbody = document.getElementById('transactionsTableBody');
        tbody.innerHTML = '';
        
        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.member?.name || 'N/A'}</td>
                <td>${transaction.book?.title || 'N/A'}</td>
                <td>${new Date(transaction.borrowDate).toLocaleDateString()}</td>
                <td>${new Date(transaction.dueDate).toLocaleDateString()}</td>
                <td>${transaction.returnDate ? new Date(transaction.returnDate).toLocaleDateString() : '-'}</td>
                <td>
                    <span class="status-badge status-${transaction.status}">
                        ${transaction.status}
                    </span>
                </td>
                <td>$${transaction.fine || 0}</td>
                <td>
                    ${transaction.status === 'active' ? 
                        `<button class="btn btn-success" onclick="returnBook('${transaction._id}')">
                            <i class="fas fa-undo"></i> Return
                        </button>` : 
                        '-'
                    }
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading transactions:', error);
    }
}

function showAddBookModal() {
    document.getElementById('addBookModal').style.display = 'block';
}

function showBorrowModal() {
    loadMembersForBorrow();
    loadBooksForBorrow();
    document.getElementById('borrowModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

async function handleAddBook(e) {
    e.preventDefault();
    
    const bookData = {
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        isbn: document.getElementById('bookISBN').value,
        category: document.getElementById('bookCategory').value,
        publisher: document.getElementById('bookPublisher').value,
        publishedYear: parseInt(document.getElementById('bookYear').value),
        totalCopies: parseInt(document.getElementById('bookCopies').value),
        description: document.getElementById('bookDescription').value
    };
    
    try {
        await axios.post(`${API_BASE_URL}/books`, bookData, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        closeModal('addBookModal');
        loadBooks();
        showAlert('Book added successfully!', 'success');
        document.getElementById('addBookForm').reset();
    } catch (error) {
        showAlert(error.response?.data?.message || 'Failed to add book', 'error');
    }
}

async function loadMembersForBorrow() {
    try {
        const response = await axios.get(`${API_BASE_URL}/members`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        const members = response.data.members || [];
        
        const select = document.getElementById('borrowMember');
        select.innerHTML = '<option value="">Select Member</option>';
        
        members.forEach(member => {
            if (member.isActive) {
                const option = document.createElement('option');
                option.value = member._id;
                option.textContent = `${member.name} (${member.membershipId})`;
                select.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Error loading members:', error);
    }
}

async function loadBooksForBorrow() {
    try {
        const response = await axios.get(`${API_BASE_URL}/books`);
        const books = response.data.books || [];
        
        const select = document.getElementById('borrowBook');
        select.innerHTML = '<option value="">Select Book</option>';
        
        books.forEach(book => {
            if (book.availableCopies > 0) {
                const option = document.createElement('option');
                option.value = book._id;
                option.textContent = `${book.title} by ${book.author} (${book.availableCopies} available)`;
                select.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Error loading books:', error);
    }
}

async function handleBorrow(e) {
    e.preventDefault();
    
    const borrowData = {
        memberId: document.getElementById('borrowMember').value,
        bookId: document.getElementById('borrowBook').value,
        dueDate: document.getElementById('borrowDueDate').value
    };
    
    try {
        await axios.post(`${API_BASE_URL}/transactions/borrow`, borrowData, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        closeModal('borrowModal');
        loadTransactions();
        loadDashboard();
        showAlert('Book borrowed successfully!', 'success');
        document.getElementById('borrowForm').reset();
    } catch (error) {
        showAlert(error.response?.data?.message || 'Failed to borrow book', 'error');
    }
}

async function returnBook(transactionId) {
    try {
        const response = await axios.post(`${API_BASE_URL}/transactions/return/${transactionId}`, {}, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        loadTransactions();
        loadDashboard();
        
        const fine = response.data.fine;
        if (fine > 0) {
            showAlert(`Book returned successfully! Fine: $${fine}`, 'success');
        } else {
            showAlert('Book returned successfully!', 'success');
        }
    } catch (error) {
        showAlert(error.response?.data?.message || 'Failed to return book', 'error');
    }
}

async function deleteBook(bookId) {
    if (confirm('Are you sure you want to delete this book?')) {
        try {
            await axios.delete(`${API_BASE_URL}/books/${bookId}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            
            loadBooks();
            showAlert('Book deleted successfully!', 'success');
        } catch (error) {
            showAlert(error.response?.data?.message || 'Failed to delete book', 'error');
        }
    }
}

function searchBooks() {
    const searchTerm = document.getElementById('bookSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#booksTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function searchMembers() {
    const searchTerm = document.getElementById('memberSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#membersTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function filterBooks() {
    const category = document.getElementById('categoryFilter').value;
    const rows = document.querySelectorAll('#booksTableBody tr');
    
    rows.forEach(row => {
        const categoryCell = row.cells[3].textContent;
        row.style.display = !category || categoryCell === category ? '' : 'none';
    });
}

function filterTransactions() {
    const status = document.getElementById('statusFilter').value;
    const rows = document.querySelectorAll('#transactionsTableBody tr');
    
    rows.forEach(row => {
        const statusCell = row.cells[5].textContent.toLowerCase();
        row.style.display = !status || statusCell.includes(status) ? '' : 'none';
    });
}

function toggleNav() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.toggle('active');
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    document.body.insertBefore(alertDiv, document.body.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

function fillDemoData() {
    document.getElementById('registerName').value = 'John Smith';
    document.getElementById('registerEmail').value = 'john.smith@email.com';
    document.getElementById('registerPassword').value = 'password123';
    document.getElementById('registerPhone').value = '+1-555-0123';
    document.getElementById('registerAddress').value = '123 Main Street, New York, NY 10001';
    document.getElementById('registerMembershipType').value = 'public';
    
    showAlert('Demo data filled! Phone and address are now optional.', 'success');
}

window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const eyeIcon = document.getElementById(inputId + 'Eye');
    
    if (input.type === 'password') {
        input.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}