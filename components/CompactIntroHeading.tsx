type CompactIntroHeadingProps = {
  title: string;
  meta?: string;
};

export function CompactIntroHeading({ title, meta }: CompactIntroHeadingProps) {
  return (
    <>
      {meta ? <p className="intro-meta">{meta}</p> : null}
      <h1 className="intro-title">{title}</h1>
    </>
  );
}
