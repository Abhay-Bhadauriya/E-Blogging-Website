document.addEventListener('DOMContentLoaded', fetchPosts);

async function fetchPosts() {
    try {
        const response = await fetch('http://localhost:3000/posts');
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        const posts = await response.json();
        const tbody = document.querySelector('#postsTable tbody');
        tbody.innerHTML = ''; // Clear existing rows
        posts.forEach(post => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><a href="post.html?id=${post.id}">${post.title}</a></td>
                <td>${post.author}</td>
                <td class="actions">
                    <button onclick="editPost(${post.id})">Edit</button>
                    <button onclick="deletePost(${post.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        // Optionally, display a user-friendly message on the page
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Failed to fetch posts. Please try again later.';
        document.getElementById('app').appendChild(errorMessage);
    }
}

document.getElementById('postForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const author = document.getElementById('author').value;

    try {
        const response = await fetch('http://localhost:3000/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, author })
        });

        if (!response.ok) {
            throw new Error('Failed to create post');
        }

        fetchPosts(); // Refresh the posts list
    } catch (error) {
        console.error('Error creating post:', error);
    }
});

async function deletePost(postId) {
    try {
        const response = await fetch(`http://localhost:3000/posts/${postId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete post');
        }

        fetchPosts(); // Refresh the posts list
    } catch (error) {
        console.error('Error deleting post:', error);
    }
}

async function editPost(postId) {
    const newTitle = prompt('Enter new title:');
    const newContent = prompt('Enter new content:');
    const newAuthor = prompt('Enter new author:');

    if (newTitle && newContent && newAuthor) {
        try {
            const response = await fetch(`http://localhost:3000/posts/${postId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTitle, content: newContent, author: newAuthor })
            });

            if (!response.ok) {
                throw new Error('Failed to edit post');
            }

            fetchPosts(); // Refresh the posts list
        } catch (error) {
            console.error('Error editing post:', error);
        }
    }
}

const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// Load dark mode preference on page load
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}
