
document.addEventListener('DOMContentLoaded', () => {
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});

 // const toggleBtn = document.getElementById("menu-toggle");
 // const navLinks = document.getElementById("nav-links");

 // toggleBtn.addEventListener("click", () => {
 //   toggleBtn.classList.toggle("open");
 //   navLinks.classList.toggle("open");
 // });


  const toggleBtn = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const overlay = document.getElementById("nav-overlay");

  // Function to open menu
  const openMenu = () => {
    navLinks.classList.add("open");
    toggleBtn.classList.add("open");
    overlay.classList.add("active");
  };

  // Function to close menu
  const closeMenu = () => {
    navLinks.classList.remove("open");
    toggleBtn.classList.remove("open");
    overlay.classList.remove("active");
  };

  // Toggle menu on toggleBtn click
  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent bubbling up to document
    const isOpen = navLinks.classList.contains("open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when clicking outside (including overlay)
  document.addEventListener("click", (e) => {
    const isClickInsideMenu = navLinks.contains(e.target);
    const isClickOnToggle = toggleBtn.contains(e.target);

    if (!isClickInsideMenu && !isClickOnToggle) {
      closeMenu();
    }
  });


window.addEventListener("DOMContentLoaded", () => {
    // Get the Google Apps Script Web App URL here
    const APP_URL = "https://script.google.com/macros/s/AKfycbx9CiJ7cSpWfu9vke6ZAuVJ0KpZtiamhfSrERy8bvPPJYfIQmZAxJ35WMhpZk4Jsw6_9A/exec";

    const id = new URLSearchParams(window.location.search).get("id");

    if (id) {
        // Logic for view-blog.html (single blog post)
        fetch(`${APP_URL}?id=${id}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(blog => {
                console.log("Fetched blog:", blog);

                const container = document.getElementById("blog");
                if (!container) {
                    console.error("Error: 'blog' div not found in view-blog.html");
                    return;
                }

                if (!blog || blog.error || !blog.ID) {
                    container.innerHTML = "<p>Blog not found.</p>";
                    return;
                }

                document.title = blog.Title; // Set page title
                container.innerHTML = `
                    <div class="hero">
                        <h1 style="color: #FFD700; font-family: cursive;">${blog.Title}</h1>
                        <p style="font-style: italic;">${blog.Summary}</p>
                    </div>
                    <div class="blog-page">
                      <div class="blog-header">
                          <img src="${blog.ImageLink}" class="blog-hero-img" alt="Blog Image" />
                      </div>
                      <div class="blog-content">
                          ${blog.Content}
                      </div>
                    </div>
                `;
            })
            .catch(err => {
                console.error("Blog fetch error:", err);
                const container = document.getElementById("blog");
                if (container) {
                    container.innerHTML = `<p>Error loading blog post. Please try again later.</p>`;
                }
            });

    } else {
        // Logic for blog.html (list of all blog posts)
        const container = document.getElementById("blog-container");
        if (!container) {
            console.error("Error: 'blog-container' div not found in blog.html");
            return;
        }

        fetch(APP_URL) // Fetch all blogs
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (!Array.isArray(data) || data.length === 0) {
                    container.innerHTML = "<p>No blog posts found.</p>";
                    return;
                }

                data.forEach(post => {
                    if (!post.ID || !post.Title || !post.Summary || !post.ImageLink) {
                        console.warn("Skipping malformed blog post:", post);
                        return; // Skip posts that don't have essential data
                    }

                    container.innerHTML += `
                        <div class="blog-card" data-aos="fade-up" data-aos-delay="100">
                            <img src="${post.ImageLink}" alt="Blog Thumbnail" class="blog-thumb">
                            <div class="blog-info">
                                <h2>${post.Title}</h2>
                                <p>${post.Summary}</p>
                                <a href="view-blog.html?id=${post.ID}" class="read-more">Read More →</a>
                            </div>
                        </div>
                    `;
                });
            })
            .catch(err => {
                console.error("Summary fetch error:", err);
                if (container) {
                    container.innerHTML = `<p>Error loading blog summaries. Please try again later.</p>`;
                }
            });
    }
});