import React, { useState, useCallback, useMemo } from "react";
import Header from "../components/Header";
import Wrapper from "../util/Wrapper";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  XCircle,
  MessageSquare,
  Users,
  Wrench,
  Handshake,
  Newspaper,
  Zap,
} from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [validationMessage, setValidationMessage] = useState({
    type: "",
    text: "",
  });

  const handleChange = useCallback(
    (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
      if (validationMessage.text) {
        setValidationMessage({ type: "", text: "" });
      }
    },
    [formData, validationMessage.text]
  );

  const handleMailto = useCallback(() => {
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      setValidationMessage({
        type: "error",
        text: "Please fill in all required fields before sending.",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setValidationMessage({
        type: "error",
        text: "Please enter a valid email address.",
      });
      return;
    }

    const subject = encodeURIComponent(formData.subject);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}\n\n---\nSent from INFOTREK'25 Contact Form`
    );

    const mailtoUrl = `mailto:infotrek25@gmail.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;

    setValidationMessage({
      type: "success",
      text: "Opening your email client... Please send the email from there.",
    });

    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setValidationMessage({ type: "", text: "" });
    }, 3000);
  }, [formData]);

  const contactMethods = useMemo(
    () => [
      {
        icon: Mail,
        title: "Email Us",
        description: "Get in touch via email",
        contact: "infotrek25@gmail.com",
        link: "mailto:infotrek25@gmail.com",
      },
      {
        icon: Phone,
        title: "Call Us",
        description: "Speak directly with our team",
        contact: "+91 96963 73283",
        link: "tel:+9696373283",
      },
      {
        icon: MapPin,
        title: "Visit Us",
        description: "National Institute of Technology",
        contact: "Tiruchirappalli, Tamil Nadu 620015",
        link: "https://maps.google.com",
      },
    ],
    []
  );

  const departments = useMemo(
    () => [
      {
        icon: Users,
        department: "Event Coordination",
        email: "8427733664",
        description: "Event registration and participation queries",
      },
      {
        icon: Wrench,
        department: "Technical Support",
        email: "8210685291",
        description: "Technical issues and website support",
      },
      {
        icon: Handshake,
        department: "Sponsorship",
        email: "9696373283",
        description: "Partnership and sponsorship opportunities",
      },
      {
        icon: Newspaper,
        department: "Media & PR",
        email: "9711807668",
        description: "Press releases and media inquiries",
      },
    ],
    []
  );

  return (
    <div className="min-h-screen text-white bg-background">
      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-blue-600/10"></div>
        <Wrapper>
          <div className="relative px-3 py-20 md:py-28">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 border bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl backdrop-blur-sm border-white/10">
                  <Phone className="w-12 h-12 text-green-400" />
                </div>
              </div>
              <h1 className="mb-6 text-5xl font-bold text-transparent md:text-7xl bg-gradient-to-r from-white via-green-200 to-blue-200 bg-clip-text">
                Get In Touch
              </h1>
              <p className="text-lg leading-relaxed text-neutral-400 md:text-xl">
                Have questions about INFOTREK'25? We're here to help!
              </p>
            </div>
          </div>
        </Wrapper>
      </div>

      <Wrapper>
        <div className="px-3 pb-20 mt-5">
          {/* Quick Contact Methods */}
          <div className="max-w-6xl mx-auto mb-20">
            <div className="grid gap-8 md:grid-cols-3">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.link}
                  className="p-8 transition-all duration-300 border group bg-gradient-to-br from-white/5 to-white/10 rounded-3xl backdrop-blur-md border-white/10 hover:border-white/20 hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/10"
                >
                  <div className="space-y-4 text-center">
                    <div className="flex items-center justify-center p-4 mx-auto bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                      <method.icon className="w-10 h-10 text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-200">
                      {method.title}
                    </h3>
                    <p className="text-sm text-neutral-400">
                      {method.description}
                    </p>
                    <p className="font-medium text-green-400">
                      {method.contact}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-16 mx-auto max-w-7xl lg:grid-cols-2">
            {/* Contact Form */}
            <div className="space-y-8">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold md:text-4xl text-neutral-200">
                  Send us a Message
                </h2>
                <p className="text-neutral-400">
                  Fill out the form below and click "Send Message" to open your
                  email client.
                </p>
              </div>

              {/* Validation Messages */}
              <AnimatePresence>
                {validationMessage.text && (
                  <motion.div
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className={`p-4 rounded-xl border flex items-center gap-3 ${
                      validationMessage.type === "error"
                        ? "bg-red-500/10 border-red-500/30 text-red-300"
                        : "bg-green-500/10 border-green-500/30 text-green-300"
                    }`}
                  >
                    {validationMessage.type === "error" ? (
                      <XCircle className="w-6 h-6" />
                    ) : (
                      <CheckCircle className="w-6 h-6" />
                    )}
                    <div className="text-sm">{validationMessage.text}</div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Contact Form */}
              <div className="p-8 space-y-6 border bg-gradient-to-br from-white/5 to-white/10 rounded-3xl backdrop-blur-md border-white/10 shadow-lg shadow-black/5">
                {["name", "email", "subject"].map((field) => (
                  <div key={field} className="space-y-2">
                    <label className="block text-sm font-medium capitalize text-neutral-300">
                      {field} *
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      required
                      value={(formData)[field]}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-white transition-all border bg-white/5 border-white/20 rounded-xl placeholder-neutral-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
                      placeholder={`Enter your ${field}`}
                    />
                  </div>
                ))}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-300">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-white transition-all border resize-none bg-white/5 border-white/20 rounded-xl placeholder-neutral-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="button"
                  onClick={handleMailto}
                  disabled={
                    !formData.name.trim() ||
                    !formData.email.trim() ||
                    !formData.subject.trim() ||
                    !formData.message.trim()
                  }
                  className={`w-full py-4 font-semibold flex items-center justify-center gap-2 text-white text-lg transition-all rounded-xl ${
                    !formData.name.trim() ||
                    !formData.email.trim() ||
                    !formData.subject.trim() ||
                    !formData.message.trim()
                      ? "bg-neutral-600 cursor-not-allowed opacity-50"
                      : "bg-gradient-to-r from-green-500 to-blue-500 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/20"
                  }`}
                >
                  <Send className="w-5 h-5" /> Send Message
                </button>

                <p className="text-xs text-center text-neutral-500">
                  Clicking "Send Message" will open your default email client
                  with the form data pre-filled.
                </p>
              </div>
            </div>

            {/* Department Contacts */}
            <div className="space-y-8">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold md:text-4xl text-neutral-200">
                  Contacts
                </h2>
                <p className="text-neutral-400">
                  Reach out to specific departments for targeted assistance.
                </p>
              </div>

              <div className="space-y-4">
                {departments.map((dept, index) => (
                  <div
                    key={index}
                    className="p-6 transition-all duration-300 border bg-gradient-to-br from-white/5 to-white/10 rounded-2xl backdrop-blur-md border-white/10 hover:scale-[1.01] hover:shadow-lg hover:shadow-green-500/10"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/20 to-blue-500/20">
                        <dept.icon className="w-6 h-6 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 font-semibold text-neutral-200">
                          {dept.department}
                        </h3>
                        <p className="mb-2 text-sm text-neutral-400">
                          {dept.description}
                        </p>
                        <a
                          href={`https://wa.me/${dept.email}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-green-400 hover:text-green-300"
                        >
                          +91-{dept.email}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Response Promise */}
              <div className="p-6 border bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl border-green-500/20 text-center">
                <Zap className="w-8 h-8 mx-auto text-green-400 mb-3" />
                <h3 className="text-lg font-bold text-neutral-200">
                  Quick Response Guarantee
                </h3>
                <p className="text-sm text-neutral-400">
                  We respond to all inquiries within 24 hours during business
                  days.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto mt-24">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-4xl font-bold md:text-5xl text-neutral-200">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-neutral-400">
                Quick answers to common questions
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  question: "When is INFOTREK'25?",
                  answer:
                    "INFOTREK'25 will be held from 24th October to 27th October. Stay tuned for any updates on exact schedules!",
                },
                {
                  question: "How do I register for events?",
                  answer:
                    "You can register through the 'Events' section on our website or by contacting our event coordination team directly.",
                },
                {
                  question: "What is the registration fee?",
                  answer:
                    "There is no registration fee — participation is completely free!",
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="p-6 border bg-gradient-to-br from-white/5 to-white/10 rounded-2xl backdrop-blur-md border-white/10 hover:shadow-md hover:shadow-green-500/10 transition-all"
                >
                  <h3 className="mb-2 font-semibold text-neutral-200 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-green-400" />{" "}
                    {faq.question}
                  </h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default ContactPage;
