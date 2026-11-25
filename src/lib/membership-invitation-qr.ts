import qrcode from "qrcode-generator";
import { membershipInvitationUrl } from "./membership-invitation";

/** Generate locally for the public application, never a private Slack invite.
 * Four white modules around every side remain in the downloaded SVG too. */
export function membershipInvitationQr(): { svg: string; dataUrl: string } {
  const qr = qrcode(0, "M");
  qr.addData(membershipInvitationUrl, "Byte");
  qr.make();
  const svg = qr.createSvgTag({ cellSize: 8, margin: 32, scalable: true });
  return { svg, dataUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` };
}
