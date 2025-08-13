function truncateByHeight(classSpecifier) {
  const posts = document.querySelectorAll(`.${classSpecifier} .post-content`);

  posts.forEach((p) => {
    const postDiv = p.closest(".featured-post");
    const postId = postDiv?.id || "";
    const slug =
      postDiv
        ?.querySelector("h3")
        ?.textContent.toLowerCase()
        .replace(/\s+/g, "-") || "";

    // Decide readMoreLink once, in correct scope
    let readMoreLink;
    if (classSpecifier === "home-div") {
      readMoreLink = `<a href="/${postId}/${slug}" class="read-more">... read more</a>`;
    } else if (classSpecifier === "all-div") {
      readMoreLink = `<a href="/posts/${postId}/${slug}" class="read-more">... read more</a>`;
    } else {
      readMoreLink = `<a href="#" class="read-more">... read more</a>`;
    }

    // Store original text if not already stored
    if (!p.dataset.fulltext) {
      p.dataset.fulltext = p.textContent.trim();
    }

    // Reset text before measuring
    p.textContent = p.dataset.fulltext;

    // Reserve space for "... read more"
    const reserveLength = 40;
    if (p.textContent.length > reserveLength) {
      p.textContent = p.textContent.slice(0, -reserveLength).trim();
    }

    // Trim until it fits height
    while (p.scrollHeight > p.clientHeight) {
      p.textContent = p.textContent.slice(0, -1).trim();
    }

    // Append read more if truncated
    if (p.textContent.length < p.dataset.fulltext.length) {
      p.innerHTML = `${p.textContent}${readMoreLink}`;
    }
  });
}

// Run for multiple classes on load & resize
function applyTruncation() {
  truncateByHeight("home-div");
  truncateByHeight("all-div");
}

window.addEventListener("load", applyTruncation);
window.addEventListener("resize", applyTruncation);
