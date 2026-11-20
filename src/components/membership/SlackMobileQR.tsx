// QR code for https://theaipex.org/community/slack, the members-only Slack
// gateway. It encodes the gateway, never the raw invitation, so scanning it
// still needs a signed-in, approved account. Generated once with segno
// (error correction M, 29x29 modules); regenerate only if the path changes.
const QR_SIZE = 29;
const QR_PATH =
  "M0 0.5h7m1 0h1m6 0h1m1 0h4m1 0h7m-29 1h1m5 0h1m1 0h2m1 0h2m1 0h1m1 0h1m1 0h1m3 0h1m5 0h1m-29 1h1m1 0h3m1 0h1m5 0h2m1 0h2m1 0h1m3 0h1m1 0h3m1 0h1m-29 1h1m1 0h3m1 0h1m1 0h1m2 0h1m5 0h1m4 0h1m1 0h3m1 0h1m-29 1h1m1 0h3m1 0h1m2 0h2m2 0h4m2 0h1m2 0h1m1 0h3m1 0h1m-29 1h1m5 0h1m2 0h1m1 0h2m1 0h1m3 0h3m1 0h1m5 0h1m-29 1h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7m-21 1h2m1 0h5m1 0h3m-20 1h1m1 0h2m1 0h3m4 0h3m1 0h3m3 0h1m2 0h1m1 0h2m-28 1h1m1 0h1m1 0h1m3 0h1m1 0h2m3 0h4m1 0h4m3 0h1m-29 1h2m1 0h4m3 0h1m1 0h1m1 0h1m1 0h3m3 0h1m3 0h2m-28 1h1m1 0h1m2 0h1m1 0h1m1 0h2m1 0h3m1 0h1m1 0h1m1 0h3m5 0h1m-29 1h1m1 0h1m2 0h3m1 0h1m2 0h1m2 0h1m1 0h1m7 0h2m-27 1h6m2 0h3m1 0h2m1 0h5m1 0h2m3 0h3m-29 1h1m3 0h4m4 0h1m1 0h1m1 0h1m1 0h2m2 0h2m2 0h3m-29 1h4m1 0h1m1 0h3m1 0h1m1 0h1m1 0h2m2 0h1m1 0h1m1 0h2m2 0h1m-27 1h1m4 0h7m2 0h1m2 0h1m2 0h1m1 0h3m1 0h1m-26 1h2m3 0h1m5 0h1m1 0h1m1 0h1m2 0h1m2 0h1m1 0h3m-28 1h1m3 0h3m1 0h1m1 0h2m3 0h3m2 0h1m3 0h1m1 0h1m-25 1h4m4 0h2m3 0h1m1 0h1m1 0h1m1 0h1m1 0h2m1 0h1m-26 1h3m2 0h4m3 0h1m3 0h2m1 0h7m-19 1h1m3 0h3m1 0h3m1 0h1m3 0h5m-29 1h7m1 0h1m4 0h1m2 0h2m1 0h2m1 0h1m1 0h2m1 0h1m-28 1h1m5 0h1m1 0h2m1 0h2m2 0h1m2 0h1m1 0h1m3 0h2m2 0h1m-29 1h1m1 0h3m1 0h1m2 0h1m2 0h1m1 0h1m2 0h1m2 0h5m1 0h1m-27 1h1m1 0h3m1 0h1m1 0h1m5 0h2m1 0h2m2 0h1m1 0h3m2 0h1m-29 1h1m1 0h3m1 0h1m1 0h1m1 0h1m3 0h1m3 0h1m1 0h2m1 0h1m2 0h1m1 0h1m-29 1h1m5 0h1m2 0h1m5 0h1m2 0h1m1 0h3m1 0h2m1 0h1m-28 1h7m1 0h1m1 0h2m2 0h3m1 0h1m1 0h1m4 0h1m1 0h1";

// Hidden on small screens, where the Slack button above already opens it.
export default function SlackMobileQR() {
  return (
    <div className="slack-mobile">
      <svg
        className="slack-mobile-code"
        viewBox={`-3 -3 ${QR_SIZE + 6} ${QR_SIZE + 6}`}
        role="img"
        aria-label="QR code that opens the AIPEX Slack community"
        shapeRendering="crispEdges"
      >
        <rect x={-3} y={-3} width={QR_SIZE + 6} height={QR_SIZE + 6} />
        <path d={QR_PATH} />
      </svg>
      <div>
        <p className="label">On your phone</p>
        <h3 id="slack-mobile-heading">Join on your mobile.</h3>
        <p>
          Scan the code with your phone&rsquo;s camera to open the AIPEX Slack. If you&rsquo;re not
          signed in on your phone, we&rsquo;ll ask you to sign in first.
        </p>
      </div>
    </div>
  );
}
