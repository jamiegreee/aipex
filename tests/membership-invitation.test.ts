import assert from "node:assert/strict";
import test from "node:test";
import {
  canShareMembershipInvitation,
  membershipInvitationLinks,
  membershipInvitationShare,
  membershipInvitationText,
  membershipInvitationTitle,
  membershipInvitationUrl,
} from "../src/lib/membership-invitation";
import { membershipInvitationQr } from "../src/lib/membership-invitation-qr";

test("sharing is shown only for current members, including the existing reviewer exception", () => {
  const access = (application: Parameters<typeof canShareMembershipInvitation>[0]["application"], reviewer = false, membershipUnavailable = false) =>
    canShareMembershipInvitation({ application, reviewer, membershipUnavailable });

  assert.equal(access(null), false);
  for (const status of ["pending", "declined", "unknown", "", "Approved"]) {
    assert.equal(access({ status }), false, status);
  }
  assert.equal(access({ status: "approved", archived_at: null }), true);
  assert.equal(access({ status: "approved" }), true, "legacy application types omit the archive field");
  assert.equal(access({ status: "approved", archived_at: "2026-11-25T00:00:00Z" }), false);
  assert.equal(access(null, true), true, "reviewers already count as members without applying");
  assert.equal(access({ status: "pending" }, true), true);
  assert.equal(access({ status: "approved" }, false, true), false);
  assert.equal(access(null, true, true), false, "a status lookup failure never enables sharing");
});

test("malformed runtime flags fail closed rather than treating truthy values as authorization", () => {
  assert.equal(canShareMembershipInvitation({
    application: null, reviewer: "true", membershipUnavailable: false,
  } as never), false);
  assert.equal(canShareMembershipInvitation({
    application: { status: "approved" }, reviewer: false,
  } as never), false);
});

test("the native share invites an application without identity, referral tracking or Slack access", () => {
  assert.deepEqual(membershipInvitationShare, {
    title: "Invitation to AIPEX",
    text: membershipInvitationText,
    url: "https://theaipex.org/membership",
  });
  assert.match(membershipInvitationText, /apply/i);
  assert.match(membershipInvitationText, /application.*reviewed/i);
  assert.equal(membershipInvitationText.includes(membershipInvitationUrl), false, "native share supplies the URL separately");
  const url = new URL(membershipInvitationUrl);
  assert.equal(url.search, "");
  assert.equal(url.hash, "");
  assert.equal(url.username, "");
  assert.equal(url.password, "");
  assert.doesNotMatch(JSON.stringify(membershipInvitationShare), /slack|shared_invite|green|user_id|token/i);
});

test("email, WhatsApp and LinkedIn share only the same public application destination", () => {
  const body = `${membershipInvitationText}\n\n${membershipInvitationUrl}`;
  const email = new URL(membershipInvitationLinks.email);
  assert.equal(email.protocol, "mailto:");
  assert.equal(email.pathname, "", "the member chooses the recipient");
  assert.equal(email.searchParams.get("subject"), membershipInvitationTitle);
  assert.equal(email.searchParams.get("body"), body);
  assert.deepEqual([...email.searchParams.keys()].sort(), ["body", "subject"]);

  const whatsapp = new URL(membershipInvitationLinks.whatsapp);
  assert.equal(whatsapp.origin, "https://wa.me");
  assert.equal(whatsapp.pathname, "/");
  assert.equal(whatsapp.searchParams.get("text"), body);
  assert.deepEqual([...whatsapp.searchParams.keys()], ["text"]);

  const linkedin = new URL(membershipInvitationLinks.linkedin);
  assert.equal(linkedin.origin, "https://www.linkedin.com");
  assert.equal(linkedin.pathname, "/sharing/share-offsite/");
  assert.equal(linkedin.searchParams.get("url"), membershipInvitationUrl);
  assert.deepEqual([...linkedin.searchParams.keys()], ["url"]);
});

test("the QR is a self-contained, high-contrast SVG with four clear modules around every edge", () => {
  const { svg, dataUrl } = membershipInvitationQr();
  const prefix = "data:image/svg+xml;charset=utf-8,";
  assert.equal(dataUrl.startsWith(prefix), true);
  assert.equal(decodeURIComponent(dataUrl.slice(prefix.length)), svg);
  assert.match(svg, /xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.match(svg, /viewBox="0 0 296 296"/);
  assert.match(svg, /fill="white"/);
  assert.match(svg, /fill="black"/);
  assert.doesNotMatch(svg, /<script|href=|<image|<foreignObject/i);

  const cells = [...svg.matchAll(/M(\d+),(\d+)l8,0 0,8 -8,0 0,-8z/g)]
    .map(([, x, y]) => [Number(x), Number(y)]);
  assert.ok(cells.length > 100, "the SVG contains a populated QR matrix");
  for (const [x, y] of cells) {
    assert.ok(x >= 32 && y >= 32 && x + 8 <= 296 - 32 && y + 8 <= 296 - 32);
  }
  assert.equal(Math.min(...cells.map(([x]) => x)), 32);
  assert.equal(Math.min(...cells.map(([, y]) => y)), 32);
});
