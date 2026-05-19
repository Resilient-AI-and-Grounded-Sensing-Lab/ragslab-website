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
