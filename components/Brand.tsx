export default function Brand({ wordmark = false }: { wordmark?: boolean }) {
  return (
    <a className="brand" href="/" aria-label="Blueprint Group home">
      <img
        src="/assets/blueprint-logo-smooth.png"
        width="112"
        height="112"
        alt="Blueprint Group of Companies, established 2010"
      />
      {wordmark ? (
        <img className="brand-wordmark" src="/assets/Blueprint_Wordmark.svg" alt="" />
      ) : (
        <span>
          <strong>BLUEPRINT</strong>
          <small>Group of Companies</small>
        </span>
      )}
    </a>
  );
}
