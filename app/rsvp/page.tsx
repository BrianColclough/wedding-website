"use client";

import { createClient } from "@/utils/supabase/client";
import { ChangeEvent, useState } from "react";

type RSVPForm = {
  first_name: string;
  last_name: string;
  attending: boolean;
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
    attending: false,
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
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

      // Insert main guest
      if (formData.attending) {
        const { error: mainGuestError } = await supabase
          .from("Guest List")
          .insert({
            first_name: formData.first_name,
            last_name: formData.last_name,
            attending: formData.attending,
            interested_in_shuttle: formData.interested_in_shuttle,
            interested_in_hotel_block: formData.interested_in_hotel_block,
            has_plus_one: formData.plusOne,
          });

        if (mainGuestError) throw new Error(mainGuestError.message);
      }

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
          });

        if (plusOneError) throw new Error(plusOneError.message);
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error("Error submitting RSVP:", err);
      setError(err instanceof Error ? err.message : "Failed to submit RSVP");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto bg-black text-white px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">RSVP</h1>

      <div className="max-w-lg mx-auto bg-white text-gray-800 rounded-lg shadow-md p-6 md:p-8">
        {isSubmitted ? (
          <div className="text-center py-8">
            <svg
              className="w-16 h-16 text-green-500 mx-auto mb-4"
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
            <h2 className="text-2xl font-semibold mb-2">Thank You!</h2>
            <p className="text-gray-600">
              Your RSVP has been received. We&apos;re looking forward to
              celebrating with you!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="First Name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700 mb-1"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Last Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Will you be attending?*
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="attending"
                    checked={formData.attending}
                    onChange={toggleCheckbox}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Yes, I&apos;ll be there!</span>
                </label>
              </div>
            </div>

            {formData.attending && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Options
                  </label>
                  <div className="space-y-2">
                    <label className="inline-flex items-center block">
                      <input
                        type="checkbox"
                        name="plusOne"
                        checked={formData.plusOne}
                        onChange={toggleCheckbox}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">I&apos;m bringing a plus one</span>
                    </label>

                    <label className="inline-flex items-center block">
                      <input
                        type="checkbox"
                        name="interested_in_shuttle"
                        checked={formData.interested_in_shuttle}
                        onChange={toggleCheckbox}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">
                        I&apos;m interested in shuttle transportation
                      </span>
                    </label>

                    <label className="inline-flex items-center block">
                      <input
                        type="checkbox"
                        name="interested_in_hotel_block"
                        checked={formData.interested_in_hotel_block}
                        onChange={toggleCheckbox}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">
                        I&apos;m interested in the hotel block
                      </span>
                    </label>
                  </div>
                </div>

                {formData.plusOne && (
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-md font-medium mb-3">
                      Plus One Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label
                          htmlFor="plusOne_first_name"
                          className="block text-sm font-medium text-gray-700 mb-1"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="First Name"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="plusOne_last_name"
                          className="block text-sm font-medium text-gray-700 mb-1"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Message (Optional)
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any message for the couple"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
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
