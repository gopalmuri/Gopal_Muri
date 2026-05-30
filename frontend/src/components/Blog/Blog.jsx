// src/components/Blog/Blog.jsx
import useScrollAnimation from '../../hooks/useScrollAnimation';
import blogPosts from '../../data/blogPosts';
import './Blog.css';

export default function Blog() {
  const ref = useScrollAnimation();

  return (
    <section id="blog" className="blog section" ref={ref}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title fade-up stagger-child">Thoughts &amp; Articles</h2>
          <p className="section-subtitle fade-up stagger-child">
            Ideas, learnings, and deep dives from my developer journey
          </p>
        </div>

        <div className="blog__grid">
          {blogPosts.map((post, i) => (
            <a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="blog-card fade-up stagger-child"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Image */}
              <div className="blog-card__img-wrap">
                <img src={post.image} alt={post.title} className="blog-card__img" />
                <span className="blog-card__category">{post.category}</span>
              </div>

              {/* Content */}
              <div className="blog-card__body">
                <h3 className="blog-card__title">{post.title}</h3>
                <p className="blog-card__excerpt">{post.excerpt}</p>

                <div className="blog-card__meta">
                  <span className="blog-card__date">{post.date}</span>
                  <span className="blog-card__read-time">⏱ {post.readTime}</span>
                </div>

                {/* Tags */}
                <div className="blog-card__tags">
                  {post.tags.map((tag) => (
                    <span key={tag} className="blog-card__tag">{tag}</span>
                  ))}
                </div>

                <span className="blog-card__cta">Read Article →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
