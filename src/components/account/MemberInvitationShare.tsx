"use client";

import Image from "next/image";
import { useRef, useState, useSyncExternalStore } from "react";
import {
  membershipInvitationLinks,
  membershipInvitationShare,
  membershipInvitationUrl,
} from "@/lib/membership-invitation";

const subscribe = () => () => {};
const nativeShareAvailable = () => typeof navigator.share === "function";
const noNativeShare = () => false;

function ShareIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 10.5 6.8-4m-6.8 7 6.8 4" /></svg>;
}

export default function MemberInvitationShare({ qrCodeDataUrl }: { qrCodeDataUrl: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const [notice, setNotice] = useState("");
  const canUseNativeShare = useSyncExternalStore(subscribe, nativeShareAvailable, noNativeShare);

  function openSharing() {
    setNotice("");
    dialogRef.current?.showModal();
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(membershipInvitationUrl);
      setNotice("Link copied.");
    } catch {
      linkRef.current?.focus();
      linkRef.current?.select();
      setNotice("Select and copy the application link above.");
    }
  }

  async function share() {
    try {
      // Keep this call in the click handler so mobile browsers retain the
      // user activation needed to open their native sharing sheet.
      await navigator.share(membershipInvitationShare);
      setNotice("");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setNotice("Choose a sharing option below, or copy the link.");
    }
  }

  return (
    <section className="member-invite" aria-labelledby="account-invite-heading">
      <div>
        <p className="label">Community</p>
        <h2 id="account-invite-heading">Invite someone to AIPEX.</h2>
        <p>Know someone working on AI policy? Share an invitation to apply.</p>
      </div>
      <button className="button" type="button" onClick={openSharing}>
        Share invitation <ShareIcon />
      </button>
      <dialog className="member-share-dialog" ref={dialogRef}
        aria-labelledby="account-invite-dialog-title">
        <button className="member-share-close" type="button" aria-label="Close sharing options"
          onClick={() => dialogRef.current?.close()}>×</button>
        <h2 id="account-invite-dialog-title">Invite someone to apply.</h2>
        <div className="member-share-content">
          <div>
            <label className="member-share-label" htmlFor="account-invitation-link">Application link</label>
            <div className="member-share-link">
              <input id="account-invitation-link" type="url" readOnly value={membershipInvitationUrl}
                ref={linkRef} onFocus={(event) => event.currentTarget.select()} />
              <button type="button" onClick={copyLink}>Copy link</button>
            </div>
            <div className="member-share-options" role="group" aria-label="Sharing options">
              {canUseNativeShare && <button className="button member-share-native" type="button" onClick={share}><ShareIcon /> Share…</button>}
              <a href={membershipInvitationLinks.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp <span aria-hidden="true">↗</span></a>
              <a href={membershipInvitationLinks.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
              <a href={membershipInvitationLinks.email}>Email <span aria-hidden="true">↗</span></a>
            </div>
            <p className="member-share-feedback" role="status">{notice}</p>
          </div>
          <div className="member-share-qr">
            <Image src={qrCodeDataUrl} width={208} height={208} unoptimized
              alt="QR code linking to the AIPEX membership application" />
            <p>Scan to apply</p>
            <a href={qrCodeDataUrl} download="aipex-membership-qr.svg">Download QR code ↓</a>
          </div>
        </div>
      </dialog>
    </section>
  );
}
