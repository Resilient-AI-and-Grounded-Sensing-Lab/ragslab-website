Courses are edited here, not in React components.

To edit the dummy AI policy course, update:

  content/courses/ai-policy-f26.yaml

Each YAML file represents one course and automatically gets a static course page.
The slug controls the course URL path, so:

  slug: ai-policy-f26

corresponds to:

  /ai-policy-f26/

Slide links can point to PDFs or external URLs. For local slide PDFs, place files
under public/slides/<course-slug>/ and link them like this:

  href: /slides/ai-policy-f26/week-01.pdf

Each dates block can have multiple slide links. Add an item under slides for each
slide deck, in the order it should appear:

  slides:
    - title: August 31 slides
      href: /slides/ai-policy-f26/august-31.pdf
    - title: September 2 slides
      href: https://example.com/september-2-slides

Use href: null for a deck that is not posted yet; its title appears as plain text.
Omitting slides or using slides: [] shows "Posted after class".
The original single-entry format (slides with title and href) is also supported.
