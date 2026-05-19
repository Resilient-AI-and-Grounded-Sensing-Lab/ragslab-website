type CompactIntroHeadingProps = {
  title: string;
  meta?: string;
};

export function CompactIntroHeading({ title, meta }: CompactIntroHeadingProps) {
  return (
    <>
      {meta ? <p className="intro-meta">{meta}</p> : null}
      <p className="eyebrow intro-title" aria-hidden="true">
        {title}
      </p>
      <h1 className="sr-only">{title}</h1>
    </>
  );
}
