document.addEventListener('DOMContentLoaded', async function () {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');

        const response = await fetch(`http://localhost:3000/posts/${postId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch post');
        }
        const post = await response.json();

        document.getElementById('post-title').textContent = post.title;
        document.getElementById('post-content').textContent = post.content;
        document.getElementById('post-author').textContent = post.author;

        // Display comments
        const commentList = document.getElementById('commentList');
        post.comments.forEach(comment => {
            const li = document.createElement('li');
            li.textContent = comment.text;
            commentList.appendChild(li);
        });

        // Comment form submission
        document.getElementById('commentForm').addEventListener('submit', async function (e) {
            e.preventDefault();

            const commentText = document.getElementById('commentText').value;
            if (commentText.trim() === '') {
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/posts/${postId}/comments`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: commentText })
                });

                if (!response.ok) {
                    throw new Error('Failed to add comment');
                }

                const newComment = await response.json();
                const li = document.createElement('li');
                li.textContent = newComment.text;
                commentList.appendChild(li);

                document.getElementById('commentText').value = ''; // Clear input
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        });
    } catch (error) {
        console.error('Error fetching post:', error);
    }
});


document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    const response = await fetch(`http://localhost:3000/posts/${postId}`);
    const post = await response.json();

    document.getElementById('post-title').textContent = post.title;
    document.getElementById('post-content').textContent = post.content;
    document.getElementById('post-author').textContent = post.author;

    // Fetch and display comments
    fetchComments(postId);

    // Add comment event listener
    document.getElementById('commentForm').addEventListener('submit', function (e) {
        e.preventDefault();
        addComment(postId);
    });
});

async function fetchComments(postId) {
    const response = await fetch(`http://localhost:3000/posts/${postId}/comments`);
    const comments = await response.json();
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = '';

    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        commentElement.innerHTML = `
            <p><strong>${comment.author}</strong> :</p>
            <p>${comment.content}</p>
            <p><small>Posted on ${new Date(comment.created_at).toLocaleString()}</small></p>
        `;
        commentsList.appendChild(commentElement);
    });
}

async function addComment(postId) {
    const author = document.getElementById('commentAuthor').value;
    const content = document.getElementById('commentContent').value;

    await fetch(`http://localhost:3000/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, content })
    });

    document.getElementById('commentForm').reset();
    fetchComments(postId); // Refresh comments list
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