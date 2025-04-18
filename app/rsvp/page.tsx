"use client";

import { ChangeEvent, useActionState, useState } from "react";

export default function RSVP() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    attending: "yes",
    guests: 0,
    dietaryRestrictions: "",
    message: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [isSubmitted, submitAction] = useActionState(
    async (previousState: any, formData: any) => {
      //   const error = await
      console.log(
        "Form submitted:",
        formData.get("name"),
        formData.get("email")
      );
      console.log(previousState);

      return true;
    },
    false
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">RSVP</h1>

      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
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
              Your RSVP has been received. We're looking forward to celebrating
              with you!
            </p>
          </div>
        ) : (
          <form action={submitAction} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Will you be attending?*
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="attending"
                    value="yes"
                    checked={formData.attending === "yes"}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Yes, I'll be there!</span>
                </label>

                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="attending"
                    value="no"
                    checked={formData.attending === "no"}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Sorry, I can't make it</span>
                </label>
              </div>
            </div>

            {formData.attending === "yes" && (
              <>
                <div>
                  <label
                    htmlFor="guests"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Number of Guests (including yourself)
                  </label>
                  <select
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1">Just me (1)</option>
                    <option value="2">Me + 1 guest (2)</option>
                    <option value="3">Me + 2 guests (3)</option>
                    <option value="4">Me + 3 guests (4)</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="dietaryRestrictions"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Dietary Restrictions
                  </label>
                  <textarea
                    id="dietaryRestrictions"
                    name="dietaryRestrictions"
                    value={formData.dietaryRestrictions}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Please list any dietary restrictions or allergies"
                  />
                </div>
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
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any message for the couple"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Submit RSVP
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
