import { useState } from "react";
import { submitEnquiry } from "../api";
import type { ContactFormData } from "../types";
import "./ContactPage.css";

type FormStatus = "idle" | "submitting" | "success" | "error";

const ENQUIRY_TYPES = [
  { value: "GENERAL", label: "General" },
  { value: "PURCHASE", label: "Purchase enquiry" },
  { value: "COMMISSION", label: "Commission" },
  { value: "PRESS", label: "Press" },
] as const;

const EMPTY_FORM: ContactFormData = {
  name: "",
  email: "",
  enquiry_type: "GENERAL",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormData>(EMPTY_FORM);
  const [status, setStatus] = useState<FormStatus>("idle");

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      await submitEnquiry(form);
      setStatus("success");
      setForm(EMPTY_FORM);
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="page contact-page">
      <div className="content-column">
        <h1 className="contact-page__title">Contact</h1>

        {status === "success" ? (
          <div className="contact-page__success">
            <p>Thank you — your message has been sent.</p>
            <button
              className="contact-page__reset"
              onClick={() => setStatus("idle")}
            >
              Send another message
            </button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="contact-form__field">
              <label htmlFor="name" className="contact-form__label">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="contact-form__input"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>

            <div className="contact-form__field">
              <label htmlFor="email" className="contact-form__label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="contact-form__input"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div className="contact-form__field">
              <label htmlFor="enquiry_type" className="contact-form__label">
                Enquiry type
              </label>
              <div className="contact-form__select-wrapper">
                <select
                  id="enquiry_type"
                  name="enquiry_type"
                  className="contact-form__select"
                  value={form.enquiry_type}
                  onChange={handleChange}
                >
                  {ENQUIRY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="contact-form__field">
              <label htmlFor="message" className="contact-form__label">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                className="contact-form__textarea"
                value={form.message}
                onChange={handleChange}
                required
                rows={7}
              />
            </div>

            {status === "error" && (
              <p className="contact-form__error">
                Something went wrong — please try again or email directly.
              </p>
            )}

            <button
              type="submit"
              className="contact-form__submit"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Sending…" : "Send message"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
