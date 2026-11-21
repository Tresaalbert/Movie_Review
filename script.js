
const movies = [
    {
        id: 1,
        title: "Dune: Part Two",
        year: 2024,
        genre: "Sci-Fi",
        rating: 8.5,
        poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
        backdrop: "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
        description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family."
    },
    {
        id: 2,
        title: "Interstellar",
        year: 2014,
        genre: "Sci-Fi",
        rating: 8.7,
        poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        backdrop: "https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
        description: "A team of explorers travels beyond this galaxy to discover whether mankind has a future among the stars."
    },
    {
        id: 3,
        title: "Oppenheimer",
        year: 2023,
        genre: "Drama",
        rating: 8.3,
        poster: "https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg",
        backdrop: "https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg",
        description: "The story of J. Robert Oppenheimer and his role in developing the atomic bomb."
    },
    {
        id: 4,
        title: "Spider-Man: Across the Spider-Verse",
        year: 2023,
        genre: "Adventure",
        rating: 8.6,
        poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
        backdrop: "https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg",
        description: "Miles Morales travels across the multiverse and meets a team of Spider-People protecting its existence."
    },
    {
        id: 5,
        title: "The Dark Knight",
        year: 2008,
        genre: "Action",
        rating: 9.0,
        poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        backdrop: "https://image.tmdb.org/t/p/original/hqkIcbrOHL86UncnHIsHVcVmzue.jpg",
        description: "Batman faces the Joker, a criminal mastermind who plunges Gotham City into chaos."
    },
    {
        id: 6,
        title: "Avengers: Endgame",
        year: 2019,
        genre: "Action",
        rating: 8.4,
        poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
        backdrop: "https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
        description: "The Avengers assemble for one final mission to reverse the devastating actions of Thanos."
    },
    {
        id: 7,
        title: "Joker",
        year: 2019,
        genre: "Drama",
        rating: 8.2,
        poster: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
        backdrop: "https://image.tmdb.org/t/p/original/hO7KbdvGOtDdeg0W4Y5nKEHeDDh.jpg",
        description: "A struggling comedian slowly descends into madness in a city that has abandoned him."
    },
    {
        id: 8,
        title: "Top Gun: Maverick",
        year: 2022,
        genre: "Action",
        rating: 8.2,
        poster: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
        backdrop: "https://image.tmdb.org/t/p/original/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg",
        description: "Maverick returns to train a new generation of pilots for a dangerous mission."
    }
];

const movieGrid = document.getElementById("movieGrid");
const searchInput = document.getElementById("searchInput");
const movieCount = document.getElementById("movieCount");
const emptyMessage = document.getElementById("emptyMessage");
const modal = document.getElementById("movieModal");
const movieDetails = document.getElementById("movieDetails");

let selectedGenre = "All";
let currentMovie = null;
let selectedRating = 0;

const STORAGE_KEY = "frame_movie_reviews";

function getReviews() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
        return {};
    }
}

function saveReviews(reviews) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

function getMovieReviews(movieId) {
    return getReviews()[movieId] || [];
}

function getAverageRating(movie) {
    const reviews = getMovieReviews(movie.id);

    if (!reviews.length) {
        return movie.rating.toFixed(1);
    }

    const total = reviews.reduce(
        (sum, review) => sum + Number(review.rating), 0
    );

    return (total / reviews.length).toFixed(1);
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

function renderMovies() {
    const search = searchInput.value.toLowerCase().trim();

    const filtered = movies.filter(movie => {
        const matchesSearch =
            movie.title.toLowerCase().includes(search);

        const matchesGenre =
            selectedGenre === "All" ||
            movie.genre === selectedGenre;

        return matchesSearch && matchesGenre;
    });

    movieCount.textContent = `${filtered.length} MOVIES`;

    emptyMessage.hidden = filtered.length !== 0;

    movieGrid.innerHTML = filtered.map(movie => {
        const reviews = getMovieReviews(movie.id);

        return `
            <article class="movie-card"
                     data-id="${movie.id}"
                     tabindex="0"
                     role="button"
                     aria-label="View ${escapeHTML(movie.title)}">

                <div class="poster-wrap">
                    <img
                        src="${movie.poster}"
                        alt="${escapeHTML(movie.title)} poster"
                        loading="lazy"
                        onerror="this.style.opacity='0.2'">

                    <span class="rating-badge">
                        ★ ${getAverageRating(movie)}
                    </span>
                </div>

                <div class="movie-info">
                    <h3>${escapeHTML(movie.title)}</h3>

                    <div class="movie-meta">
                        ${movie.year} · ${escapeHTML(movie.genre)}
                    </div>

                    <div class="movie-bottom">
                        <span class="review-count">
                            ${reviews.length} Reviews
                        </span>

                        <span class="view-btn">VIEW DETAILS →</span>
                    </div>
                </div>
            </article>
        `;
    }).join("");

    movieGrid.querySelectorAll(".movie-card").forEach(card => {
        const open = () => openMovie(Number(card.dataset.id));

        card.addEventListener("click", open);

        card.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                open();
            }
        });
    });
}

