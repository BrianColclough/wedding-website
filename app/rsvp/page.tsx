"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import confetti from "canvas-confetti";

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
    <div className="container mx-auto bg-black text-white px-4 py-8">
      <div className="w-full flex items-center justify-center pb-8">
        <div className="backdrop-blur-sm bg-black/30 rounded-xl shadow-lg border border-periwinkle-700/30 p-8 w-full max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">RSVP</h1>
            <div className="w-16 h-0.5 mx-auto bg-periwinkle-400 rounded-full mb-3"></div>
            <h2 className="text-lg font-semibold text-gray-200 mb-2">
              We&apos;re counting down to the big day, and we hope you can make it!
            </h2>
            <div className="flex flex-col gap-2 whitespace-break-spaces">
              <p className="font-light text-periwinkle-200">
                Please RSVP by March 1st to confirm your attendance! Let us know if you&apos;ll be bringing a guest, if you&apos;d like to reserve a room in our hotel block, and if you&apos;re planning to use the shuttle service.
              </p>
              <p className="font-light text-periwinkle-200">
                A complimentary shuttle will pick up guests from the hotel and take them to the venue before the ceremony, and later that evening, it will bring everyone back to the hotel. If you plan to enjoy drinks at the reception, we strongly encourage taking advantage of the shuttle so everyone can get back safely!
              </p>
              <p className="font-light text-periwinkle-200">
                Don&apos;t forget to leave us a message if you&apos;d like! To confirm your RSVP status, please visit the <Link href="/guest-list" className="text-periwinkle-200 hover:text-periwinkle-300">Guest List</Link> page to search for your name.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="backdrop-blur-sm bg-black/30 rounded-xl shadow-lg border border-periwinkle-700/30 p-8 w-full max-w-lg mx-auto -translate-y-4">
        {isSubmitted ? (
          <div className="text-center py-8">
            <svg
              className="w-16 h-16 text-green-400 mx-auto mb-4 drop-shadow-lg"
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
            <h2 className="text-2xl font-semibold mb-2 text-white">Thank You!</h2>
            <p className="text-periwinkle-200">
              Your RSVP has been received. We&apos;re looking forward to
              celebrating with you!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-900/30 border border-red-400/40 text-red-300 rounded-lg text-center font-semibold">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-semibold text-periwinkle-200 mb-1"
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
                  className="w-full px-3 py-2 bg-black/40 text-white border border-periwinkle-700/50 rounded-md placeholder-periwinkle-300/40"
                  placeholder="First Name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-semibold text-periwinkle-200 mb-1"
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
                className="w-full px-3 py-2 bg-black/40 text-white border border-periwinkle-700/50 rounded-md placeholder-periwinkle-300/40"
                placeholder="Last Name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-periwinkle-200 mb-1">
                Will you be attending?*
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="attending"
                    value="true"
                    checked={formData.attending === true}
                    onChange={toggleRadio}
                    required
                    tabIndex={0}
                    className="h-4 w-4 text-periwinkle-400 bg-black/40 border-periwinkle-700/50 focus:ring-periwinkle-400 focus:ring-2"
                  />
                  <span className="ml-2 text-periwinkle-100 font-medium">Yes, I&apos;ll be there!</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="attending"
                    value="false"
                    checked={formData.attending === false}
                    onChange={toggleRadio}
                    required
                    tabIndex={0}
                    className="h-4 w-4 text-periwinkle-400 bg-black/40 border-periwinkle-700/50 focus:ring-periwinkle-400 focus:ring-2"
                  />
                  <span className="ml-2 text-periwinkle-100 font-medium">No, I won&apos;t be able to attend</span>
                </label>
              </div>
            </div>

            {formData.attending && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-periwinkle-200 mb-1">
                    Additional Options
                  </label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center block">
                      <input
                        type="checkbox"
                        name="plusOne"
                        checked={formData.plusOne}
                        onChange={toggleCheckbox}
                        tabIndex={0}
                        className="h-4 w-4 text-periwinkle-400 bg-black/40 border-periwinkle-700/50 focus:ring-periwinkle-400 focus:ring-2 rounded"
                      />
                      <span className="ml-2 text-periwinkle-100">I&apos;m bringing a plus one</span>
                    </label>

                    <label className="inline-flex items-center block">
                      <input
                        type="checkbox"
                        name="interested_in_shuttle"
                        checked={formData.interested_in_shuttle}
                        onChange={toggleCheckbox}
                        tabIndex={0}
                        className="h-4 w-4 text-periwinkle-400 bg-black/40 border-periwinkle-700/50 focus:ring-periwinkle-400 focus:ring-2 rounded"
                      />
                      <span className="ml-2 text-periwinkle-100">
                        I&apos;m interested in shuttle transportation
                      </span>
                    </label>

                    <label className="inline-flex items-center block">
                      <input
                        type="checkbox"
                        name="interested_in_hotel_block"
                        checked={formData.interested_in_hotel_block}
                        onChange={toggleCheckbox}
                        tabIndex={0}
                        className="h-4 w-4 text-periwinkle-400 bg-black/40 border-periwinkle-700/50 focus:ring-periwinkle-400 focus:ring-2 rounded"
                      />
                      <span className="ml-2 text-periwinkle-100">
                        I&apos;m interested in the hotel block
                      </span>
                    </label>
                  </div>
                </div>

                {formData.plusOne && (
                  <div className="border-t border-periwinkle-700/30 pt-4 mt-4">
                    <h3 className="text-md font-semibold mb-3 text-periwinkle-200">
                      Plus One Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label
                          htmlFor="plusOne_first_name"
                          className="block text-sm font-semibold text-periwinkle-200 mb-1"
                        >
                          Plus One First Name*
                        </label>
                        <input
                          type="text"
                          id="plusOne_first_name"
                          name="plusOne_first_name"
                          value={formData.plusOne_first_name}
                          onChange={handleInputChange}
                          required={formData.plusOne}
                          className="w-full px-3 py-2 bg-black/40 text-white border border-periwinkle-700/50 rounded-md placeholder-periwinkle-300/40"
                          placeholder="First Name"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="plusOne_last_name"
                          className="block text-sm font-semibold text-periwinkle-200 mb-1"
                        >
                          Plus One Last Name*
                        </label>
                        <input
                          type="text"
                          id="plusOne_last_name"
                          name="plusOne_last_name"
                          value={formData.plusOne_last_name}
                          onChange={handleInputChange}
                          required={formData.plusOne}
                          className="w-full px-3 py-2 bg-black/40 text-white border border-periwinkle-700/50 rounded-md placeholder-periwinkle-300/40"
                          placeholder="Last Name"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-periwinkle-200 mb-1"
              >
                Message (Optional)
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 bg-black/40 text-white border border-periwinkle-700/50 rounded-md placeholder-periwinkle-300/40"
                placeholder="Any message for the couple"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-periwinkle-500 text-white font-bold py-2 px-4 rounded-md  hover:bg-amber-500 transition duration-300 focus:outline-none focus:ring-2 focus:ring-periwinkle-400 disabled:bg-periwinkle-700/40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit RSVP"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
