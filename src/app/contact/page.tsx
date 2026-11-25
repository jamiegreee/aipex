import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
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
        </section>
      </main>
      <Footer />
    </>
  );
}
