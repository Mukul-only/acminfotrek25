import React, { useState, useCallback, useMemo } from "react";
import Header from "../components/Header";
import Wrapper from "../util/Wrapper";
import { motion, AnimatePresence } from "framer-motion";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Add state for form validation feedback
  const [validationMessage, setValidationMessage] = useState({
    type: "",
    text: "",
  });

  // Memoize handlers to prevent recreation
  const handleChange = useCallback(
    (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
      // Clear any previous validation messages when user starts typing
      if (validationMessage.text) {
        setValidationMessage({ type: "", text: "" });
      }
    },
    [formData, validationMessage.text]
  );

  // Mailto handler to open default email client
  const handleMailto = useCallback(() => {
    // Form validation
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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setValidationMessage({
        type: "error",
        text: "Please enter a valid email address.",
      });
      return;
    }

    // Construct mailto URL with encoded parameters
    const subject = encodeURIComponent(formData.subject);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}\n\n---\nSent from INFOTREK'25 Contact Form`
    );

    const mailtoUrl = `mailto:infotrek25@gmail.com?subject=${subject}&body=${body}`;

    // Open default email client
    window.location.href = mailtoUrl;

    // Show success message
    setValidationMessage({
      type: "success",
      text: "Opening your email client... Please send the email from there.",
    });

    // Optional: Clear form after opening email client
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setValidationMessage({ type: "", text: "" });
    }, 3000);
  }, [formData]);

  // Alternative mailto handler with CC/BCC support
  const handleAdvancedMailto = useCallback(() => {
    // Form validation (same as above)
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

    // Construct advanced mailto URL with CC and formatted body
    const subject = encodeURIComponent(`[INFOTREK'25] ${formData.subject}`);
    const body = encodeURIComponent(
      `Dear INFOTREK'25 Team,\n\n` +
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Subject: ${formData.subject}\n\n` +
        `Message:\n${formData.message}\n\n` +
        `Best regards,\n${formData.name}\n\n` +
        `---\nThis message was sent through the INFOTREK'25 website contact form.`
    );

    // You can add CC/BCC if needed:
    // const mailtoUrl = `mailto:infotrek25@gmail.com?cc=support@infotrek.nitt.edu&subject=${subject}&body=${body}`;
    const mailtoUrl = `mailto:infotrek25@gmail.com?subject=${subject}&body=${body}`;

    window.location.href = mailtoUrl;

    setValidationMessage({
      type: "success",
      text: "Email client opened! Please review and send the message.",
    });
  }, [formData]);

  // Memoize static data
  const contactMethods = useMemo(
    () => [
      {
        icon: "📧",
        title: "Email Us",
        description: "Get in touch via email",
        contact: "infotrek25@gmail.com",
        link: "mailto:infotrek25@gmail.com",
      },
      {
        icon: "📱",
        title: "Call Us",
        description: "Speak directly with our team",
        contact: "+91 98765 43210",
        link: "tel:+919876543210",
      },
      {
        icon: "📍",
        title: "Visit Us",
        description: "National Institute of Technology",
        contact: "Tiruchirappalli, Tamil Nadu 620015",
        link: "https://maps.google.com",
      },
    ],
    []
  );

  const socialLinks = useMemo(
    () => [
      {
        icon: "📘",
        platform: "Facebook",
        handle: "@InfotrekNITT",
        link: "https://facebook.com",
      },
      {
        icon: "📸",
        platform: "Instagram",
        handle: "@infotrek_nitt",
        link: "https://instagram.com",
      },
      {
        icon: "🐦",
        platform: "Twitter",
        handle: "@InfotrekNITT",
        link: "https://twitter.com",
      },
      {
        icon: "💼",
        platform: "LinkedIn",
        handle: "INFOTREK NIT Trichy",
        link: "https://linkedin.com",
      },
    ],
    []
  );

  const departments = useMemo(
    () => [
      {
        icon: "🎯",
        department: "Event Coordination",
        email: "infotrek25@gmail.com",
        description: "Event registration and participation queries",
      },
      {
        icon: "🛠️",
        department: "Technical Support",
        email: "infotrek25@gmail.com",
        description: "Technical issues and website support",
      },
      {
        icon: "🎪",
        department: "Sponsorship",
        email: "infotrek25@gmail.com",
        description: "Partnership and sponsorship opportunities",
      },
      {
        icon: "📰",
        department: "Media & PR",
        email: "infotrek25@gmail.com",
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
        <div className="absolute w-32 h-32 rounded-full top-20 left-10 bg-green-500/5 blur-xl"></div>
        <div className="absolute w-40 h-40 rounded-full bottom-10 right-20 bg-blue-500/5 blur-xl"></div>

        <Wrapper>
          <div className="relative px-3 py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 border bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl backdrop-blur-sm border-white/10">
                  <div className="w-12 h-12 text-4xl">📞</div>
                </div>
              </div>
              <h1 className="mb-6 text-5xl font-bold text-transparent md:text-7xl bg-gradient-to-r from-white via-green-200 to-blue-200 bg-clip-text">
                Get In Touch
              </h1>
              <p className="text-xl leading-relaxed text-txt md:text-2xl">
                Have questions about INFOTREK'25? We're here to help!
              </p>
            </div>
          </div>
        </Wrapper>
      </div>

      <Wrapper>
        <div className="px-3 pb-16">
          {/* Quick Contact Methods */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="grid gap-8 md:grid-cols-3">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.link}
                  className="p-8 transition-all duration-300 border group bg-gradient-to-br from-white/5 to-white/10 rounded-3xl backdrop-blur-sm border-white/10 hover:border-white/20 hover:transform hover:scale-105"
                >
                  <div className="space-y-4 text-center">
                    <div className="p-4 mx-auto transition-transform duration-300 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl w-fit group-hover:scale-110">
                      <div className="w-12 h-12 text-4xl">{method.icon}</div>
                    </div>
                    <h3 className="text-xl font-bold text-neutral-200">
                      {method.title}
                    </h3>
                    <p className="text-sm text-txt">{method.description}</p>
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
              <div className="space-y-4">
                <h2 className="text-3xl font-bold md:text-4xl text-neutral-200">
                  Send us a Message
                </h2>
                <p className="text-lg text-txt">
                  Fill out the form below and click "Send Message" to open your
                  email client.
                </p>
              </div>

              {/* Validation Messages */}
              <AnimatePresence>
                {validationMessage.text && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    className={`p-4 rounded-2xl border ${
                      validationMessage.type === "error"
                        ? "bg-red-500/10 border-red-500/30 text-red-300"
                        : "bg-green-500/10 border-green-500/30 text-green-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {validationMessage.type === "error" ? "❌" : "✅"}
                      </div>
                      <div>
                        <div className="font-semibold">
                          {validationMessage.type === "error"
                            ? "Validation Error"
                            : "Success"}
                        </div>
                        <div className="text-sm">{validationMessage.text}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Contact Form - Remove form tag and use div instead */}
              <div className="space-y-6">
                <div className="p-8 space-y-6 border bg-gradient-to-br from-white/5 to-white/10 rounded-3xl backdrop-blur-sm border-white/10">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-300">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-white transition-all duration-300 border bg-white/5 border-white/20 rounded-xl placeholder-neutral-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-300">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-white transition-all duration-300 border bg-white/5 border-white/20 rounded-xl placeholder-neutral-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
                      placeholder="Enter your email address"
                    />
                  </div>

                  {/* Subject Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-300">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-white transition-all duration-300 border bg-white/5 border-white/20 rounded-xl placeholder-neutral-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
                      placeholder="What's this about?"
                    />
                  </div>

                  {/* Message Textarea */}
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
                      className="w-full px-4 py-3 text-white transition-all duration-300 border resize-none bg-white/5 border-white/20 rounded-xl placeholder-neutral-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  {/* Send Message Button */}
                  <button
                    type="button"
                    onClick={handleMailto}
                    disabled={
                      !formData.name.trim() ||
                      !formData.email.trim() ||
                      !formData.subject.trim() ||
                      !formData.message.trim()
                    }
                    className={`w-full py-4 font-bold text-white text-lg transition-all duration-300 rounded-xl ${
                      !formData.name.trim() ||
                      !formData.email.trim() ||
                      !formData.subject.trim() ||
                      !formData.message.trim()
                        ? "bg-neutral-600 cursor-not-allowed opacity-50"
                        : "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 transform"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Send Message 📧
                    </div>
                  </button>

                  {/* Info Text */}
                  <p className="text-xs text-center text-neutral-400">
                    💡 Clicking "Send Message" will open your default email
                    client with the form data pre-filled
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information - Rest of your existing code remains the same */}
            <div className="space-y-8">
              {/* Department Contacts */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold md:text-4xl text-neutral-200">
                  Department Contacts
                </h2>
                <p className="text-lg text-txt">
                  Reach out to specific departments for targeted assistance.
                </p>

                <div className="space-y-4">
                  {departments.map((dept, index) => (
                    <div
                      key={index}
                      className="p-6 transition-all duration-300 border bg-gradient-to-br from-white/5 to-white/10 rounded-2xl backdrop-blur-sm border-white/10 hover:border-white/20"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-blue-500/20">
                          <div className="w-6 h-6 text-xl">{dept.icon}</div>
                        </div>
                        <div className="flex-1">
                          <h3 className="mb-1 font-semibold text-neutral-200">
                            {dept.department}
                          </h3>
                          <p className="mb-2 text-sm text-txt">
                            {dept.description}
                          </p>
                          <a
                            href={`mailto:${dept.email}`}
                            className="text-sm font-medium text-green-400 transition-colors duration-300 hover:text-green-300"
                          >
                            {dept.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              {/* <div className="space-y-6">
                <h2 className="text-2xl font-bold text-neutral-200">
                  Follow Us
                </h2>
                <p className="text-txt">
                  Stay updated with the latest news and announcements.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 transition-all duration-300 border group bg-gradient-to-br from-white/5 to-white/10 rounded-xl backdrop-blur-sm border-white/10 hover:border-white/20 hover:transform hover:scale-105"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{social.icon}</div>
                        <div>
                          <div className="text-sm font-medium text-neutral-200">
                            {social.platform}
                          </div>
                          <div className="text-xs text-txt">
                            {social.handle}
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div> */}

              {/* Quick Response Promise */}
              <div className="p-6 border bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl border-green-500/20">
                <div className="space-y-3 text-center">
                  <div className="text-3xl">⚡</div>
                  <h3 className="text-lg font-bold text-neutral-200">
                    Quick Response Guarantee
                  </h3>
                  <p className="text-sm text-txt">
                    We respond to all inquiries within 24 hours during business
                    days.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto mt-20">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold md:text-5xl text-neutral-200">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-txt">
                Quick answers to common questions
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  question: "When is INFOTREK'25?",
                  answer:
                    "INFOTREK'25 will be held from 24th OCT to 27th OCT. Stay tuned for exact dates!",
                },
                {
                  question: "How do I register for events?",
                  answer:
                    "You can register through our website's events section or contact our event coordination team.",
                },
                {
                  question: "Is accommodation provided?",
                  answer:
                    "Yes, we provide accommodation for outstation participants. Details will be shared upon registration.",
                },
                {
                  question: "What is the registration fee?",
                  answer: "No fee!.",
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="p-6 border bg-gradient-to-br from-white/5 to-white/10 rounded-2xl backdrop-blur-sm border-white/10"
                >
                  <h3 className="mb-3 font-semibold text-neutral-200">
                    ❓ {faq.question}
                  </h3>
                  <p className="text-sm leading-relaxed text-txt">
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
