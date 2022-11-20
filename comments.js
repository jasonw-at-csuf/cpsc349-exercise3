// https://jsonplaceholder.typicode.com/guide/

async function downloadPosts(page = 1) {
  const postsURL = `https://jsonplaceholder.typicode.com/posts?_page=${page}`;
  const response = await fetch(postsURL);
  const articles = await response.json();
  return articles;
}

async function downloadComments(postId) {
  const commentsURL = `https://jsonplaceholder.typicode.com/posts/${postId}/comments`;
  const response = await fetch(commentsURL);
  const comments = await response.json();
  return comments;
}

async function getUserName(userId) {
  const userURL = `https://jsonplaceholder.typicode.com/users/${userId}`;
  const response = await fetch(userURL);
  const user = await response.json();
  return user.name;
}

function getArticleId(comments) {
  const article = comments.previousElementSibling;
  const data = article.dataset;
  return data.postId;
}

const details = document.getElementsByTagName("details");
for (const detail of details) {
  detail.addEventListener("toggle", async (event) => {
    if (detail.open) {
      const asides = detail.getElementsByTagName("aside");
      const commentsWereDownloaded = asides.length > 0;
      if (!commentsWereDownloaded) {
        const articleId = getArticleId(detail);
        const comments = await downloadComments(articleId);
        console.log(comments);
      }
    }
  });
}

const posts = await downloadPosts(2);
console.log(posts);

for (const post of posts) {
  // create articles
  const article = document.createElement("article");
  article.setAttribute("data-post-id", post.id);

  const h2 = document.createElement("h2");
  h2.textContent = post.title;
  article.appendChild(h2);

  const span = document.createElement("span");
  span.textContent = await getUserName(post.userId);

  const aside = document.createElement("aside");
  aside.setAttribute("class", "author");
  aside.appendChild(span);
  article.appendChild(aside);

  const p = (document.createElement("p").innerHTML = post.body.replaceAll(
    "\n",
    "<br>"
  ));
  article.append(p);

  // create details
  const details = document.createElement("details");

  const section = document.createElement("section");
  details.appendChild(section);

  const header = document.createElement("header");
  section.appendChild(header);

  const h3 = document.createElement("h3");
  h3.textContent = "Comments";
  header.appendChild(h3);

  const summary = document.createElement("summary");
  summary.textContent = "See what our readers had to say...";
  details.appendChild(summary);

  document.querySelector("main").appendChild(article);
  document.querySelector("main").appendChild(details);
}

for (const detail of document.getElementsByTagName("details")) {
  detail.addEventListener("toggle", async () => {
    if (detail.open && detail.getElementsByTagName("aside")) {
      const id = getArticleId(detail);
      const comments = await downloadComments(id);

      for (const section of document.getElementsByTagName("section")) {
        for (const comment of comments) {
          const aside = document.createElement("aside");

          const body = document.createElement("p");
          body.innerHTML = comment.body.replaceAll("\n", "<br>");
          aside.appendChild(body);

          const small = document.createElement("small");
          small.textContent = comment.name;
          const subtext = document.createElement("p");

          subtext.appendChild(small);
          aside.appendChild(subtext);
          section.appendChild(aside);
        }
      }
    }
  });
}
