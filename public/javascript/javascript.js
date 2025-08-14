function truncateSinglePost(p, classSpecifier) {
  const postDiv = p.closest(".featured-post");
  const postId = postDiv?.id || "";
  const slug =
    postDiv
      ?.querySelector("h3")
      ?.textContent.toLowerCase()
      .replace(/\s+/g, "-") || "";

  // Decide readMoreLink once
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
}

function observeTruncation(classSpecifier) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          truncateSinglePost(entry.target, classSpecifier);

          // Stop observing once truncated (performance boost)
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  ); // 10% visible triggers

  // Attach observer to all posts in this section
  document
    .querySelectorAll(`.${classSpecifier} .post-content`)
    .forEach((post) => {
      observer.observe(post);
    });
}

function applyTruncation() {
  observeTruncation("home-div");
  observeTruncation("all-div");
}

window.addEventListener("load", applyTruncation);
window.addEventListener("resize", applyTruncation);