// Search movies
searchInput.addEventListener("input", renderMovies);

// Genre filtering
document.querySelectorAll(".category").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelector(".category.active")
            ?.classList.remove("active");

        button.classList.add("active");
        selectedGenre = button.dataset.genre;

        renderMovies();
    });
});

// Open movie details
function openMovie(id) {
    currentMovie = movies.find(movie => movie.id === id);

    if (!currentMovie) return;

    selectedRating = 0;

    renderMovieDetails();

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function renderMovieDetails() {
    const movie = currentMovie;
    const reviews = getMovieReviews(movie.id);

    movieDetails.innerHTML = `
        <img
            class="detail-banner"
            src="${movie.backdrop}"
            alt="${escapeHTML(movie.title)}">

        <div class="detail-body">

            <span class="eyebrow">
                ${escapeHTML(movie.genre)} · ${movie.year}
            </span>

            <h2>${escapeHTML(movie.title)}</h2>

            <div class="detail-rating">
                ★ ${getAverageRating(movie)} / 10
                <span style="color:#888;font-size:12px">
                    · ${reviews.length} community reviews
                </span>
            </div>

            <p>${escapeHTML(movie.description)}</p>

            <form class="review-form" id="reviewForm">

                <h3>Write Your Review</h3>

                <label for="reviewName">Your Name</label>
                <input
                    id="reviewName"
                    type="text"
                    maxlength="60"
                    placeholder="Enter your name"
                    required>

                <label>Your Rating</label>

                <div class="star-input" id="starInput">
                    ${[1,2,3,4,5].map(n => `
                        <button type="button"
                                data-star="${n}"
                                aria-label="${n} stars">★</button>
                    `).join("")}
                </div>

                <label for="reviewComment">Your Review</label>
                <textarea
                    id="reviewComment"
                    maxlength="1000"
                    minlength="5"
                    placeholder="Share your opinion about this movie..."
                    required></textarea>

                <button class="submit-review" type="submit">
                    SUBMIT REVIEW
                </button>

                <p id="reviewMessage" aria-live="polite"></p>
            </form>

            <div class="review-list">
                <h3>Audience Reviews (${reviews.length})</h3>

                ${reviews.length ? reviews.map(review => `
                    <div class="review-item">
                        <strong>${escapeHTML(review.name)}</strong>
                        <span>${"★".repeat(review.rating)}${"☆".repeat(5-review.rating)}</span>
                        <p>${escapeHTML(review.comment)}</p>
                        <small>${escapeHTML(review.date)}</small>
                    </div>
                `).join("") : `
                    <p>No reviews yet. Be the first to review this movie!</p>
                `}
            </div>

        </div>
    `;

    // Star selection
    const starButtons = document.querySelectorAll("[data-star]");

    starButtons.forEach(button => {
        button.addEventListener("click", () => {
            selectedRating = Number(button.dataset.star);

            starButtons.forEach(star => {
                star.classList.toggle(
                    "selected",
                    Number(star.dataset.star) <= selectedRating
                );
            });
        });
    });

    // Review submission
    document.getElementById("reviewForm")
        .addEventListener("submit", submitReview);
}

// Save review in browser
function submitReview(event) {
    event.preventDefault();

    const name = document.getElementById("reviewName")
        .value.trim();

    const comment = document.getElementById("reviewComment")
        .value.trim();

    const message = document.getElementById("reviewMessage");

    if (!selectedRating) {
        message.style.color = "#f0525b";
        message.textContent = "Please select a star rating.";
        return;
    }

    if (comment.length < 5) {
        message.style.color = "#f0525b";
        message.textContent = "Please write a longer review.";
        return;
    }

    const reviews = getReviews();

    if (!reviews[currentMovie.id]) {
        reviews[currentMovie.id] = [];
    }

    reviews[currentMovie.id].unshift({
        name: name,
        rating: selectedRating,
        comment: comment,
        date: new Date().toLocaleDateString()
    });

    saveReviews(reviews);

    // Refresh movie information and reviews
    renderMovies();
    renderMovieDetails();
}

// Close modal
function closeMovie() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

document.getElementById("closeModal")
    .addEventListener("click", closeMovie);

modal.addEventListener("click", event => {
    if (event.target === modal) closeMovie();
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.classList.contains("open")) {
        closeMovie();
    }
});

// Initial display
renderMovies();
