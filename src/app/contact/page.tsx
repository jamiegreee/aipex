import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Arrow } from "@/components/Brand";
import ContactForm from "@/components/contact/ContactForm";
import { contactFormToken } from "@/lib/contact-server";
import "./contact.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to AIPEX about helping governments and policymakers prepare for advanced artificial intelligence, or share feedback on our public resources.",
};

export default function Contact() {
  return (
    <>
      <Navigation />
      <main id="main">
        <section className="page-intro">
          <div className="container">
            <p className="label">Get in touch</p>
            <h1>Contact</h1>
            <p className="intro-description">
              Preparing for advanced AI? Tell us about the policy questions
              your institution is facing.
            </p>
          </div>
        </section>
        <section className="container contact-grid">
          <div>
            <ContactForm token={contactFormToken()} />
          </div>
          <div className="contact-aside">
            <h2>A decision on your desk?</h2>
            <p>
              Use our practical tools to assess evidence, compare policy options
              or plan oversight. Start without an account and export your work.
            </p>
            <Link className="text-link" href="/tools">
              Explore the tools <Arrow />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
