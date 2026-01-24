"use client";

import { createClient } from "@/utils/supabase/client";
import BackgroundAmbience from "@/app/components/BackgroundAmbience";
import confetti from "canvas-confetti";
import Link from "next/link";
import { ChangeEvent, useState } from "react";

type RSVPForm = {
  first_name: string;
  last_name: string;
  attending: boolean | null;
  plusOne: boolean;
  message: string;
  interested_in_shuttle: boolean;
  interested_in_hotel_block: boolean;
  plusOne_first_name: string;
  plusOne_last_name: string;
};

export default function RSVP() {
  const [formData, setFormData] = useState<RSVPForm>({
    first_name: "",
    last_name: "",
    attending: null,
    plusOne: false,
    message: "",
    interested_in_shuttle: false,
    interested_in_hotel_block: false,
    plusOne_first_name: "",
    plusOne_last_name: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleRadio = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "attending" ? value === "true" : value,
    }));
  };

  const toggleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.first_name || !formData.last_name) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.attending === null || formData.attending === undefined) {
      setError("Please select whether you will be attending");
      return;
    }

    if (
      formData.plusOne &&
      (!formData.plusOne_first_name || !formData.plusOne_last_name)
    ) {
      setError("Please complete your plus one's information");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = await createClient();
      const hostFullName = `${formData.first_name.trim()} ${formData.last_name.trim()}`.trim();
      const rsvpMessage = formData.message.trim();

      const { error: mainGuestError } = await supabase
        .from("Guest List")
        .insert({
          first_name: formData.first_name,
          last_name: formData.last_name,
          attending: formData.attending,
          interested_in_shuttle: formData.interested_in_shuttle,
          interested_in_hotel_block: formData.interested_in_hotel_block,
          has_plus_one: formData.attending ? formData.plusOne : false,
          is_plus_one: false,
          plus_one_host: null,
          message: rsvpMessage ? rsvpMessage : null,
        });

      if (mainGuestError) throw new Error(mainGuestError.message);

      // Insert plus one if applicable
      if (formData.attending && formData.plusOne) {
        const { error: plusOneError } = await supabase
          .from("Guest List")
          .insert({
            first_name: formData.plusOne_first_name,
            last_name: formData.plusOne_last_name,
            attending: true,
            interested_in_shuttle: formData.interested_in_shuttle,
            interested_in_hotel_block: formData.interested_in_hotel_block,
            has_plus_one: false,
            is_plus_one: true,
            plus_one_host: hostFullName || formData.first_name.trim() || null,
            message: null,
          });

        if (plusOneError) throw new Error(plusOneError.message);
      }

      setIsSubmitted(true);
      confetti({
        particleCount: 160,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#a3a3ff", "#ffcd19", "#ffffff"],
      });
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 0.15, y: 0.7 },
        });
      }, 300);
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0.85, y: 0.7 },
        });
      }, 300);
    } catch (err) {
      console.error("Error submitting RSVP:", err);
      setError(err instanceof Error ? err.message : "Failed to submit RSVP");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 relative selection:bg-periwinkle-500/30 overflow-hidden">
      {/* Background Ambience */}
      <BackgroundAmbience />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
        <div className="rounded-3xl bg-white/5 border border-white/10 p-8 md:p-12 backdrop-blur-md transition-all hover:border-periwinkle-500/30 w-full max-w-2xl mb-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-periwinkle-300 via-white to-periwinkle-300 pb-2 tracking-tight mb-4 animate-fade-in-down">
              RSVP
            </h1>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-transparent via-periwinkle-500 to-transparent rounded-full mb-6"></div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-200 mb-6">
              We&apos;re counting down to the big day, and we hope you can make it! 🥂
            </h2>
            <div className="flex flex-col gap-4 whitespace-break-spaces text-left md:text-center">
              <p className="font-light text-periwinkle-100/90 text-lg">
                Please RSVP by March 15th to confirm your attendance! Let us know if you&apos;ll be bringing a guest, if you&apos;d like to reserve a room in our hotel block, and if you&apos;re planning to use the shuttle service.
              </p>
              <p className="font-light text-periwinkle-200/80">
                A complimentary shuttle will pick up guests from the hotel and take them to the venue before the ceremony, and later that evening, it will bring everyone back to the hotel. If you plan to enjoy drinks at the reception, we strongly encourage taking advantage of the shuttle so everyone can get back safely!
              </p>
              <p className="font-light text-periwinkle-200/80">
                Don&apos;t forget to leave us a message if you&apos;d like! To confirm your RSVP status, please visit the <Link href="/guest-list" className="text-periwinkle-300 hover:text-white underline decoration-periwinkle-500/50 hover:decoration-white transition-all">Guest List</Link> page to search for your name.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white/5 border border-white/10 p-8 md:p-10 backdrop-blur-md transition-all hover:border-periwinkle-500/30 w-full max-w-lg shadow-2xl">
          {isSubmitted ? (
            <div className="text-center py-8">
              <svg
                className="w-20 h-20 text-green-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-3xl font-bold mb-4 text-white">Thank You!</h2>
              <p className="text-periwinkle-200 text-lg">
                Your RSVP has been received. We&apos;re looking forward to
                celebrating with you! 🎉
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-900/40 border border-red-500/30 text-red-200 rounded-xl text-center font-medium backdrop-blur-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-semibold text-periwinkle-200 mb-2 pl-1"
                  >
                    First Name*
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 text-white border border-white/10 rounded-xl focus:outline-none focus:border-periwinkle-500/50 focus:ring-1 focus:ring-periwinkle-500/50 transition-all placeholder-white/20 hover:bg-white/10"
                    placeholder="Jane"
                  />
                </div>

                <div>
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-semibold text-periwinkle-200 mb-2 pl-1"
                  >
                    Last Name*
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 text-white border border-white/10 rounded-xl focus:outline-none focus:border-periwinkle-500/50 focus:ring-1 focus:ring-periwinkle-500/50 transition-all placeholder-white/20 hover:bg-white/10"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-periwinkle-200 mb-3 pl-1">
                  Will you be attending?*
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex-1 relative cursor-pointer group">
                    <input
                      type="radio"
                      name="attending"
                      value="true"
                      checked={formData.attending === true}
                      onChange={toggleRadio}
                      required
                      className="peer sr-only"
                    />
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5 peer-checked:bg-periwinkle-900/30 peer-checked:border-periwinkle-500/50 transition-all group-hover:bg-white/10 text-center">
                      <span className="text-gray-200 peer-checked:text-periwinkle-200 font-medium">Yes, I&apos;ll be there! 🥳</span>
                    </div>
                  </label>
                  <label className="flex-1 relative cursor-pointer group">
                    <input
                      type="radio"
                      name="attending"
                      value="false"
                      checked={formData.attending === false}
                      onChange={toggleRadio}
                      required
                      className="peer sr-only"
                    />
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5 peer-checked:bg-red-900/20 peer-checked:border-red-500/30 transition-all group-hover:bg-white/10 text-center">
                      <span className="text-gray-200 peer-checked:text-red-200 font-medium">No, I can&apos;t make it 😢</span>
                    </div>
                  </label>
                </div>
              </div>

              {formData.attending && (
                <div className="animate-fade-in-up space-y-6">
                  <div className="space-y-3 bg-white/5 rounded-2xl p-4 border border-white/5">
                    <label className="block text-sm font-semibold text-periwinkle-200 mb-1 pl-1">
                      Additional Options
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-white/5 transition-colors">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          name="plusOne"
                          checked={formData.plusOne}
                          onChange={toggleCheckbox}
                          className="peer h-5 w-5 rounded border-white/20 bg-black/40 text-periwinkle-500 focus:ring-offset-0 focus:ring-periwinkle-500/50 transition-all cursor-pointer"
                        />
                      </div>
                      <span className="text-gray-200 group-hover:text-white transition-colors select-none">I&apos;m bringing a plus one</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-white/5 transition-colors">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          name="interested_in_shuttle"
                          checked={formData.interested_in_shuttle}
                          onChange={toggleCheckbox}
                          className="peer h-5 w-5 rounded border-white/20 bg-black/40 text-periwinkle-500 focus:ring-offset-0 focus:ring-periwinkle-500/50 transition-all cursor-pointer"
                        />
                      </div>
                      <span className="text-gray-200 group-hover:text-white transition-colors select-none">
                        I&apos;m interested in shuttle transportation 🚌
                      </span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-white/5 transition-colors">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          name="interested_in_hotel_block"
                          checked={formData.interested_in_hotel_block}
                          onChange={toggleCheckbox}
                          className="peer h-5 w-5 rounded border-white/20 bg-black/40 text-periwinkle-500 focus:ring-offset-0 focus:ring-periwinkle-500/50 transition-all cursor-pointer"
                        />
                      </div>
                      <span className="text-gray-200 group-hover:text-white transition-colors select-none">
                        I&apos;m interested in the hotel block 🏨
                      </span>
                    </label>
                  </div>

                  {formData.plusOne && (
                    <div className="border-t border-white/10 pt-6 animate-fade-in-up">
                      <h3 className="text-lg font-semibold mb-4 text-periwinkle-200 flex items-center gap-2">
                        Plus One Information <span className="text-xl">👥</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="plusOne_first_name"
                            className="block text-sm font-semibold text-periwinkle-200 mb-2 pl-1"
                          >
                            First Name*
                          </label>
                          <input
                            type="text"
                            id="plusOne_first_name"
                            name="plusOne_first_name"
                            value={formData.plusOne_first_name}
                            onChange={handleInputChange}
                            required={formData.plusOne}
                            className="w-full px-4 py-3 bg-white/5 text-white border border-white/10 rounded-xl focus:outline-none focus:border-periwinkle-500/50 focus:ring-1 focus:ring-periwinkle-500/50 transition-all placeholder-white/20 hover:bg-white/10"
                            placeholder="Guest's First Name"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="plusOne_last_name"
                            className="block text-sm font-semibold text-periwinkle-200 mb-2 pl-1"
                          >
                            Last Name*
                          </label>
                          <input
                            type="text"
                            id="plusOne_last_name"
                            name="plusOne_last_name"
                            value={formData.plusOne_last_name}
                            onChange={handleInputChange}
                            required={formData.plusOne}
                            className="w-full px-4 py-3 bg-white/5 text-white border border-white/10 rounded-xl focus:outline-none focus:border-periwinkle-500/50 focus:ring-1 focus:ring-periwinkle-500/50 transition-all placeholder-white/20 hover:bg-white/10"
                            placeholder="Guest's Last Name"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-periwinkle-200 mb-2 pl-1"
                >
                  Message (Optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 text-white border border-white/10 rounded-xl focus:outline-none focus:border-periwinkle-500/50 focus:ring-1 focus:ring-periwinkle-500/50 transition-all placeholder-white/20 hover:bg-white/10 resize-none"
                  placeholder="Leave a note for the couple... ❤️"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-periwinkle-600 hover:bg-periwinkle-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-periwinkle-400 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-periwinkle-900/20"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : "Submit RSVP 💌"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
