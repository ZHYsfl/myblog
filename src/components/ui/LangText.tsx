export function LangText({ zh, en }: { zh: string; en: string }) {
  return (
    <>
      <span data-lang-block="zh">{zh}</span>
      <span data-lang-block="en">{en}</span>
    </>
  );
}
